import uuid
from sqlalchemy import Integer, TIMESTAMP, ForeignKey, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Cart(Base):
    __tablename__ = 'carts'
    __table_args__ = (UniqueConstraint('user_id', 'product_id', 'variant_id', name='uq_cart_entry'),)

    id:         Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:    Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    variant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('product_variants.id', ondelete='CASCADE'), nullable=False)
    qty:        Mapped[int]       = mapped_column(Integer, default=1)
    added_at:   Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    user:       Mapped[object]    = relationship('User',           back_populates='carts')
    product:    Mapped[object]    = relationship('Product')
    variant:    Mapped[object]    = relationship('ProductVariant', back_populates='carts')
