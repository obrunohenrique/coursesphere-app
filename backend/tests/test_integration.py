from app.main import app
from fastapi.testclient import TestClient
import pytest

client = TestClient(app)

@pytest.fixture
def auth_headers(session):
    """Cria um usuário e retorna o cabeçalho com o Token JWT."""
    user_data = {"name": "Bruno", "email": "bruno@integration.com", "password": "123"}
    client.post("/users/", json=user_data)
    login_res = client.post("/users/login", data={"username": "bruno@integration.com", "password": "123"})
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- INTEGRAÇÃO: USUÁRIO ---

def test_integration_user_flow():
    # Testar fluxo: Criar -> Login -> Ver Perfil
    email = "flow@test.com"
    client.post("/users/", json={"name": "Flow", "email": email, "password": "123"})
    login = client.post("/users/login", data={"username": email, "password": "123"})
    assert login.status_code == 200
    
    token = login.json()["access_token"]
    me = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.json()["email"] == email

# --- INTEGRAÇÃO: CURSOS ---

def test_integration_course_crud(auth_headers):
    # Create
    course_data = {
        "name": "Curso de Integração",
        "start_date": "2026-05-10",
        "end_date": "2026-06-10"
    }
    res = client.post("/courses/", json=course_data, headers=auth_headers)
    assert res.status_code == 201
    course_id = res.json()["id"]

    # Read
    res = client.get(f"/courses/{course_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "Curso de Integração"

    # Update
    course_data["name"] = "Nome Atualizado"
    res = client.put(f"/courses/{course_id}", json=course_data, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Nome Atualizado"

    # Delete
    res = client.delete(f"/courses/{course_id}", headers=auth_headers)
    assert res.status_code == 204

# --- INTEGRAÇÃO: AULAS (LESSONS) ---

def test_integration_lesson_ownership_protection(auth_headers):
    # 1. Criar curso com Usuário A (auth_headers)
    course_res = client.post("/courses/", json={
        "name": "Curso Protegido", "start_date": "2026-05-10", "end_date": "2026-05-11"
    }, headers=auth_headers)
    course_id = course_res.json()["id"]

    # 2. Criar Usuário B e tentar postar aula no curso do A
    client.post("/users/", json={"name": "Hacker", "email": "hacker@test.com", "password": "123"})
    login_b = client.post("/users/login", data={"username": "hacker@test.com", "password": "123"})
    token_b = login_b.json()["access_token"]

    lesson_data = {"title": "Tentativa Invasão", "status": "published", "course_id": course_id}
    res = client.post("/lessons/", json=lesson_data, headers={"Authorization": f"Bearer {token_b}"})
    
    # Deve retornar 403 Forbidden
    assert res.status_code == 403
