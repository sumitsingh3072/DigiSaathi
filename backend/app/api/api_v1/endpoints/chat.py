# backend/api/api_v1/endpoints/chat.py

from fastapi import APIRouter
from backend.app.schemas.chat import ChatMessageCreate, ChatMessageResponse

router = APIRouter()

@router.post("/", response_model=ChatMessageResponse)
async def process_chat_message(
    chat_in: ChatMessageCreate
):
    """
    Process an incoming chat message.

    This endpoint receives a user's message, and for now, it returns
    a simple hardcoded response. In the future, this is where the call
    to the AI agent/LLM will be made.

    - **chat_in**: The incoming chat message data, validated by ChatMessageCreate.
    """
    # Placeholder for AI logic
    # For now, we'll just echo the message back with a prefix.
    response_text = f"You said: '{chat_in.message}'. The AI is not connected yet."
    
    return {"response": response_text}
