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
        logger.warning(f"pdfplumber extraction failed ({e}), falling back to pypdf/PyPDF2...")

    # Strategy 2: pypdf or PyPDF2 fallback if empty
    if not extracted_text.strip():
        try:
            try:
                import pypdf
                reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            except ImportError:
                import PyPDF2 as pypdf
                reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))

            pages_text = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
            extracted_text = "\n\n".join(pages_text)
        except Exception as e:
            logger.warning(f"pypdf/PyPDF2 extraction failed ({e}), attempting raw byte stream recovery...")

    # Strategy 3: Raw byte-stream ASCII & PDF literal string recovery
    if not extracted_text.strip():
        try:
            # Matches PDF string literals (Text) Tj or (Text) '
            raw_matches = re.findall(rb"\(([^()]{2,100})\)\s*(?:Tj|TJ|'|\")", pdf_bytes)
            if raw_matches:
                decoded = [m.decode("latin1", errors="ignore") for m in raw_matches]
                extracted_text = " ".join(decoded)
            if not extracted_text.strip():
                # Scan printable English words / tokens
                ascii_matches = re.findall(rb"[a-zA-Z0-9.,;:+\-_/ @#()]{4,}", pdf_bytes)
                extracted_text = " ".join([m.decode("ascii", errors="ignore") for m in ascii_matches[:300]])
            if extracted_text.strip():
                logger.info("Successfully recovered text via raw byte-stream PDF scanner.")
        except Exception as e:
            logger.error(f"Raw byte stream extraction also failed: {e}")

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
