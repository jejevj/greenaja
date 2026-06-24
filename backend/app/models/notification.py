import uuid
from sqlalchemy import Boolean, String, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Notification(Base):
    __tablename__ = 'notifications'

    id:         Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id:    Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    type:       Mapped[str]       = mapped_column(String(30), nullable=False)
    title:      Mapped[str]       = mapped_column(String(120), nullable=False)
    body:       Mapped[str]       = mapped_column(Text, nullable=False)
    data:       Mapped[object]    = mapped_column(JSONB, nullable=True)
    is_read:    Mapped[bool]      = mapped_column(Boolean, default=False)
    created_at: Mapped[object]    = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

    user:       Mapped[object]    = relationship('User', back_populates='notifications')
