from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.deps import get_current_user
from app.models.user import User
from app.models.review import Review
from app.models.product import Product
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix='/reviews', tags=['Reviews'])


@router.post('/', response_model=ReviewOut, status_code=201, summary='Buat ulasan produk')
def create_review(body: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.product_id == body.product_id,
        Review.order_id == body.order_id,
    ).first()
    if existing:
        raise HTTPException(400, 'Sudah memberikan ulasan untuk produk ini di order yang sama')
    review = Review(user_id=current_user.id, **body.model_dump())
    db.add(review)
    db.flush()
    # update avg rating
    reviews = db.query(Review).filter(Review.product_id == body.product_id).all()
    avg = sum(r.rating for r in reviews) / len(reviews)
    db.query(Product).filter(Product.id == body.product_id).update({Product.rating: round(avg, 1)})
    db.commit()
    db.refresh(review)
    return review


@router.get('/product/{product_id}', response_model=list[ReviewOut], summary='Ulasan produk')
def get_product_reviews(product_id, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.product_id == product_id).order_by(Review.created_at.desc()).all()
