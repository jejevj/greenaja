import uuid
from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    phone: str | None
    avatar_url: str | None
    is_active: bool

    model_config = {'from_attributes': True}


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None


class ChangePassword(BaseModel):
    old_password: str
    new_password: str
