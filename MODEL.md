# GreenAja — Data Model

> Dokumen ini mendefinisikan semua entiti yang teridentifikasi dari UI mobile GreenAja.
> Dijadikan referensi sebelum implementasi database (backend).
> Update: entiti Farm dihapus — semua produk dijual langsung oleh GreenAja.

---

## 1. User

Pengguna yang login ke aplikasi GreenAja.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | string | Nama lengkap |
| `email` | string | Email login, unique |
| `phone` | string | Nomor HP |
| `avatar_url` | string\|null | URL foto profil |
| `password_hash` | string | Hash bcrypt |
| `is_active` | boolean | False jika akun dinonaktifkan |
| `fcm_token` | string\|null | Firebase Cloud Messaging token (notifikasi) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- Punya banyak `Address`
- Punya banyak `Order`
- Punya banyak `Cart` (aktif)
- Punya banyak `Review`
- Punya banyak `Notification`

---

## 2. Address

Alamat pengiriman milik User. Bisa punya lebih dari satu.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | FK → User |
| `label` | string | Contoh: "Rumah", "Kantor" |
| `recipient_name` | string | Nama penerima |
| `phone` | string | Nomor HP penerima |
| `address_line` | string | Jalan, nomor, RT/RW |
| `kecamatan` | string | |
| `kabupaten` | string | |
| `provinsi` | string | |
| `postal_code` | string | |
| `lat` | float\|null | Koordinat GPS |
| `lon` | float\|null | Koordinat GPS |
| `is_default` | boolean | Alamat utama |
| `created_at` | timestamp | |

---

## 3. Product

Produk pertanian yang dijual langsung oleh GreenAja.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `name` | string | Nama produk |
| `description` | string | Deskripsi panjang |
| `tag` | string | Label singkat: "Bestseller", "Organik", "Baru", "Populer", "Segar", "Lokal" |
| `category` | enum | `Sayuran`, `Buah`, `Rempah`, `Organik`, `Lokal` |
| `image_url` | string\|null | |
| `rating` | float | Rata-rata rating dari Review |
| `sold_count` | integer | Total terjual |
| `is_active` | boolean | Produk tersedia atau tidak |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- Punya banyak `ProductVariant`
- Punya banyak `Review`

---

## 4. ProductVariant

Setiap produk punya beberapa varian (ukuran/berat/satuan).

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `product_id` | UUID | FK → Product |
| `label` | string | Contoh: "250g", "1 Ikat", "1kg" |
| `price` | integer | Harga dalam Rupiah |
| `unit` | string | Contoh: "gram", "ikat", "kg" |
| `stock` | integer | Stok tersedia |

---

## 5. Cart

Item yang ditambahkan User ke keranjang sebelum checkout.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | FK → User |
| `product_id` | UUID | FK → Product |
| `variant_id` | UUID | FK → ProductVariant |
| `qty` | integer | Jumlah |
| `added_at` | timestamp | |

> Satu baris per kombinasi (user, product, variant). Jika user tambah lagi, qty di-increment.

---

## 6. Order

Pesanan yang sudah di-checkout oleh User.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `order_code` | string | Kode unik, contoh: `GRN-20260622-8471` |
| `user_id` | UUID | FK → User |
| `address_id` | UUID | FK → Address (snapshot saat checkout) |
| `status` | enum | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` |
| `shipping_method` | enum | `reguler`, `express`, `same_day` |
| `shipping_price` | integer | |
| `subtotal` | integer | Total harga produk sebelum diskon |
| `discount` | integer | Nominal diskon dari voucher |
| `grand_total` | integer | Subtotal + ongkir − diskon |
| `note` | string\|null | Catatan untuk penjual |
| `payment_method` | enum | `qris` (sementara hanya QRIS) |
| `payment_status` | enum | `unpaid`, `paid`, `refunded` |
| `voucher_id` | UUID\|null | FK → Voucher |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Relasi:**
- Punya banyak `OrderItem`

---

## 7. OrderItem

Detail produk dalam satu Order.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `order_id` | UUID | FK → Order |
| `product_id` | UUID | FK → Product (snapshot) |
| `variant_id` | UUID | FK → ProductVariant (snapshot) |
| `product_name` | string | Snapshot nama saat checkout |
| `variant_label` | string | Snapshot label varian |
| `price` | integer | Snapshot harga saat checkout |
| `qty` | integer | |
| `subtotal` | integer | price × qty |

> Field snapshot penting agar data order tidak berubah jika produk diedit/dihapus.

---

## 8. Voucher

Kode promo yang bisa dipakai saat checkout.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `code` | string | Kode unik, contoh: `GREENAJA10`, `WELCOME20` |
| `label` | string | Deskripsi singkat |
| `type` | enum | `percent`, `flat` |
| `value` | integer | Nilai diskon (persen atau Rupiah) |
| `min_purchase` | integer\|null | Minimum belanja untuk pakai voucher |
| `max_discount` | integer\|null | Maksimum nominal diskon (untuk tipe percent) |
| `quota` | integer\|null | Batas penggunaan total. Null = unlimited |
| `used_count` | integer | Sudah dipakai berapa kali |
| `valid_from` | date | |
| `valid_until` | date | |
| `is_active` | boolean | |

---

## 9. Review

Ulasan produk yang ditulis User setelah pesanan selesai.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | FK → User |
| `product_id` | UUID | FK → Product |
| `order_id` | UUID | FK → Order |
| `rating` | integer | 1–5 bintang |
| `comment` | string\|null | Komentar teks |
| `image_urls` | string[] | Foto ulasan |
| `created_at` | timestamp | |

> Satu user hanya boleh review satu produk per order.

---

## 10. Notification

Notifikasi push/in-app untuk User.

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | |
| `user_id` | UUID | FK → User |
| `type` | enum | `order_update`, `promo`, `system` |
| `title` | string | |
| `body` | string | |
| `data` | JSON\|null | Payload tambahan (misal: `order_id`) |
| `is_read` | boolean | |
| `created_at` | timestamp | |

---

## 11. UserSettings

Preferensi dan pengaturan akun User (dari screen Settings).

| Field | Tipe | Keterangan |
|---|---|---|
| `user_id` | UUID | FK → User, 1:1 |
| `notif_order` | boolean | Notifikasi status pesanan |
| `notif_promo` | boolean | Notifikasi promo |
| `notif_system` | boolean | Notifikasi sistem |
| `language` | string | Kode bahasa, contoh: `id`, `en` |
| `theme` | enum | `light`, `dark`, `system` |
| `updated_at` | timestamp | |

---

## Relasi Ringkas

```
User ──< Address
User ──< Cart ──> ProductVariant ──> Product
User ──< Order ──< OrderItem ──> ProductVariant ──> Product
Order >── Voucher
Order >── Address
User ──< Review >── Product
User ──< Notification
User ──1 UserSettings
Product ──< ProductVariant
```

---

> **Catatan:** Model ini masih draft. Silakan review dan tambahkan field yang mungkin terlewat sebelum implementasi.
