from sqlmodel import Session, select
from ..models.models import User
from ..schemas.user import UserCreate
from ..core.security import get_password_hash, verify_password
from fastapi import HTTPException

# Função para criar um usuário
def create_user(session: Session, user_in: UserCreate):
    # Por enquanto, estamos salvando a senha em texto puro. 
    # Em passos futuros, adicionaremos a criptografia (Hash).
    
    # Verificação de e-mail único 
    existing_user = get_user_by_email(session, user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)

    db_user = User(
        name=user_in.name,
        email=user_in.email,
        password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

# Função para buscar usuário por email (será útil para o Login)
def get_user_by_email(session: Session, email: str):
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def authenticate_user(session: Session, email: str, password: str):
    user = get_user_by_email(session, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def update_user(session: Session, db_user: User, user_in: UserCreate):
    # Atualiza campos (incluindo hash da senha se ela for enviada)
    db_user.name = user_in.name
    db_user.email = user_in.email
    db_user.password = get_password_hash(user_in.password)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def delete_user(session: Session, db_user: User):
    session.delete(db_user)
    session.commit()
    return True
