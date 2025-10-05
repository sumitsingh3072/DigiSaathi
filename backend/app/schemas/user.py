from pydantic import BaseModel, EmailStr, Field
class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None

class UserCreate(UserBase):
    """Schema for creating a new user."""
    # Updated password field with validation
    password: str = Field(
        ...,
        min_length=8,
        max_length=256,
        description="Password must be between 8 and 72 characters."
    )

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
