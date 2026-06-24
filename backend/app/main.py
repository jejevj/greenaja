from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, addresses, products, cart, orders, vouchers, reviews, notifications, settings

app = FastAPI(
    title='GreenAja API',
    description=(
        '## API Backend untuk aplikasi GreenAja\n\n'
        'Semua endpoint kecuali `/auth/*` dan `GET /products` memerlukan **Bearer Token** (JWT).\n\n'
        'Dapatkan token via `POST /api/auth/login` atau `POST /api/auth/register`.'
    ),
    version='1.0.0',
    contact={'name': 'GreenAja Dev Team'},
    license_info={'name': 'Proprietary'},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

API_PREFIX = '/api'
app.include_router(auth.router,          prefix=API_PREFIX)
app.include_router(users.router,         prefix=API_PREFIX)
app.include_router(addresses.router,     prefix=API_PREFIX)
app.include_router(products.router,      prefix=API_PREFIX)
app.include_router(cart.router,          prefix=API_PREFIX)
app.include_router(orders.router,        prefix=API_PREFIX)
app.include_router(vouchers.router,      prefix=API_PREFIX)
app.include_router(reviews.router,       prefix=API_PREFIX)
app.include_router(notifications.router, prefix=API_PREFIX)
app.include_router(settings.router,      prefix=API_PREFIX)


@app.get('/', tags=['Health'], summary='Health check')
def root():
    return {'status': 'ok', 'app': 'GreenAja API', 'version': '1.0.0'}
