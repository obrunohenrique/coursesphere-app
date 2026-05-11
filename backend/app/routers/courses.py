from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..schemas.course import CourseCreate, CourseRead, CourseReadWithLessons
from ..crud.course_crud import create_course, get_courses, get_course
from ..routers.users import get_current_user
from ..models.models import User, Lesson, Course
from ..services.external_api import get_random_instructor
from ..schemas.lesson import LessonCreate, LessonRead

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def route_create_course(
    course_in: CourseCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return create_course(session, course_in, creator_id=current_user.id)

@router.get("/", response_model=List[CourseRead])
def route_list_courses(session: Session = Depends(get_session)):
    return get_courses(session)

@router.get("/{id}", response_model=CourseReadWithLessons)
def get_course(id: int, db: Session = Depends(get_session)):
    course = db.get(Course, id)
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return course


# Funcao auxiliar
def get_course(session: Session, course_id: int):
    # Aqui 'session' deve ser o primeiro para o .get() funcionar
    return session.get(Course, course_id)


@router.put("/{course_id}", response_model=CourseRead)
def route_update_course(
    course_id: int, 
    course_in: CourseCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_course = get_course(session, course_id) 
    
    if not db_course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    if db_course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão negada")

    # Lógica de atualização...
    update_data = course_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_course, key, value)
    
    session.add(db_course)
    session.commit()
    session.refresh(db_course)
    return db_course

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def route_delete_course(
    course_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_course = get_course(session, course_id)
    
    if not db_course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    if db_course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão negada")

    session.delete(db_course)
    session.commit()
    return {"detail": "Curso deletado"}



# Rota para consumo de API externa
@router.get("/suggest/instructor")
async def suggest_instructor():
    """
    Retorna um instrutor aleatório da API externa RandomUser.
    Requisito: Consumo de API Pública Externa.
    """
    return await get_random_instructor()


@router.post("/{course_id}/lessons", response_model=LessonRead)
def create_lesson(course_id: int, lesson_in: LessonCreate, db: Session = Depends(get_session)):
    # 1. Transformamos o Schema (Pydantic) em um dicionário
    lesson_data = lesson_in.model_dump() 
    
    # 2. Criamos a instância do Modelo (SQLAlchemy/SQLModel) usando esse dicionário
    db_lesson = Lesson(**lesson_data)
    
    # 3. Forçamos o course_id da URL para garantir a integridade
    db_lesson.course_id = course_id
    
    # 4. Agora sim, salvamos no banco
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    
    return db_lesson