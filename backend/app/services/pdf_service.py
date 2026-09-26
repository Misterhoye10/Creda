import io
import logging
import re
from typing import Optional

logger = logging.getLogger("creda.pdf")


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text content from a PDF file.
    Tries pdfplumber first for high fidelity layout parsing,
    and falls back to pypdf if needed.
    """
    extracted_text = ""

    # Strategy 1: pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n\n".join(pages_text)
    except Exception as e:
        logger.warning(f"pdfplumber extraction failed ({e}), falling back to pypdf...")

    # Strategy 2: pypdf fallback if empty
    if not extracted_text.strip():
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            pages_text = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n\n".join(pages_text)
        except Exception as e:
            logger.error(f"pypdf extraction also failed: {e}")

    # Clean and normalize extracted text
    return clean_extracted_text(extracted_text)


def clean_extracted_text(text: str) -> str:
    """Normalize whitespace and remove excessive blank lines."""
    if not text:
        return ""
    # Normalize unicode spaces
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Replace 3 or more consecutive newlines with 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Replace multiple horizontal spaces with single space
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()
