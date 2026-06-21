import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Dimensions, ScrollView, useColorScheme,
  Pressable, TextInput, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT, DARK } from '../constants/Theme';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.88;

export type Variant = { id: string; label: string; price: number; unit: string; stock: number };

export type ProductSheetItem = {
  id: string;
  name: string;
  farm: string;
  tag: string;
  description: string;
  variants: Variant[];
};

type Review = {
  id: string;
  name: string;       // nama asli — akan disensor saat render
  rating: number;
  date: string;
  note: string;
  variant: string;
  photo?: boolean;    // placeholder: apakah ada foto
};

// ── Dummy reviews per productId ────────────────────────────────────────────
const REVIEWS: Record<string, Review[]> = {
  '1': [
    { id: 'r1', name: 'Ari Santoso',   rating: 5, date: '18 Jun 2026', note: 'Bayamnya segar banget, baru pagi sudah sampai. Batangnya renyah dan daunnya tidak layu sama sekali!', variant: '1 Ikat' },
    { id: 'r2', name: 'Jayadi',         rating: 4, date: '15 Jun 2026', note: 'Bagus, segar, sesuai deskripsi. Pengiriman cepat. Akan beli lagi minggu depan.', variant: '3 Ikat' },
    { id: 'r3', name: 'Siti Rahayu',   rating: 5, date: '10 Jun 2026', note: 'Terbaik! Organik dan bebas pestisida, anak-anak pun suka makannya.', variant: '1 Ikat', photo: true },
    { id: 'r4', name: 'Budi Utomo',    rating: 3, date: '5 Jun 2026',  note: 'Lumayan segar, tapi pengiriman agak telat. Semoga next order lebih cepat.', variant: '5 Ikat' },
  ],
  '2': [
    { id: 'r1', name: 'Fitri Lestari', rating: 5, date: '20 Jun 2026', note: 'Tomat organiknya manis dan segar! Cocok banget buat salad dan tumisan.', variant: '500g' },
    { id: 'r2', name: 'Hendro',        rating: 4, date: '17 Jun 2026', note: 'Kualitas oke, harga sepadan untuk tomat organik bersertifikat.', variant: '250g', photo: true },
    { id: 'r3', name: 'Wulandari',     rating: 5, date: '12 Jun 2026', note: 'Sudah langganan 3 bulan, konsisten segar dan dikirim tepat waktu!', variant: '1kg' },
  ],
  '3': [
    { id: 'r1', name: 'Agus Prasetyo', rating: 5, date: '19 Jun 2026', note: 'Cabainya pedas banget, fresh dari kebun. Sempurna untuk sambal!', variant: '250g' },
    { id: 'r2', name: 'Rini',           rating: 4, date: '14 Jun 2026', note: 'Segar dan pedes, mantap. Ukurannya juga seragam.', variant: '100g' },
  ],
  '4': [
    { id: 'r1', name: 'Darmawan',      rating: 5, date: '21 Jun 2026', note: 'Kangkungnya hijau segar, batang renyah banget. Pas buat tumis!', variant: '1 Ikat' },
    { id: 'r2', name: 'Nurul Hidayah', rating: 5, date: '16 Jun 2026', note: 'Langganan tiap minggu, kualitasnya stabil. Petaninya keren!', variant: '3 Ikat', photo: true },
    { id: 'r3', name: 'Eko Setiawan',  rating: 4, date: '11 Jun 2026', note: 'Enak dan segar, tapi daun agak sedikit lebih kuning dari biasanya.', variant: '1 Ikat' },
  ],
  '5': [
    { id: 'r1', name: 'Laras',         rating: 5, date: '20 Jun 2026', note: 'Wortel babynya manis dan crispy banget, anak-anak suka snack langsung!', variant: '250g' },
    { id: 'r2', name: 'Teguh Wibowo',  rating: 4, date: '13 Jun 2026', note: 'Segar dan bersih. Ukurannya pas, tidak terlalu kecil.', variant: '500g' },
  ],
  '6': [
    { id: 'r1', name: 'Citra Dewi',    rating: 5, date: '19 Jun 2026', note: 'Brokolinya besar dan segar! Sudah beli 5x, kualitas selalu konsisten.', variant: 'Besar (~600g)', photo: true },
    { id: 'r2', name: 'Bagas',         rating: 5, date: '15 Jun 2026', note: 'Organik dan padat, rasanya manis alami. Harga worth it.', variant: 'Kecil (~300g)' },
    { id: 'r3', name: 'Mirna Sari',    rating: 4, date: '9 Jun 2026',  note: 'Bagus, cuma floretnya ada sedikit yang agak kuning di pinggir.', variant: 'Besar (~600g)' },
  ],
};

