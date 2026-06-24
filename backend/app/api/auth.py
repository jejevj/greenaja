from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/register', response_model=TokenResponse, status_code=status.HTTP_201_CREATED,
             summary='Daftar akun baru')
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail='Email sudah terdaftar')
    user = User(
        name=body.name,
        email=body.email,
        phone=body.phone,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    db.flush()
    db.add(UserSettings(user_id=user.id))
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.post('/login', response_model=TokenResponse, summary='Login dan dapatkan token')
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Email atau password salah')
    if not user.is_active:
        raise HTTPException(status_code=403, detail='Akun dinonaktifkan')
    return TokenResponse(access_token=create_access_token(str(user.id)))
