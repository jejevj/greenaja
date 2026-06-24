import uuid
from pydantic import BaseModel


class OrderItemIn(BaseModel):
    product_id: uuid.UUID
    variant_id: uuid.UUID
    qty: int


class OrderCreate(BaseModel):
    address_id: uuid.UUID
    shipping_method: str
    voucher_code: str | None = None
    note: str | None = None
    items: list[OrderItemIn]


class OrderItemOut(BaseModel):
    id: uuid.UUID
    product_name: str
    variant_label: str
    price: int
    qty: int
    subtotal: int

    model_config = {'from_attributes': True}


class OrderOut(BaseModel):
    id: uuid.UUID
    order_code: str
    status: str
    shipping_method: str
    shipping_price: int
    subtotal: int
    discount: int
    grand_total: int
    payment_method: str
    payment_status: str
    note: str | None
    items: list[OrderItemOut] = []

    model_config = {'from_attributes': True}
