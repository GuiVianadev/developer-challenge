# Developer Challenge - Zeine

Aplicação fullstack desenvolvida como parte de um desafio técnico.  
O sistema permite **gerenciar usuários e contatos**, com autenticação JWT e upload opcional de fotos de contato.

---

## 🚀 Tecnologias

### Backend (FastAPI)
- Python 3.11+
- FastAPI
- SQLAlchemy + Alembic
- PostgreSQL (via Docker)
- Pydantic
- JWT (autenticação)
- Cloudinary (upload de imagens)

### Frontend (React)
- React 19 + Vite
- TailwindCSS
- React Query
- React Hook Form + Zod
- Radix UI
- Axios

---

## 📂 Estrutura do projeto

```
developer-challenge/
├── backend-zeine/          # API FastAPI
│   ├── app/
│   │   ├── config/         # Configurações
│   │   ├── database/       # Modelos e DTOs
│   │   ├── repository/     # Camada de acesso a dados
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   └── utils/          # Utilitários
│   ├── migrations/         # Migrações do banco
│   └── requirements.txt    # Dependências Python
└── frontend-zeine/         # Aplicação React
    ├── src/
    │   ├── api/           # Clientes da API
    │   ├── components/    # Componentes React
    │   ├── hooks/         # Custom hooks
    │   ├── pages/         # Páginas da aplicação
    │   └── lib/           # Configurações e utilitários
    └── package.json       # Dependências
```

---

## ⚙️ Como rodar

### 1. Banco de dados
```bash
docker-compose up -d
```

Banco criado:
- **Usuário**: `desafio_user`
- **Senha**: `desafio_password`
- **Database**: `desafio_db`
- **Porta**: `5432`

---

### 2. Backend
```bash
cd backend-zeine
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pip install -r requirements.txt

alembic upgrade head  # rodar migrations
uvicorn app.main:app --reload
```

API disponível em:  
👉 `http://localhost:8000`  

Swagger:  
👉 `http://localhost:8000/docs`

---

### 3. Frontend
```bash
cd frontend-zeine
npm install
npm run dev
```

App disponível em:  
👉 `http://localhost:5173`

---

## 📡 Rotas principais (API)

### 🔑 Auth

#### POST `/auth/login`
**Request**
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```
**Response**
```json
{
  "access_token": "jwt_token_aqui",
  "refresh_token": "jwt_refresh_aqui",
  "token_type": "bearer"
}
```

#### POST `/auth/refresh_token`
**Response**
```json
{
  "access_token": "novo_token_jwt",
  "refresh_token": "novo_refresh_token",
  "token_type": "bearer"
}
```

---

### 👤 Users

#### POST `/users`
**Request**
```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```
**Response**
```json
{
  "id": 1,
  "name": "João da Silva",
  "email": "joao@email.com"
}
```

#### GET `/users`
**Response**
```json
[
  {
    "id": 1,
    "name": "João da Silva",
    "email": "joao@email.com"
  }
]
```

---

### 📇 Contacts

#### GET `/contacts`
**Response**
```json
[
  {
    "id": 1,
    "name": "Maria Oliveira",
    "email": "maria@email.com",
    "telefone": "11999999999",
    "reference": "Amiga de infância",
    "foto_url": "https://cloudinary.com/maria.jpg"
  }
]
```

#### GET `/contacts/filter?initial=M`
**Response**
```json
[
  {
    "id": 1,
    "name": "Maria Oliveira",
    "email": "maria@email.com",
    "telefone": "11999999999",
    "reference": "Amiga de infância",
    "foto_url": "https://cloudinary.com/maria.jpg"
  }
]
```

#### POST `/contacts`
**Multipart Form Data**
```json
{
  "name": "Carlos Souza",
  "email": "carlos@email.com",
  "telefone": "11988887777",
  "reference": "Colega de trabalho",
  "foto": "arquivo.jpg"
}
```
**Response**
```json
{
  "id": 2,
  "name": "Carlos Souza",
  "email": "carlos@email.com",
  "telefone": "11988887777",
  "reference": "Colega de trabalho",
  "foto_url": "https://cloudinary.com/carlos.jpg"
}
```

#### PATCH `/contacts/{id}`
**Request**
```json
{
  "telefone": "11977776666"
}
```
**Response**
```json
{
  "id": 2,
  "name": "Carlos Souza",
  "email": "carlos@email.com",
  "telefone": "11977776666",
  "reference": "Colega de trabalho",
  "foto_url": "https://cloudinary.com/carlos.jpg"
}
```

#### DELETE `/contacts/{id}`
**Response**
```json
{
  "message": "Contato removido com sucesso"
}
```

---

## ✅ Funcionalidades

- Autenticação JWT (login + refresh token)  
- CRUD de usuários  
- CRUD de contatos  
- Filtro de contatos pela letra inicial  
- Upload opcional de fotos de contatos  
- Frontend integrado com backend via React Query  

--- 
## Diagram ERD
<img width="859" height="293" alt="erd" src="https://github.com/user-attachments/assets/74b4f7a0-d313-47a9-8104-d8024a5ccc4c" />

---
### Video da aplicação

(https://youtu.be/0dAiLo0q_Io)


- **Testes unitários** com Pytest (se aplicável).  
- Docker para provisionamento do banco.  
