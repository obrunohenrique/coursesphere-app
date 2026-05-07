import pytest
from datetime import date, timedelta
from app.course_crud import create_course
from app.schemas import CourseCreate
from app.user_crud import create_user
from app.course_crud import create_course, get_course, get_courses, update_course, delete_course
from fastapi import HTTPException

# --- TESTES DE SUCESSO ---

def test_get_course_success(session, test_user):
    course_in = CourseCreate(name="Curso Teste", start_date=date.today(), end_date=date.today())
    created = create_course(session, course_in, test_user.id)
    
    retrieved = get_course(session, created.id)
    assert retrieved.id == created.id
    assert retrieved.name == "Curso Teste"

def test_list_courses(session, test_user):
    course_in = CourseCreate(name="Curso 1", start_date=date.today(), end_date=date.today())
    create_course(session, course_in, test_user.id)
    
    courses = get_courses(session)
    assert len(courses) >= 1

def test_update_course_success(session, test_user):
    course_in = CourseCreate(name="Nome Antigo", start_date=date.today(), end_date=date.today())
    db_course = create_course(session, course_in, test_user.id)
    
    update_data = CourseCreate(name="Nome Novo", start_date=date.today(), end_date=date.today())
    updated = update_course(session, db_course, update_data)
    assert updated.name == "Nome Novo"

def test_delete_course_success(session, test_user):
    course_in = CourseCreate(name="Para Deletar", start_date=date.today(), end_date=date.today())
    db_course = create_course(session, course_in, test_user.id)
    
    delete_course(session, db_course)
    assert get_course(session, db_course.id) is None

# --- TESTES DE FRACASSO / REGRAS ---

def test_create_course_end_date_before_start(session, test_user):
    course_in = CourseCreate(
        name="Erro Data", 
        start_date=date.today() + timedelta(days=5), 
        end_date=date.today()
    )
    with pytest.raises(HTTPException) as exc:
        create_course(session, course_in, test_user.id)
    assert exc.value.status_code == 400

def test_update_course_invalid_date(session, test_user):
    course_in = CourseCreate(name="Curso", start_date=date.today(), end_date=date.today())
    db_course = create_course(session, course_in, test_user.id)
    
    invalid_update = CourseCreate(
        name="Update Errado", 
        start_date=date.today() + timedelta(days=10), 
        end_date=date.today()
    )
    with pytest.raises(HTTPException) as exc:
        update_course(session, db_course, invalid_update)
    assert exc.value.status_code == 400
