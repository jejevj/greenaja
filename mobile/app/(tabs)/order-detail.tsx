import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

type StepStatus = 'done' | 'active' | 'pending';

type TrackStep = {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  time: string | null;
  status: StepStatus;
};

type OrderData = {
  id: string;
  date: string;
  paymentMethod: string;
  items: { name: string; qty: number; price: number; unit: string }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: string;
  recipient: string;
  shippingMethod: string;
  estimatedArrival: string;
  steps: TrackStep[];
};

const ORDERS: Record<string, OrderData> = {
  'GRN-20260622-8471': {
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
    steps: [
      { id: 'paid',      label: 'Pembayaran Diterima',   sublabel: 'QRIS berhasil diverifikasi',              icon: 'checkmark-circle', time: '03:48 WIB', status: 'done' },
      { id: 'confirmed', label: 'Pesanan Dikonfirmasi',  sublabel: 'Penjual sedang mempersiapkan pesanan',    icon: 'receipt',          time: '03:49 WIB', status: 'done' },
      { id: 'packing',   label: 'Sedang Dikemas',        sublabel: 'Produk segar dipilihkan dan dikemas',     icon: 'cube',             time: null,         status: 'active' },
      { id: 'pickup',    label: 'Siap Dijemput Kurir',   sublabel: 'Menunggu kurir pengambilan',              icon: 'bicycle',          time: null,         status: 'pending' },
      { id: 'shipping',  label: 'Dalam Pengiriman',      sublabel: 'Pesanan dalam perjalanan ke lokasimu',   icon: 'car',              time: null,         status: 'pending' },
      { id: 'delivered', label: 'Pesanan Tiba',          sublabel: 'Produk berhasil diterima',               icon: 'home',             time: null,         status: 'pending' },
    ],
  },
  'GRN-20260618-3102': {
    id: 'GRN-20260618-3102',
    date: '18 Juni 2026, 10:22 WIB',
    paymentMethod: 'QRIS',
    items: [
      { name: 'Kangkung Segar', qty: 3, price: 5000,  unit: '/ikat' },
      { name: 'Cabai Merah',   qty: 1, price: 12500, unit: '/250g' },
    ],
    subtotal: 27500,
    shipping: 15000,
    discount: 0,
    total: 42500,
    address: 'Jl. Melati No. 12, RT 03/RW 05, Bogor, Jawa Barat 16151',
    recipient: 'Budi Santoso · 08123456789',
    shippingMethod: 'Reguler (2–3 hari)',
    estimatedArrival: '20 Juni 2026',
    steps: [
      { id: 'paid',      label: 'Pembayaran Diterima',  sublabel: 'QRIS berhasil diverifikasi',            icon: 'checkmark-circle', time: '10:22 WIB', status: 'done' },
      { id: 'confirmed', label: 'Pesanan Dikonfirmasi', sublabel: 'Penjual mempersiapkan pesanan',         icon: 'receipt',          time: '10:24 WIB', status: 'done' },
      { id: 'packing',   label: 'Selesai Dikemas',      sublabel: 'Produk telah dikemas dengan baik',      icon: 'cube',             time: '11:00 WIB', status: 'done' },
      { id: 'pickup',    label: 'Dijemput Kurir',       sublabel: 'Kurir telah mengambil pesanan',         icon: 'bicycle',          time: '12:30 WIB', status: 'done' },
      { id: 'shipping',  label: 'Dalam Pengiriman',     sublabel: 'Pesanan dalam perjalanan ke lokasimu', icon: 'car',              time: '13:00 WIB', status: 'done' },
      { id: 'delivered', label: 'Pesanan Tiba',         sublabel: 'Produk berhasil diterima',              icon: 'home',             time: '15:45 WIB', status: 'done' },
    ],
  },
  'GRN-20260610-5577': {
    id: 'GRN-20260610-5577',
    date: '10 Juni 2026, 09:10 WIB',
    paymentMethod: 'QRIS',
    items: [
      { name: 'Brokoli Organik', qty: 1, price: 18000, unit: '/pcs' },
      { name: 'Bayam Segar',    qty: 2, price: 4500,  unit: '/ikat' },
    ],
    subtotal: 27000,
    shipping: 15000,
    discount: 7000,
    total: 35000,
    address: 'Jl. Melati No. 12, RT 03/RW 05, Bogor, Jawa Barat 16151',
    recipient: 'Budi Santoso · 08123456789',
    shippingMethod: 'Reguler (2–3 hari)',
    estimatedArrival: '12 Juni 2026',
    steps: [
      { id: 'paid',      label: 'Pembayaran Diterima',  sublabel: 'QRIS berhasil diverifikasi',            icon: 'checkmark-circle', time: '09:10 WIB', status: 'done' },
      { id: 'confirmed', label: 'Pesanan Dikonfirmasi', sublabel: 'Penjual mempersiapkan pesanan',         icon: 'receipt',          time: '09:12 WIB', status: 'done' },
      { id: 'packing',   label: 'Selesai Dikemas',      sublabel: 'Produk telah dikemas dengan baik',      icon: 'cube',             time: '10:00 WIB', status: 'done' },
      { id: 'pickup',    label: 'Dijemput Kurir',       sublabel: 'Kurir telah mengambil pesanan',         icon: 'bicycle',          time: '11:30 WIB', status: 'done' },
      { id: 'shipping',  label: 'Dalam Pengiriman',     sublabel: 'Pesanan dalam perjalanan ke lokasimu', icon: 'car',              time: '12:00 WIB', status: 'done' },
      { id: 'delivered', label: 'Pesanan Tiba',         sublabel: 'Produk berhasil diterima',              icon: 'home',             time: '16:20 WIB', status: 'done' },
    ],
  },
};

