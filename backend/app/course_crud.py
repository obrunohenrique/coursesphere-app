from sqlmodel import Session, select
from fastapi import HTTPException, status
from .models import Course
from .schemas import CourseCreate

def create_course(session: Session, course_in: CourseCreate, creator_id: int):
    # Requisito: end_date >= start_date 
    if course_in.end_date < course_in.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A data de término deve ser igual ou posterior à data de início."
        )
    
    db_course = Course(
        **course_in.model_dump(),
        creator_id=creator_id
    )
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

def get_courses(session: Session, skip: int = 0, limit: int = 100):
    """Lista cursos (Requisito de Dashboard) [cite: 63]"""
    return session.exec(select(Course).offset(skip).limit(limit)).all()

def get_course(session: Session, course_id: int):
    return session.get(Course, course_id)

def update_course(session: Session, db_course: Course, course_in: CourseCreate):
    # Requisito de data também no Update
    if course_in.end_date < course_in.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A data de término deve ser igual ou posterior à data de início."
        )
    
    # Atualiza os dados do objeto existente
    course_data = course_in.model_dump(exclude_unset=True)
    for key, value in course_data.items():
        setattr(db_course, key, value)
    
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course


def delete_course(session: Session, db_course: Course):
    session.delete(db_course)
    session.commit()
