import uuid
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class OrderItem(Base):
    __tablename__ = 'order_items'

    id:            Mapped[uuid.UUID]   = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id:      Mapped[uuid.UUID]   = mapped_column(UUID(as_uuid=True), ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id:    Mapped[uuid.UUID|None] = mapped_column(UUID(as_uuid=True), ForeignKey('products.id', ondelete='SET NULL'), nullable=True)
    variant_id:    Mapped[uuid.UUID|None] = mapped_column(UUID(as_uuid=True), ForeignKey('product_variants.id', ondelete='SET NULL'), nullable=True)
    product_name:  Mapped[str]         = mapped_column(String(120), nullable=False)
    variant_label: Mapped[str]         = mapped_column(String(60),  nullable=False)
    price:         Mapped[int]         = mapped_column(Integer, nullable=False)
    qty:           Mapped[int]         = mapped_column(Integer, nullable=False)
    subtotal:      Mapped[int]         = mapped_column(Integer, nullable=False)

    order:         Mapped[object]      = relationship('Order', back_populates='items')
