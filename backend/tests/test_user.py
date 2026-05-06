from sqlmodel import Session
from app.user_crud import create_user 
from app.schemas import UserCreate

def test_create_user_success(session: Session):
    user_in = UserCreate(name="Tester", email="test@example.com", password="password123")
    user = create_user(session, user_in)
    assert user.id is not None
    assert user.email == "test@example.com"