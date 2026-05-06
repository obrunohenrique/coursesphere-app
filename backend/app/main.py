# backend/app/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import create_db_and_tables
from .routers import users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # O que acontece ao iniciar (Startup)
    create_db_and_tables()
    yield
    # O que acontece ao encerrar (Shutdown) - se necessário

app = FastAPI(title="CourseSphere API", lifespan=lifespan)

# Incluindo os roteadores das entidades
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"status": "CourseSphere API is running"}