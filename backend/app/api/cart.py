import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.cart import Cart
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.schemas.cart import CartItemIn

router = APIRouter(prefix='/cart', tags=['Cart'])


@router.get('/', summary='Isi keranjang user')
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(Cart).filter(Cart.user_id == current_user.id).all()
    result = []
    for item in items:
        p = db.get(Product, item.product_id)
        v = db.get(ProductVariant, item.variant_id)
        result.append({
            'id': item.id,
            'product_id': item.product_id,
            'product_name': p.name if p else 'Produk dihapus',
            'variant_id': item.variant_id,
            'variant_label': v.label if v else '-',
            'price': v.price if v else 0,
            'qty': item.qty,
            'subtotal': (v.price if v else 0) * item.qty,
        })
    return result


@router.post('/', status_code=201, summary='Tambah item ke keranjang')
def add_to_cart(body: CartItemIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == body.product_id,
        Cart.variant_id == body.variant_id,
    ).first()
    if existing:
        existing.qty += body.qty
    else:
        db.add(Cart(user_id=current_user.id, **body.model_dump()))
    db.commit()
    return {'message': 'Ditambahkan ke keranjang'}


@router.patch('/{cart_id}', summary='Update qty item keranjang')
def update_cart(cart_id: uuid.UUID, qty: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == current_user.id).first()
    if not item:
        raise HTTPException(404, 'Item tidak ditemukan')
    if qty <= 0:
        db.delete(item)
    else:
        item.qty = qty
    db.commit()
    return {'message': 'Keranjang diperbarui'}


@router.delete('/{cart_id}', summary='Hapus item dari keranjang')
def remove_from_cart(cart_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == current_user.id).first()
    if not item:
        raise HTTPException(404, 'Item tidak ditemukan')
    db.delete(item)
    db.commit()
    return {'message': 'Item dihapus dari keranjang'}


@router.delete('/', summary='Kosongkan keranjang')
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Cart).filter(Cart.user_id == current_user.id).delete()
    db.commit()
    return {'message': 'Keranjang dikosongkan'}
