import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, TextInput,
  useColorScheme, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', label: 'Semua',   icon: 'apps-outline' },
  { id: '2', label: 'Sayuran', icon: 'leaf-outline' },
  { id: '3', label: 'Buah',    icon: 'nutrition-outline' },
  { id: '4', label: 'Rempah',  icon: 'flask-outline' },
  { id: '5', label: 'Organik', icon: 'shield-checkmark-outline' },
  { id: '6', label: 'Lokal',   icon: 'home-outline' },
] as const;

const PRODUCTS = [
  { id: '1', name: 'Bayam Segar',    price: 'Rp 4.500',  unit: '/ikat',  tag: 'Bestseller', farm: 'Kebun Pak Budi' },
  { id: '2', name: 'Tomat Organik',  price: 'Rp 12.000', unit: '/kg',    tag: 'Organik',    farm: 'Farm Cisarua'   },
  { id: '3', name: 'Cabai Rawit',    price: 'Rp 28.000', unit: '/kg',    tag: 'Populer',    farm: 'Kebun Bu Sari'  },
  { id: '4', name: 'Kangkung',       price: 'Rp 3.500',  unit: '/ikat',  tag: 'Segar',      farm: 'Kebun Pak Budi' },
  { id: '5', name: 'Wortel Baby',    price: 'Rp 9.000',  unit: '/250g',  tag: 'Baru',       farm: 'Farm Lembang'   },
  { id: '6', name: 'Brokoli Hijau',  price: 'Rp 15.000', unit: '/buah',  tag: 'Organik',    farm: 'Farm Cisarua'   },
];

const PROMOS = [
  { id: '1', title: 'Gratis Ongkir',         sub: 'Min. belanja Rp 50.000' },
  { id: '2', title: 'Diskon 20% Pagi Hari',  sub: 'Pesan sebelum jam 07.00' },
  { id: '3', title: 'Paket Mingguan',         sub: 'Hemat hingga 30%' },
];

