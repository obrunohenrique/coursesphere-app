# backend/app/routers/users.py
from fastapi import APIRouter, Depends
from sqlmodel import Session
from ..database import get_session
from ..schemas import UserCreate, UserRead
from ..user_crud import create_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserRead)
def register_user(user_in: UserCreate, session: Session = Depends(get_session)):
    return create_user(session, user_in)