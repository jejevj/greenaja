import uuid
from sqlalchemy import Boolean, String, Text, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class User(Base):
    __tablename__ = 'users'

    id:            Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name:          Mapped[str]       = mapped_column(String(120), nullable=False)
    email:         Mapped[str]       = mapped_column(String(255), nullable=False, unique=True, index=True)
    phone:         Mapped[str | None]= mapped_column(String(20))
    avatar_url:    Mapped[str | None]= mapped_column(Text)
    password_hash: Mapped[str]       = mapped_column(Text, nullable=False)
    is_active:     Mapped[bool]      = mapped_column(Boolean, default=True)
    fcm_token:     Mapped[str | None]= mapped_column(Text)
    created_at:    Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at:    Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    addresses:     Mapped[list]      = relationship('Address',      back_populates='user', cascade='all, delete-orphan')
    orders:        Mapped[list]      = relationship('Order',        back_populates='user')
    carts:         Mapped[list]      = relationship('Cart',         back_populates='user', cascade='all, delete-orphan')
    reviews:       Mapped[list]      = relationship('Review',       back_populates='user')
    notifications: Mapped[list]      = relationship('Notification', back_populates='user', cascade='all, delete-orphan')
    settings:      Mapped[object]    = relationship('UserSettings', back_populates='user', uselist=False, cascade='all, delete-orphan')
