import uuid
from sqlalchemy import Boolean, String, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Voucher(Base):
    __tablename__ = 'vouchers'

    id:           Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code:         Mapped[str]       = mapped_column(String(40), nullable=False, unique=True)
    label:        Mapped[str]       = mapped_column(String(120), nullable=False)
    type:         Mapped[str]       = mapped_column(String(10), nullable=False)  # percent | flat
    value:        Mapped[int]       = mapped_column(Integer, nullable=False)
    min_purchase: Mapped[int|None]  = mapped_column(Integer)
    max_discount: Mapped[int|None]  = mapped_column(Integer)
    quota:        Mapped[int|None]  = mapped_column(Integer)
    used_count:   Mapped[int]       = mapped_column(Integer, default=0)
    valid_from:   Mapped[object]    = mapped_column(Date, nullable=False)
    valid_until:  Mapped[object]    = mapped_column(Date, nullable=False)
    is_active:    Mapped[bool]      = mapped_column(Boolean, default=True)
