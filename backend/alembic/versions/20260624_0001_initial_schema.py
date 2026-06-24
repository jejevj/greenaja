"""initial schema

Revision ID: 0001
Downgrade: None
Create Date: 2026-06-24
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- users ---
    op.create_table('users',
        sa.Column('id',            UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name',          sa.String(120),  nullable=False),
        sa.Column('email',         sa.String(255),  nullable=False, unique=True),
        sa.Column('phone',         sa.String(20),   nullable=True),
        sa.Column('avatar_url',    sa.Text,         nullable=True),
        sa.Column('password_hash', sa.Text,         nullable=False),
        sa.Column('is_active',     sa.Boolean,      nullable=False, server_default='true'),
        sa.Column('fcm_token',     sa.Text,         nullable=True),
        sa.Column('created_at',    sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at',    sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
    )

    # --- user_settings ---
    op.create_table('user_settings',
        sa.Column('user_id',      UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('notif_order',  sa.Boolean, nullable=False, server_default='true'),
        sa.Column('notif_promo',  sa.Boolean, nullable=False, server_default='true'),
        sa.Column('notif_system', sa.Boolean, nullable=False, server_default='true'),
        sa.Column('language',     sa.String(10), nullable=False, server_default="'id'"),
        sa.Column('theme',        sa.String(10), nullable=False, server_default="'system'"),
        sa.Column('updated_at',   sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
    )

    # --- addresses ---
    op.create_table('addresses',
        sa.Column('id',             UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id',        UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('label',          sa.String(60),  nullable=False),
        sa.Column('recipient_name', sa.String(120), nullable=False),
        sa.Column('phone',          sa.String(20),  nullable=False),
        sa.Column('address_line',   sa.Text,        nullable=False),
        sa.Column('kecamatan',      sa.String(100), nullable=False),
        sa.Column('kabupaten',      sa.String(100), nullable=False),
        sa.Column('provinsi',       sa.String(100), nullable=False),
        sa.Column('postal_code',    sa.String(10),  nullable=False),
        sa.Column('lat',            sa.Float,       nullable=True),
        sa.Column('lon',            sa.Float,       nullable=True),
        sa.Column('is_default',     sa.Boolean,     nullable=False, server_default='false'),
        sa.Column('created_at',     sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
    )

    # --- products ---
    op.create_table('products',
        sa.Column('id',          UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name',        sa.String(120), nullable=False),
        sa.Column('description', sa.Text,        nullable=True),
        sa.Column('tag',         sa.String(40),  nullable=True),
        sa.Column('category',    sa.String(40),  nullable=False),
        sa.Column('image_url',   sa.Text,        nullable=True),
        sa.Column('rating',      sa.Float,       nullable=False, server_default='0'),
        sa.Column('sold_count',  sa.Integer,     nullable=False, server_default='0'),
        sa.Column('is_active',   sa.Boolean,     nullable=False, server_default='true'),
        sa.Column('created_at',  sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at',  sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
    )

    # --- product_variants ---
    op.create_table('product_variants',
        sa.Column('id',         UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('product_id', UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('label',      sa.String(60),  nullable=False),
        sa.Column('price',      sa.Integer,     nullable=False),
        sa.Column('unit',       sa.String(20),  nullable=False),
        sa.Column('stock',      sa.Integer,     nullable=False, server_default='0'),
    )

    # --- vouchers ---
    op.create_table('vouchers',
        sa.Column('id',           UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('code',         sa.String(40),  nullable=False, unique=True),
        sa.Column('label',        sa.String(120), nullable=False),
        sa.Column('type',         sa.String(10),  nullable=False),  # percent | flat
        sa.Column('value',        sa.Integer,     nullable=False),
        sa.Column('min_purchase', sa.Integer,     nullable=True),
        sa.Column('max_discount', sa.Integer,     nullable=True),
        sa.Column('quota',        sa.Integer,     nullable=True),
        sa.Column('used_count',   sa.Integer,     nullable=False, server_default='0'),
        sa.Column('valid_from',   sa.Date,        nullable=False),
        sa.Column('valid_until',  sa.Date,        nullable=False),
        sa.Column('is_active',    sa.Boolean,     nullable=False, server_default='true'),
    )

    # --- orders ---
    op.create_table('orders',
        sa.Column('id',              UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('order_code',      sa.String(40),  nullable=False, unique=True),
        sa.Column('user_id',         UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('address_id',      UUID(as_uuid=True), sa.ForeignKey('addresses.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('status',          sa.String(20),  nullable=False, server_default="'pending'"),
        sa.Column('shipping_method', sa.String(20),  nullable=False),
        sa.Column('shipping_price',  sa.Integer,     nullable=False, server_default='0'),
        sa.Column('subtotal',        sa.Integer,     nullable=False),
        sa.Column('discount',        sa.Integer,     nullable=False, server_default='0'),
        sa.Column('grand_total',     sa.Integer,     nullable=False),
        sa.Column('note',            sa.Text,        nullable=True),
        sa.Column('payment_method',  sa.String(20),  nullable=False, server_default="'qris'"),
        sa.Column('payment_status',  sa.String(20),  nullable=False, server_default="'unpaid'"),
        sa.Column('voucher_id',      UUID(as_uuid=True), sa.ForeignKey('vouchers.id', ondelete='SET NULL'), nullable=True),
        sa.Column('created_at',      sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at',      sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
    )

    # --- order_items ---
    op.create_table('order_items',
        sa.Column('id',            UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('order_id',      UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id',    UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='SET NULL'), nullable=True),
        sa.Column('variant_id',    UUID(as_uuid=True), sa.ForeignKey('product_variants.id', ondelete='SET NULL'), nullable=True),
        sa.Column('product_name',  sa.String(120), nullable=False),
        sa.Column('variant_label', sa.String(60),  nullable=False),
        sa.Column('price',         sa.Integer,     nullable=False),
        sa.Column('qty',           sa.Integer,     nullable=False),
        sa.Column('subtotal',      sa.Integer,     nullable=False),
    )

    # --- carts ---
    op.create_table('carts',
        sa.Column('id',         UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id',    UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('variant_id', UUID(as_uuid=True), sa.ForeignKey('product_variants.id', ondelete='CASCADE'), nullable=False),
        sa.Column('qty',        sa.Integer,     nullable=False, server_default='1'),
        sa.Column('added_at',   sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
        sa.UniqueConstraint('user_id', 'product_id', 'variant_id', name='uq_cart_entry'),
    )

    # --- reviews ---
    op.create_table('reviews',
        sa.Column('id',          UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id',     UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id',  UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('order_id',    UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rating',      sa.Integer,   nullable=False),
        sa.Column('comment',     sa.Text,      nullable=True),
        sa.Column('image_urls',  ARRAY(sa.Text), nullable=False, server_default='{}'),
        sa.Column('created_at',  sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
        sa.UniqueConstraint('user_id', 'product_id', 'order_id', name='uq_review_per_order'),
    )

    # --- notifications ---
    op.create_table('notifications',
        sa.Column('id',         UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id',    UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type',       sa.String(30),  nullable=False),
        sa.Column('title',      sa.String(120), nullable=False),
        sa.Column('body',       sa.Text,        nullable=False),
        sa.Column('data',       JSONB,          nullable=True),
        sa.Column('is_read',    sa.Boolean,     nullable=False, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()')),
    )

    # indexes
    op.create_index('ix_products_category',  'products',      ['category'])
    op.create_index('ix_orders_user_id',     'orders',        ['user_id'])
    op.create_index('ix_carts_user_id',      'carts',         ['user_id'])
    op.create_index('ix_notifications_user', 'notifications', ['user_id', 'is_read'])


def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('reviews')
    op.drop_table('carts')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('vouchers')
    op.drop_table('product_variants')
    op.drop_table('products')
    op.drop_table('addresses')
    op.drop_table('user_settings')
    op.drop_table('users')
