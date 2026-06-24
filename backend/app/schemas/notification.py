import uuid
from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: uuid.UUID
    type: str
    title: str
    body: str
    data: dict | None
    is_read: bool

    model_config = {'from_attributes': True}
