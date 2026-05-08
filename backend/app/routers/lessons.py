from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..schemas.lesson import LessonCreate, LessonRead
from ..crud.lesson_crud import (
    create_lesson, get_lessons_by_course, 
    get_lesson, update_lesson, delete_lesson
)
from ..crud.course_crud import get_course # Para validar o dono do curso
from ..routers.users import get_current_user
from ..models.models import User

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.post("/", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
def route_create_lesson(
    lesson_in: LessonCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Verificar se o curso existe
    db_course = get_course(session, lesson_in.course_id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    # 2. Verificar se o usuário logado é o dono do curso
    if db_course.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Você não tem permissão para adicionar aulas a este curso"
        )
    
    return create_lesson(session, lesson_in)

@router.get("/course/{course_id}", response_model=List[LessonRead])
def route_list_lessons(course_id: int, session: Session = Depends(get_session)):
    """Lista todas as aulas de um curso específico"""
    return get_lessons_by_course(session, course_id)

@router.put("/{lesson_id}", response_model=LessonRead)
def route_update_lesson(
    lesson_id: int, 
    lesson_in: LessonCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_lesson = get_lesson(session, lesson_id)
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    # Validar se o curso da aula pertence ao usuário
    db_course = get_course(session, db_lesson.course_id)
    if db_course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão insuficiente")
    
    return update_lesson(session, db_lesson, lesson_in)

@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def route_delete_lesson(
    lesson_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_lesson = get_lesson(session, lesson_id)
    if not db_lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    
    db_course = get_course(session, db_lesson.course_id)
    if db_course.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permissão insuficiente")
    
    delete_lesson(session, db_lesson)
    return None
