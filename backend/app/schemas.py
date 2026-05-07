from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import date

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
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date

class CourseCreate(CourseBase):
    pass # Dados para criação

class CourseRead(CourseBase):
    id: int
    creator_id: int
    model_config = ConfigDict(from_attributes=True)
    