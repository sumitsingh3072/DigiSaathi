import pytesseract
from PIL import Image
from fastapi import UploadFile
import io
import logging

async def extract_text_from_image(file: UploadFile) -> str:
    """
    Asynchronously reads an uploaded image file, processes it with Tesseract OCR,
    and returns the extracted text.

    Args:
        file: The image file uploaded by the user.

    Returns:
        A string containing the extracted text.
    """
    try:
        # Handle UploadFile or bytes input
        if isinstance(file, UploadFile):
            image_data = await file.read()
        elif isinstance(file, (bytes, bytearray)):
            image_data = file
        else:
            return "Invalid file type. Expected an UploadFile or bytes."
        
        # Open the image from the in-memory bytes
        image = Image.open(io.BytesIO(image_data))
        
        # Use pytesseract to extract text from the image
        # You might need to specify the language for better accuracy, e.g., lang='eng+hin' for English and Hindi
        extracted_text = pytesseract.image_to_string(image)
        
        if not extracted_text.strip():
            return "No text could be extracted from the image."
            
        return extracted_text

    except Exception as e:
        logging.error(f"An error occurred during OCR processing: {e}")
        return "Error: Could not process the image. Please ensure it is a valid image file."
