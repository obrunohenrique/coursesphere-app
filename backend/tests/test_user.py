import pytest
from sqlmodel import Session
from fastapi import HTTPException
from app.user_crud import create_user, get_user_by_email, authenticate_user, update_user, delete_user
from app.schemas import UserCreate
from app.security import verify_password

# --- TESTES DE CRIAÇÃO (CREATE) ---

def test_create_user_success(session: Session):
    user_in = UserCreate(name="Bruno", email="bruno@teste.com", password="securepassword")
    user = create_user(session, user_in)
    assert user.id is not None
    assert user.email == "bruno@teste.com"
    # Verifica se a senha foi criptografada
    assert verify_password("securepassword", user.password)

def test_create_user_duplicate_email(session: Session):
    user_in = UserCreate(name="Bruno 1", email="duplo@teste.com", password="123")
    create_user(session, user_in)
    
    user_in_duplicate = UserCreate(name="Bruno 2", email="duplo@teste.com", password="456")
    with pytest.raises(HTTPException) as exc:
        create_user(session, user_in_duplicate)
    assert exc.value.status_code == 400

# --- TESTES DE AUTENTICAÇÃO (READ/AUTH) ---

def test_authenticate_user_success(session: Session):
    password = "testpassword"
    user_in = UserCreate(name="Auth User", email="auth@teste.com", password=password)
    create_user(session, user_in)
    
    authenticated_user = authenticate_user(session, "auth@teste.com", password)
    assert authenticated_user is not None
    assert authenticated_user.email == "auth@teste.com"

def test_authenticate_user_wrong_password(session: Session):
    user_in = UserCreate(name="User", email="wrong@teste.com", password="correct")
    create_user(session, user_in)
    
    result = authenticate_user(session, "wrong@teste.com", "incorrect")
    assert result is False

# --- TESTES DE ATUALIZAÇÃO (UPDATE) ---

def test_update_user_data(session: Session):
    user_in = UserCreate(name="Original", email="orig@teste.com", password="123")
    user = create_user(session, user_in)
    
    update_data = UserCreate(name="Updated Name", email="new@teste.com", password="newpassword")
    updated_user = update_user(session, user, update_data)
    
    assert updated_user.name == "Updated Name"
    assert updated_user.email == "new@teste.com"
    assert verify_password("newpassword", updated_user.password)

# --- TESTES DE EXCLUSÃO (DELETE) ---

def test_delete_user_success(session: Session):
    user_in = UserCreate(name="To Delete", email="delete@teste.com", password="123")
    user = create_user(session, user_in)
    
    result = delete_user(session, user)
    assert result is True
    
    # Tenta buscar o usuário deletado
    db_user = get_user_by_email(session, "delete@teste.com")
    assert db_user is None
    