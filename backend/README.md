# GreenAja — Backend (FastAPI)

## Stack
- **FastAPI** + **Uvicorn**
- **PostgreSQL** (via psycopg2)
- **SQLAlchemy 2.x** ORM
- **Alembic** migrations
- **JWT** auth (python-jose + passlib bcrypt)

## Struktur Folder

```
backend/
  app/
    api/          # Router per domain
    core/         # Config & security
    db/           # Session & base
    models/       # SQLAlchemy models
    schemas/      # Pydantic schemas
    deps.py       # Dependency injection
    main.py       # Entry point FastAPI
  alembic/
    versions/     # Migration files
  seed.py         # Data awal
  requirements.txt
  alembic.ini
  .env.example
```

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Salin & isi .env
cp .env.example .env
```

## Database

```bash
# Buat database dulu di PostgreSQL
createdb greenaja

# Jalankan migration (fresh)
alembic upgrade head

# Jika ingin reset total
alembic downgrade base
alembic upgrade head

# Generate migration baru (setelah ubah model)
alembic revision --autogenerate -m "deskripsi perubahan"
```

## Seed

```bash
python seed.py
```

Akun default setelah seed:
| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@greenaja.id   | admin123  |
| Demo  | demo@greenaja.id    | demo123   |

## Jalankan Server

```bash
uvicorn app.main:app --reload --port 8000
```

## Swagger UI

| URL | Keterangan |
|-----|------------|
| http://localhost:8000/docs | Swagger UI interaktif |
| http://localhost:8000/redoc | ReDoc dokumentasi |
| http://localhost:8000/openapi.json | Raw OpenAPI schema |

## Endpoint Summary

| Tag | Endpoint | Method | Auth |
|-----|----------|--------|------|
| Auth | `/api/auth/register` | POST | - |
| Auth | `/api/auth/login` | POST | - |
| Users | `/api/users/me` | GET/PATCH | JWT |
| Users | `/api/users/me/change-password` | POST | JWT |
| Users | `/api/users/me` (delete) | DELETE | JWT |
| Addresses | `/api/addresses/` | GET/POST | JWT |
| Addresses | `/api/addresses/{id}` | PUT/DELETE | JWT |
| Products | `/api/products/` | GET/POST | - / admin |
| Products | `/api/products/{id}` | GET/PATCH/DELETE | - / admin |
| Cart | `/api/cart/` | GET/POST/DELETE | JWT |
| Cart | `/api/cart/{id}` | PATCH/DELETE | JWT |
| Orders | `/api/orders/` | GET/POST | JWT |
| Orders | `/api/orders/{id}` | GET | JWT |
| Orders | `/api/orders/{id}/cancel` | PATCH | JWT |
| Vouchers | `/api/vouchers/` | GET | JWT |
| Vouchers | `/api/vouchers/validate` | POST | JWT |
| Reviews | `/api/reviews/` | POST | JWT |
| Reviews | `/api/reviews/product/{id}` | GET | - |
| Notifications | `/api/notifications/` | GET | JWT |
| Notifications | `/api/notifications/{id}/read` | PATCH | JWT |
| Notifications | `/api/notifications/read-all` | PATCH | JWT |
| Settings | `/api/settings/` | GET/PATCH | JWT |
