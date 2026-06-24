import uuid
from pydantic import BaseModel


class VariantOut(BaseModel):
    id: uuid.UUID
    label: str
    price: int
    unit: str
    stock: int

    model_config = {'from_attributes': True}


class VariantCreate(BaseModel):
    label: str
    price: int
    unit: str
    stock: int


class ProductOut(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    tag: str | None
    category: str
    image_url: str | None
    rating: float
    sold_count: int
    is_active: bool
    variants: list[VariantOut] = []

    model_config = {'from_attributes': True}


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    tag: str | None = None
    category: str
    image_url: str | None = None
    variants: list[VariantCreate]


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    tag: str | None = None
    category: str | None = None
    image_url: str | None = None
    is_active: bool | None = None