export default function OrderDetailScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const order = ORDERS[orderId ?? ''] ?? ORDERS['GRN-20260622-8471'];

  const activeStep = order.steps.find(s => s.status === 'active');
  const isCompleted = order.steps.every(s => s.status === 'done');

  const statusColor = (s: StepStatus) => {
    if (s === 'done')   return t.primary;
    if (s === 'active') return '#F59E0B';
    return t.border;
  };
  const statusBg = (s: StepStatus) => {
    if (s === 'done')   return t.primaryMuted;
    if (s === 'active') return '#FEF3C7';
    return t.accent;
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
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: t.text }]}>Detail Pesanan</Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>{order.id}</Text>
        </View>
        {/* Status pill */}
        {isCompleted ? (
          <View style={[styles.headerBadge, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.headerBadgeText, { color: '#065F46' }]}>Selesai</Text>
          </View>
        ) : (
          <View style={[styles.headerBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.headerBadgeText, { color: '#92400E' }]}>Aktif</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>

        {/* Active status banner — only when not completed */}
        {!isCompleted && activeStep && (
          <View style={[styles.activeBanner, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <View style={[styles.activeBannerIcon, { backgroundColor: '#FDE68A' }]}>
              <Ionicons name={activeStep.icon as any} size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeBannerTitle}>{activeStep.label}</Text>
              <Text style={styles.activeBannerSub}>{activeStep.sublabel}</Text>
            </View>
            <View style={[styles.pulseDot, { backgroundColor: '#F59E0B' }]} />
          </View>
        )}

        {/* Completed banner */}
        {isCompleted && (
          <View style={[styles.activeBanner, { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' }]}>
            <View style={[styles.activeBannerIcon, { backgroundColor: '#A7F3D0' }]}>
              <Ionicons name="checkmark-done" size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activeBannerTitle, { color: '#065F46' }]}>Pesanan Selesai</Text>
              <Text style={[styles.activeBannerSub, { color: '#047857' }]}>Semua produk telah diterima</Text>
            </View>
          </View>
        )}

        {/* ── TRACKING TIMELINE ── */}
        <SectionCard t={t} icon="navigate-outline" title="Status Pengiriman">
          <View style={styles.timeline}>
            {order.steps.map((step, idx) => {
              const isLast = idx === order.steps.length - 1;
              const color  = statusColor(step.status);
              const bg     = statusBg(step.status);
              return (
                <View key={step.id} style={styles.timelineRow}>
                  {!isLast && (
                    <View style={[styles.timelineLine, { backgroundColor: step.status === 'done' ? t.primary : t.border }]} />
                  )}
                  <View style={[styles.timelineIcon, { backgroundColor: bg, borderColor: color }]}>
                    <Ionicons name={step.icon as any} size={16} color={color} />
                    {step.status === 'active' && (
                      <View style={[styles.pulseRing, { borderColor: '#F59E0B' }]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.stepLabel,
                      { color: step.status === 'pending' ? t.textSub : t.text },
                      step.status === 'active' && { color: '#92400E', fontWeight: '800' },
                    ]}>
                      {step.label}
                      {step.status === 'active' && <Text style={{ color: '#F59E0B' }}> •</Text>}
                    </Text>
                    <Text style={[styles.stepSub, { color: t.textSub }]}>{step.sublabel}</Text>
                    {step.time && (
                      <Text style={[styles.stepTime, { color: t.primary }]}>{step.time}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
          <Text style={[styles.note, { color: t.textSub }]}>
            Status diperbarui otomatis. Notifikasi dikirim saat status berubah.
          </Text>
        </SectionCard>

        {/* ── DETAIL ITEMS ── */}
        <SectionCard t={t} icon="bag-outline" title="Produk">
          {order.items.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.itemRow,
                idx < order.items.length - 1 && { borderBottomWidth: 1, borderColor: t.border },
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
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <PriceRow t={t} label="Subtotal"     value={fmt(order.subtotal)} />
          <PriceRow t={t} label="Ongkos Kirim" value={fmt(order.shipping)} />
          {order.discount > 0 && (
            <PriceRow t={t} label="Diskon" value={`− ${fmt(order.discount)}`} valueColor="#2A9960" />
          )}
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: t.text }]}>Total Dibayar</Text>
            <Text style={[styles.totalValue, { color: t.primary }]}>{fmt(order.total)}</Text>
          </View>
        </SectionCard>

        {/* ── INFO PENGIRIMAN ── */}
        <SectionCard t={t} icon="location-outline" title="Info Pengiriman">
          <MetaRow t={t} icon="calendar-outline"  label="Tanggal"      value={order.date} />
          <MetaRow t={t} icon="qr-code-outline"   label="Pembayaran"   value={order.paymentMethod} />
          <MetaRow t={t} icon="bicycle-outline"   label="Pengiriman"   value={order.shippingMethod} />
          <MetaRow t={t} icon="time-outline"      label="Est. Tiba"    value={order.estimatedArrival} />
          <MetaRow t={t} icon="location-outline"  label="Alamat"       value={order.address} />
          <MetaRow t={t} icon="person-outline"    label="Penerima"     value={order.recipient} last />
        </SectionCard>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionCard({ t, icon, title, children }: { t: typeof LIGHT; icon: any; title: string; children: React.ReactNode }) {
  return (
    <View style={[secStyles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
      <View style={secStyles.header}>
        <View style={[secStyles.iconBox, { backgroundColor: t.primaryMuted }]}>
          <Ionicons name={icon} size={14} color={t.primary} />
        </View>
        <Text style={[secStyles.title, { color: t.text }]}>{title}</Text>
      </View>
      {children}
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
      <Ionicons name={icon} size={13} color={t.textSub} />
      <Text style={[metaStyles.label, { color: t.textSub }]}>{label}</Text>
      <Text style={[metaStyles.value, { color: t.text }]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const secStyles = StyleSheet.create({
  card:    { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
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
  label: { fontSize: 12, width: 88 },
  value: { flex: 1, fontSize: 12, fontWeight: '600', textAlign: 'right' },
});

const styles = StyleSheet.create({
  safe:               { flex: 1 },
  header:             { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:            { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:              { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:           { fontSize: 11, marginTop: 1 },
  headerBadge:        { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  headerBadgeText:    { fontSize: 12, fontWeight: '700' },
  activeBanner:       { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 14, padding: 14, marginBottom: 16 },
  activeBannerIcon:   { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  activeBannerTitle:  { fontSize: 14, fontWeight: '700', color: '#92400E', marginBottom: 2 },
  activeBannerSub:    { fontSize: 12, color: '#B45309' },
  pulseDot:           { width: 10, height: 10, borderRadius: 5 },
  timeline:           { paddingLeft: 2 },
  timelineRow:        { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, position: 'relative' },
  timelineLine:       { position: 'absolute', left: 19, top: 38, width: 2, height: 26, zIndex: 0 },
  timelineIcon:       { width: 38, height: 38, borderRadius: 19, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginRight: 14, zIndex: 1, position: 'relative' },
  pulseRing:          { position: 'absolute', width: 50, height: 50, borderRadius: 25, borderWidth: 2, opacity: 0.3 },
  timelineContent:    { flex: 1, paddingTop: 4 },
  stepLabel:          { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  stepSub:            { fontSize: 12, lineHeight: 17 },
  stepTime:           { fontSize: 11, fontWeight: '700', marginTop: 4 },
  note:               { fontSize: 11, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
  itemRow:            { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  itemDot:            { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  itemName:           { fontSize: 13, fontWeight: '600' },
  itemSub:            { fontSize: 11, marginTop: 1 },
  itemTotal:          { fontSize: 13, fontWeight: '700' },
  divider:            { height: 1, marginVertical: 10 },
  totalRow:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:         { fontSize: 14, fontWeight: '700' },
  totalValue:         { fontSize: 18, fontWeight: '800' },
});
