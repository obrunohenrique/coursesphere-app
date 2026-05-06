from fastapi import FastAPI
from .database import create_db_and_tables # Adicione isso

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def read_root():
    return {"status": "CourseSphere API is running"}