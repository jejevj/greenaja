import uuid
from sqlalchemy import Integer, Text, TIMESTAMP, ForeignKey, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Review(Base):
    __tablename__ = 'reviews'
    __table_args__ = (UniqueConstraint('user_id', 'product_id', 'order_id', name='uq_review_per_order'),)

    id:         Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:    Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    order_id:   Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    rating:     Mapped[int]       = mapped_column(Integer, nullable=False)
    comment:    Mapped[str|None]  = mapped_column(Text)
    image_urls: Mapped[object]    = mapped_column(ARRAY(String), default=list)
    created_at: Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    user:       Mapped[object]    = relationship('User',    back_populates='reviews')
    product:    Mapped[object]    = relationship('Product', back_populates='reviews')
