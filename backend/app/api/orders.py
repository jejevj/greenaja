import uuid, random, string
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.voucher import Voucher
from app.models.cart import Cart
from app.schemas.order import OrderCreate, OrderOut

router = APIRouter(prefix='/orders', tags=['Orders'])

SHIPPING_PRICE = {'reguler': 10000, 'express': 20000, 'same_day': 35000}


def _gen_code() -> str:
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"GRN-{date.today().strftime('%Y%m%d')}-{suffix}"


@router.get('/', response_model=list[OrderOut], summary='Riwayat order user')
def list_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (db.query(Order)
            .options(joinedload(Order.items))
            .filter(Order.user_id == current_user.id)
            .order_by(Order.created_at.desc())
            .all())


@router.get('/{order_id}', response_model=OrderOut, summary='Detail order')
def get_order(order_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = (db.query(Order)
             .options(joinedload(Order.items))
             .filter(Order.id == order_id, Order.user_id == current_user.id)
             .first())
    if not order:
        raise HTTPException(404, 'Order tidak ditemukan')
    return order


@router.post('/', response_model=OrderOut, status_code=201, summary='Buat order baru (checkout)')
def create_order(body: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subtotal = 0
    order_items = []
    for item in body.items:
        variant = db.get(ProductVariant, item.variant_id)
        product = db.get(Product, item.product_id)
        if not variant or not product:
            raise HTTPException(400, f'Produk/varian tidak ditemukan: {item.product_id}')
        if variant.stock < item.qty:
            raise HTTPException(400, f'Stok {product.name} tidak cukup')
        item_subtotal = variant.price * item.qty
        subtotal += item_subtotal
        order_items.append(OrderItem(
            product_id=product.id,
            variant_id=variant.id,
            product_name=product.name,
            variant_label=variant.label,
            price=variant.price,
            qty=item.qty,
            subtotal=item_subtotal,
        ))

    shipping_price = SHIPPING_PRICE.get(body.shipping_method, 10000)
    discount = 0
    voucher_id = None

    if body.voucher_code:
        today = date.today()
        voucher = db.query(Voucher).filter(
            Voucher.code == body.voucher_code,
            Voucher.is_active == True,
            Voucher.valid_from <= today,
            Voucher.valid_until >= today,
        ).first()
        if not voucher:
            raise HTTPException(400, 'Voucher tidak valid atau sudah expired')
        if voucher.min_purchase and subtotal < voucher.min_purchase:
            raise HTTPException(400, f'Minimum pembelian Rp {voucher.min_purchase:,} untuk voucher ini')
        if voucher.quota is not None and voucher.used_count >= voucher.quota:
            raise HTTPException(400, 'Kuota voucher habis')
        if voucher.type == 'percent':
            discount = int(subtotal * voucher.value / 100)
            if voucher.max_discount:
                discount = min(discount, voucher.max_discount)
        else:
            discount = voucher.value
        voucher.used_count += 1
        voucher_id = voucher.id

    grand_total = subtotal + shipping_price - discount

    order = Order(
        order_code=_gen_code(),
        user_id=current_user.id,
        address_id=body.address_id,
        shipping_method=body.shipping_method,
        shipping_price=shipping_price,
        subtotal=subtotal,
        discount=discount,
        grand_total=grand_total,
        note=body.note,
        voucher_id=voucher_id,
    )
    db.add(order)
    db.flush()

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    # kurangi stok
    for item in body.items:
        db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).update(
            {ProductVariant.stock: ProductVariant.stock - item.qty}
        )
        db.query(Product).filter(Product.id == item.product_id).update(
            {Product.sold_count: Product.sold_count + item.qty}
        )

    # kosongkan cart
    db.query(Cart).filter(Cart.user_id == current_user.id).delete()

    db.commit()
    db.refresh(order)
    return order


@router.patch('/{order_id}/status', summary='Update status order (admin/internal)')
def update_status(order_id: uuid.UUID, status: str, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(404, 'Order tidak ditemukan')
    order.status = status
    db.commit()
    return {'message': f'Status diubah ke {status}'}


@router.patch('/{order_id}/cancel', summary='Batalkan order')
def cancel_order(order_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(404, 'Order tidak ditemukan')
    if order.status not in ('pending', 'confirmed'):
        raise HTTPException(400, 'Order tidak bisa dibatalkan pada status ini')
    order.status = 'cancelled'
    db.commit()
    return {'message': 'Order dibatalkan'}
