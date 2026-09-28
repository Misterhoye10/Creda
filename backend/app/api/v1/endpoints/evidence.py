import re
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.evidence import Evidence
from app.schemas.evidence import (
    ProjectCreateRequest,
    GitHubConnectRequest,
    EvidenceResponse,
    EvidenceListResponse
)
from app.schemas.auth import MessageResponse
from app.services.pdf_service import extract_text_from_pdf
from app.services.storage_service import save_file, delete_file
from app.services.github_service import fetch_github_profile_and_repos, get_github_client

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post(
    "/upload-cv",
    response_model=EvidenceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload CV (PDF)",
    description="Uploads a PDF resume, parses its raw text, and stores the document as evidence."
)
async def upload_cv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file extension
    filename = file.filename or "cv.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF documents are supported for CV upload."
        )

    # Read and validate file size
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE // (1024 * 1024)}MB."
        )

    # Validate PDF magic bytes header to prevent disguised binaries/scripts
    if not file_bytes.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF format. The uploaded document is corrupted or not a valid PDF."
        )

    # Extract text from PDF
    extracted_text = extract_text_from_pdf(file_bytes)
    if not extracted_text:
        extracted_text = f"Resume document: {filename} (text extraction produced limited plain text)"

    # Save file
    file_url = save_file(file_bytes, filename, content_type="application/pdf")

    # Save to database
    evidence = Evidence(
        user_id=current_user.id,
        type="CV",
        title=filename,
        description=f"Uploaded CV: {filename}",
        source="upload",
        file_url=file_url,
        raw_text=extracted_text,
        metadata_json=json.dumps({"filename": filename, "size_bytes": len(file_bytes)})
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    return EvidenceResponse.model_validate(evidence)


@router.post(
    "/github",
    response_model=EvidenceResponse,
    summary="Connect GitHub Profile",
    description="Connects candidate's GitHub username, fetches public repos & languages, and saves evidence."
)
def connect_github(
    data: GitHubConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    raw_user = data.username.strip().lstrip("@")
    # Normalize full GitHub URLs if candidate pasted a link (e.g. https://github.com/octocat or github.com/octocat/repo)
    if "github.com/" in raw_user:
        raw_user = raw_user.split("github.com/")[-1].strip("/")
    # Handle username/repo syntax
    if "/" in raw_user:
        raw_user = raw_user.split("/")[0].strip()

    # Handle email input (e.g. dev@example.com)
    if "@" in raw_user and "." in raw_user:
        try:
            g = get_github_client()
            matched_users = g.search_users(f"{raw_user} in:email")
            if matched_users.totalCount > 0:
                username = matched_users[0].login
            else:
                username = raw_user.split("@")[0].strip()
        except Exception:
            username = raw_user.split("@")[0].strip()
    else:
        username = raw_user

    if not username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub username cannot be empty."
        )

    # Validate against standard GitHub username specification
    if not re.match(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$", username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub username format. Use alphanumeric characters and single hyphens."
        )

    try:
        gh_data = fetch_github_profile_and_repos(username)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # Check if a GitHub evidence record already exists for this user
    existing_evidence = db.query(Evidence).filter(
        Evidence.user_id == current_user.id,
        Evidence.type == "GitHub"
    ).first()

    if existing_evidence:
        existing_evidence.title = gh_data["title"]
        existing_evidence.url = gh_data["url"]
        existing_evidence.description = gh_data["description"]
        existing_evidence.raw_text = gh_data["raw_text"]
        existing_evidence.metadata_json = gh_data["metadata_json"]
        db.commit()
        db.refresh(existing_evidence)
        return EvidenceResponse.model_validate(existing_evidence)

    new_evidence = Evidence(
        user_id=current_user.id,
        type="GitHub",
        title=gh_data["title"],
        url=gh_data["url"],
        description=gh_data["description"],
        source="github_api",
        raw_text=gh_data["raw_text"],
        metadata_json=gh_data["metadata_json"]
    )
    db.add(new_evidence)
    db.commit()
    db.refresh(new_evidence)

    return EvidenceResponse.model_validate(new_evidence)


@router.post(
    "/project",
    response_model=EvidenceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Manual Project",
    description="Adds a project portfolio piece with tech stack, description, and repository/live URLs."
)
def add_project(
    data: ProjectCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    techs_str = ", ".join(data.technologies) if data.technologies else "None specified"
    raw_text = f"""Project: {data.title}
Description: {data.description or 'No description provided'}
Technologies Used: {techs_str}
GitHub URL: {data.github_url or 'N/A'}
Live URL: {data.live_url or 'N/A'}
""".strip()

    metadata = {
        "technologies": data.technologies,
        "github_url": data.github_url,
        "live_url": data.live_url
    }

    evidence = Evidence(
        user_id=current_user.id,
        type="Project",
        title=data.title,
        description=data.description,
        url=data.live_url or data.github_url,
        source="manual",
        raw_text=raw_text,
        metadata_json=json.dumps(metadata)
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    return EvidenceResponse.model_validate(evidence)


@router.get(
    "",
    response_model=EvidenceListResponse,
    summary="List User Evidence",
    description="Retrieves all evidence submitted by the authenticated user, optionally filtered by type."
)
def get_user_evidence(
    type: Optional[str] = Query(None, description="Filter by evidence type (e.g. 'CV', 'GitHub', 'Project')"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Evidence).filter(Evidence.user_id == current_user.id)
    if type:
        query = query.filter(Evidence.type == type)

    items = query.order_by(Evidence.created_at.desc()).all()
    return EvidenceListResponse(
        total=len(items),
        items=[EvidenceResponse.model_validate(item) for item in items]
    )


@router.get(
    "/{evidence_id}",
    response_model=EvidenceResponse,
    summary="Get Single Evidence Item",
    description="Retrieves details of a specific evidence record owned by the authenticated user."
)
def get_evidence_item(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evidence = db.query(Evidence).filter(
        Evidence.id == evidence_id,
        Evidence.user_id == current_user.id
    ).first()

    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence item not found."
        )

    return EvidenceResponse.model_validate(evidence)


@router.delete(
    "/{evidence_id}",
    response_model=MessageResponse,
    summary="Delete Evidence",
    description="Deletes an evidence item and cleans up any associated file from storage."
)
def delete_evidence_item(
    evidence_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    evidence = db.query(Evidence).filter(
        Evidence.id == evidence_id,
        Evidence.user_id == current_user.id
    ).first()

    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence item not found."
        )

    # Clean up file from storage if present
    if evidence.file_url:
        delete_file(evidence.file_url)

    db.delete(evidence)
    db.commit()

    return MessageResponse(message="Evidence deleted successfully.")
