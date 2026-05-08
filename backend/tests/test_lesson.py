import pytest
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from app.crud.lesson_crud import (
    create_lesson, get_lesson, get_lessons_by_course, 
    update_lesson, delete_lesson
)
from app.schemas.lesson import LessonCreate, LessonStatus

# --- TESTES DE CRIAÇÃO (CREATE) ---

def test_create_lesson_success(session, test_setup):
    _, course = test_setup
    lesson_in = LessonCreate(title="Aula 01", status="published", course_id=course.id)
    lesson = create_lesson(session, lesson_in)
    assert lesson.id is not None
    assert lesson.course_id == course.id

def test_create_lesson_invalid_url(session, test_setup):
    _, course = test_setup
    # Deve falhar por causa do Regex no Field
    with pytest.raises(ValidationError):
        LessonCreate(title="Aula 01", video_url="isso_nao_e_link", course_id=course.id)

# --- TESTES DE LEITURA (READ) ---

def test_get_lesson_by_id(session, test_setup):
    _, course = test_setup
    created = create_lesson(session, LessonCreate(title="Aula Busca", course_id=course.id))
    
    retrieved = get_lesson(session, created.id)
    assert retrieved.id == created.id
    assert retrieved.title == "Aula Busca"

def test_list_lessons_by_course(session, test_setup):
    _, course = test_setup
    create_lesson(session, LessonCreate(title="Aula A", course_id=course.id))
    create_lesson(session, LessonCreate(title="Aula B", course_id=course.id))
    
    lessons = get_lessons_by_course(session, course.id)
    assert len(lessons) == 2

# --- TESTES DE ATUALIZAÇÃO (UPDATE) ---

def test_update_lesson_content(session, test_setup):
    _, course = test_setup
    db_lesson = create_lesson(session, LessonCreate(title="Antes", course_id=course.id))
    
    update_data = LessonCreate(title="Depois", status="published", course_id=course.id)
    updated = update_lesson(session, db_lesson, update_data)
    
    assert updated.title == "Depois"
    assert updated.status == LessonStatus.published

# --- TESTES DE DELEÇÃO (DELETE) ---

def test_delete_lesson_success(session, test_setup):
    _, course = test_setup
    db_lesson = create_lesson(session, LessonCreate(title="Vou sumir", course_id=course.id))
    
    delete_lesson(session, db_lesson)
    assert get_lesson(session, db_lesson.id) is None

# --- TESTES DE INTEGRIDADE (FAILURE CASES) ---

def test_get_non_existent_lesson(session):
    # Pegamos o ID 1 em um banco que acabamos de garantir que está vazio
    # ou um ID que é o "max(id) + 1"
    invalid_id = 1 
    assert get_lesson(session, invalid_id) is None

def test_lesson_foreign_key_constraint(session):
    # IDs negativos não são gerados pelo autoincremento
    invalid_course_id = -1 
    lesson_in = LessonCreate(title="Aula Fantasma", course_id=invalid_course_id)
    
    with pytest.raises(IntegrityError):
        create_lesson(session, lesson_in)