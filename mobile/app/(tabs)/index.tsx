import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, TextInput,
  useColorScheme, Dimensions,
  FlatList, Animated, NativeScrollEvent, NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import ProductBottomSheet, { ProductSheetItem } from '../../components/ProductBottomSheet';

const { width } = Dimensions.get('window');

// ─── Ad Slideshow Data ────────────────────────────────────────────────────────
const ADS = [
  {
    id: '1',
    title: 'Sayur Segar Tiap Pagi',
    sub: 'Langsung dari kebun ke meja makanmu',
    icon: 'leaf-outline' as const,
    colors: ['#1A7A4A', '#2A9960'] as [string, string],
  },
  {
    id: '2',
    title: 'Gratis Ongkir Hari Ini!',
    sub: 'Untuk pembelian pertamamu, tanpa minimum',
    icon: 'bicycle-outline' as const,
    colors: ['#0D6E8A', '#1A9DBF'] as [string, string],
  },
  {
    id: '3',
    title: 'Produk 100% Organik',
    sub: 'Bersertifikat, bebas pestisida kimia',
    icon: 'shield-checkmark-outline' as const,
    colors: ['#7A4A1A', '#BF6A1A'] as [string, string],
  },
  {
    id: '4',
    title: 'Paket Keluarga Hemat',
    sub: 'Hemat hingga 30% untuk pembelian mingguan',
    icon: 'cart-outline' as const,
    colors: ['#4A1A7A', '#7A2ABF'] as [string, string],
  },
  {
    id: '5',
    title: 'Dukung Petani Lokal',
    sub: 'Setiap pembelian mendukung 200+ petani',
    icon: 'people-outline' as const,
    colors: ['#1A4A7A', '#2A6ABF'] as [string, string],
  },
];

const AD_WIDTH = width - 40;
const AD_HEIGHT = 140;
const AD_INTERVAL = 3500;

