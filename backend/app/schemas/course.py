from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.lesson import LessonRead

class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    duration: int

class CourseCreate(CourseBase):
    pass # Dados para criação

class CourseRead(CourseBase):
    id: int
    creator_id: int
    model_config = ConfigDict(from_attributes=True)
    

class CourseReadWithLessons(CourseRead):
    lessons: list[LessonRead] = []