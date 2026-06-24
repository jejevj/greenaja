from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.voucher import Voucher
from app.schemas.voucher import VoucherOut, VoucherValidate

router = APIRouter(prefix='/vouchers', tags=['Vouchers'])


@router.get('/', response_model=list[VoucherOut], summary='Daftar voucher aktif')
def list_vouchers(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    today = date.today()
    return db.query(Voucher).filter(
        Voucher.is_active == True,
        Voucher.valid_from <= today,
        Voucher.valid_until >= today,
    ).all()


@router.post('/validate', summary='Validasi voucher sebelum checkout')
def validate_voucher(body: VoucherValidate, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    today = date.today()
    v = db.query(Voucher).filter(
        Voucher.code == body.code,
        Voucher.is_active == True,
        Voucher.valid_from <= today,
        Voucher.valid_until >= today,
    ).first()
    if not v:
        raise HTTPException(400, 'Voucher tidak valid atau expired')
    if v.min_purchase and body.purchase_amount < v.min_purchase:
        raise HTTPException(400, f'Minimum pembelian Rp {v.min_purchase:,}')
    if v.quota is not None and v.used_count >= v.quota:
        raise HTTPException(400, 'Kuota voucher habis')
    discount = int(body.purchase_amount * v.value / 100) if v.type == 'percent' else v.value
    if v.max_discount:
        discount = min(discount, v.max_discount)
    return {'code': v.code, 'label': v.label, 'discount': discount}
