# CourseSphere 🌐

**CourseSphere** é uma plataforma simplificada para gestão de cursos e aulas, desenvolvida como parte de um desafio técnico para demonstrar competências em desenvolvimento Full Stack, conteinerização e integração de APIs.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Python 3.14**
- **FastAPI**: Framework web de alta performance.
- **SQLModel (SQLAlchemy + Pydantic)**: Para interação com o banco de dados e validação de dados.
- **SQLite**: Banco de dados relacional (em arquivo).
- **Pytest**: Suíte de testes unitários e de integração.
- **Httpx**: Para consumo assíncrono da API externa.
- **Docker & Docker Compose**: Para orquestração e padronização do ambiente.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados.

### Via Docker (Recomendado)
Para subir todo o ambiente (atualmente o Backend) com um único comando:

```bash
docker-compose up --build
```

Após o carregamento, a API estará disponível em:

- API: http://localhost:8000

- Documentação Interativa (Swagger): http://localhost:8000/docs


## 🧪 Testes

O projeto conta com cobertura de testes unitários e de integração (CRUD e Segurança). Para rodar os testes:

```bash
cd backend
pytest
```

## 🔗 Integração com API Externa

O sistema consome a API pública RandomUser para sugerir instrutores convidados.

- Endpoint: GET /courses/suggest/instructor