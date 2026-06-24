from pydantic import BaseModel


class SettingsOut(BaseModel):
    notif_order: bool
    notif_promo: bool
    notif_system: bool
    language: str
    theme: str

    model_config = {'from_attributes': True}


class SettingsUpdate(BaseModel):
    notif_order: bool | None = None
    notif_promo: bool | None = None
    notif_system: bool | None = None
    language: str | None = None
    theme: str | None = None
