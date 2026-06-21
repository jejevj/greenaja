import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme, TextInput, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

// ── Dummy data ────────────────────────────────────────────────────────────────
const DUMMY_ADDRESS = {
  label: 'Rumah',
  name: 'Budi Santoso',
  phone: '08123456789',
  address: 'Jl. Melati No. 12, RT 03/RW 05',
  city: 'Bogor, Jawa Barat 16151',
};

const DUMMY_ITEMS = [
  { id: '1', name: 'Bayam Segar',   qty: 2, price: 4500,  unit: '/ikat' },
  { id: '2', name: 'Tomat Organik', qty: 1, price: 12000, unit: '/500g' },
  { id: '3', name: 'Wortel Baby',   qty: 1, price: 9000,  unit: '/250g' },
];

const VALID_PROMOS: Record<string, { label: string; type: 'percent' | 'flat'; value: number }> = {
  'GREENAJA10':  { label: 'Diskon 10%',        type: 'percent', value: 10 },
  'GRATIS50':    { label: 'Gratis Ongkir s/d Rp 15.000', type: 'flat', value: 15000 },
  'WELCOME20':   { label: 'Diskon 20% Pengguna Baru',    type: 'percent', value: 20 },
};

const SHIPPING_OPTIONS = [
  { id: 'reguler', label: 'Reguler', eta: '2–3 hari', price: 15000 },
  { id: 'express', label: 'Express', eta: 'Hari ini',  price: 25000 },
  { id: 'same',    label: 'Same Day', eta: '< 4 jam',  price: 35000 },
];

