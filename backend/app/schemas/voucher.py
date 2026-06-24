import uuid
from datetime import date
from pydantic import BaseModel


class VoucherOut(BaseModel):
    id: uuid.UUID
    code: str
    label: str
    type: str
    value: int
    min_purchase: int | None
    max_discount: int | None
    valid_from: date
    valid_until: date

    model_config = {'from_attributes': True}


class VoucherValidate(BaseModel):
    code: str
    purchase_amount: int
