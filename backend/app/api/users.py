from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate, ChangePassword
from app.core.security import verify_password, hash_password

router = APIRouter(prefix='/users', tags=['Users'])


@router.get('/me', response_model=UserOut, summary='Profil user yang sedang login')
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch('/me', response_model=UserOut, summary='Update profil')
def update_me(body: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for field, val in body.model_dump(exclude_none=True).items():
        setattr(current_user, field, val)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post('/me/change-password', summary='Ganti password')
def change_password(body: ChangePassword, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not verify_password(body.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail='Password lama salah')
    current_user.password_hash = hash_password(body.new_password)
    db.commit()
    return {'message': 'Password berhasil diubah'}


@router.delete('/me', summary='Nonaktifkan akun')
def deactivate(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.is_active = False
    db.commit()
    return {'message': 'Akun dinonaktifkan'}
