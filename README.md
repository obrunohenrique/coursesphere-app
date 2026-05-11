# CourseSphere - Sistema de Gestão de Cursos

Breve descrição: Uma aplicação Full Stack moderna desenvolvida para gestão de conteúdos educacionais, permitindo o cadastro de cursos e aulas com persistência de dados e autenticação segura.

## 🌐 Deploy Real (Cloud)
A aplicação está disponível online nos seguintes links:

- Frontend: https://coursesphere-web.onrender.com

- Backend (API): https://coursesphere-api-pik9.onrender.com

## 🔑 Acesso de Teste
O sistema possui fluxo de registro completo, mas para facilitar a avaliação, utilize as credenciais abaixo:

Usuário: jose@email.com (ou qualquer usuário criado no pela tela de cadastro)

Senha: 123456

## 🚀 Tecnologias Utilizadas
- Backend: Python (FastAPI), SQLModel (SQLite).

- Frontend: React (Vite, TypeScript), Tailwind CSS.

- Infraestrutura: Docker e Docker Compose.

## 🐳 Como rodar com Docker (Recomendado)

Se você tem o Docker instalado, este é o método mais rápido para subir todo o ecossistema:

Na raiz do projeto, execute o comando:

```bash
docker-compose up --build
```

Após o build, acesse:

Frontend: http://localhost:5173

Backend (Documentação API): http://localhost:8000/docs

## 🛠️ Instalação Manual (Sem Docker)

- Backend

Entre na pasta backend: cd backend

Crie um ambiente virtual: python -m venv venv

Ative o venv:

Mac/Linux: source venv/bin/activate

Windows: .\venv\Scripts\activate

Instale as dependências: pip install -r requirements.txt

Configure o arquivo .env com as chaves necessárias.

Inicie o servidor: uvicorn app.main:app --reload

- Frontend

Entre na pasta frontend: cd frontend

Instale as dependências: npm install

Configure a variável VITE_API_URL no .env.

Inicie a aplicação: npm run dev

## 📝 Instruções de Uso
Registro: Crie uma nova conta ou utilize o usuário de teste.

Dashboard: Visualize os cursos disponíveis.

Gerenciamento: Você pode criar, editar e excluir seus próprios cursos. Ao excluir um curso, todas as aulas vinculadas a ele serão removidas automaticamente.