// ── Sensor nama: "Ari Santoso" → "A*i S******" ───────────────────────────────
function censorName(name: string): string {
  return name
    .split(' ')
    .map(word => {
      if (word.length <= 1) return word;
      if (word.length === 2) return word[0] + '*';
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    })
    .join(' ');
}

// ── Star display component ────────────────────────────────────────────────────
function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <Ionicons key={s} name={s <= rating ? 'star' : 'star-outline'} size={size} color={s <= rating ? '#F59E0B' : '#D1D5DB'} />
      ))}
    </View>
  );
}

type Props = {
  visible: boolean;
  product: ProductSheetItem | null;
  onClose: () => void;
  onAddToCart: (productId: string, variantId: string, qty: number) => void;
};

export default function ProductBottomSheet({ visible, product, onClose, onAddToCart }: Props) {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const slideAnim = useRef(new Animated.Value(SHEET_H)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const qtyInputRef = useRef<TextInput>(null);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [qty, setQty]         = useState(1);
  const [qtyRaw, setQtyRaw]   = useState('1');
  const [qtyFocused, setQtyFocused] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]?.id ?? null);
      setQty(1); setQtyRaw('1');
      setShowAllReviews(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SHEET_H, duration: 240, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,       duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!product) return null;

  const variant    = product.variants.find(v => v.id === selectedVariant);
  const maxStock   = variant?.stock ?? 99;
  const totalPrice = variant ? variant.price * qty : 0;
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const reviews    = REVIEWS[product.id] ?? [];
  const avgRating  = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  // rating distribution (1–5 star count)
  const dist = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const stepQty = (delta: number) => {
    const next = Math.min(maxStock, Math.max(1, qty + delta));
    setQty(next); setQtyRaw(String(next));
  };
  const handleQtyChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setQtyRaw(cleaned);
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed) && parsed >= 1) setQty(Math.min(maxStock, parsed));
  };
  const handleQtyBlur = () => {
    setQtyFocused(false);
    const parsed = parseInt(qtyRaw, 10);
    const safe = isNaN(parsed) || parsed < 1 ? 1 : Math.min(maxStock, parsed);
    setQty(safe); setQtyRaw(String(safe));
  };
  const handleAdd = () => {
    if (!selectedVariant) return;
    Keyboard.dismiss();
    onAddToCart(product.id, selectedVariant, qty);
    onClose();
  };
  const qtyError = !qtyFocused && (qty < 1 || qty > maxStock);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} statusBarTranslucent animationType="none">
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => { Keyboard.dismiss(); onClose(); }} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: t.bg, height: SHEET_H, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleWrap}>
          <View style={[styles.handle, { backgroundColor: t.border }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Product header */}
          <View style={styles.productHeader}>
            <View style={[styles.productIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="leaf-outline" size={44} color={t.primary} />
            </View>
            <View style={[styles.tagBox, { backgroundColor: t.primaryMuted }]}>
              <Text style={[styles.tagText, { color: t.primary }]}>{product.tag}</Text>
            </View>
          </View>

          <View style={styles.productMeta}>
            <Text style={[styles.productName, { color: t.text }]}>{product.name}</Text>
            <View style={styles.farmRow}>
              <Ionicons name="location-outline" size={13} color={t.textSub} />
              <Text style={[styles.farmText, { color: t.textSub }]}>{product.farm}</Text>
            </View>
            {/* Avg rating badge di bawah nama */}
            {reviews.length > 0 && (
              <View style={styles.avgRow}>
                <Stars rating={Math.round(avgRating)} size={14} />
                <Text style={[styles.avgText, { color: t.text }]}>{avgRating.toFixed(1)}</Text>
                <Text style={[styles.avgCount, { color: t.textSub }]}>({reviews.length} ulasan)</Text>
              </View>
            )}
            <Text style={[styles.desc, { color: t.textSub }]}>{product.description}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: t.border }]} />

          {/* Variant selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: t.text }]}>Pilih Varian</Text>
            <View style={styles.variantList}>
              {product.variants.map(v => {
                const active = selectedVariant === v.id;
                const outOfStock = v.stock === 0;
                return (
                  <TouchableOpacity
                    key={v.id}
                    disabled={outOfStock}
                    onPress={() => { setSelectedVariant(v.id); setQty(1); setQtyRaw('1'); }}
                    style={[
                      styles.variantChip,
                      { borderColor: active ? t.primary : t.border, backgroundColor: active ? t.primaryMuted : t.surface, opacity: outOfStock ? 0.4 : 1 },
                    ]}
                  >
                    <Text style={[styles.variantLabel, { color: active ? t.primary : t.text }]}>{v.label}</Text>
                    <Text style={[styles.variantPrice, { color: active ? t.primary : t.textSub }]}>{fmt(v.price)}</Text>
                    <Text style={[styles.variantUnit, { color: t.textSub }]}>{v.unit}</Text>
                    {outOfStock && (
                      <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>Habis</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: t.border }]} />

          {/* Qty stepper */}
          <View style={styles.section}>
            <View style={styles.qtyLabelRow}>
              <Text style={[styles.sectionLabel, { color: t.text }]}>Jumlah</Text>
              {variant && (
                <Text style={[styles.stockNote, { color: t.textSub }]}>
                  Stok: <Text style={{ color: t.primary, fontWeight: '700' }}>{variant.stock}</Text> {variant.unit}
                </Text>
              )}
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, { borderColor: qty <= 1 ? t.border : t.primary, backgroundColor: t.surface }]}
                onPress={() => stepQty(-1)} disabled={qty <= 1}
              >
                <Ionicons name="remove-outline" size={18} color={qty <= 1 ? t.textSub : t.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1} onPress={() => qtyInputRef.current?.focus()}
                style={[styles.qtyInputBox, { borderColor: qtyFocused ? t.primary : t.border, backgroundColor: qtyFocused ? t.primaryMuted : t.accent }]}
              >
                <TextInput
                  ref={qtyInputRef}
                  style={[styles.qtyInput, { color: t.text }]}
                  value={qtyFocused ? qtyRaw : String(qty)}
                  onChangeText={handleQtyChange}
                  onFocus={() => { setQtyFocused(true); setQtyRaw(String(qty)); }}
                  onBlur={handleQtyBlur}
                  keyboardType="number-pad"
                  selectTextOnFocus maxLength={4}
                  returnKeyType="done" onSubmitEditing={handleQtyBlur}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qtyBtn, { borderColor: qty >= maxStock ? t.border : t.primary, backgroundColor: qty >= maxStock ? t.surface : t.primary }]}
                onPress={() => stepQty(1)} disabled={qty >= maxStock}
              >
                <Ionicons name="add-outline" size={18} color={qty >= maxStock ? t.textSub : '#fff'} />
              </TouchableOpacity>
              {!qtyFocused && (
                <TouchableOpacity onPress={() => qtyInputRef.current?.focus()} style={[styles.editHint, { backgroundColor: t.primaryMuted }]}>
                  <Ionicons name="pencil-outline" size={12} color={t.primary} />
                  <Text style={[styles.editHintText, { color: t.primary }]}>Ketik</Text>
                </TouchableOpacity>
              )}
            </View>
            {qtyError && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color={t.danger} />
                <Text style={[styles.errorText, { color: t.danger }]}>Maksimal {maxStock} {variant?.unit}</Text>
              </View>
            )}
          </View>

          {/* ───────────── SECTION ULASAN ───────────── */}
          {reviews.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: t.border }]} />

              {/* Header ulasan */}
              <View style={styles.reviewHeader}>
                <View style={styles.reviewHeaderLeft}>
                  <View style={[styles.reviewIconBox, { backgroundColor: t.primaryMuted }]}>
                    <Ionicons name="star" size={14} color={t.primary} />
                  </View>
                  <Text style={[styles.sectionLabel, { color: t.text }]}>Ulasan Pembeli</Text>
                </View>
                <Text style={[styles.reviewCount, { color: t.textSub }]}>{reviews.length} ulasan</Text>
              </View>

              {/* Rating summary card */}
              <View style={[styles.ratingSummary, { backgroundColor: t.surface, borderColor: t.border }]}>
                {/* Left: big number */}
                <View style={styles.ratingBig}>
                  <Text style={[styles.ratingBigNum, { color: t.text }]}>{avgRating.toFixed(1)}</Text>
                  <Stars rating={Math.round(avgRating)} size={16} />
                  <Text style={[styles.ratingBigSub, { color: t.textSub }]}>{reviews.length} ulasan</Text>
                </View>
                {/* Right: distribution bars */}
                <View style={styles.ratingBars}>
                  {dist.map(({ star, count }) => {
                    const pct = reviews.length > 0 ? count / reviews.length : 0;
                    return (
                      <View key={star} style={styles.barRow}>
                        <Text style={[styles.barStar, { color: t.textSub }]}>{star}</Text>
                        <Ionicons name="star" size={10} color="#F59E0B" />
                        <View style={[styles.barTrack, { backgroundColor: t.border }]}>
                          <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: t.primary }]} />
                        </View>
                        <Text style={[styles.barCount, { color: t.textSub }]}>{count}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Review cards */}
              <View style={styles.reviewList}>
                {visibleReviews.map((review, idx) => (
                  <View
                    key={review.id}
                    style={[
                      styles.reviewCard,
                      { backgroundColor: t.surface, borderColor: t.border },
                      idx < visibleReviews.length - 1 && { marginBottom: 10 },
                    ]}
                  >
                    {/* Top: avatar + name + rating */}
                    <View style={styles.reviewCardTop}>
                      <View style={[styles.reviewAvatar, { backgroundColor: t.primaryMuted }]}>
                        <Text style={[styles.reviewAvatarText, { color: t.primary }]}>
                          {review.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.reviewName, { color: t.text }]}>
                          {censorName(review.name)}
                        </Text>
                        <View style={styles.reviewMetaRow}>
                          <Stars rating={review.rating} size={12} />
                          <Text style={[styles.reviewDate, { color: t.textSub }]}>{review.date}</Text>
                        </View>
                      </View>
                      {/* Variant tag */}
                      <View style={[styles.reviewVariantBadge, { backgroundColor: t.accent }]}>
                        <Text style={[styles.reviewVariantText, { color: t.textSub }]}>{review.variant}</Text>
                      </View>
                    </View>

                    {/* Note */}
                    <Text style={[styles.reviewNote, { color: t.text }]}>{review.note}</Text>

                    {/* Photo placeholder */}
                    {review.photo && (
                      <View style={styles.reviewPhotoRow}>
                        {[0, 1].map(i => (
                          <View key={i} style={[styles.reviewPhotoThumb, { backgroundColor: t.accent, borderColor: t.border }]}>
                            <Ionicons name="image-outline" size={20} color={t.textSub} />
                          </View>
                        ))}
                        <View style={[styles.reviewPhotoThumb, { backgroundColor: t.accent, borderColor: t.border, justifyContent: 'center', alignItems: 'center' }]}>
                          <Text style={[styles.reviewPhotoMore, { color: t.textSub }]}>+2</Text>
                        </View>
                      </View>
                    )}

                    {/* Helpful row */}
                    <View style={styles.helpfulRow}>
                      <Ionicons name="thumbs-up-outline" size={12} color={t.textSub} />
                      <Text style={[styles.helpfulText, { color: t.textSub }]}>Ulasan ini membantu</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Show more / less */}
              {reviews.length > 2 && (
                <TouchableOpacity
                  style={[styles.showMoreBtn, { borderColor: t.border, backgroundColor: t.surface }]}
                  onPress={() => setShowAllReviews(p => !p)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.showMoreText, { color: t.primary }]}>
                    {showAllReviews ? 'Sembunyikan ulasan' : `Lihat semua ${reviews.length} ulasan`}
                  </Text>
                  <Ionicons
                    name={showAllReviews ? 'chevron-up-outline' : 'chevron-down-outline'}
                    size={14} color={t.primary}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>

        {/* CTA bar */}
        <View style={[styles.ctaBar, { backgroundColor: t.bg }]}>
          <View style={styles.ctaPriceRow}>
            <Text style={[styles.ctaPriceLabel, { color: t.textSub }]}>Total harga</Text>
            <Text style={[styles.ctaPrice, { color: t.primary }]}>{fmt(totalPrice)}</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtnOuter} onPress={handleAdd} activeOpacity={0.88}>
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.ctaBtnInner}
            >
              <Ionicons name="bag-add-outline" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Tambah ke Keranjang</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:            { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:               { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  handleWrap:          { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle:              { width: 36, height: 4, borderRadius: 2 },
  productHeader:       { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  productIconBox:      { width: 100, height: 100, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  tagBox:              { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText:             { fontSize: 11, fontWeight: '700' },
  productMeta:         { paddingHorizontal: 20, paddingBottom: 16, alignItems: 'center' },
  productName:         { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 6, textAlign: 'center' },
  farmRow:             { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  farmText:            { fontSize: 13 },
  avgRow:              { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  avgText:             { fontSize: 14, fontWeight: '800' },
  avgCount:            { fontSize: 12 },
  desc:                { fontSize: 13, lineHeight: 20, textAlign: 'center' },
  divider:             { height: 1, marginHorizontal: 20, marginVertical: 16 },
  section:             { paddingHorizontal: 20, marginBottom: 4 },
  sectionLabel:        { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  variantList:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  variantChip:         { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, minWidth: 90, alignItems: 'center', gap: 2, overflow: 'hidden' },
  variantLabel:        { fontSize: 13, fontWeight: '700' },
  variantPrice:        { fontSize: 13, fontWeight: '800' },
  variantUnit:         { fontSize: 11 },
  outOfStockOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  outOfStockText:      { fontSize: 11, fontWeight: '700', color: '#888' },
  qtyLabelRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stockNote:           { fontSize: 12 },
  qtyRow:              { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn:              { width: 42, height: 42, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  qtyInputBox:         { width: 64, height: 42, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  qtyInput:            { fontSize: 18, fontWeight: '800', textAlign: 'center', width: '100%', paddingHorizontal: 4 },
  editHint:            { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  editHintText:        { fontSize: 11, fontWeight: '600' },
  errorRow:            { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  errorText:           { fontSize: 12 },

  // ─ Review section ─
  reviewHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
  reviewHeaderLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewIconBox:       { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  reviewCount:         { fontSize: 12 },

  ratingSummary:       { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, gap: 16, marginBottom: 14 },
  ratingBig:           { alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 70 },
  ratingBigNum:        { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  ratingBigSub:        { fontSize: 11, marginTop: 4 },
  ratingBars:          { flex: 1, gap: 5, justifyContent: 'center' },
  barRow:              { flexDirection: 'row', alignItems: 'center', gap: 5 },
  barStar:             { fontSize: 11, width: 10, textAlign: 'right' },
  barTrack:            { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill:             { height: '100%', borderRadius: 3 },
  barCount:            { fontSize: 11, width: 16, textAlign: 'right' },

  reviewList:          { paddingHorizontal: 20, marginBottom: 4 },
  reviewCard:          { borderRadius: 16, borderWidth: 1, padding: 14 },
  reviewCardTop:       { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  reviewAvatar:        { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText:    { fontSize: 15, fontWeight: '800' },
  reviewName:          { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  reviewMetaRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewDate:          { fontSize: 11 },
  reviewVariantBadge:  { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  reviewVariantText:   { fontSize: 10, fontWeight: '600' },
  reviewNote:          { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  reviewPhotoRow:      { flexDirection: 'row', gap: 8, marginBottom: 10 },
  reviewPhotoThumb:    { width: 56, height: 56, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  reviewPhotoMore:     { fontSize: 13, fontWeight: '700' },
  helpfulRow:          { flexDirection: 'row', alignItems: 'center', gap: 5 },
  helpfulText:         { fontSize: 11 },

  showMoreBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginHorizontal: 20, borderWidth: 1, borderRadius: 14, paddingVertical: 12, marginTop: 8, marginBottom: 4 },
  showMoreText:        { fontSize: 13, fontWeight: '700' },

  // ─ CTA bar ─
  ctaBar:              { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  ctaPriceRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ctaPriceLabel:       { fontSize: 13 },
  ctaPrice:            { fontSize: 20, fontWeight: '800' },
  ctaBtnOuter:         { borderRadius: 16, overflow: 'hidden' },
  ctaBtnInner:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaBtnText:          { fontSize: 16, fontWeight: '700', color: '#fff' },
});
