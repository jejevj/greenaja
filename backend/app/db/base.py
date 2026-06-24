from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# import semua model agar Alembic bisa mendeteksi tabel
from app.models import (  # noqa: F401, E402
    user, address, product, product_variant,
    cart, order, order_item, voucher,
    review, notification, user_settings,
)
