# 1. Imagem base oficial do Python
FROM python:3.14-slim

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Formato moderno de ENV (key=value)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 4. Instala dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 5. Copia o arquivo (com o nome correto agora)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copia o restante do código
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]