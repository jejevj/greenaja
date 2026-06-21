import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme, Dimensions, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import ProductBottomSheet, { ProductSheetItem } from '../../components/ProductBottomSheet';

const { width } = Dimensions.get('window');

// ─── Shared product data (source of truth) ───────────────────────────────────
export const ALL_PRODUCTS: (ProductSheetItem & { category: string; rating: number; sold: number })[] = [
  { id:'1',  name:'Bayam Segar',    farm:'Kebun Pak Budi', tag:'Bestseller', category:'Sayuran', rating:4.9, sold:312, description:'Bayam lokal segar dipanen pagi hari langsung dari kebun organik Bogor.',       variants:[{id:'v1',label:'1 Ikat',       price:4500,  unit:'ikat', stock:30},{id:'v2',label:'3 Ikat',        price:12000,unit:'ikat',stock:15},{id:'v3',label:'5 Ikat',        price:18000,unit:'ikat',stock:8}] },
  { id:'2',  name:'Tomat Organik',  farm:'Farm Cisarua',   tag:'Organik',    category:'Sayuran', rating:4.8, sold:204, description:'Tomat cherry organik bersertifikat, tanpa pestisida, rasa manis alami.',      variants:[{id:'v1',label:'250g',         price:7500,  unit:'gram',stock:20},{id:'v2',label:'500g',         price:12000,unit:'gram',stock:12},{id:'v3',label:'1kg',           price:22000,unit:'kg',  stock:0}]  },
  { id:'3',  name:'Cabai Rawit',    farm:'Kebun Bu Sari',  tag:'Populer',    category:'Rempah',  rating:4.7, sold:178, description:'Cabai rawit merah segar, tingkat kepedasan tinggi, cocok untuk masakan rumah.', variants:[{id:'v1',label:'100g',         price:6000,  unit:'gram',stock:25},{id:'v2',label:'250g',         price:14000,unit:'gram',stock:10},{id:'v3',label:'500g',         price:26000,unit:'gram',stock:5}]  },
  { id:'4',  name:'Kangkung',       farm:'Kebun Pak Budi', tag:'Segar',      category:'Sayuran', rating:4.6, sold:156, description:'Kangkung air segar, batang renyah, cocok untuk tumis dan lalapan.',          variants:[{id:'v1',label:'1 Ikat',       price:3500,  unit:'ikat', stock:40},{id:'v2',label:'3 Ikat',        price:9500, unit:'ikat', stock:20}] },
  { id:'5',  name:'Wortel Baby',    farm:'Farm Lembang',   tag:'Baru',       category:'Sayuran', rating:4.8, sold:98,  description:'Wortel baby Lembang, manis dan renyah, cocok untuk camilan sehat anak.',     variants:[{id:'v1',label:'250g',         price:9000,  unit:'gram',stock:15},{id:'v2',label:'500g',         price:16500,unit:'gram',stock:8}]  },
  { id:'6',  name:'Brokoli Hijau',  farm:'Farm Cisarua',   tag:'Organik',    category:'Sayuran', rating:4.9, sold:134, description:'Brokoli segar organik ukuran besar, kaya vitamin C dan serat.',              variants:[{id:'v1',label:'Kecil (~300g)',price:8000,  unit:'buah',stock:12},{id:'v2',label:'Besar (~600g)',price:15000,unit:'buah',stock:6}]  },
  { id:'7',  name:'Jahe Merah',     farm:'Kebun Bu Sari',  tag:'Organik',    category:'Rempah',  rating:4.7, sold:87,  description:'Jahe merah organik kering, kaya manfaat, cocok untuk minuman kesehatan.',    variants:[{id:'v1',label:'100g',         price:8500,  unit:'gram',stock:30},{id:'v2',label:'250g',         price:19000,unit:'gram',stock:15}] },
  { id:'8',  name:'Pisang Cavendish',farm:'Farm Lembang',  tag:'Segar',      category:'Buah',    rating:4.6, sold:211, description:'Pisang Cavendish manis, matang sempurna, dipanen langsung dari kebun.',      variants:[{id:'v1',label:'1 Sisir',      price:12000, unit:'sisir',stock:20},{id:'v2',label:'1 Tandan',      price:35000,unit:'tandan',stock:8}]  },
  { id:'9',  name:'Mangga Harum Manis',farm:'Kebun Pak Budi',tag:'Populer',  category:'Buah',    rating:4.9, sold:265, description:'Mangga harum manis kualitas premium, manis legit, tanpa serat berlebih.',    variants:[{id:'v1',label:'500g',         price:14000, unit:'gram',stock:18},{id:'v2',label:'1kg',           price:25000,unit:'kg',  stock:9}]  },
  { id:'10', name:'Kunyit Segar',   farm:'Kebun Bu Sari',  tag:'Lokal',      category:'Rempah',  rating:4.5, sold:63,  description:'Kunyit segar lokal, warna orange cerah, untuk masakan dan jamu tradisional.',variants:[{id:'v1',label:'100g',         price:5000,  unit:'gram',stock:35},{id:'v2',label:'250g',         price:11000,unit:'gram',stock:20}] },
  { id:'11', name:'Bayam Merah',    farm:'Farm Cisarua',   tag:'Organik',    category:'Sayuran', rating:4.7, sold:72,  description:'Bayam merah organik kaya antioksidan, cocok untuk salad dan smoothie.',      variants:[{id:'v1',label:'1 Ikat',       price:6000,  unit:'ikat', stock:22}] },
  { id:'12', name:'Jeruk Nipis',    farm:'Farm Lembang',   tag:'Segar',      category:'Buah',    rating:4.6, sold:189, description:'Jeruk nipis segar berair, asam segar, cocok untuk minuman dan masakan.',     variants:[{id:'v1',label:'250g (~5 bj)', price:7000,  unit:'gram',stock:40},{id:'v2',label:'500g (~10 bj)',price:12500,unit:'gram',stock:25}] },
];

