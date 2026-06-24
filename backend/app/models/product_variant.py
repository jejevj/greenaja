import uuid
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ProductVariant(Base):
    __tablename__ = 'product_variants'

    id:         Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    label:      Mapped[str]       = mapped_column(String(60), nullable=False)
    price:      Mapped[int]       = mapped_column(Integer, nullable=False)
    unit:       Mapped[str]       = mapped_column(String(20), nullable=False)
    stock:      Mapped[int]       = mapped_column(Integer, default=0)

    product:    Mapped[object]    = relationship('Product', back_populates='variants')
    carts:      Mapped[list]      = relationship('Cart',    back_populates='variant')
