import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationOut

router = APIRouter(prefix='/notifications', tags=['Notifications'])


@router.get('/', response_model=list[NotificationOut], summary='Daftar notifikasi user')
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (db.query(Notification)
            .filter(Notification.user_id == current_user.id)
            .order_by(Notification.created_at.desc())
            .all())


@router.patch('/{notif_id}/read', summary='Tandai notifikasi sudah dibaca')
def mark_read(notif_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {'message': 'Ditandai sudah dibaca'}


@router.patch('/read-all', summary='Tandai semua notifikasi sudah dibaca')
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({'is_read': True})
    db.commit()
    return {'message': 'Semua notifikasi dibaca'}