const CATEGORIES = ['Semua','Sayuran','Buah','Rempah'];
const SORTS = [
  { key:'popular', label:'Terpopuler' },
  { key:'rating',  label:'Rating'     },
  { key:'price_asc', label:'Harga ↑'  },
  { key:'price_desc',label:'Harga ↓'  },
];

type CartEntry = { productId: string; variantId: string; qty: number };

export default function ProductsScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { category: initCat = 'Semua', query: initQuery = '' } = useLocalSearchParams<{ category?: string; query?: string }>();

  const [activeCategory, setActiveCategory] = useState(initCat);
  const [activeSort,     setActiveSort]     = useState('popular');
  const [sheetProduct,   setSheetProduct]   = useState<ProductSheetItem | null>(null);
  const [cart,           setCart]           = useState<CartEntry[]>([]);

  const handleAddToCart = (productId: string, variantId: string, qty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(e => e.productId === productId && e.variantId === variantId);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], qty: n[idx].qty + qty }; return n; }
      return [...prev, { productId, variantId, qty }];
    });
  };

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (initQuery) list = list.filter(p => p.name.toLowerCase().includes((initQuery as string).toLowerCase()) || p.farm.toLowerCase().includes((initQuery as string).toLowerCase()));
    if (activeCategory !== 'Semua') list = list.filter(p => p.category === activeCategory);
    if (activeSort === 'popular')    list = [...list].sort((a,b) => b.sold - a.sold);
    if (activeSort === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating);
    if (activeSort === 'price_asc')  list = [...list].sort((a,b) => a.variants[0].price - b.variants[0].price);
    if (activeSort === 'price_desc') list = [...list].sort((a,b) => b.variants[0].price - a.variants[0].price);
    return list;
  }, [activeCategory, activeSort, initQuery]);

  const inCart = (id: string) => cart.some(e => e.productId === id);
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: t.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <Ionicons name="arrow-back-outline" size={20} color={t.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: t.text }]}>
            {initQuery ? `Hasil: "${initQuery}"` : activeCategory === 'Semua' ? 'Semua Produk' : activeCategory}
          </Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>{filtered.length} produk ditemukan</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/search')}
          style={[styles.searchIconBtn, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <Ionicons name="search-outline" size={20} color={t.text} />
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      {!initQuery && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(c => {
            const active = activeCategory === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setActiveCategory(c)}
                style={[styles.catChip, { backgroundColor: active ? t.primary : t.surface, borderColor: active ? t.primary : t.border }]}
              >
                <Text style={[styles.catChipText, { color: active ? '#fff' : t.text }]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Sort row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
        {SORTS.map(s => {
          const active = activeSort === s.key;
          return (
            <TouchableOpacity
              key={s.key}
              onPress={() => setActiveSort(s.key)}
              style={[styles.sortChip, { backgroundColor: active ? t.primaryMuted : t.surface, borderColor: active ? t.primary : t.border }]}
            >
              <Text style={[styles.sortChipText, { color: active ? t.primary : t.textSub }]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={52} color={t.border} />
          <Text style={[styles.emptyTitle, { color: t.text }]}>Produk tidak ditemukan</Text>
          <Text style={[styles.emptySub,   { color: t.textSub }]}>Coba kata kunci lain</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 40, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: p }) => {
            const added = inCart(p.id);
            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}
                activeOpacity={0.88}
                onPress={() => setSheetProduct(p)}
              >
                <View style={[styles.cardImg, { backgroundColor: t.accent }]}>
                  <Ionicons name="leaf-outline" size={36} color={t.primary} />
                </View>
                <View style={[styles.cardTagBox, { backgroundColor: t.primaryMuted }]}>
                  <Text style={[styles.cardTagText, { color: t.primary }]}>{p.tag}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardName, { color: t.text }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.cardFarm, { color: t.textSub }]} numberOfLines={1}>{p.farm}</Text>
                  {/* Rating row */}
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={[styles.ratingText, { color: t.textSub }]}>{p.rating} · {p.sold} terjual</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={[styles.cardPrice, { color: t.primary }]}>{fmt(p.variants[0].price)}</Text>
                      <Text style={[styles.cardUnit,  { color: t.textSub }]}>/{p.variants[0].unit}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.addBtn, { backgroundColor: added ? t.primary : t.primaryMuted, borderColor: t.primary }]}
                      onPress={() => setSheetProduct(p)}
                      hitSlop={{ top:8,bottom:8,left:8,right:8 }}
                    >
                      <Ionicons name={added ? 'checkmark-outline' : 'add-outline'} size={18} color={added ? '#fff' : t.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

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
  safe:          { flex: 1 },
  header:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:       { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:         { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:      { fontSize: 12, marginTop: 2 },
  searchIconBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  catRow:        { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  catChip:       { borderWidth: 1.5, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 7 },
  catChipText:   { fontSize: 13, fontWeight: '700' },
  sortRow:       { paddingHorizontal: 20, paddingBottom: 10, gap: 8 },
  sortChip:      { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  sortChipText:  { fontSize: 12, fontWeight: '600' },
  row:           { gap: 12, marginBottom: 12 },
  card:          { width: (width - 52) / 2, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  cardImg:       { height: 100, alignItems: 'center', justifyContent: 'center' },
  cardTagBox:    { position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  cardTagText:   { fontSize: 10, fontWeight: '700' },
  cardBody:      { padding: 12 },
  cardName:      { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cardFarm:      { fontSize: 11, marginBottom: 4 },
  ratingRow:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingText:    { fontSize: 11 },
  cardFooter:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardPrice:     { fontSize: 14, fontWeight: '800' },
  cardUnit:      { fontSize: 11 },
  addBtn:        { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  empty:         { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 80 },
  emptyTitle:    { fontSize: 16, fontWeight: '700' },
  emptySub:      { fontSize: 13 },
});
