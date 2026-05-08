from pydantic import BaseModel, ConfigDict, HttpUrl, Field
from typing import Optional
from enum import Enum

class LessonStatus(str, Enum):
    draft = "draft"
    published = "published"

URL_REGEX = r"^(https?://)?(www\.)?([a-zA-Z0-9-]+(\.[a-z]{2,})+)(/[^\s]*)?$"

class LessonBase(BaseModel):
    title: str = Field(..., min_length=3)
    status: LessonStatus = LessonStatus.draft
    video_url: Optional[str] = Field(None, pattern=URL_REGEX)

class LessonCreate(LessonBase):
    course_id: int

class LessonRead(LessonBase):
    id: int
    course_id: int
    model_config = ConfigDict(from_attributes=True)