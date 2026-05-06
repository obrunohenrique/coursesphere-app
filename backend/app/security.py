from passlib.context import CryptContext

# Configuração do algoritmo Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Transforma a senha em um hash seguro."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha digitada coincide com o hash salvo."""
    return pwd_context.verify(plain_password, hashed_password)