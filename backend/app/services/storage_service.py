import os
import re
import uuid
import logging
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger("creda.storage")

UPLOAD_DIR = Path("uploads/cvs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_file(file_bytes: bytes, original_filename: str, content_type: str = "application/pdf") -> str:
    """
    Save an uploaded file.
    Tries Supabase Storage first; if unavailable, falls back to local disk storage.
    Returns the file URL or relative storage path.
    """
    raw_name = Path(original_filename).name
    clean_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", raw_name)
    if not clean_name or clean_name == ".pdf":
        clean_name = "document.pdf"
    unique_filename = f"{uuid.uuid4().hex[:12]}_{clean_name}"

    # Attempt Supabase Storage
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            from supabase import create_client
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            bucket_name = "cv_uploads"
            res = supabase.storage.from_(bucket_name).upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": content_type}
            )
            # Retrieve public URL
            public_url = supabase.storage.from_(bucket_name).get_public_url(unique_filename)
            logger.info(f"File uploaded to Supabase Storage: {public_url}")
            return public_url
        except Exception as e:
            logger.warning(f"Supabase storage upload failed ({e}). Falling back to local storage.")

    # Local storage fallback
    local_path = UPLOAD_DIR / unique_filename
    with open(local_path, "wb") as f:
        f.write(file_bytes)

    logger.info(f"File saved to local storage: {local_path}")
    return f"/uploads/cvs/{unique_filename}"


def delete_file(file_url: str) -> bool:
    """Remove a stored file either from local disk or Supabase."""
    if not file_url:
        return False

    if file_url.startswith("/uploads/cvs/"):
        filename = file_url.replace("/uploads/cvs/", "")
        local_path = UPLOAD_DIR / filename
        if local_path.exists():
            try:
                local_path.unlink()
                logger.info(f"Deleted local file: {local_path}")
                return True
            except Exception as e:
                logger.error(f"Error deleting local file {local_path}: {e}")
                return False
    return True
