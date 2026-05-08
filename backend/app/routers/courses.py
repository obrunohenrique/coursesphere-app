from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..schemas.course import CourseCreate, CourseRead
from ..crud.course_crud import create_course, get_courses, get_course, update_course, delete_course
from ..routers.users import get_current_user
from ..models.models import User
from ..services.external_api import get_random_instructor

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

@router.get("/{course_id}", response_model=CourseRead)
def route_get_course(course_id: int, session: Session = Depends(get_session)):
    db_course = get_course(session, course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return db_course

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
    
    # REGRA DE NEGÓCIO: Só o criador edita
    if db_course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão insuficiente")
    
    return update_course(session, db_course, course_in)

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def route_delete_course(
    course_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_course = get_course(session, course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    # REGRA DE NEGÓCIO: Só o criador deleta
    if db_course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão insuficiente")
    
    delete_course(session, db_course)
    return None



# Rota para consumo de API externa
@router.get("/suggest/instructor")
async def suggest_instructor():
    """
    Retorna um instrutor aleatório da API externa RandomUser.
    Requisito: Consumo de API Pública Externa.
    """
    return await get_random_instructor()
