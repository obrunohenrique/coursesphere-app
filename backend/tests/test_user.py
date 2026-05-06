import pytest
from sqlmodel import Session
from app.user_crud import create_user 
from app.schemas import UserCreate

def test_create_user_success(session: Session):
    password_plana = "password123"
    user_in = UserCreate(name="Tester", email="test@example.com", password=password_plana)
    
    user = create_user(session, user_in)
    
    assert user.id is not None
    # O teste abaixo garante que a senha foi criptografada
    assert user.password != password_plana
    assert len(user.password) > 30 # Hashes bcrypt são longos


def test_create_user_duplicate_email(session: Session):
    # 1. Criamos o primeiro usuário
    user_in1 = UserCreate(name="Bruno", email="bruno@teste.com", password="123")
    create_user(session, user_in1)
    
    # 2. Tentamos criar o segundo com o mesmo e-mail
    user_in2 = UserCreate(name="Outro Bruno", email="bruno@teste.com", password="456")
    
    # 3. Verificamos se o sistema levanta um erro (ainda vai falhar!)
    with pytest.raises(Exception): # Esperamos que ocorra uma exceção
        create_user(session, user_in2)