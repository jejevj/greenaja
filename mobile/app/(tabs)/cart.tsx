import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const INIT_ITEMS = [
  { id: '1', name: 'Bayam Segar',   price: 4500,  unit: '/ikat', farm: 'Kebun Pak Budi', qty: 1 },
  { id: '2', name: 'Tomat Organik', price: 12000, unit: '/kg',   farm: 'Farm Cisarua',   qty: 1 },
];

export default function CartScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [items, setItems] = useState(INIT_ITEMS);

  const updateQty = (id: string, delta: number) =>
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

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
          <Text style={[styles.title, { color: t.text }]}>Keranjang</Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>{items.length} item dipilih</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160, paddingTop: 4 }}
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: t.accent }]}>
              <Ionicons name="bag-outline" size={40} color={t.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: t.text }]}>Keranjang kosong</Text>
            <Text style={[styles.emptySub, { color: t.textSub }]}>Tambahkan produk segar pilihanmu</Text>
            <TouchableOpacity
              style={[styles.shopBtn, { backgroundColor: t.primary }]}
              onPress={() => router.back()}
            >
              <Text style={styles.shopBtnText}>Mulai Belanja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map(item => (
              <View key={item.id} style={[styles.cartCard, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={[styles.itemIcon, { backgroundColor: t.accent }]}>
                  <Ionicons name="leaf-outline" size={24} color={t.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: t.text }]}>{item.name}</Text>
                  <Text style={[styles.itemFarm, { color: t.textSub }]}>{item.farm}</Text>
                  <Text style={[styles.itemPrice, { color: t.primary }]}>{fmt(item.price)}{item.unit}</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { backgroundColor: t.surface, borderColor: t.border }]}
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <Ionicons name="remove-outline" size={16} color={t.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepQty, { color: t.text }]}>{item.qty}</Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { backgroundColor: t.primary, borderColor: t.primary }]}
                    onPress={() => updateQty(item.id, 1)}
                  >
                    <Ionicons name="add-outline" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Summary */}
            <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text style={[styles.summaryTitle, { color: t.text }]}>Ringkasan</Text>
              {items.map(i => (
                <View key={i.id} style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: t.textSub }]}>{i.name} ×{i.qty}</Text>
                  <Text style={[styles.summaryValue, { color: t.text }]}>{fmt(i.price * i.qty)}</Text>
                </View>
              ))}
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: t.border, marginTop: 10, paddingTop: 10 }]}>
                <Text style={[styles.summaryLabel, { color: t.text, fontWeight: '700' }]}>Total</Text>
                <Text style={[styles.summaryValue, { color: t.primary, fontWeight: '800', fontSize: 16 }]}>{fmt(total)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Checkout bar */}
      {items.length > 0 && (
        <View style={[styles.checkoutBar, { backgroundColor: t.bg }]}>
          <TouchableOpacity activeOpacity={0.9} style={styles.checkoutOuter}>
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.checkoutInner}
            >
              <Text style={styles.checkoutText}>Pesan Sekarang</Text>
              <Text style={styles.checkoutAmt}>{fmt(total)}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1 },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:        { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:          { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:       { fontSize: 13, marginTop: 2 },
  cartCard:       { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10, gap: 12 },
  itemIcon:       { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemName:       { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  itemFarm:       { fontSize: 12, marginBottom: 4 },
  itemPrice:      { fontSize: 14, fontWeight: '700' },
  stepper:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn:        { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepQty:        { fontSize: 15, fontWeight: '700', minWidth: 22, textAlign: 'center' },
  summary:        { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 6 },
  summaryTitle:   { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  summaryRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel:   { fontSize: 13 },
  summaryValue:   { fontSize: 13 },
  checkoutBar:    { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32 },
  checkoutOuter:  { borderRadius: 16, overflow: 'hidden' },
  checkoutInner:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 17, paddingHorizontal: 22 },
  checkoutText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
  checkoutAmt:    { fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  empty:          { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon:      { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle:     { fontSize: 18, fontWeight: '700' },
  emptySub:       { fontSize: 14 },
  shopBtn:        { marginTop: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  shopBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
