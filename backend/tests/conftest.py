import pytest
from datetime import date
from sqlmodel import Session, SQLModel, create_engine
from app.schemas.user import UserCreate
from app.crud.user_crud import create_user
from app.crud.course_crud import create_course
from app.schemas.course import CourseCreate
from app.schemas.user import UserCreate
from sqlalchemy import event

@pytest.fixture(name="session")
def session_fixture():
    # Motor em memória para velocidade
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    
    # ATIVAÇÃO FORÇADA DE FOREIGN KEYS PARA O TESTE
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture
def test_user(session):
    user_in = UserCreate(name="Instrutor", email="inst@teste.com", password="123")
    return create_user(session, user_in)


@pytest.fixture
def test_setup(session):
    # Setup: Criar usuário e curso para os testes
    user = create_user(session, UserCreate(name="Instrutor", email="i@t.com", password="123"))
    course_in = CourseCreate(name="Curso de Teste", start_date=date.today(), end_date=date.today())
    course = create_course(session, course_in, creator_id=user.id)
    return user, course