export default function CheckoutScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const params = useLocalSearchParams();

  const subtotal = Number(params.total) || DUMMY_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof VALID_PROMOS[string] | null>(null);
  const [promoError, setPromoError] = useState('');
  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0].id);
  const [note, setNote] = useState('');
  const [showQris, setShowQris] = useState(false);

  const shippingPrice = SHIPPING_OPTIONS.find(s => s.id === shipping)!.price;

  const discount = appliedPromo
    ? appliedPromo.type === 'percent'
      ? Math.round(subtotal * appliedPromo.value / 100)
      : Math.min(appliedPromo.value, shippingPrice)
    : 0;

  const grandTotal = subtotal + shippingPrice - discount;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_PROMOS[code]) {
      setAppliedPromo(VALID_PROMOS[code]);
      setPromoError('');
    } else {
      setAppliedPromo(null);
      setPromoError('Kode promo tidak valid atau sudah kedaluwarsa.');
    }
  };

  const handleOrder = () => {
    setShowQris(true);
  };

  const handlePaymentDone = () => {
    setShowQris(false);
    Alert.alert(
      '✓ Pesanan Dikonfirmasi',
      'Pembayaran QRIS berhasil.\nPesanan sedang diproses dan akan segera dikirim.',
      [{ text: 'Kembali ke Beranda', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <Ionicons name="arrow-back-outline" size={20} color={t.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: t.text }]}>Checkout</Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>Periksa kembali pesananmu</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160, paddingTop: 4 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── ALAMAT ── */}
        <SectionCard t={t} icon="location-outline" title="Alamat Pengiriman">
          <View style={styles.addressRow}>
            <View style={[styles.addrBadge, { backgroundColor: t.primaryMuted }]}>
              <Text style={[styles.addrBadgeText, { color: t.primary }]}>{DUMMY_ADDRESS.label}</Text>
            </View>
          </View>
          <Text style={[styles.addrName, { color: t.text }]}>{DUMMY_ADDRESS.name} · {DUMMY_ADDRESS.phone}</Text>
          <Text style={[styles.addrLine, { color: t.textSub }]}>{DUMMY_ADDRESS.address}</Text>
          <Text style={[styles.addrLine, { color: t.textSub }]}>{DUMMY_ADDRESS.city}</Text>
        </SectionCard>

        {/* ── PRODUK ── */}
        <SectionCard t={t} icon="bag-outline" title={`Produk (${DUMMY_ITEMS.length} item)`}>
          {DUMMY_ITEMS.map((item, idx) => (
            <View key={item.id} style={[styles.itemRow, idx < DUMMY_ITEMS.length - 1 && { borderBottomWidth: 1, borderColor: t.border }]}>
              <View style={[styles.itemDot, { backgroundColor: t.accent }]}>
                <Ionicons name="leaf-outline" size={16} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: t.text }]}>{item.name}</Text>
                <Text style={[styles.itemSub, { color: t.textSub }]}>{item.qty}× {fmt(item.price)}{item.unit}</Text>
              </View>
              <Text style={[styles.itemTotal, { color: t.text }]}>{fmt(item.price * item.qty)}</Text>
            </View>
          ))}
        </SectionCard>

        {/* ── PENGIRIMAN ── */}
        <SectionCard t={t} icon="bicycle-outline" title="Metode Pengiriman">
          {SHIPPING_OPTIONS.map(opt => {
            const active = shipping === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.shippingOption,
                  { borderColor: active ? t.primary : t.border,
                    backgroundColor: active ? t.primaryMuted : t.surface },
                ]}
                onPress={() => setShipping(opt.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.shippingLabel, { color: active ? t.primary : t.text }]}>{opt.label}</Text>
                  <Text style={[styles.shippingEta, { color: t.textSub }]}>{opt.eta}</Text>
                </View>
                <Text style={[styles.shippingPrice, { color: active ? t.primary : t.text }]}>{fmt(opt.price)}</Text>
                {active && <Ionicons name="checkmark-circle" size={18} color={t.primary} style={{ marginLeft: 8 }} />}
              </TouchableOpacity>
            );
          })}
        </SectionCard>

        {/* ── PROMO ── */}
        <SectionCard t={t} icon="pricetag-outline" title="Kode Promo">
          {appliedPromo ? (
            <View style={[styles.promoApplied, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}>
              <Ionicons name="checkmark-circle" size={18} color={t.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.promoAppliedCode, { color: t.primary }]}>{promoCode.toUpperCase()}</Text>
                <Text style={[styles.promoAppliedLabel, { color: t.textSub }]}>{appliedPromo.label}</Text>
              </View>
              <TouchableOpacity onPress={() => { setAppliedPromo(null); setPromoCode(''); }}>
                <Ionicons name="close-circle-outline" size={20} color={t.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoRow}>
              <TextInput
                style={[styles.promoInput, { backgroundColor: t.accent, borderColor: promoError ? '#E53935' : t.border, color: t.text }]}
                placeholder="Masukkan kode promo"
                placeholderTextColor={t.textSub}
                value={promoCode}
                onChangeText={v => { setPromoCode(v); setPromoError(''); }}
                autoCapitalize="characters"
                returnKeyType="done"
                onSubmitEditing={handleApplyPromo}
              />
              <TouchableOpacity
                style={[styles.promoBtn, { backgroundColor: t.primary }]}
                onPress={handleApplyPromo}
              >
                <Text style={styles.promoBtnText}>Pakai</Text>
              </TouchableOpacity>
            </View>
          )}
          {promoError ? (
            <View style={styles.promoErrorRow}>
              <Ionicons name="alert-circle-outline" size={13} color="#E53935" />
              <Text style={styles.promoErrorText}>{promoError}</Text>
            </View>
          ) : null}
          <View style={styles.promoHints}>
            {['GREENAJA10', 'GRATIS50', 'WELCOME20'].map(code => (
              <TouchableOpacity
                key={code}
                style={[styles.promoHintChip, { borderColor: t.border, backgroundColor: t.surface }]}
                onPress={() => { setPromoCode(code); setPromoError(''); }}
              >
                <Text style={[styles.promoHintText, { color: t.textSub }]}>{code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* ── CATATAN ── */}
        <SectionCard t={t} icon="create-outline" title="Catatan untuk Penjual">
          <TextInput
            style={[styles.noteInput, { backgroundColor: t.accent, borderColor: t.border, color: t.text }]}
            placeholder="Contoh: tolong pilihkan yang paling segar..."
            placeholderTextColor={t.textSub}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </SectionCard>

        {/* ── METODE PEMBAYARAN ── */}
        <SectionCard t={t} icon="qr-code-outline" title="Metode Pembayaran">
          <View style={[styles.qrisCard, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}>
            <View style={[styles.qrisIconBox, { backgroundColor: t.primary }]}>
              <Ionicons name="qr-code-outline" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.qrisLabel, { color: t.text }]}>QRIS</Text>
              <Text style={[styles.qrisSub, { color: t.textSub }]}>Bayar dengan semua dompet digital & m-banking</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color={t.primary} />
          </View>
          <Text style={[styles.qrisNote, { color: t.textSub }]}>* Metode pembayaran lain akan segera tersedia</Text>
        </SectionCard>

        {/* ── RINCIAN HARGA ── */}
        <SectionCard t={t} icon="receipt-outline" title="Rincian Pembayaran">
          <PriceRow t={t} label="Subtotal produk" value={fmt(subtotal)} />
          <PriceRow t={t} label={`Ongkos kirim (${SHIPPING_OPTIONS.find(s=>s.id===shipping)!.label})`} value={fmt(shippingPrice)} />
          {appliedPromo && (
            <PriceRow t={t} label={`Promo (${promoCode.toUpperCase()})`} value={`− ${fmt(discount)}`} valueColor="#2A9960" />
          )}
          <View style={[styles.totalDivider, { backgroundColor: t.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: t.text }]}>Total Pembayaran</Text>
            <Text style={[styles.totalValue, { color: t.primary }]}>{fmt(grandTotal)}</Text>
          </View>
        </SectionCard>

      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { backgroundColor: t.bg }]}>
        <View style={styles.ctaTopRow}>
          <Text style={[styles.ctaTotalLabel, { color: t.textSub }]}>Total</Text>
          <Text style={[styles.ctaTotalValue, { color: t.primary }]}>{fmt(grandTotal)}</Text>
        </View>
        <TouchableOpacity style={styles.ctaOuter} onPress={handleOrder} activeOpacity={0.9}>
          <LinearGradient
            colors={['#1A7A4A', '#2A9960']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaInner}
          >
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
            <Text style={styles.ctaText}>Bayar dengan QRIS</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── QRIS MODAL ── */}
      <Modal visible={showQris} transparent animationType="slide" onRequestClose={() => setShowQris(false)}>
        <View style={styles.qrisModalBg}>
          <View style={[styles.qrisModal, { backgroundColor: t.bg }]}>
            <View style={styles.qrisModalHandle} />

            <Text style={[styles.qrisModalTitle, { color: t.text }]}>Scan QRIS untuk Membayar</Text>
            <Text style={[styles.qrisModalSub, { color: t.textSub }]}>Gunakan aplikasi apapun yang mendukung QRIS</Text>

            {/* QR placeholder */}
            <View style={[styles.qrBox, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 49 }).map((_, i) => (
                  <View
                    key={i}
                    style={[styles.qrCell, {
                      backgroundColor: Math.random() > 0.5 ? t.text : 'transparent',
                      opacity: 0.85,
                    }]}
                  />
                ))}
              </View>
              <Text style={[styles.qrWatermark, { color: t.primary }]}>GreenAja · QRIS</Text>
            </View>

            <View style={[styles.qrisAmtBox, { backgroundColor: t.accent }]}>
              <Text style={[styles.qrisAmtLabel, { color: t.textSub }]}>Jumlah yang harus dibayar</Text>
              <Text style={[styles.qrisAmtValue, { color: t.primary }]}>{fmt(grandTotal)}</Text>
            </View>

            <Text style={[styles.qrisExpiry, { color: t.textSub }]}>QR berlaku selama <Text style={{ fontWeight: '700', color: '#E53935' }}>10:00</Text> menit</Text>

            <TouchableOpacity style={styles.paidBtn} onPress={handlePaymentDone}>
              <LinearGradient
                colors={['#1A7A4A', '#2A9960']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.paidBtnInner}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.paidBtnText}>Saya Sudah Bayar</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowQris(false)} style={styles.cancelBtn}>
              <Text style={[styles.cancelBtnText, { color: t.textSub }]}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionCard({ t, icon, title, children }: { t: typeof LIGHT; icon: any; title: string; children: React.ReactNode }) {
  return (
    <View style={[sectionStyles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={sectionStyles.header}>
        <View style={[sectionStyles.iconBox, { backgroundColor: t.primaryMuted }]}>
          <Ionicons name={icon} size={15} color={t.primary} />
        </View>
        <Text style={[sectionStyles.title, { color: t.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function PriceRow({ t, label, value, valueColor }: { t: typeof LIGHT; label: string; value: string; valueColor?: string }) {
  return (
    <View style={priceRowStyles.row}>
      <Text style={[priceRowStyles.label, { color: t.textSub }]}>{label}</Text>
      <Text style={[priceRowStyles.value, { color: valueColor ?? t.text }]}>{value}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card:    { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  iconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 14, fontWeight: '700' },
});

const priceRowStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: '600' },
});

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:         { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:           { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:        { fontSize: 13, marginTop: 2 },
  // Address
  addressRow:      { flexDirection: 'row', marginBottom: 8 },
  addrBadge:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  addrBadgeText:   { fontSize: 11, fontWeight: '700' },
  addrName:        { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  addrLine:        { fontSize: 13, marginBottom: 1 },
  // Items
  itemRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  itemDot:         { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemName:        { fontSize: 14, fontWeight: '600' },
  itemSub:         { fontSize: 12, marginTop: 2 },
  itemTotal:       { fontSize: 14, fontWeight: '700' },
  // Shipping
  shippingOption:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 8 },
  shippingLabel:   { fontSize: 14, fontWeight: '700' },
  shippingEta:     { fontSize: 12, marginTop: 2 },
  shippingPrice:   { fontSize: 14, fontWeight: '700' },
  // Promo
  promoRow:        { flexDirection: 'row', gap: 8 },
  promoInput:      { flex: 1, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  promoBtn:        { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  promoBtnText:    { fontSize: 14, fontWeight: '700', color: '#fff' },
  promoApplied:    { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 12 },
  promoAppliedCode:{ fontSize: 14, fontWeight: '800' },
  promoAppliedLabel:{ fontSize: 12, marginTop: 1 },
  promoErrorRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  promoErrorText:  { fontSize: 12, color: '#E53935' },
  promoHints:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  promoHintChip:   { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  promoHintText:   { fontSize: 11, fontWeight: '600' },
  // Note
  noteInput:       { borderWidth: 1.5, borderRadius: 10, padding: 12, fontSize: 13, minHeight: 76 },
  // QRIS card
  qrisCard:        { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 12, padding: 14 },
  qrisIconBox:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qrisLabel:       { fontSize: 15, fontWeight: '700' },
  qrisSub:         { fontSize: 12, marginTop: 2 },
  qrisNote:        { fontSize: 11, marginTop: 10, fontStyle: 'italic' },
  // Price summary
  totalDivider:    { height: 1, marginVertical: 10 },
  totalRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:      { fontSize: 15, fontWeight: '700' },
  totalValue:      { fontSize: 20, fontWeight: '800' },
  // CTA
  ctaBar:          { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },
  ctaTopRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ctaTotalLabel:   { fontSize: 13 },
  ctaTotalValue:   { fontSize: 18, fontWeight: '800' },
  ctaOuter:        { borderRadius: 16, overflow: 'hidden' },
  ctaInner:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 },
  ctaText:         { fontSize: 16, fontWeight: '700', color: '#fff' },
  // QRIS Modal
  qrisModalBg:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  qrisModal:       { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, alignItems: 'center' },
  qrisModalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#ddd', marginBottom: 20 },
  qrisModalTitle:  { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  qrisModalSub:    { fontSize: 13, marginBottom: 24, textAlign: 'center' },
  qrBox:           { width: 220, height: 220, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 16, marginBottom: 20 },
  qrGrid:          { flexDirection: 'row', flexWrap: 'wrap', width: 168, height: 168 },
  qrCell:          { width: 24, height: 24 },
  qrWatermark:     { fontSize: 11, fontWeight: '700', marginTop: 8 },
  qrisAmtBox:      { width: '100%', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  qrisAmtLabel:    { fontSize: 12, marginBottom: 4 },
  qrisAmtValue:    { fontSize: 24, fontWeight: '800' },
  qrisExpiry:      { fontSize: 13, marginBottom: 20 },
  paidBtn:         { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  paidBtnInner:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  paidBtnText:     { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn:       { paddingVertical: 12 },
  cancelBtnText:   { fontSize: 14, fontWeight: '600' },
});
