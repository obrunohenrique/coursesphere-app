import pytest
from sqlmodel import Session, SQLModel, create_engine
from app.schemas.user import UserCreate
from app.crud.user_crud import create_user


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture
def test_user(session):
    user_in = UserCreate(name="Instrutor", email="inst@teste.com", password="123")
    return create_user(session, user_in)
