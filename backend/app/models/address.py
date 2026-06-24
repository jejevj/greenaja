import uuid
from sqlalchemy import Boolean, String, Text, Float, TIMESTAMP, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Address(Base):
    __tablename__ = 'addresses'

    id:             Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:        Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    label:          Mapped[str]       = mapped_column(String(60), nullable=False)
    recipient_name: Mapped[str]       = mapped_column(String(120), nullable=False)
    phone:          Mapped[str]       = mapped_column(String(20), nullable=False)
    address_line:   Mapped[str]       = mapped_column(Text, nullable=False)
    kecamatan:      Mapped[str]       = mapped_column(String(100), nullable=False)
    kabupaten:      Mapped[str]       = mapped_column(String(100), nullable=False)
    provinsi:       Mapped[str]       = mapped_column(String(100), nullable=False)
    postal_code:    Mapped[str]       = mapped_column(String(10), nullable=False)
    lat:            Mapped[float|None]= mapped_column(Float)
    lon:            Mapped[float|None]= mapped_column(Float)
    is_default:     Mapped[bool]      = mapped_column(Boolean, default=False)
    created_at:     Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    user:           Mapped[object]    = relationship('User', back_populates='addresses')
    orders:         Mapped[list]      = relationship('Order', back_populates='address')
