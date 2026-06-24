from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import SettingsOut, SettingsUpdate

router = APIRouter(prefix='/settings', tags=['Settings'])


@router.get('/', response_model=SettingsOut, summary='Ambil pengaturan user')
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    s = db.get(UserSettings, current_user.id)
    if not s:
        s = UserSettings(user_id=current_user.id)
        db.add(s)
        db.commit()
        db.refresh(s)
    return s


@router.patch('/', response_model=SettingsOut, summary='Update pengaturan user')
def update_settings(body: SettingsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    s = db.get(UserSettings, current_user.id)
    if not s:
        s = UserSettings(user_id=current_user.id)
        db.add(s)
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s
