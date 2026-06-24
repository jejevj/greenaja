import uuid
from sqlalchemy import String, Integer, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Order(Base):
    __tablename__ = 'orders'

    id:              Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_code:      Mapped[str]       = mapped_column(String(40), nullable=False, unique=True)
    user_id:         Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='RESTRICT'), nullable=False)
    address_id:      Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('addresses.id', ondelete='RESTRICT'), nullable=False)
    status:          Mapped[str]       = mapped_column(String(20), default='pending')
    shipping_method: Mapped[str]       = mapped_column(String(20), nullable=False)
    shipping_price:  Mapped[int]       = mapped_column(Integer, default=0)
    subtotal:        Mapped[int]       = mapped_column(Integer, nullable=False)
    discount:        Mapped[int]       = mapped_column(Integer, default=0)
    grand_total:     Mapped[int]       = mapped_column(Integer, nullable=False)
    note:            Mapped[str|None]  = mapped_column(Text)
    payment_method:  Mapped[str]       = mapped_column(String(20), default='qris')
    payment_status:  Mapped[str]       = mapped_column(String(20), default='unpaid')
    voucher_id:      Mapped[uuid.UUID|None] = mapped_column(UUID(as_uuid=True), ForeignKey('vouchers.id', ondelete='SET NULL'), nullable=True)
    created_at:      Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at:      Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user:            Mapped[object]    = relationship('User',      back_populates='orders')
    address:         Mapped[object]    = relationship('Address',   back_populates='orders')
    items:           Mapped[list]      = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
