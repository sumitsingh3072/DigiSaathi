from fastapi import APIRouter, File, UploadFile
from backend.app.schemas.ocr import OCRResponse
from backend.app.services.ocr_service import extract_text_from_image

router = APIRouter()

@router.post("/upload", response_model=OCRResponse)
async def upload_image_for_ocr(file: UploadFile = File(...)):
    """
    Receives an uploaded image file, performs OCR, and returns the extracted text.
    """
    extracted_text = await extract_text_from_image(file)

    return {
        "filename": file.filename,
        "extracted_text": extracted_text
    }