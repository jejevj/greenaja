import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.address import Address
from app.schemas.address import AddressCreate, AddressUpdate, AddressOut

router = APIRouter(prefix='/addresses', tags=['Addresses'])


@router.get('/', response_model=list[AddressOut], summary='Daftar alamat milik user')
def list_addresses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Address).filter(Address.user_id == current_user.id).all()


@router.post('/', response_model=AddressOut, status_code=201, summary='Tambah alamat baru')
def create_address(body: AddressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if body.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({'is_default': False})
    addr = Address(**body.model_dump(), user_id=current_user.id)
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.put('/{address_id}', response_model=AddressOut, summary='Update alamat')
def update_address(address_id: uuid.UUID, body: AddressUpdate,
                   db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(404, 'Alamat tidak ditemukan')
    if body.is_default:
        db.query(Address).filter(Address.user_id == current_user.id, Address.id != address_id).update({'is_default': False})
    for k, v in body.model_dump().items():
        setattr(addr, k, v)
    db.commit()
    db.refresh(addr)
    return addr


@router.delete('/{address_id}', summary='Hapus alamat')
def delete_address(address_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(404, 'Alamat tidak ditemukan')
    db.delete(addr)
    db.commit()
    return {'message': 'Alamat dihapus'}
