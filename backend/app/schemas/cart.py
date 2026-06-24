import uuid
from pydantic import BaseModel
from app.schemas.product import VariantOut


class CartItemIn(BaseModel):
    product_id: uuid.UUID
    variant_id: uuid.UUID
    qty: int = 1


class CartItemOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    variant_id: uuid.UUID
    qty: int
    product_name: str
    variant: VariantOut

    model_config = {'from_attributes': True}
