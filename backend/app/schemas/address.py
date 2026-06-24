import uuid
from pydantic import BaseModel


class AddressBase(BaseModel):
    label: str
    recipient_name: str
    phone: str
    address_line: str
    kecamatan: str
    kabupaten: str
    provinsi: str
    postal_code: str
    lat: float | None = None
    lon: float | None = None
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(AddressBase):
    pass


class AddressOut(AddressBase):
    id: uuid.UUID
    user_id: uuid.UUID

    model_config = {'from_attributes': True}
