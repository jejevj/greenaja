import uuid
from sqlalchemy import Boolean, String, TIMESTAMP, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class UserSettings(Base):
    __tablename__ = 'user_settings'

    user_id:      Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    notif_order:  Mapped[bool]      = mapped_column(Boolean, default=True)
    notif_promo:  Mapped[bool]      = mapped_column(Boolean, default=True)
    notif_system: Mapped[bool]      = mapped_column(Boolean, default=True)
    language:     Mapped[str]       = mapped_column(String(10), default='id')
    theme:        Mapped[str]       = mapped_column(String(10), default='system')
    updated_at:   Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user:         Mapped[object]    = relationship('User', back_populates='settings')
