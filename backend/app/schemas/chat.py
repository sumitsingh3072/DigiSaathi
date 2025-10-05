from pydantic import BaseModel

class ChatMessageCreate(BaseModel):
    """
    Pydantic model for creating a new chat message.
    Ensures that any incoming request has a 'message' field of type string.
    """
    message: str

class ChatMessageResponse(BaseModel):
    """
    Pydantic model for the response of a chat message.
    Defines the structure of the JSON response sent back to the client.
    """
    response: str