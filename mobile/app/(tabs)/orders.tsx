import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

type OrderStatus = 'packing' | 'shipping' | 'delivered' | 'confirmed';

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: { name: string; qty: number }[];
  total: number;
};

const DUMMY_ORDERS: Order[] = [
  {
    id: 'GRN-20260622-8471',
    date: '22 Jun 2026',
    status: 'packing',
    items: [
      { name: 'Bayam Segar', qty: 2 },
      { name: 'Tomat Organik', qty: 1 },
      { name: 'Wortel Baby', qty: 1 },
    ],
    total: 42000,
  },
  {
    id: 'GRN-20260618-3102',
    date: '18 Jun 2026',
    status: 'delivered',
    items: [{ name: 'Kangkung Segar', qty: 3 }, { name: 'Cabai Merah', qty: 1 }],
    total: 27500,
  },
  {
    id: 'GRN-20260610-5577',
    date: '10 Jun 2026',
    status: 'delivered',
    items: [{ name: 'Brokoli Organik', qty: 1 }, { name: 'Bayam Segar', qty: 2 }],
    total: 35000,
  },
];

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  confirmed: { label: 'Dikonfirmasi',    color: '#2A9960', bg: '#D1FAE5', icon: 'receipt-outline' },
  packing:   { label: 'Sedang Dikemas', color: '#D97706', bg: '#FEF3C7', icon: 'cube-outline' },
  shipping:  { label: 'Dikirim',        color: '#2563EB', bg: '#DBEAFE', icon: 'car-outline' },
  delivered: { label: 'Selesai',        color: '#6B7280', bg: '#F3F4F6', icon: 'checkmark-done-outline' },
};

const TABS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all',       label: 'Semua' },
  { key: 'packing',   label: 'Dikemas' },
  { key: 'shipping',  label: 'Dikirim' },
  { key: 'delivered', label: 'Selesai' },
];

export default function OrdersScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const filtered = activeTab === 'all'
    ? DUMMY_ORDERS
    : DUMMY_ORDERS.filter(o => o.status === activeTab);

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
          <Text style={[styles.title, { color: t.text }]}>Pesanan Saya</Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>{DUMMY_ORDERS.length} pesanan total</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}
      >
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabChip,
                { borderColor: active ? t.primary : t.border,
                  backgroundColor: active ? t.primaryMuted : t.surface },
              ]}
            >
              <Text style={[styles.tabText, { color: active ? t.primary : t.textSub }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={48} color={t.border} />
            <Text style={[styles.emptyText, { color: t.textSub }]}>Tidak ada pesanan</Text>
          </View>
        ) : (
          filtered.map(order => {
            const meta = STATUS_META[order.status];
            const isActive = order.status === 'packing' || order.status === 'shipping';
            return (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, { backgroundColor: t.surface, borderColor: t.border }]}
                activeOpacity={0.78}
                onPress={() => router.push({ pathname: '/(tabs)/order-detail', params: { orderId: order.id } })}
              >
                {/* Top row */}
                <View style={styles.cardTop}>
                  <Text style={[styles.orderId, { color: t.textSub }]}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon as any} size={11} color={meta.color} />
                    <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>

                {/* Items */}
                <View style={styles.itemsRow}>
                  <View style={[styles.itemIconBox, { backgroundColor: t.accent }]}>
                    <Ionicons name="leaf-outline" size={16} color={t.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemsText, { color: t.text }]} numberOfLines={1}>
                      {order.items.map(i => `${i.name} ×${i.qty}`).join(' · ')}
                    </Text>
                    <Text style={[styles.dateText, { color: t.textSub }]}>{order.date}</Text>
                  </View>
                </View>

                {/* Bottom row */}
                <View style={[styles.cardBottom, { borderTopColor: t.border }]}>
                  <Text style={[styles.totalLabel, { color: t.textSub }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: t.primary }]}>{fmt(order.total)}</Text>
                  <View style={{ flex: 1 }} />
                  {isActive ? (
                    <View style={[styles.trackBtn, { backgroundColor: t.primaryMuted }]}>
                      <Ionicons name="navigate-outline" size={12} color={t.primary} />
                      <Text style={[styles.trackBtnText, { color: t.primary }]}>Lacak</Text>
                    </View>
                  ) : (
                    <View style={[styles.trackBtn, { backgroundColor: t.accent }]}>
                      <Ionicons name="eye-outline" size={12} color={t.textSub} />
                      <Text style={[styles.trackBtnText, { color: t.textSub }]}>Detail</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward-outline" size={14} color={t.textSub} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn:      { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:     { fontSize: 13, marginTop: 2 },
  tabChip:      { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  tabText:      { fontSize: 13, fontWeight: '600' },
  emptyBox:     { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText:    { fontSize: 14 },
  orderCard:    { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTop:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 10 },
  orderId:      { fontSize: 12, fontWeight: '600' },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText:   { fontSize: 11, fontWeight: '700' },
  itemsRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 12 },
  itemIconBox:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemsText:    { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  dateText:     { fontSize: 11 },
  cardBottom:   { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 11 },
  totalLabel:   { fontSize: 12 },
  totalValue:   { fontSize: 14, fontWeight: '700', marginLeft: 4 },
  trackBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  trackBtnText: { fontSize: 11, fontWeight: '700' },
});
