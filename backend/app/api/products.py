import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.db.session import get_db
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate

router = APIRouter(prefix='/products', tags=['Products'])


@router.get('/', response_model=list[ProductOut], summary='Daftar produk (filter & sort)')
def list_products(
    category: str | None = Query(None, description='Filter kategori: Sayuran, Buah, Rempah'),
    q: str | None = Query(None, description='Pencarian nama produk'),
    sort: str = Query('popular', description='popular | rating | price_asc | price_desc'),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.variants)).filter(Product.is_active == True)
    if category:
        query = query.filter(Product.category == category)
    if q:
        query = query.filter(Product.name.ilike(f'%{q}%'))
    if sort == 'popular':    query = query.order_by(Product.sold_count.desc())
    elif sort == 'rating':   query = query.order_by(Product.rating.desc())
    elif sort == 'price_asc': pass   # handled post-query if needed
    elif sort == 'price_desc': pass
    return query.offset((page - 1) * limit).limit(limit).all()


@router.get('/{product_id}', response_model=ProductOut, summary='Detail produk')
def get_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    p = db.query(Product).options(joinedload(Product.variants)).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, 'Produk tidak ditemukan')
    return p


@router.post('/', response_model=ProductOut, status_code=201, summary='Tambah produk (admin)')
def create_product(body: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        name=body.name, description=body.description,
        tag=body.tag, category=body.category, image_url=body.image_url,
    )
    db.add(product)
    db.flush()
    for v in body.variants:
        db.add(ProductVariant(product_id=product.id, **v.model_dump()))
    db.commit()
    db.refresh(product)
    return product


@router.patch('/{product_id}', response_model=ProductOut, summary='Update produk (admin)')
def update_product(product_id: uuid.UUID, body: ProductUpdate, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, 'Produk tidak ditemukan')
    for k, v in body.model_dump(exclude_none=True).items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p


@router.delete('/{product_id}', summary='Hapus produk (admin)')
def delete_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    p = db.get(Product, product_id)
    if not p:
        raise HTTPException(404, 'Produk tidak ditemukan')
    db.delete(p)
    db.commit()
    return {'message': 'Produk dihapus'}
