from fastapi import APIRouter, Depends
from backend.app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from backend.app.services.chat_service import generate_gemini_response
from backend.app.api import deps  
from backend.models.user import User as UserModel

router = APIRouter()

@router.post(
    "/",
    response_model=ChatMessageResponse,
    summary="Process a user's chat message",
    description="Receives a message from the user, sends it to the Gemini AI, and returns the response.",
)
def process_chat_message(
    *,
    chat_in: ChatMessageCreate,
    current_user: UserModel = Depends(deps.get_current_user)  # Add this dependency
):
    """
    Processes a chat message from the user. Requires authentication.
    """
    user_name = current_user.full_name or "user"
    personalized_prompt = (
        f"A user named {user_name} is asking a question. "
        f"Please provide a helpful and friendly response. \n\n"
        f"User's question: {chat_in.message}"
    )
    ai_response = generate_gemini_response(personalized_prompt)
    return {"response": ai_response}
