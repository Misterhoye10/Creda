import io
from unittest.mock import patch
import pypdf


def get_auth_token(client, email="user@creda.app"):
    """Helper to register and obtain a bearer token for testing."""
    res = client.post("/api/auth/signup", json={
        "email": email,
        "password": "Password123!",
        "name": "Test Candidate"
    })
    return res.json()["access_token"]


def create_dummy_pdf_bytes():
    """Generate a minimal valid in-memory PDF byte stream."""
    writer = pypdf.PdfWriter()
    writer.add_blank_page(width=200, height=200)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def test_add_project_success(client):
    token = get_auth_token(client, "project_test@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "title": "Creda AI Platform",
        "description": "Skills verification system with FastAPI and React",
        "technologies": ["Python", "FastAPI", "PostgreSQL", "React"],
        "github_url": "https://github.com/Misterhoye10/Creda",
        "live_url": "https://creda.app"
    }

    response = client.post("/api/evidence/project", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "Project"
    assert data["title"] == "Creda AI Platform"
    assert "FastAPI" in data["raw_text"]
    assert "React" in data["raw_text"]
    assert data["source"] == "manual"


def test_upload_cv_pdf(client):
    token = get_auth_token(client, "cv_test@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    pdf_bytes = create_dummy_pdf_bytes()
    files = {
        "file": ("software_engineer_cv.pdf", pdf_bytes, "application/pdf")
    }

    response = client.post("/api/evidence/upload-cv", files=files, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "CV"
    assert data["title"] == "software_engineer_cv.pdf"
    assert data["source"] == "upload"
    assert data["file_url"] is not None


def test_upload_cv_non_pdf_rejected(client):
    token = get_auth_token(client, "cv_reject_test@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    files = {
        "file": ("not_a_pdf.txt", b"plain text resume", "text/plain")
    }

    response = client.post("/api/evidence/upload-cv", files=files, headers=headers)
    assert response.status_code == 400
    assert "Only PDF documents are supported" in response.json()["detail"]


@patch("app.api.v1.endpoints.evidence.fetch_github_profile_and_repos")
def test_github_connect(mock_fetch, client):
    token = get_auth_token(client, "gh_test@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    mock_fetch.return_value = {
        "title": "GitHub: @Misterhoye10",
        "url": "https://github.com/Misterhoye10",
        "source": "github_api",
        "description": "GitHub profile with 12 repos. Top languages: Python (60%), TypeScript (40%)",
        "raw_text": "GitHub Profile for Misterhoye10\nLanguages: Python, TypeScript\nRepositories: Creda",
        "metadata_json": '{"profile": {"username": "Misterhoye10"}, "languages": [{"language": "Python", "percentage": 60.0}]}'
    }

    response = client.post(
        "/api/evidence/github",
        json={"username": "Misterhoye10"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "GitHub"
    assert data["title"] == "GitHub: @Misterhoye10"
    assert data["source"] == "github_api"
    assert "Python" in data["raw_text"]


def test_get_evidence_list_and_filter(client):
    token = get_auth_token(client, "list_filter_test@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    # Add Project 1
    client.post("/api/evidence/project", json={
        "title": "Project Alpha",
        "technologies": ["Python"]
    }, headers=headers)

    # Add Project 2
    client.post("/api/evidence/project", json={
        "title": "Project Beta",
        "technologies": ["TypeScript"]
    }, headers=headers)

    # Add CV
    pdf_bytes = create_dummy_pdf_bytes()
    client.post("/api/evidence/upload-cv", files={
        "file": ("my_resume.pdf", pdf_bytes, "application/pdf")
    }, headers=headers)

    # List all
    all_res = client.get("/api/evidence", headers=headers)
    assert all_res.status_code == 200
    assert all_res.json()["total"] == 3

    # Filter by type=Project
    project_res = client.get("/api/evidence?type=Project", headers=headers)
    assert project_res.status_code == 200
    assert project_res.json()["total"] == 2

    # Filter by type=CV
    cv_res = client.get("/api/evidence?type=CV", headers=headers)
    assert cv_res.status_code == 200
    assert cv_res.json()["total"] == 1


def test_delete_evidence_item(client):
    token = get_auth_token(client, "delete_test@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    # Create project
    create_res = client.post("/api/evidence/project", json={
        "title": "Temporary Project",
        "technologies": ["Go"]
    }, headers=headers)
    evidence_id = create_res.json()["id"]

    # Delete project
    del_res = client.delete(f"/api/evidence/{evidence_id}", headers=headers)
    assert del_res.status_code == 200
    assert del_res.json()["message"] == "Evidence deleted successfully."

    # Try fetching deleted item
    get_res = client.get(f"/api/evidence/{evidence_id}", headers=headers)
    assert get_res.status_code == 404


def test_evidence_user_isolation(client):
    user1_token = get_auth_token(client, "user1@creda.app")
    user2_token = get_auth_token(client, "user2@creda.app")

    # User 1 creates evidence
    res = client.post("/api/evidence/project", json={
        "title": "User1 Private Work",
        "technologies": ["Rust"]
    }, headers={"Authorization": f"Bearer {user1_token}"})
    user1_evidence_id = res.json()["id"]

    # User 2 attempts to fetch User 1's evidence
    unauth_get = client.get(
        f"/api/evidence/{user1_evidence_id}",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    assert unauth_get.status_code == 404

    # User 2 attempts to delete User 1's evidence
    unauth_del = client.delete(
        f"/api/evidence/{user1_evidence_id}",
        headers={"Authorization": f"Bearer {user2_token}"}
    )
    assert unauth_del.status_code == 404