export default function HomeScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [activeCategory, setActiveCategory] = useState('1');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [focusSearch, setFocusSearch] = useState(false);

  const toggleCart = (id: string) =>
    setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── TOP BAR ── */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: t.textSub }]}>Selamat datang</Text>
            <Text style={[styles.topTitle, { color: t.text }]}>GreenAja Market</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}
              onPress={() => router.push('/(tabs)/cart')}
            >
              <Ionicons name="bag-outline" size={20} color={t.text} />
              {cart.length > 0 && (
                <View style={[styles.badge, { backgroundColor: t.primary }]}>
                  <Text style={styles.badgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Ionicons name="person-outline" size={20} color={t.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SEARCH ── */}
        <View style={[styles.searchBar, { backgroundColor: t.surface, borderColor: focusSearch ? t.primary : t.border }]}>
          <Ionicons name="search-outline" size={18} color={t.textSub} />
          <TextInput
            style={[styles.searchInput, { color: t.text }]}
            placeholder="Cari produk, petani..."
            placeholderTextColor={t.textSub}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setFocusSearch(true)}
            onBlur={() => setFocusSearch(false)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle-outline" size={18} color={t.textSub} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── PROMO BANNER ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoList}>
          {PROMOS.map(p => (
            <TouchableOpacity key={p.id} activeOpacity={0.82}>
              <LinearGradient
                colors={['#1A7A4A', '#2A9960']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.promoBanner}
              >
                <Ionicons name="pricetag-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginBottom: 8 }} />
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── CATEGORIES ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(c => {
            const active = activeCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setActiveCategory(c.id)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? t.primary : t.surface, borderColor: active ? t.primary : t.border },
                ]}
              >
                <Ionicons name={c.icon as any} size={14} color={active ? '#fff' : t.textSub} />
                <Text style={[styles.chipText, { color: active ? '#fff' : t.text }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── PRODUCTS ── */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Produk Segar</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')} style={styles.seeAllBtn}>
            <Text style={[styles.seeAllText, { color: t.primary }]}>Lihat semua</Text>
            <Ionicons name="chevron-forward-outline" size={14} color={t.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {PRODUCTS.map(p => {
            const inCart = cart.includes(p.id);
            return (
              <View key={p.id} style={[styles.productCard, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={[styles.productImgBox, { backgroundColor: t.accent }]}>
                  <Ionicons name="leaf-outline" size={36} color={t.primary} />
                </View>
                <View style={[styles.productTagBox, { backgroundColor: t.primaryMuted }]}>
                  <Text style={[styles.productTagText, { color: t.primary }]}>{p.tag}</Text>
                </View>
                <View style={styles.productBody}>
                  <Text style={[styles.productName, { color: t.text }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.productFarm, { color: t.textSub }]} numberOfLines={1}>{p.farm}</Text>
                  <View style={styles.productFooter}>
                    <View>
                      <Text style={[styles.productPrice, { color: t.primary }]}>{p.price}</Text>
                      <Text style={[styles.productUnit, { color: t.textSub }]}>{p.unit}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.addBtn,
                        { backgroundColor: inCart ? t.primary : t.primaryMuted, borderColor: t.primary },
                      ]}
                      onPress={() => toggleCart(p.id)}
                    >
                      <Ionicons
                        name={inCart ? 'checkmark-outline' : 'add-outline'}
                        size={18}
                        color={inCart ? '#fff' : t.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── RECOMMENDATIONS ── */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Untukmu Hari Ini</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recList}>
          {PRODUCTS.slice(3).map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.recCard, { backgroundColor: t.surface, borderColor: t.border }]}
            >
              <View style={[styles.recImg, { backgroundColor: t.accent }]}>
                <Ionicons name="leaf-outline" size={26} color={t.primary} />
              </View>
              <Text style={[styles.recName, { color: t.text }]} numberOfLines={1}>{p.name}</Text>
              <Text style={[styles.recPrice, { color: t.primary }]}>{p.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* ── FLOATING CART ── */}
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.floatCartOuter}
          onPress={() => router.push('/(tabs)/cart')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#1A7A4A', '#2A9960']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.floatCartInner}
          >
            <View style={styles.floatCartLeft}>
              <Ionicons name="bag-outline" size={18} color="#fff" />
              <Text style={styles.floatCartText}>{cart.length} item dipilih</Text>
            </View>
            <View style={styles.floatCartRight}>
              <Text style={styles.floatCartText}>Keranjang</Text>
              <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1 },
  topBar:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  greeting:         { fontSize: 12, marginBottom: 2 },
  topTitle:         { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  topActions:       { flexDirection: 'row', gap: 8 },
  iconBtn:          { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badge:            { position: 'absolute', top: -4, right: -4, width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText:        { fontSize: 9, color: '#fff', fontWeight: '800' },
  searchBar:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, height: 48, gap: 10, marginBottom: 20 },
  searchInput:      { flex: 1, fontSize: 14 },
  promoList:        { paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  promoBanner:      { width: width * 0.68, borderRadius: 16, padding: 18 },
  promoTitle:       { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  promoSub:         { fontSize: 12, color: 'rgba(255,255,255,0.72)' },
  catList:          { paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24, borderWidth: 1 },
  chipText:         { fontSize: 13, fontWeight: '600' },
  sectionRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle:     { fontSize: 16, fontWeight: '700' },
  seeAllBtn:        { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:       { fontSize: 13, fontWeight: '600' },
  grid:             { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 12, marginBottom: 28 },
  productCard:      { width: (width - 52) / 2, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  productImgBox:    { height: 100, alignItems: 'center', justifyContent: 'center' },
  productTagBox:    { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  productTagText:   { fontSize: 10, fontWeight: '700' },
  productBody:      { padding: 12 },
  productName:      { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  productFarm:      { fontSize: 11, marginBottom: 10 },
  productFooter:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  productPrice:     { fontSize: 14, fontWeight: '800' },
  productUnit:      { fontSize: 11 },
  addBtn:           { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  recList:          { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  recCard:          { width: 120, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: 'center', gap: 8 },
  recImg:           { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recName:          { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  recPrice:         { fontSize: 13, fontWeight: '700' },
  floatCartOuter:   { position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 16, overflow: 'hidden', elevation: 6, shadowColor: '#1A7A4A', shadowOpacity: 0.25, shadowRadius: 12 },
  floatCartInner:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  floatCartLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  floatCartRight:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  floatCartText:    { fontSize: 14, fontWeight: '600', color: '#fff' },
});
