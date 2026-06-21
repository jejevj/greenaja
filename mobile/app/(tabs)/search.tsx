import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, useColorScheme, Dimensions, Keyboard, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import ProductBottomSheet, { ProductSheetItem } from '../../components/ProductBottomSheet';
import { ALL_PRODUCTS } from './products';

const { width } = Dimensions.get('window');

const RECENT_SEARCHES = ['Bayam segar', 'Tomat organik', 'Cabai rawit', 'Wortel'];
const POPULAR_TAGS    = ['Sayuran', 'Buah', 'Rempah', 'Organik', 'Bestseller', 'Segar'];

type CartEntry = { productId: string; variantId: string; qty: number };

// Sensor nama censor untuk konsistensi (reuse pattern)
function highlight(text: string, query: string): { part: string; bold: boolean }[] {
  if (!query) return [{ part: text, bold: false }];
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return [{ part: text, bold: false }];
  return [
    { part: text.slice(0, idx),           bold: false },
    { part: text.slice(idx, idx + query.length), bold: true  },
    { part: text.slice(idx + query.length),      bold: false },
  ];
}

export default function SearchScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { q: initQ = '' } = useLocalSearchParams<{ q?: string }>();

  const [query,        setQuery]        = useState(initQ as string);
  const [focused,      setFocused]      = useState(true);
  const [sheetProduct, setSheetProduct] = useState<ProductSheetItem | null>(null);
  const [cart,         setCart]         = useState<CartEntry[]>([]);

  const inputRef  = useRef<TextInput>(null);
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    inputRef.current?.focus();
    Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, []);

  const handleAddToCart = (productId: string, variantId: string, qty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(e => e.productId === productId && e.variantId === variantId);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], qty: n[idx].qty + qty }; return n; }
      return [...prev, { productId, variantId, qty }];
    });
  };

  // Sugesti: muncul saat query >= 1 karakter
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matched = ALL_PRODUCTS.filter(
      p => p.name.toLowerCase().includes(q) || p.farm.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    // Deduplicate by name prefix + category
    const seen = new Set<string>();
    const result: { type: 'product' | 'category'; label: string; sub: string; id: string }[] = [];
    matched.forEach(p => {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        result.push({ type: 'product', label: p.name, sub: p.farm, id: p.id });
      }
    });
    // juga suggest kategori jika cocok
    ['Sayuran','Buah','Rempah'].forEach(cat => {
      if (cat.toLowerCase().includes(q) && !seen.has(cat)) {
        seen.add(cat);
        result.push({ type: 'category', label: cat, sub: 'Kategori', id: cat });
      }
    });
    return result.slice(0, 7);
  }, [query]);

  // Hasil penuh (setelah enter / submit)
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(
      p => p.name.toLowerCase().includes(q) ||
           p.farm.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q) ||
           p.tag.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSubmit = () => {
    Keyboard.dismiss();
    setFocused(false);
  };

  const handleSuggestionTap = (s: typeof suggestions[0]) => {
    if (s.type === 'category') {
      router.push({ pathname: '/(tabs)/products', params: { category: s.label } });
    } else {
      setQuery(s.label);
      Keyboard.dismiss();
      setFocused(false);
    }
  };

  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const inCart = (id: string) => cart.some(e => e.productId === id);

  const showSuggestions = focused && suggestions.length > 0;
  const showResults     = !focused && query.trim().length > 0;
  const showIdle        = !query.trim();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>

      {/* Search bar */}
      <Animated.View style={[styles.barWrap, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <Ionicons name="arrow-back-outline" size={20} color={t.text} />
        </TouchableOpacity>
        <View style={[styles.inputWrap, { backgroundColor: t.surface, borderColor: focused ? t.primary : t.border }]}>
          <Ionicons name="search-outline" size={18} color={focused ? t.primary : t.textSub} />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: t.text }]}
            placeholder="Cari produk, petani, kategori..."
            placeholderTextColor={t.textSub}
            value={query}
            onChangeText={v => { setQuery(v); setFocused(true); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setFocused(true); inputRef.current?.focus(); }}>
              <Ionicons name="close-circle" size={18} color={t.textSub} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── SUGESTI DROPDOWN ── */}
      {showSuggestions && (
        <View style={[styles.suggestBox, { backgroundColor: t.surface, borderColor: t.border }]}>
          {suggestions.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.suggestRow, i < suggestions.length - 1 && { borderBottomWidth: 1, borderBottomColor: t.border }]}
              onPress={() => handleSuggestionTap(s)}
              activeOpacity={0.75}
            >
              <View style={[styles.suggestIcon, { backgroundColor: s.type === 'category' ? t.primaryMuted : t.accent }]}>
                <Ionicons
                  name={s.type === 'category' ? 'grid-outline' : 'leaf-outline'}
                  size={14}
                  color={s.type === 'category' ? t.primary : t.textSub}
                />
              </View>
              <View style={{ flex: 1 }}>
                {/* Highlight matched part */}
                <Text style={[styles.suggestLabel, { color: t.text }]} numberOfLines={1}>
                  {highlight(s.label, query).map((chunk, ci) =>
                    chunk.bold
                      ? <Text key={ci} style={{ color: t.primary, fontWeight: '800' }}>{chunk.part}</Text>
                      : <Text key={ci}>{chunk.part}</Text>
                  )}
                </Text>
                <Text style={[styles.suggestSub, { color: t.textSub }]}>{s.sub}</Text>
              </View>
              <Ionicons name="arrow-up-back-outline" size={14} color={t.textSub} style={styles.suggestArrow} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── IDLE (belum ada query) ── */}
      {showIdle && (
        <FlatList
          data={[]}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
              {/* Recent */}
              <Text style={[styles.sectionLabel, { color: t.text }]}>Pencarian Terakhir</Text>
              {RECENT_SEARCHES.map((r, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.recentRow, { borderBottomColor: t.border }]}
                  onPress={() => { setQuery(r); setFocused(false); }}
                >
                  <Ionicons name="time-outline" size={16} color={t.textSub} />
                  <Text style={[styles.recentText, { color: t.text }]}>{r}</Text>
                  <TouchableOpacity onPress={() => {}} style={{ padding: 4 }}>
                    <Ionicons name="close-outline" size={16} color={t.textSub} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              {/* Popular tags */}
              <Text style={[styles.sectionLabel, { color: t.text, marginTop: 20 }]}>Populer</Text>
              <View style={styles.tagsWrap}>
                {POPULAR_TAGS.map((tag, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.tagChip, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}
                    onPress={() => { setQuery(tag); setFocused(false); }}
                  >
                    <Ionicons name="trending-up-outline" size={12} color={t.primary} />
                    <Text style={[styles.tagText, { color: t.primary }]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          }
          renderItem={() => null}
          keyExtractor={() => ''}
        />
      )}

      {/* ── HASIL PENCARIAN ── */}
      {showResults && (
        <>
          <View style={styles.resultHeader}>
            <Text style={[styles.resultCount, { color: t.textSub }]}>
              <Text style={{ color: t.primary, fontWeight: '800' }}>{results.length}</Text> produk ditemukan
            </Text>
            {results.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(tabs)/products', params: { query } })}
                style={[styles.seeAllBtn, { backgroundColor: t.primaryMuted }]}
              >
                <Text style={[styles.seeAllText, { color: t.primary }]}>Lihat semua</Text>
                <Ionicons name="chevron-forward-outline" size={12} color={t.primary} />
              </TouchableOpacity>
            )}
          </View>

          {results.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={52} color={t.border} />
              <Text style={[styles.emptyTitle, { color: t.text }]}>Tidak ada hasil untuk</Text>
              <Text style={[styles.emptyQuery, { color: t.primary }]}>"{query}"</Text>
              <Text style={[styles.emptySub,   { color: t.textSub }]}>Coba kata kunci lain atau browsing kategori</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 40 }}
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
                      <Ionicons name="leaf-outline" size={32} color={t.primary} />
                    </View>
                    <View style={[styles.cardTag, { backgroundColor: t.primaryMuted }]}>
                      <Text style={[styles.cardTagTxt, { color: t.primary }]}>{p.tag}</Text>
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={[styles.cardName, { color: t.text }]} numberOfLines={1}>{p.name}</Text>
                      <Text style={[styles.cardFarm, { color: t.textSub }]} numberOfLines={1}>{p.farm}</Text>
                      <View style={styles.cardFooter}>
                        <Text style={[styles.cardPrice, { color: t.primary }]}>{fmt(p.variants[0].price)}</Text>
                        <TouchableOpacity
                          style={[styles.addBtn, { backgroundColor: added ? t.primary : t.primaryMuted, borderColor: t.primary }]}
                          onPress={() => setSheetProduct(p)}
                          hitSlop={{ top:8,bottom:8,left:8,right:8 }}
                        >
                          <Ionicons name={added ? 'checkmark-outline' : 'add-outline'} size={16} color={added ? '#fff' : t.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </>
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
  barWrap:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn:       { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  inputWrap:     { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, height: 48, gap: 10 },
  input:         { flex: 1, fontSize: 14 },

  // suggest
  suggestBox:    { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, zIndex: 20 },
  suggestRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  suggestIcon:   { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  suggestLabel:  { fontSize: 13, fontWeight: '600', marginBottom: 1 },
  suggestSub:    { fontSize: 11 },
  suggestArrow:  { transform: [{ rotate: '225deg' }] },

  // idle
  sectionLabel:  { fontSize: 14, fontWeight: '800', marginBottom: 12 },
  recentRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  recentText:    { flex: 1, fontSize: 14 },
  tagsWrap:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip:       { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  tagText:       { fontSize: 12, fontWeight: '700' },

  // results
  resultHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10 },
  resultCount:   { fontSize: 13 },
  seeAllBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  seeAllText:    { fontSize: 12, fontWeight: '700' },
  gridRow:       { gap: 12, marginBottom: 12 },
  card:          { width: (width - 52) / 2, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  cardImg:       { height: 90, alignItems: 'center', justifyContent: 'center' },
  cardTag:       { position: 'absolute', top: 8, left: 8, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  cardTagTxt:    { fontSize: 9, fontWeight: '700' },
  cardBody:      { padding: 10 },
  cardName:      { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  cardFarm:      { fontSize: 11, marginBottom: 8 },
  cardFooter:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice:     { fontSize: 13, fontWeight: '800' },
  addBtn:        { width: 32, height: 32, borderRadius: 9, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  emptyBox:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
  emptyTitle:    { fontSize: 15, fontWeight: '600' },
  emptyQuery:    { fontSize: 18, fontWeight: '800' },
  emptySub:      { fontSize: 12, textAlign: 'center', paddingHorizontal: 40 },
});
