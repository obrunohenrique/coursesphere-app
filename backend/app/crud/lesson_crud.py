from sqlmodel import Session, select
from ..models.models import Lesson
from ..schemas.lesson import LessonCreate

def create_lesson(session: Session, lesson_in: LessonCreate):
    db_lesson = Lesson(**lesson_in.model_dump())
    session.add(db_lesson)
    session.commit()
    session.refresh(db_lesson)
    return db_lesson

def get_lessons_by_course(session: Session, course_id: int):
    # Retorna todas as aulas de um curso
    statement = select(Lesson).where(Lesson.course_id == course_id)
    return session.exec(statement).all()

def get_lesson(session: Session, lesson_id: int):
    return session.get(Lesson, lesson_id)

def update_lesson(session: Session, db_lesson: Lesson, lesson_in: LessonCreate):
    lesson_data = lesson_in.model_dump(exclude_unset=True)
    for key, value in lesson_data.items():
        setattr(db_lesson, key, value)
    session.add(db_lesson)
    session.commit()
    session.refresh(db_lesson)
    return db_lesson

def delete_lesson(session: Session, db_lesson: Lesson):
    session.delete(db_lesson)
    session.commit()
    