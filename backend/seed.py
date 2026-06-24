"""Seed data awal GreenAja.
Jalankan: python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.user_settings import UserSettings
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.voucher import Voucher
from app.core.security import hash_password
from datetime import date


def run():
    db = SessionLocal()
    try:
        # ─── Users ───────────────────────────────────────────────
        if not db.query(User).filter(User.email == 'admin@greenaja.id').first():
            admin = User(
                name='Admin GreenAja',
                email='admin@greenaja.id',
                phone='081200000000',
                password_hash=hash_password('admin123'),
            )
            db.add(admin)
            db.flush()
            db.add(UserSettings(user_id=admin.id))

        if not db.query(User).filter(User.email == 'demo@greenaja.id').first():
            demo = User(
                name='Demo User',
                email='demo@greenaja.id',
                phone='081200000001',
                password_hash=hash_password('demo123'),
            )
            db.add(demo)
            db.flush()
            db.add(UserSettings(user_id=demo.id))

        # ─── Products ────────────────────────────────────────────
        PRODUCTS = [
            dict(name='Bayam Segar',        tag='Bestseller', category='Sayuran', rating=4.9, sold_count=312,
                 description='Bayam lokal segar dipanen pagi hari, kaya zat besi.',
                 variants=[
                     dict(label='1 Ikat', price=4500,  unit='ikat', stock=30),
                     dict(label='3 Ikat', price=12000, unit='ikat', stock=15),
                     dict(label='5 Ikat', price=18000, unit='ikat', stock=8),
                 ]),
            dict(name='Tomat Organik',      tag='Organik',    category='Sayuran', rating=4.8, sold_count=204,
                 description='Tomat cherry organik bersertifikat, tanpa pestisida.',
                 variants=[
                     dict(label='250g', price=7500,  unit='gram', stock=20),
                     dict(label='500g', price=12000, unit='gram', stock=12),
                     dict(label='1kg',  price=22000, unit='kg',   stock=0),
                 ]),
            dict(name='Cabai Rawit',        tag='Populer',    category='Rempah',  rating=4.7, sold_count=178,
                 description='Cabai rawit merah segar, tingkat kepedasan tinggi.',
                 variants=[
                     dict(label='100g', price=6000,  unit='gram', stock=25),
                     dict(label='250g', price=14000, unit='gram', stock=10),
                     dict(label='500g', price=26000, unit='gram', stock=5),
                 ]),
            dict(name='Kangkung',           tag='Segar',      category='Sayuran', rating=4.6, sold_count=156,
                 description='Kangkung air segar, batang renyah.',
                 variants=[
                     dict(label='1 Ikat', price=3500, unit='ikat', stock=40),
                     dict(label='3 Ikat', price=9500, unit='ikat', stock=20),
                 ]),
            dict(name='Wortel Baby',        tag='Baru',       category='Sayuran', rating=4.8, sold_count=98,
                 description='Wortel baby Lembang, manis dan renyah.',
                 variants=[
                     dict(label='250g', price=9000,  unit='gram', stock=15),
                     dict(label='500g', price=16500, unit='gram', stock=8),
                 ]),
            dict(name='Brokoli Hijau',      tag='Organik',    category='Sayuran', rating=4.9, sold_count=134,
                 description='Brokoli segar organik ukuran besar, kaya vitamin C.',
                 variants=[
                     dict(label='Kecil (~300g)', price=8000,  unit='buah', stock=12),
                     dict(label='Besar (~600g)', price=15000, unit='buah', stock=6),
                 ]),
            dict(name='Jahe Merah',         tag='Organik',    category='Rempah',  rating=4.7, sold_count=87,
                 description='Jahe merah organik kering, kaya manfaat kesehatan.',
                 variants=[
                     dict(label='100g', price=8500,  unit='gram', stock=30),
                     dict(label='250g', price=19000, unit='gram', stock=15),
                 ]),
            dict(name='Pisang Cavendish',   tag='Segar',      category='Buah',    rating=4.6, sold_count=211,
                 description='Pisang Cavendish manis, matang sempurna.',
                 variants=[
                     dict(label='1 Sisir',  price=12000, unit='sisir',  stock=20),
                     dict(label='1 Tandan', price=35000, unit='tandan', stock=8),
                 ]),
            dict(name='Mangga Harum Manis', tag='Populer',    category='Buah',    rating=4.9, sold_count=265,
                 description='Mangga harum manis kualitas premium, manis legit.',
                 variants=[
                     dict(label='500g', price=14000, unit='gram', stock=18),
                     dict(label='1kg',  price=25000, unit='kg',   stock=9),
                 ]),
            dict(name='Kunyit Segar',       tag='Lokal',      category='Rempah',  rating=4.5, sold_count=63,
                 description='Kunyit segar lokal, warna orange cerah.',
                 variants=[
                     dict(label='100g', price=5000,  unit='gram', stock=35),
                     dict(label='250g', price=11000, unit='gram', stock=20),
                 ]),
            dict(name='Bayam Merah',        tag='Organik',    category='Sayuran', rating=4.7, sold_count=72,
                 description='Bayam merah organik kaya antioksidan.',
                 variants=[
                     dict(label='1 Ikat', price=6000, unit='ikat', stock=22),
                 ]),
            dict(name='Jeruk Nipis',        tag='Segar',      category='Buah',    rating=4.6, sold_count=189,
                 description='Jeruk nipis segar berair, asam segar.',
                 variants=[
                     dict(label='250g (~5 bj)',  price=7000,  unit='gram', stock=40),
                     dict(label='500g (~10 bj)', price=12500, unit='gram', stock=25),
                 ]),
        ]

        for p_data in PRODUCTS:
            if not db.query(Product).filter(Product.name == p_data['name']).first():
                variants = p_data.pop('variants')
                product = Product(**p_data)
                db.add(product)
                db.flush()
                for v in variants:
                    db.add(ProductVariant(product_id=product.id, **v))

        # ─── Vouchers ────────────────────────────────────────────
        VOUCHERS = [
            dict(code='GREENAJA10', label='Diskon 10% untuk semua produk',   type='percent', value=10,
                 min_purchase=50000, max_discount=15000, quota=100,
                 valid_from=date(2026, 1, 1), valid_until=date(2026, 12, 31)),
            dict(code='WELCOME20',  label='Diskon 20% untuk pengguna baru',  type='percent', value=20,
                 min_purchase=30000, max_discount=20000, quota=50,
                 valid_from=date(2026, 1, 1), valid_until=date(2026, 12, 31)),
            dict(code='GRATIS15K',  label='Potongan langsung Rp 15.000',     type='flat',    value=15000,
                 min_purchase=75000, max_discount=None,  quota=None,
                 valid_from=date(2026, 6, 1), valid_until=date(2026, 6, 30)),
        ]

        for v_data in VOUCHERS:
            if not db.query(Voucher).filter(Voucher.code == v_data['code']).first():
                db.add(Voucher(**v_data))

        db.commit()
        print('Seed selesai!')
    except Exception as e:
        db.rollback()
        print(f'Seed gagal: {e}')
        raise
    finally:
        db.close()


if __name__ == '__main__':
    run()
