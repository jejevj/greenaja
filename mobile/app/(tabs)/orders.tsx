import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const { width } = Dimensions.get('window');
const TAB_W = (width - 40 - 12) / 4; // 4 cards fit, 20px side padding, 4×3 gaps

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
      { name: 'Bayam Segar',   qty: 2 },
      { name: 'Tomat Organik', qty: 1 },
      { name: 'Wortel Baby',   qty: 1 },
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
  confirmed: { label: 'Dikonfirmasi', color: '#2A9960', bg: '#D1FAE5', icon: 'receipt-outline' },
  packing:   { label: 'Dikemas',      color: '#D97706', bg: '#FEF3C7', icon: 'cube-outline' },
  shipping:  { label: 'Dikirim',      color: '#2563EB', bg: '#DBEAFE', icon: 'car-outline' },
  delivered: { label: 'Selesai',      color: '#6B7280', bg: '#F3F4F6', icon: 'checkmark-done-outline' },
};

type TabKey = 'all' | OrderStatus;

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'all',       label: 'Semua',   icon: 'apps-outline' },
  { key: 'packing',   label: 'Dikemas', icon: 'cube-outline' },
  { key: 'shipping',  label: 'Dikirim', icon: 'car-outline' },
  { key: 'delivered', label: 'Selesai', icon: 'checkmark-done-outline' },
];

const TAB_ACTIVE_COLOR: Record<TabKey, string> = {
  all:       '#2A9960',
  packing:   '#D97706',
  shipping:  '#2563EB',
  delivered: '#6B7280',
};

const TAB_ACTIVE_BG: Record<TabKey, string> = {
  all:       '#D1FAE5',
  packing:   '#FEF3C7',
  shipping:  '#DBEAFE',
  delivered: '#F3F4F6',
};

export default function OrdersScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const getCount = (key: TabKey) =>
    key === 'all' ? DUMMY_ORDERS.length : DUMMY_ORDERS.filter(o => o.status === key).length;

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

      {/* ── Filter Tab Cards ── */}
      <View style={styles.tabRow}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          const count  = getCount(tab.key);
          const accent = TAB_ACTIVE_COLOR[tab.key];
          const accentBg = TAB_ACTIVE_BG[tab.key];
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.75}
              style={[
                styles.tabCard,
                {
                  backgroundColor: active ? accentBg : t.surface,
                  borderColor:     active ? accent    : t.border,
                  width: TAB_W,
                },
              ]}
            >
              {/* Icon circle */}
              <View style={[
                styles.tabIconCircle,
                { backgroundColor: active ? accent : t.accent },
              ]}>
                <Ionicons
                  name={tab.icon as any}
                  size={18}
                  color={active ? '#fff' : t.textSub}
                />
              </View>
              {/* Count badge */}
              <View style={[styles.tabCount, { backgroundColor: active ? accent : t.border }]}>
                <Text style={[styles.tabCountText, { color: active ? '#fff' : t.textSub }]}>{count}</Text>
              </View>
              {/* Label */}
              <Text
                style={[styles.tabLabel, { color: active ? accent : t.textSub }]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Order List ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 4 }}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={48} color={t.border} />
            <Text style={[styles.emptyText, { color: t.textSub }]}>Tidak ada pesanan</Text>
          </View>
        ) : (
          filtered.map(order => {
            const meta    = STATUS_META[order.status];
            const isActive = order.status === 'packing' || order.status === 'shipping';
            return (
              <TouchableOpacity
                key={order.id}
                style={[styles.orderCard, { backgroundColor: t.surface, borderColor: t.border }]}
                activeOpacity={0.78}
                onPress={() => router.push({ pathname: '/(tabs)/order-detail', params: { orderId: order.id } })}
              >
                {/* Top */}
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

                {/* Bottom */}
                <View style={[styles.cardBottom, { borderTopColor: t.border }]}>
                  <Text style={[styles.totalLabel, { color: t.textSub }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: t.primary }]}>{fmt(order.total)}</Text>
                  <View style={{ flex: 1 }} />
                  <View style={[
                    styles.actionBtn,
                    { backgroundColor: isActive ? t.primaryMuted : t.accent },
                  ]}>
                    <Ionicons
                      name={isActive ? 'navigate-outline' : 'eye-outline'}
                      size={12}
                      color={isActive ? t.primary : t.textSub}
                    />
                    <Text style={[styles.actionBtnText, { color: isActive ? t.primary : t.textSub }]}>
                      {isActive ? 'Lacak' : 'Detail'}
                    </Text>
                  </View>
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
  safe:          { flex: 1 },
  header:        { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:       { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:         { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:      { fontSize: 13, marginTop: 2 },

  // Tab cards
  tabRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16, gap: 8 },
  tabCard:       { borderWidth: 1.5, borderRadius: 14, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, position: 'relative' },
  tabIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tabCount:      { position: 'absolute', top: 6, right: 6, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabCountText:  { fontSize: 10, fontWeight: '800' },
  tabLabel:      { fontSize: 11, fontWeight: '700', textAlign: 'center' },

  // List
  emptyBox:      { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText:     { fontSize: 14 },
  orderCard:     { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTop:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 10 },
  orderId:       { fontSize: 12, fontWeight: '600' },
  statusBadge:   { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText:    { fontSize: 11, fontWeight: '700' },
  itemsRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 12 },
  itemIconBox:   { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemsText:     { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  dateText:      { fontSize: 11 },
  cardBottom:    { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 11 },
  totalLabel:    { fontSize: 12 },
  totalValue:    { fontSize: 14, fontWeight: '700', marginLeft: 4 },
  actionBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  actionBtnText: { fontSize: 11, fontWeight: '700' },
});
