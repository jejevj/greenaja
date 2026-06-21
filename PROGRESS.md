# GreenAja Mobile — Catatan Progres Pengembangan

> Dokumen ini mencatat semua perubahan yang telah dikerjakan pada project GreenAja Mobile (Expo + React Native) secara kronologis.

---

## 🏗️ Setup & Fondasi

### Init Project
- Setup folder `mobile/` dengan Expo SDK 53 + React Native 0.79
- Konfigurasi `expo-router` (file-based routing)
- Tambah dependencies: `expo-linear-gradient`, `@expo/vector-icons` (Ionicons)
- Buat struktur folder: `app/(auth)`, `app/(tabs)`, `components/`, `constants/`
- Setup `Theme.ts` dengan token warna LIGHT & DARK (`primary`, `bg`, `surface`, `accent`, `border`, `text`, `textSub`, `primaryMuted`)
- Konfigurasi `.gitignore` untuk Android, iOS, dan Expo

---

## 🎨 Halaman Auth

### Splash Screen (`app/index.tsx`)
- Full-screen `LinearGradient` hijau gelap (`#1a7a4a → #0d4a2c`)
- Logo icon `leaf-outline` (Ionicons) dalam kotak transparan
- Nama app **GreenAja** + tagline
- Auto-redirect ke login setelah 2.5 detik
- Label versi `v1.0.0` di bawah layar

### Halaman Login (`app/(auth)/login.tsx`)
- Gradient header hijau di atas, card putih melayang (`borderTopRadius: 28`)
- Input Email & Password dengan style `#f7f7f7`, border 1.5px
- Toggle show/hide password menggunakan `eye-outline` / `eye-off-outline` (Ionicons)
- Tombol **Masuk** dengan `LinearGradient` horizontal
- Link ke halaman Register
- Semua emoji diganti Ionicons outlined

### Halaman Register (`app/(auth)/register.tsx`)
- Struktur sama dengan Login (gradient header + card melayang)
- Form: Nama, Email, Password, Konfirmasi Password
- Tombol kembali menggunakan `arrow-back-outline` + teks "Kembali"
- Toggle password sama dengan Login
- Tombol **Daftar** gradient konsisten

---

## 🏠 Halaman Utama (Home)

### Top Bar
- Greeting + judul **GreenAja Market**
- Tombol keranjang (dengan badge count) dan profil di kanan

### Search Bar
- Input dengan `search-outline`, border berubah warna saat fokus
- Tombol `close-circle-outline` muncul saat ada teks

### Ad Slideshow (Banner Iklan)
- `FlatList` horizontal paginated, 5 slide iklan
- Auto-advance setiap 3.5 detik, timer reset setelah swipe manual
- Setiap slide: `LinearGradient` warna unik, icon Ionicons, dekorasi lingkaran transparan
- Dot indicator di bawah — dot aktif melebar (pill shape), bisa di-tap untuk navigasi
- Konten iklan: Sayur Segar, Gratis Ongkir, Produk Organik, Paket Keluarga, Dukung Petani

### Promo Cards
- Horizontal scroll, 3 kartu promo gradient hijau
- Icon `pricetag-outline` + judul + subtitle

### Category Chips
- 6 kategori: Semua, Sayuran, Buah, Rempah, Organik, Lokal
- Chip aktif: background hijau, teks putih

### Product Grid
- 2-kolom grid, 6 produk
- Tiap kartu: icon placeholder, tag badge, nama, nama kebun, harga, tombol tambah
- Tombol tambah berubah jadi `checkmark` jika sudah di keranjang
- Tap kartu/tombol → buka Product Bottom Sheet

### Rekomendasi Horizontal
- Scroll horizontal 3 produk terakhir

### Floating Cart Button
- Muncul saat cart tidak kosong, posisi absolute bottom
- Gradient hijau, menampilkan jumlah item & link ke keranjang

---

## 🛒 Product Bottom Sheet (`components/ProductBottomSheet.tsx`)

### Fitur Utama
- Modal dengan animasi slide-up spring + fade backdrop
- Drag handle di atas
- Icon produk, tag, nama, asal kebun, deskripsi

### Variant Selector
- Chip varian dengan border aktif warna primary
- Varian habis ditampilkan overlay "Habis" + disabled

### Qty Stepper (dengan Keyboard Input)
- Tombol `−` dan `+` (Ionicons)
- **Input langsung via keyboard**: tap angka → keyboard numerik muncul, teks ter-select otomatis
- `selectTextOnFocus` untuk UX yang nyaman
- Validasi: hanya digit, minimum 1, maksimum = stok tersedia
- Normalisasi saat blur: kosong/0 → kembali ke 1
- Hint `✏️ Ketik` muncul saat tidak fokus
- Pesan error muncul jika melebihi stok
- `Keyboard.dismiss()` otomatis saat sheet ditutup
- Label stok tersedia di baris atas stepper

### CTA Bar
- Pinned di bawah sheet, total harga update real-time
- Tombol **Tambah ke Keranjang** gradient + icon `bag-add-outline`

---

## 🛍️ Halaman Cart (`app/(tabs)/cart.tsx`)
- Daftar item cart
- Update qty & hapus item
- Summary total harga
- Tombol checkout gradient

---

## 👤 Halaman Profil (`app/(tabs)/profile.tsx`)
- Info user (dummy)
- Menu navigasi profil

---

## 🔍 Halaman Explore (`app/(tabs)/explore.tsx`)
- Daftar/grid semua produk
- Filter kategori

---

## 🎨 Design System

| Token | Light | Dark |
|---|---|---|
| `primary` | `#1A7A4A` | `#2A9960` |
| `bg` | `#F8FAF9` | `#0F1A14` |
| `surface` | `#FFFFFF` | `#1A2A1F` |
| `accent` | `#EBF5EE` | `#162310` |
| `border` | `#E5EDE8` | `#2A3D30` |
| `text` | `#1A1A1A` | `#F0F5F2` |
| `textSub` | `#7A8C82` | `#6A8070` |
| `primaryMuted` | `#D4EEE0` | `#1A3D28` |

**Icon system:** Semua menggunakan `Ionicons` dengan variant `*-outline`  
**Button CTA:** Selalu `LinearGradient ['#1A7A4A', '#2A9960']`  
**Border radius:** Cards `16px`, Chips `24px`, Input `12–14px`, Sheet `24px`

---

## 📋 Backlog / Yang Belum Dikerjakan

- [ ] Integrasi API backend (auth, produk, cart, order)
- [ ] Halaman detail produk (full page)
- [ ] Upload foto produk (gambar nyata, bukan placeholder icon)
- [ ] Push notification
- [ ] State management global (Zustand / Redux)
- [ ] Persistence cart (AsyncStorage)
- [ ] Ad slideshow dengan gambar nyata dari server
- [ ] Halaman order & riwayat transaksi
- [ ] Rating & ulasan produk
- [ ] Dark mode polish
