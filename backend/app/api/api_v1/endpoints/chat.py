# backend/api/api_v1/endpoints/chat.py

from fastapi import APIRouter
from backend.app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from backend.app.services.chat_service import generate_gemini_response

router = APIRouter()

@router.post(
    "/",
    response_model=ChatMessageResponse,
    summary="Process a user's chat message",
    description="Receives a message from the user, sends it to the Gemini AI, and returns the response.",
)
async def process_chat_message(chat_in: ChatMessageCreate) -> ChatMessageResponse:
    """
    Handles the chat request by calling the Gemini service.
    """
    # 1. Get the user's message from the request body
    user_message = chat_in.message

    # 2. Call our new service to get the AI's response
    ai_response = generate_gemini_response(user_message)

    # 3. Return the AI's response in the correct format
    return ChatMessageResponse(response=ai_response)

