import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, TextInput, FlatList,
  useColorScheme, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', label: 'Semua',    emoji: '🌿' },
  { id: '2', label: 'Sayuran',  emoji: '🥬' },
  { id: '3', label: 'Buah',     emoji: '🍅' },
  { id: '4', label: 'Rempah',   emoji: '🌶️' },
  { id: '5', label: 'Organik',  emoji: '🌱' },
  { id: '6', label: 'Lokal',    emoji: '🏡' },
];

const PRODUCTS = [
  { id: '1', name: 'Bayam Segar',     price: 'Rp 4.500',  unit: '/ikat',  tag: 'Bestseller', emoji: '🥬', farm: 'Kebun Pak Budi' },
  { id: '2', name: 'Tomat Organik',   price: 'Rp 12.000', unit: '/kg',    tag: 'Organik',    emoji: '🍅', farm: 'Farm Cisarua' },
  { id: '3', name: 'Cabai Rawit',     price: 'Rp 28.000', unit: '/kg',    tag: 'Pedas',      emoji: '🌶️', farm: 'Kebun Bu Sari' },
  { id: '4', name: 'Kangkung Lokal',  price: 'Rp 3.500',  unit: '/ikat',  tag: 'Segar',      emoji: '🌿', farm: 'Kebun Pak Budi' },
  { id: '5', name: 'Wortel Baby',     price: 'Rp 9.000',  unit: '/250g',  tag: 'Baru',       emoji: '🥕', farm: 'Farm Lembang' },
  { id: '6', name: 'Brokoli Hijau',   price: 'Rp 15.000', unit: '/buah',  tag: 'Organik',    emoji: '🥦', farm: 'Farm Cisarua' },
];

