from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Updated imports to use the new chat message schemas and CRUD functions
from backend.app.schemas.chat_message import ChatMessageCreateDB
from backend.app.schemas.chat import ChatMessageResponse, ChatMessageCreate
from backend.app.services.chat_service import generate_gemini_response
from backend.app.api import deps
from backend.db import crud
from backend.models.user import User as UserModel


router = APIRouter()


@router.post("/", response_model=ChatMessageResponse)
def process_chat_message(
    *,
    db: Session = Depends(deps.get_db),
    chat_in: ChatMessageCreate, # The incoming message from the user
    current_user: UserModel = Depends(deps.get_current_user)
):
    """
    Processes a chat message, saves it and the AI response to the database.
    """
    # 1. Save the user's message to the database
    user_message_to_save = ChatMessageCreateDB(message=chat_in.message, is_from_user=True)
    crud.create_chat_message(db=db, msg=user_message_to_save, owner_id=current_user.id)

    # 2. Generate a personalized prompt and get the AI response
    prompt = (
        f"You are DigiSaathi, a friendly financial assistant for users in India. "
        f"The user's name is {current_user.full_name}. "
        f"Please provide a helpful and encouraging response in {chat_in.language} "
        f"Please provide a helpful and encouraging response to their message: '{chat_in.message}'"
    )
    ai_response_text = generate_gemini_response(prompt)

    # 3. Save the AI's response to the database
    ai_message_to_save = ChatMessageCreateDB(message=ai_response_text, is_from_user=False)
    crud.create_chat_message(db=db, msg=ai_message_to_save, owner_id=current_user.id)

    # 4. Return the AI response to the user
    return {"response": ai_response_text, "message": chat_in.message}

