from sqlmodel import SQLModel, create_engine, Session
from .models.models import * # Importa os modelos para o SQLModel "enxergá-los"

# 1. Definimos o nome do arquivo de banco local
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# 2. Criamos o engine (motor de conexão)
# check_same_thread=False é necessário apenas para o SQLite no FastAPI
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

# 3. Função para criar as tabelas no banco de dados
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# 4. Dependência para obter uma sessão de banco em cada rota
def get_session():
    with Session(engine) as session:
        yield session