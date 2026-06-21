import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const ITEMS = [
  { id: '1', name: 'Bayam Segar',   price: 4500,  unit: '/ikat', emoji: '🥬', farm: 'Kebun Pak Budi' },
  { id: '2', name: 'Tomat Organik', price: 12000, unit: '/kg',   emoji: '🍅', farm: 'Farm Cisarua' },
];

export default function CartScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const [items, setItems] = useState(ITEMS.map(i => ({ ...i, qty: 1 })));

  const bg    = dark ? '#0f1a14' : '#f4f9f6';
  const card  = dark ? '#1c2e22' : '#ffffff';
  const txt   = dark ? '#e8f5e9' : '#1a1a1a';
  const muted = dark ? '#7aab87' : '#888';
  const borderCol = dark ? '#2a4030' : '#efefef';

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev
      .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
      .filter(i => i.qty > 0)
    );
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: txt }]}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: txt }]}>Keranjang</Text>
        <Text style={[styles.itemCount, { color: muted }]}>{items.length} item</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 16, paddingTop: 8 }}
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={[styles.emptyTitle, { color: txt }]}>Keranjang kosong</Text>
            <Text style={[styles.emptySub, { color: muted }]}>Yuk tambah sayur segar!</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => router.back()}>
              <Text style={styles.shopBtnText}>Mulai Belanja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map(item => (
            <View key={item.id} style={[styles.cartCard, { backgroundColor: card, borderColor: borderCol }]}>
              <View style={[styles.cartEmoji, { backgroundColor: dark ? '#22382a' : '#f0f9f4' }]}>
                <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cartName, { color: txt }]}>{item.name}</Text>
                <Text style={[styles.cartFarm, { color: muted }]}>{item.farm}</Text>
                <Text style={styles.cartPrice}>{fmt(item.price)}{item.unit}</Text>
              </View>
              {/* Qty stepper — one-handed, bottom-right */}
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[styles.stepBtn, { borderColor: borderCol }]}
                  onPress={() => updateQty(item.id, -1)}
                >
                  <Text style={[styles.stepTxt, { color: txt }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepQty, { color: txt }]}>{item.qty}</Text>
                <TouchableOpacity
                  style={[styles.stepBtn, { backgroundColor: '#1a7a4a', borderColor: '#1a7a4a' }]}
                  onPress={() => updateQty(item.id, 1)}
                >
                  <Text style={[styles.stepTxt, { color: '#fff' }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Order summary */}
        {items.length > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: card, borderColor: borderCol }]}>
            <Text style={[styles.summaryTitle, { color: txt }]}>Ringkasan Pesanan</Text>
            {items.map(i => (
              <View key={i.id} style={styles.summaryRow}>
                <Text style={[styles.summaryItem, { color: muted }]}>{i.name} x{i.qty}</Text>
                <Text style={[styles.summaryItem, { color: txt }]}>{fmt(i.price * i.qty)}</Text>
              </View>
            ))}
            <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: borderCol, marginTop: 8, paddingTop: 8 }]}>
              <Text style={[styles.summaryTotal, { color: txt }]}>Total</Text>
              <Text style={styles.summaryTotalAmt}>{fmt(total)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout button — pinned bottom, one-handed */}
      {items.length > 0 && (
        <View style={[styles.checkoutBar, { backgroundColor: bg }]}>
          <TouchableOpacity activeOpacity={0.9} style={styles.checkoutBtnOuter}>
            <LinearGradient
              colors={['#1a7a4a', '#2d9966']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.checkoutBtnInner}
            >
              <Text style={styles.checkoutBtnText}>Pesan Sekarang • {fmt(total)}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1 },
  header:         { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  backText:       { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  title:          { fontSize: 24, fontWeight: '800' },
  itemCount:      { fontSize: 13, marginTop: 2 },
  cartCard:       { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1.5, padding: 14, marginBottom: 10, gap: 12 },
  cartEmoji:      { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cartName:       { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cartFarm:       { fontSize: 12, marginBottom: 4 },
  cartPrice:      { fontSize: 14, fontWeight: '700', color: '#1a7a4a' },
  stepper:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn:        { width: 34, height: 34, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepTxt:        { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  stepQty:        { fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  summaryCard:    { borderRadius: 16, borderWidth: 1.5, padding: 16, marginTop: 8 },
  summaryTitle:   { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  summaryRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryItem:    { fontSize: 13 },
  summaryTotal:   { fontSize: 15, fontWeight: '700' },
  summaryTotalAmt:{ fontSize: 15, fontWeight: '800', color: '#1a7a4a' },
  checkoutBar:    { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 28 },
  checkoutBtnOuter: { borderRadius: 16, overflow: 'hidden' },
  checkoutBtnInner: { paddingVertical: 18, alignItems: 'center' },
  checkoutBtnText:  { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  empty:          { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji:     { fontSize: 56 },
  emptyTitle:     { fontSize: 18, fontWeight: '700' },
  emptySub:       { fontSize: 14 },
  shopBtn:        { marginTop: 8, backgroundColor: '#1a7a4a', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  shopBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