function AdSlideshow({ t }: { t: typeof LIGHT }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    flatRef.current?.scrollToIndex({ index: idx, animated: true });
    setActiveIdx(idx);
  };

  // auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % ADS.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AD_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / AD_WIDTH);
    setActiveIdx(idx);
    // reset timer setelah user swipe manual
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % ADS.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AD_INTERVAL);
  };

  return (
    <View style={adStyles.wrapper}>
      <FlatList
        ref={flatRef}
        data={ADS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={handleMomentumEnd}
        getItemLayout={(_, index) => ({ length: AD_WIDTH, offset: AD_WIDTH * index, index })}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={{ width: AD_WIDTH }}>
            <LinearGradient
              colors={item.colors}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={adStyles.card}
            >
              {/* Deco circle */}
              <View style={adStyles.decoCircle} />
              <View style={adStyles.decoCircle2} />

              <View style={adStyles.content}>
                <View style={adStyles.iconBox}>
                  <Ionicons name={item.icon} size={28} color="rgba(255,255,255,0.95)" />
                </View>
                <View style={adStyles.textBox}>
                  <Text style={adStyles.title}>{item.title}</Text>
                  <Text style={adStyles.sub}>{item.sub}</Text>
                </View>
                <View style={adStyles.arrow}>
                  <Ionicons name="arrow-forward-outline" size={16} color="rgba(255,255,255,0.7)" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />

      {/* Dot indicators */}
      <View style={adStyles.dots}>
        {ADS.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <View
              style={[
                adStyles.dot,
                { backgroundColor: i === activeIdx ? t.primary : t.border, width: i === activeIdx ? 20 : 6 },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const adStyles = StyleSheet.create({
  wrapper:     { marginHorizontal: 20, marginBottom: 20 },
  card:        { width: AD_WIDTH, height: AD_HEIGHT, borderRadius: 18, padding: 20, overflow: 'hidden', justifyContent: 'center' },
  decoCircle:  { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)', top: -40, right: -30 },
  decoCircle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)', bottom: -30, right: 60 },
  content:     { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox:     { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  textBox:     { flex: 1 },
  title:       { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4, letterSpacing: -0.2 },
  sub:         { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 17 },
  arrow:       { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  dots:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 },
  dot:         { height: 6, borderRadius: 3 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: '1', label: 'Semua',   icon: 'apps-outline'              },
  { id: '2', label: 'Sayuran', icon: 'leaf-outline'              },
  { id: '3', label: 'Buah',    icon: 'nutrition-outline'         },
  { id: '4', label: 'Rempah',  icon: 'flask-outline'             },
  { id: '5', label: 'Organik', icon: 'shield-checkmark-outline'  },
  { id: '6', label: 'Lokal',   icon: 'home-outline'              },
] as const;

const PRODUCTS: ProductSheetItem[] = [
  {
    id: '1', name: 'Bayam Segar', farm: 'Kebun Pak Budi', tag: 'Bestseller',
    description: 'Bayam lokal segar dipanen pagi hari langsung dari kebun organik Bogor.',
    variants: [
      { id: 'v1', label: '1 Ikat',   price: 4500,  unit: 'ikat', stock: 30 },
      { id: 'v2', label: '3 Ikat',   price: 12000, unit: 'ikat', stock: 15 },
      { id: 'v3', label: '5 Ikat',   price: 18000, unit: 'ikat', stock: 8  },
    ],
  },
  {
    id: '2', name: 'Tomat Organik', farm: 'Farm Cisarua', tag: 'Organik',
    description: 'Tomat cherry organik bersertifikat, tanpa pestisida, rasa manis alami.',
    variants: [
      { id: 'v1', label: '250g',  price: 7500,  unit: 'gram', stock: 20 },
      { id: 'v2', label: '500g',  price: 12000, unit: 'gram', stock: 12 },
      { id: 'v3', label: '1kg',   price: 22000, unit: 'kg',   stock: 0  },
    ],
  },
  {
    id: '3', name: 'Cabai Rawit', farm: 'Kebun Bu Sari', tag: 'Populer',
    description: 'Cabai rawit merah segar, tingkat kepedasan tinggi, cocok untuk masakan rumah.',
    variants: [
      { id: 'v1', label: '100g', price: 6000,  unit: 'gram', stock: 25 },
      { id: 'v2', label: '250g', price: 14000, unit: 'gram', stock: 10 },
      { id: 'v3', label: '500g', price: 26000, unit: 'gram', stock: 5  },
    ],
  },
  {
    id: '4', name: 'Kangkung', farm: 'Kebun Pak Budi', tag: 'Segar',
    description: 'Kangkung air segar, batang renyah, cocok untuk tumis dan lalapan.',
    variants: [
      { id: 'v1', label: '1 Ikat', price: 3500,  unit: 'ikat', stock: 40 },
      { id: 'v2', label: '3 Ikat', price: 9500,  unit: 'ikat', stock: 20 },
    ],
  },
  {
    id: '5', name: 'Wortel Baby', farm: 'Farm Lembang', tag: 'Baru',
    description: 'Wortel baby Lembang, manis dan renyah, cocok untuk camilan sehat anak.',
    variants: [
      { id: 'v1', label: '250g', price: 9000,  unit: 'gram', stock: 15 },
      { id: 'v2', label: '500g', price: 16500, unit: 'gram', stock: 8  },
    ],
  },
  {
    id: '6', name: 'Brokoli Hijau', farm: 'Farm Cisarua', tag: 'Organik',
    description: 'Brokoli segar organik ukuran besar, kaya vitamin C dan serat.',
    variants: [
      { id: 'v1', label: 'Kecil (~300g)',  price: 8000,  unit: 'buah', stock: 12 },
      { id: 'v2', label: 'Besar (~600g)',  price: 15000, unit: 'buah', stock: 6  },
    ],
  },
];

const PROMOS = [
  { id: '1', title: 'Gratis Ongkir',         sub: 'Min. belanja Rp 50.000' },
  { id: '2', title: 'Diskon 20% Pagi Hari',  sub: 'Pesan sebelum jam 07.00' },
  { id: '3', title: 'Paket Mingguan',         sub: 'Hemat hingga 30%' },
];

type CartEntry = { productId: string; variantId: string; qty: number };

export default function HomeScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [activeCategory, setActiveCategory] = useState('1');
  const [search, setSearch] = useState('');
  const [focusSearch, setFocusSearch] = useState(false);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [sheetProduct, setSheetProduct] = useState<ProductSheetItem | null>(null);

  const cartCount = cart.reduce((s, e) => s + e.qty, 0);

  const handleAddToCart = (productId: string, variantId: string, qty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(e => e.productId === productId && e.variantId === variantId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId, variantId, qty }];
    });
  };

  const inCart = (id: string) => cart.some(e => e.productId === id);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* TOP BAR */}
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
              {cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: t.primary }]}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
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

        {/* SEARCH */}
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

        {/* AD SLIDESHOW */}
        <AdSlideshow t={t} />

        {/* PROMO BANNERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoList}>
          {PROMOS.map(p => (
            <TouchableOpacity key={p.id} activeOpacity={0.82}>
              <LinearGradient
                colors={['#1A7A4A', '#2A9960']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.promoBanner}
              >
                <Ionicons name="pricetag-outline" size={16} color="rgba(255,255,255,0.65)" style={{ marginBottom: 8 }} />
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CATEGORIES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(c => {
            const active = activeCategory === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setActiveCategory(c.id)}
                style={[styles.chip, { backgroundColor: active ? t.primary : t.surface, borderColor: active ? t.primary : t.border }]}
              >
                <Ionicons name={c.icon as any} size={14} color={active ? '#fff' : t.textSub} />
                <Text style={[styles.chipText, { color: active ? '#fff' : t.text }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PRODUCTS */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Produk Segar</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')} style={styles.seeAllBtn}>
            <Text style={[styles.seeAllText, { color: t.primary }]}>Lihat semua</Text>
            <Ionicons name="chevron-forward-outline" size={14} color={t.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {PRODUCTS.map(p => {
            const added = inCart(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.productCard, { backgroundColor: t.surface, borderColor: t.border }]}
                activeOpacity={0.88}
                onPress={() => setSheetProduct(p)}
              >
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
                      <Text style={[styles.productPrice, { color: t.primary }]}>
                        {p.variants[0] ? 'Rp ' + p.variants[0].price.toLocaleString('id-ID') : '-'}
                      </Text>
                      <Text style={[styles.productUnit, { color: t.textSub }]}>/{p.variants[0]?.unit}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.addBtn, { backgroundColor: added ? t.primary : t.primaryMuted, borderColor: t.primary }]}
                      onPress={() => setSheetProduct(p)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name={added ? 'checkmark-outline' : 'add-outline'} size={18} color={added ? '#fff' : t.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RECOMMENDATIONS */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Untukmu Hari Ini</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recList}>
          {PRODUCTS.slice(3).map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.recCard, { backgroundColor: t.surface, borderColor: t.border }]}
              onPress={() => setSheetProduct(p)}
            >
              <View style={[styles.recImg, { backgroundColor: t.accent }]}>
                <Ionicons name="leaf-outline" size={26} color={t.primary} />
              </View>
              <Text style={[styles.recName, { color: t.text }]} numberOfLines={1}>{p.name}</Text>
              <Text style={[styles.recPrice, { color: t.primary }]}>Rp {p.variants[0]?.price.toLocaleString('id-ID')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* FLOATING CART */}
      {cartCount > 0 && (
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
            <View style={styles.floatLeft}>
              <Ionicons name="bag-outline" size={18} color="#fff" />
              <Text style={styles.floatText}>{cartCount} item dipilih</Text>
            </View>
            <View style={styles.floatRight}>
              <Text style={styles.floatText}>Keranjang</Text>
              <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* BOTTOM SHEET */}
      <ProductBottomSheet
        visible={!!sheetProduct}
        product={sheetProduct}
        onClose={() => setSheetProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1 },
  topBar:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  greeting:       { fontSize: 12, marginBottom: 2 },
  topTitle:       { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  topActions:     { flexDirection: 'row', gap: 8 },
  iconBtn:        { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badge:          { position: 'absolute', top: -4, right: -4, width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText:      { fontSize: 9, color: '#fff', fontWeight: '800' },
  searchBar:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, height: 48, gap: 10, marginBottom: 20 },
  searchInput:    { flex: 1, fontSize: 14 },
  promoList:      { paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  promoBanner:    { width: width * 0.68, borderRadius: 16, padding: 18 },
  promoTitle:     { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 4 },
  promoSub:       { fontSize: 12, color: 'rgba(255,255,255,0.72)' },
  catList:        { paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  chip:           { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24, borderWidth: 1 },
  chipText:       { fontSize: 13, fontWeight: '600' },
  sectionRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle:   { fontSize: 16, fontWeight: '700' },
  seeAllBtn:      { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:     { fontSize: 13, fontWeight: '600' },
  grid:           { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 12, marginBottom: 28 },
  productCard:    { width: (width - 52) / 2, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  productImgBox:  { height: 100, alignItems: 'center', justifyContent: 'center' },
  productTagBox:  { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  productTagText: { fontSize: 10, fontWeight: '700' },
  productBody:    { padding: 12 },
  productName:    { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  productFarm:    { fontSize: 11, marginBottom: 10 },
  productFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  productPrice:   { fontSize: 14, fontWeight: '800' },
  productUnit:    { fontSize: 11 },
  addBtn:         { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  recList:        { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  recCard:        { width: 120, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: 'center', gap: 8 },
  recImg:         { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recName:        { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  recPrice:       { fontSize: 13, fontWeight: '700' },
  floatCartOuter: { position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 16, overflow: 'hidden', elevation: 6, shadowColor: '#1A7A4A', shadowOpacity: 0.25, shadowRadius: 12 },
  floatCartInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  floatLeft:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  floatRight:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  floatText:      { fontSize: 14, fontWeight: '600', color: '#fff' },
});