const PROMOS = [
  { id: '1', title: 'Gratis Ongkir',        sub: 'Min. belanja Rp 50.000',   grad: ['#1a7a4a', '#2d9966'] as [string,string] },
  { id: '2', title: 'Sayur Pagi Diskon 20%', sub: 'Pesan sebelum jam 7 pagi', grad: ['#388e3c', '#66bb6a'] as [string,string] },
  { id: '3', title: 'Paket Mingguan',        sub: 'Hemat hingga 30%',          grad: ['#0288d1', '#0299e6'] as [string,string] },
];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const [activeCategory, setActiveCategory] = useState('1');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<string[]>([]);

  const addToCart = (id: string) => setCart(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const bg = dark ? '#0f1a14' : '#f4f9f6';
  const card = dark ? '#1c2e22' : '#ffffff';
  const txt = dark ? '#e8f5e9' : '#1a1a1a';
  const muted = dark ? '#7aab87' : '#888';
  const inputBg = dark ? '#1c2e22' : '#fff';
  const borderCol = dark ? '#2a4030' : '#efefef';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── TOP BAR ── */}
        <View style={[styles.topBar, { backgroundColor: bg }]}>
          <View>
            <Text style={[styles.hello, { color: muted }]}>Halo, Pengguna 👋</Text>
            <Text style={[styles.topTitle, { color: txt }]}>GreenAja Market</Text>
          </View>
          <View style={styles.topRight}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: card, borderColor: borderCol }]}
              onPress={() => router.push('/(tabs)/cart')}
            >
              <Text style={styles.iconBtnText}>🛒</Text>
              {cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: card, borderColor: borderCol }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.iconBtnText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SEARCH BAR ── */}
        <View style={[styles.searchWrap, { backgroundColor: inputBg, borderColor: borderCol }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: txt }]}
            placeholder="Cari sayur, buah, rempah..."
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ── PROMO BANNER ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoScroll}
        >
          {PROMOS.map(p => (
            <TouchableOpacity key={p.id} activeOpacity={0.85}>
              <LinearGradient colors={p.grad} style={styles.promoBanner}>
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── CATEGORY CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {CATEGORIES.map(c => {
            const active = activeCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setActiveCategory(c.id)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? '#1a7a4a' : card, borderColor: active ? '#1a7a4a' : borderCol },
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.chipEmoji}>{c.emoji}</Text>
                <Text style={[styles.chipLabel, { color: active ? '#fff' : txt }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── PRODUCT GRID ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: txt }]}>Produk Segar Hari Ini</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.seeAll}>Lihat semua →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {PRODUCTS.map(p => {
            const inCart = cart.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.productCard, { backgroundColor: card, borderColor: borderCol }]}
                activeOpacity={0.85}
              >
                {/* Emoji as product image */}
                <View style={[styles.productImg, { backgroundColor: dark ? '#22382a' : '#f0f9f4' }]}>
                  <Text style={{ fontSize: 40 }}>{p.emoji}</Text>
                </View>
                {/* Tag */}
                <View style={styles.productTag}>
                  <Text style={styles.productTagText}>{p.tag}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: txt }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.productFarm, { color: muted }]} numberOfLines={1}>{p.farm}</Text>
                  <View style={styles.productBottom}>
                    <View>
                      <Text style={styles.productPrice}>{p.price}</Text>
                      <Text style={[styles.productUnit, { color: muted }]}>{p.unit}</Text>
                    </View>
                    {/* ── ONE-HANDED ADD BUTTON (bottom-right, thumb-reachable) ── */}
                    <TouchableOpacity
                      style={[styles.addBtn, inCart && styles.addBtnActive]}
                      onPress={() => addToCart(p.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.addBtnText, inCart && { color: '#fff' }]}>
                        {inCart ? '✓' : '+'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── PERSONALIZED SECTION ── */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, { color: txt }]}>Rekomendasi Untukmu</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {PRODUCTS.slice(3).map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.recCard, { backgroundColor: card, borderColor: borderCol }]}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 32 }}>{p.emoji}</Text>
              <Text style={[styles.recName, { color: txt }]} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.recPrice}>{p.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* ── FLOATING CART BAR (one-handed, pinned bottom) ── */}
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => router.push('/(tabs)/cart')}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.floatingCartInner}>
            <Text style={styles.floatingCartLeft}>🛒 {cart.length} item dipilih</Text>
            <Text style={styles.floatingCartRight}>Lihat Keranjang →</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1 },
  topBar:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  hello:              { fontSize: 12 },
  topTitle:           { fontSize: 20, fontWeight: '800' },
  topRight:           { flexDirection: 'row', gap: 8 },
  iconBtn:            { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconBtnText:        { fontSize: 18 },
  cartBadge:          { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#e53935', alignItems: 'center', justifyContent: 'center' },
  cartBadgeText:      { fontSize: 10, color: '#fff', fontWeight: '700' },
  searchWrap:         { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 16, gap: 8 },
  searchIcon:         { fontSize: 16 },
  searchInput:        { flex: 1, fontSize: 14 },
  promoScroll:        { paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  promoBanner:        { width: width * 0.72, borderRadius: 16, padding: 18 },
  promoTitle:         { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  promoSub:           { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  catScroll:          { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  chip:               { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24, borderWidth: 1.5, gap: 5 },
  chipEmoji:          { fontSize: 14 },
  chipLabel:          { fontSize: 13, fontWeight: '600' },
  sectionHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:       { fontSize: 16, fontWeight: '700' },
  seeAll:             { fontSize: 13, color: '#1a7a4a', fontWeight: '600' },
  grid:               { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12, marginBottom: 24 },
  productCard:        { width: (width - 48) / 2, borderRadius: 16, borderWidth: 1.5, overflow: 'hidden' },
  productImg:         { height: 110, alignItems: 'center', justifyContent: 'center' },
  productTag:         { position: 'absolute', top: 8, left: 8, backgroundColor: '#1a7a4a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  productTagText:     { fontSize: 10, color: '#fff', fontWeight: '700' },
  productInfo:        { padding: 12 },
  productName:        { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  productFarm:        { fontSize: 11, marginBottom: 10 },
  productBottom:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  productPrice:       { fontSize: 14, fontWeight: '800', color: '#1a7a4a' },
  productUnit:        { fontSize: 11, marginTop: 1 },
  addBtn:             { width: 36, height: 36, borderRadius: 12, backgroundColor: '#edf7f1', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#1a7a4a' },
  addBtnActive:       { backgroundColor: '#1a7a4a' },
  addBtnText:         { fontSize: 20, fontWeight: '700', color: '#1a7a4a', lineHeight: 24 },
  recCard:            { width: 130, borderRadius: 16, borderWidth: 1.5, padding: 14, alignItems: 'center', gap: 6 },
  recName:            { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  recPrice:           { fontSize: 13, fontWeight: '700', color: '#1a7a4a' },
  floatingCart:       { position: 'absolute', bottom: 20, left: 16, right: 16, borderRadius: 18, overflow: 'hidden', shadowColor: '#1a7a4a', shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  floatingCartInner:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  floatingCartLeft:   { fontSize: 14, fontWeight: '600', color: '#fff' },
  floatingCartRight:  { fontSize: 14, fontWeight: '700', color: '#fff' },
});
