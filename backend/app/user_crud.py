from sqlmodel import Session, select
from .models import User
from .schemas import UserCreate

# Função para criar um usuário
def create_user(session: Session, user_in: UserCreate):
    # Por enquanto, estamos salvando a senha em texto puro. 
    # Em passos futuros, adicionaremos a criptografia (Hash).
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        password=user_in.password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# Função para buscar usuário por email (será útil para o Login)
def get_user_by_email(session: Session, email: str):
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()