import uuid
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    product_id: uuid.UUID
    order_id: uuid.UUID
    rating: int = Field(ge=1, le=5)
    comment: str | None = None
    image_urls: list[str] = []


class ReviewOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    product_id: uuid.UUID
    order_id: uuid.UUID
    rating: int
    comment: str | None
    image_urls: list[str]

    model_config = {'from_attributes': True}
