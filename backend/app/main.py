# backend/app/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import create_db_and_tables
from .routers import users, courses, lessons
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # O que acontece ao iniciar (Startup)
    create_db_and_tables()
    yield
    # O que acontece ao encerrar (Shutdown) - se necessário


app = FastAPI(title="CourseSphere API", lifespan=lifespan)

origins = [
    "http://localhost:5173",  # URL padrão do Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos (GET, POST, PUT, DELETE, etc)
    allow_headers=["*"], # Permite todos os cabeçalhos
)


# Incluindo os roteadores das entidades
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(lessons.router)

@app.get("/")
def read_root():
    return {"status": "CourseSphere API is running"}