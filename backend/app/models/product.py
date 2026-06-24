import uuid
from sqlalchemy import Boolean, String, Text, Float, Integer, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Product(Base):
    __tablename__ = 'products'

    id:          Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name:        Mapped[str]       = mapped_column(String(120), nullable=False)
    description: Mapped[str|None]  = mapped_column(Text)
    tag:         Mapped[str|None]  = mapped_column(String(40))
    category:    Mapped[str]       = mapped_column(String(40), nullable=False, index=True)
    image_url:   Mapped[str|None]  = mapped_column(Text)
    rating:      Mapped[float]     = mapped_column(Float, default=0)
    sold_count:  Mapped[int]       = mapped_column(Integer, default=0)
    is_active:   Mapped[bool]      = mapped_column(Boolean, default=True)
    created_at:  Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at:  Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    variants:    Mapped[list]      = relationship('ProductVariant', back_populates='product', cascade='all, delete-orphan')
    reviews:     Mapped[list]      = relationship('Review',         back_populates='product')
