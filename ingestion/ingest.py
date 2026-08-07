import os
from pathlib import Path
from pypdf import PdfReader
from dotenv import load_dotenv
from google import genai
import chromadb

# Load keys from .env
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")

# Settings
DOCS_FOLDER = Path("documents")
COLLECTION_NAME = "business_content"
CHUNK_SIZE = 500        # approx tokens per chunk
CHUNK_OVERLAP = 50      # overlap between chunks
EMBEDDING_MODEL = "gemini-embedding-001"

# Connect to Gemini and Chroma
genai_client = genai.Client(api_key=GEMINI_API_KEY)

chroma_client = chromadb.CloudClient(
    api_key=CHROMA_API_KEY,
    tenant=CHROMA_TENANT,
    database=CHROMA_DATABASE,
)

collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Pull all text out of a PDF file."""
    reader = PdfReader(str(pdf_path))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Split text into overlapping word-based chunks."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def embed_text(text: str) -> list[float]:
    """Turn a chunk of text into a vector using Gemini's embedding model."""
    result = genai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
    )
    return result.embeddings[0].values


def main():
    pdf_files = list(DOCS_FOLDER.glob("*.pdf"))

    if not pdf_files:
        print(f"No PDFs found in {DOCS_FOLDER.resolve()}. Add some and re-run.")
        return

    print(f"Found {len(pdf_files)} PDF(s). Starting ingestion...\n")

    total_chunks = 0

    for pdf_path in pdf_files:
        print(f"Processing: {pdf_path.name}")
        text = extract_text_from_pdf(pdf_path)

        if not text.strip():
            print(f"  No extractable text found in {pdf_path.name}, skipping.")
            continue

        chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
        print(f"  Split into {len(chunks)} chunk(s)")

        for i, chunk in enumerate(chunks):
            embedding = embed_text(chunk)
            chunk_id = f"{pdf_path.stem}-{i}"

            collection.upsert(
                ids=[chunk_id],
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[{"source": pdf_path.name, "chunk_index": i}],
            )
            total_chunks += 1

        print(f"  Done with {pdf_path.name}\n")

    print(f"Ingestion complete. {total_chunks} chunk(s) stored in Chroma Cloud collection '{COLLECTION_NAME}'.")


if __name__ == "__main__":
    main()