from pydantic import BaseModel, EmailStr
from typing import Optional

# Schema base com campos comuns
class UserBase(BaseModel):
    name: str
    email: EmailStr # Valida se o formato do e-mail é real (ex: bruno@email.com)

# Dados que o Frontend envia para CRIAR um usuário (Input)
class UserCreate(UserBase):
    password: str # Aqui a senha é obrigatória

# Dados que a API devolve para o Frontend (Output)
# Note que NÃO incluímos a senha aqui por segurança.
class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True # Permite converter um modelo do banco para este schema