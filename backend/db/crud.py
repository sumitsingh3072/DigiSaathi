from sqlalchemy.orm import Session
from backend.models.document import Document  # Ensure this is the SQLAlchemy model
from backend.app.schemas.document import DocumentCreate
from backend.models.user import User
from backend.app.schemas.user import UserCreate
from backend.app.core.security import get_password_hash


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ------------------------- doc crud functions -------------------------

def create_user_document(db: Session, doc: DocumentCreate, owner_id: int) -> Document:
    db_document = Document(**doc.model_dump(), owner_id=owner_id)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document
def get_user_documents(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[Document]:
    return db.query(Document).filter(Document.owner_id == user_id).offset(skip).limit(limit).all()