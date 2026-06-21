import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const { width } = Dimensions.get('window');

// ── Dummy order data ───────────────────────────────────────────────────────────────
const ORDER = {
  id: 'GRN-20260622-8471',
  date: '22 Juni 2026, 03:48 WIB',
  paymentMethod: 'QRIS',
  items: [
    { name: 'Bayam Segar',   qty: 2, price: 4500,  unit: '/ikat' },
    { name: 'Tomat Organik', qty: 1, price: 12000, unit: '/500g' },
    { name: 'Wortel Baby',   qty: 1, price: 9000,  unit: '/250g' },
  ],
  subtotal: 30000,
  shipping: 15000,
  discount: 3000,
  total: 42000,
  address: 'Jl. Melati No. 12, RT 03/RW 05, Bogor, Jawa Barat 16151',
  recipient: 'Budi Santoso · 08123456789',
  shippingMethod: 'Reguler (2–3 hari)',
  estimatedArrival: '24–25 Juni 2026',
};

type TrackStep = {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  time: string | null;
  status: 'done' | 'active' | 'pending';
};

const INITIAL_STEPS: TrackStep[] = [
  {
    id: 'paid',
    label: 'Pembayaran Diterima',
    sublabel: 'QRIS berhasil diverifikasi',
    icon: 'checkmark-circle',
    time: '03:48 WIB',
    status: 'done',
  },
  {
    id: 'confirmed',
    label: 'Pesanan Dikonfirmasi',
    sublabel: 'Penjual sedang mempersiapkan pesanan',
    icon: 'receipt',
    time: '03:49 WIB',
    status: 'done',
  },
  {
    id: 'packing',
    label: 'Sedang Dikemas',
    sublabel: 'Produk segar dipilihkan dan dikemas',
    icon: 'cube',
    time: null,
    status: 'active',
  },
  {
    id: 'pickup',
    label: 'Siap Dijemput Kurir',
    sublabel: 'Menunggu kurir pengambilan',
    icon: 'bicycle',
    time: null,
    status: 'pending',
  },
  {
    id: 'shipping',
    label: 'Dalam Pengiriman',
    sublabel: 'Pesanan dalam perjalanan ke lokasimu',
    icon: 'car',
    time: null,
    status: 'pending',
  },
  {
    id: 'delivered',
    label: 'Pesanan Tiba',
    sublabel: 'Produk berhasil diterima',
    icon: 'home',
    time: null,
    status: 'pending',
  },
];

