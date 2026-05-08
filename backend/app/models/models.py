from datetime import date, datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# 1. Usuário (User)
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True) # Requisito: Email deve ser único
    password: str # Será armazenada como hash posteriormente
    
    # Relacionamento: Um usuário pode ser dono de vários cursos
    courses: List["Course"] = Relationship(back_populates="creator")

# 2. Curso (Course)
class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=3) # Requisito: Mínimo 3 caracteres
    description: Optional[str] = None
    start_date: date
    end_date: date
    created_at: datetime = Field(default_factory=datetime.now) # Incremento sugerido
    
    # Chave estrangeira para o dono do curso[cite: 1]
    creator_id: int = Field(foreign_key="user.id")
    
    # Relacionamentos
    creator: Optional[User] = Relationship(back_populates="courses")
    lessons: List["Lesson"] = Relationship(back_populates="course")

# 3. Aula (Lesson)
class Lesson(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=3) # Requisito: Mínimo 3 caracteres[cite: 1]
    status: str = Field(default="draft") # Requisito: Valores "draft" ou "published"[cite: 1]
    video_url: Optional[str] = None

    # Chave estrangeira para o curso
    course_id: int = Field(foreign_key="course.id")
    
    # Relacionamento inverso
    course: Optional[Course] = Relationship(back_populates="lessons")