export default function OrderSuccessScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const params = useLocalSearchParams();
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  // Entrance animations
  const checkScale  = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentY    = useRef(new Animated.Value(40)).current;
  const contentOp   = useRef(new Animated.Value(0)).current;

  // Tracking section toggle
  const [showTracking, setShowTracking] = useState(false);
  const [steps] = useState<TrackStep[]>(INITIAL_STEPS);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(checkScale,   { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentY,  { toValue: 0, duration: 380, useNativeDriver: true }),
        Animated.timing(contentOp, { toValue: 1, duration: 380, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const statusColor = (s: TrackStep['status']) => {
    if (s === 'done')    return t.primary;
    if (s === 'active')  return '#F59E0B';
    return t.border;
  };
  const statusBg = (s: TrackStep['status']) => {
    if (s === 'done')    return t.primaryMuted;
    if (s === 'active')  return '#FEF3C7';
    return t.accent;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── SUCCESS HERO ── */}
        <LinearGradient
          colors={['#1A7A4A', '#2A9960', '#3DB870']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Deco circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          {/* Check icon */}
          <Animated.View
            style={[
              styles.checkCircle,
              { opacity: checkOpacity, transform: [{ scale: checkScale }] },
            ]}
          >
            <Ionicons name="checkmark" size={48} color="#1A7A4A" />
          </Animated.View>

          <Text style={styles.heroTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.heroSub}>Pesananmu sudah kami terima</Text>

          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>ID Pesanan</Text>
            <Text style={styles.orderId}>{ORDER.id}</Text>
          </View>
        </LinearGradient>

        <Animated.View style={{ opacity: contentOp, transform: [{ translateY: contentY }] }}>

          {/* ── DETAIL PESANAN ── */}
          <View style={styles.section}>
            <SectionHeader t={t} icon="receipt-outline" title="Detail Pesanan" />
            <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>

              {/* Items */}
              {ORDER.items.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.itemRow,
                    idx < ORDER.items.length - 1 && { borderBottomWidth: 1, borderColor: t.border },
                  ]}
                >
                  <View style={[styles.itemDot, { backgroundColor: t.accent }]}>
                    <Ionicons name="leaf-outline" size={14} color={t.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemName, { color: t.text }]}>{item.name}</Text>
                    <Text style={[styles.itemSub, { color: t.textSub }]}>{item.qty}× {fmt(item.price)}{item.unit}</Text>
                  </View>
                  <Text style={[styles.itemTotal, { color: t.text }]}>{fmt(item.price * item.qty)}</Text>
                </View>
              ))}

              {/* Price breakdown */}
              <View style={[styles.priceDivider, { backgroundColor: t.border }]} />
              <PriceRow t={t} label="Subtotal"     value={fmt(ORDER.subtotal)} />
              <PriceRow t={t} label="Ongkos Kirim" value={fmt(ORDER.shipping)} />
              <PriceRow t={t} label="Diskon Promo" value={`− ${fmt(ORDER.discount)}`} valueColor="#2A9960" />
              <View style={[styles.priceDivider, { backgroundColor: t.border }]} />
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: t.text }]}>Total Dibayar</Text>
                <Text style={[styles.totalValue, { color: t.primary }]}>{fmt(ORDER.total)}</Text>
              </View>

              {/* Meta info */}
              <View style={[styles.metaBox, { backgroundColor: t.accent, borderColor: t.border }]}>
                <MetaRow t={t} icon="calendar-outline"    label="Tanggal"          value={ORDER.date} />
                <MetaRow t={t} icon="qr-code-outline"     label="Metode Bayar"     value={ORDER.paymentMethod} />
                <MetaRow t={t} icon="bicycle-outline"     label="Pengiriman"       value={ORDER.shippingMethod} />
                <MetaRow t={t} icon="time-outline"        label="Est. Tiba"        value={ORDER.estimatedArrival} />
                <MetaRow t={t} icon="location-outline"   label="Alamat"           value={ORDER.address} />
                <MetaRow t={t} icon="person-outline"     label="Penerima"         value={ORDER.recipient} last />
              </View>
            </View>
          </View>

          {/* ── TRACKING ── */}
          <View style={styles.section}>
            <SectionHeader t={t} icon="navigate-outline" title="Tracking Pesanan" />
            <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>

              {/* Active status banner */}
              <View style={[styles.activeBanner, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
                <Ionicons name="cube-outline" size={18} color="#F59E0B" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.activeBannerTitle, { color: '#92400E' }]}>Sedang Dikemas</Text>
                  <Text style={[styles.activeBannerSub, { color: '#B45309' }]}>Penjual memilihkan produk terbaik untukmu</Text>
                </View>
                <View style={styles.activePulse}>
                  <View style={[styles.activeDot, { backgroundColor: '#F59E0B' }]} />
                </View>
              </View>

              {/* Timeline */}
              <View style={styles.timeline}>
                {steps.map((step, idx) => {
                  const isLast = idx === steps.length - 1;
                  const color  = statusColor(step.status);
                  const bg     = statusBg(step.status);
                  return (
                    <View key={step.id} style={styles.timelineRow}>
                      {/* Line */}
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            { backgroundColor: step.status === 'done' ? t.primary : t.border },
                          ]}
                        />
                      )}

                      {/* Icon */}
                      <View style={[styles.timelineIcon, { backgroundColor: bg, borderColor: color }]}>
                        <Ionicons name={step.icon as any} size={16} color={color} />
                        {step.status === 'active' && (
                          <View style={[styles.activePulseRing, { borderColor: '#F59E0B' }]} />
                        )}
                      </View>

                      {/* Text */}
                      <View style={styles.timelineContent}>
                        <Text style={[
                          styles.timelineLabel,
                          { color: step.status === 'pending' ? t.textSub : t.text },
                          step.status === 'active' && { color: '#92400E', fontWeight: '800' },
                        ]}>
                          {step.label}
                          {step.status === 'active' && (
                            <Text style={{ color: '#F59E0B' }}> •</Text>
                          )}
                        </Text>
                        <Text style={[styles.timelineSub, { color: t.textSub }]}>{step.sublabel}</Text>
                        {step.time && (
                          <Text style={[styles.timelineTime, { color: t.primary }]}>{step.time}</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              <Text style={[styles.trackingNote, { color: t.textSub }]}>
                Status diperbarui secara otomatis. Notifikasi akan dikirim saat status berubah.
              </Text>
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {/* ── BOTTOM ACTIONS ── */}
      <View style={[styles.bottomBar, { backgroundColor: t.bg }]}>
        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: t.border, backgroundColor: t.surface }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Ionicons name="home-outline" size={17} color={t.text} />
          <Text style={[styles.secondaryBtnText, { color: t.text }]}>Beranda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtnOuter}
          onPress={() => {
            // Scroll to tracking section — on real app would deep-link to order detail
            // For demo: just highlight with a brief flash or navigate
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#1A7A4A', '#2A9960']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.primaryBtnInner}
          >
            <Ionicons name="navigate-outline" size={17} color="#fff" />
            <Text style={styles.primaryBtnText}>Lacak Pesanan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({ t, icon, title }: { t: typeof LIGHT; icon: any; title: string }) {
  return (
    <View style={secStyles.row}>
      <View style={[secStyles.iconBox, { backgroundColor: t.primaryMuted }]}>
        <Ionicons name={icon} size={14} color={t.primary} />
      </View>
      <Text style={[secStyles.title, { color: t.text }]}>{title}</Text>
    </View>
  );
}

function PriceRow({ t, label, value, valueColor }: { t: typeof LIGHT; label: string; value: string; valueColor?: string }) {
  return (
    <View style={prStyles.row}>
      <Text style={[prStyles.label, { color: t.textSub }]}>{label}</Text>
      <Text style={[prStyles.value, { color: valueColor ?? t.text }]}>{value}</Text>
    </View>
  );
}

function MetaRow({ t, icon, label, value, last }: { t: typeof LIGHT; icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[metaStyles.row, !last && { borderBottomWidth: 1, borderColor: t.border }]}>
      <Ionicons name={icon} size={14} color={t.textSub} />
      <Text style={[metaStyles.label, { color: t.textSub }]}>{label}</Text>
      <Text style={[metaStyles.value, { color: t.text }]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const secStyles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  iconBox: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 14, fontWeight: '700' },
});

const prStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: '600' },
});

const metaStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 9 },
  label: { fontSize: 12, width: 90 },
  value: { flex: 1, fontSize: 12, fontWeight: '600', textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe:              { flex: 1 },
  // Hero
  hero:              { paddingTop: 40, paddingBottom: 36, alignItems: 'center', paddingHorizontal: 24, overflow: 'hidden', position: 'relative' },
  decoCircle1:       { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40 },
  decoCircle2:       { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -20 },
  checkCircle:       { width: 88, height: 88, borderRadius: 44, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12 },
  heroTitle:         { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6, letterSpacing: -0.3 },
  heroSub:           { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  orderIdBox:        { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  orderIdLabel:      { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  orderId:           { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  // Layout
  section:           { paddingHorizontal: 20, marginTop: 20 },
  card:              { borderRadius: 16, borderWidth: 1, padding: 16 },
  // Items
  itemRow:           { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  itemDot:           { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  itemName:          { fontSize: 13, fontWeight: '600' },
  itemSub:           { fontSize: 11, marginTop: 1 },
  itemTotal:         { fontSize: 13, fontWeight: '700' },
  priceDivider:      { height: 1, marginVertical: 10 },
  totalRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel:        { fontSize: 14, fontWeight: '700' },
  totalValue:        { fontSize: 18, fontWeight: '800' },
  metaBox:           { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginTop: 4 },
  // Tracking
  activeBanner:      { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 20 },
  activeBannerTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  activeBannerSub:   { fontSize: 12 },
  activePulse:       { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  activeDot:         { width: 10, height: 10, borderRadius: 5 },
  timeline:          { paddingLeft: 4 },
  timelineRow:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, position: 'relative' },
  timelineLine:      { position: 'absolute', left: 19, top: 36, width: 2, height: 28, zIndex: 0 },
  timelineIcon:      { width: 38, height: 38, borderRadius: 19, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 14, zIndex: 1, position: 'relative' },
  activePulseRing:   { position: 'absolute', width: 50, height: 50, borderRadius: 25, borderWidth: 2, opacity: 0.3 },
  timelineContent:   { flex: 1, paddingTop: 4 },
  timelineLabel:     { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  timelineSub:       { fontSize: 12, lineHeight: 17 },
  timelineTime:      { fontSize: 11, fontWeight: '700', marginTop: 4 },
  trackingNote:      { fontSize: 11, textAlign: 'center', marginTop: 16, fontStyle: 'italic', lineHeight: 17 },
  // Bottom
  bottomBar:         { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 32 },
  secondaryBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14 },
  secondaryBtnText:  { fontSize: 14, fontWeight: '700' },
  primaryBtnOuter:   { flex: 2, borderRadius: 14, overflow: 'hidden' },
  primaryBtnInner:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14 },
  primaryBtnText:    { fontSize: 14, fontWeight: '700', color: '#fff' },
});
