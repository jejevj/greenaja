import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme, Dimensions,
  FlatList, Animated, NativeScrollEvent, NativeSyntheticEvent,
  ActivityIndicator, AppState, AppStateStatus, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { LIGHT, DARK } from '../../constants/Theme';
import ProductBottomSheet, { ProductSheetItem } from '../../components/ProductBottomSheet';
import { ALL_PRODUCTS } from './products';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

// ─── Tipe lokasi ──────────────────────────────────────────────────────────────
type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'denied' }
  | { status: 'location_off' }
  | { status: 'error' }
  | { status: 'ok'; kecamatan: string; kabupaten?: string; provinsi?: string };

// ─── Nominatim reverse geocode ────────────────────────────────────────────────
// Mapping field Nominatim OSM untuk Indonesia:
//   addr.municipality   → Kecamatan (paling akurat di rural)
//   addr.suburb         → Kecamatan / kawasan kota
//   addr.city_district  → Kecamatan kota besar
//   addr.quarter        → Sub-distrik / kawasan
//   addr.village        → Desa/Kelurahan (lebih spesifik)
//   addr.town           → Kota kecil / ibukota kecamatan
//   ── batas kecamatan ──
//   addr.county         → Kabupaten/Kota (BUKAN kecamatan)
//   addr.city           → Kota (setara kabupaten)
//   addr.regency        → Kabupaten
//   addr.state_district → Kabupaten/Kota alternatif
//   addr.state          → Provinsi
async function reverseGeocode(
  lat: number, lon: number
): Promise<{ kecamatan: string; kabupaten?: string; provinsi?: string } | null> {
  const res = await global.fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    { headers: { 'Accept-Language': 'id', 'User-Agent': 'GreenAjaApp/1.0 (com.greenaja.app)' } }
  );
  const data = await res.json();
  const addr = data?.address ?? {};

  // Kecamatan — urutan dari paling akurat ke fallback
  const kecamatan =
    addr.municipality   ??
    addr.suburb         ??
    addr.city_district  ??
    addr.quarter        ??
    addr.village        ??
    addr.town           ??
    null;

  if (!kecamatan) return null;

  // Kabupaten/Kota — county di OSM Indonesia = kabupaten
  const kabupaten =
    addr.county         ??
    addr.city           ??
    addr.regency        ??
    addr.state_district ??
    undefined;

  // Provinsi
  const provinsi = addr.state ?? undefined;

  return { kecamatan, kabupaten, provinsi };
}

// ─── Hook lokasi + monitoring GPS ─────────────────────────────────────────────
function useKecamatan() {
  const [loc, setLoc] = useState<LocationState>({ status: 'idle' });

  const resolve = useCallback(async () => {
    setLoc({ status: 'loading' });
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') { setLoc({ status: 'denied' }); return; }

      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) { setLoc({ status: 'location_off' }); return; }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const result = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      if (!result) { setLoc({ status: 'error' }); return; }

      setLoc({ status: 'ok', ...result });
    } catch (e: any) {
      if (e?.code === 'E_LOCATION_SERVICES_DISABLED') setLoc({ status: 'location_off' });
      else setLoc({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(resolve, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') resolve();
    });
    return () => sub.remove();
  }, [resolve]);

  // Polling 5 detik
  const locStatusRef = useRef(loc.status);
  useEffect(() => { locStatusRef.current = loc.status; }, [loc.status]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const serviceEnabled = await Location.hasServicesEnabledAsync().catch(() => false);
      if (!serviceEnabled) {
        setLoc(prev => prev.status !== 'location_off' ? { status: 'location_off' } : prev);
      } else if (locStatusRef.current === 'location_off') {
        resolve();
      }
    }, 5_000);
    return () => clearInterval(interval);
  }, [resolve]);

  return { loc, refetch: resolve };
}

// ─── Full-screen solid overlay: GPS dimatikan ─────────────────────────────────
function LocationOffScreen({ t }: { t: typeof LIGHT }) {
  const openLocationSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(() =>
        Linking.openSettings()
      );
    }
  };

  return (
    <View style={[gpsStyles.screen, { backgroundColor: t.bg }]}>
      <View style={[gpsStyles.card, { backgroundColor: t.surface }]}>
        <View style={[gpsStyles.iconWrap, { backgroundColor: t.primaryMuted }]}>
          <Ionicons name="location-off-outline" size={40} color={t.primary} />
        </View>
        <Text style={[gpsStyles.title, { color: t.text }]}>Lokasi Dimatikan</Text>
        <Text style={[gpsStyles.desc, { color: t.textSub }]}>
          Layanan lokasi (GPS) kamu sedang mati.{`\n`}
          GreenAja membutuhkan lokasi untuk menampilkan kecamatan dan menemukan produk di sekitarmu.
        </Text>
        <TouchableOpacity
          style={[gpsStyles.btn, { backgroundColor: t.primary }]}
          onPress={openLocationSettings}
          activeOpacity={0.85}
        >
          <Ionicons name="settings-outline" size={18} color="#fff" />
          <Text style={gpsStyles.btnText}>Nyalakan Lokasi</Text>
        </TouchableOpacity>
        <Text style={[gpsStyles.hint, { color: t.textSub }]}>
          Akan terdeteksi otomatis setelah lokasi dinyalakan
        </Text>
      </View>
    </View>
  );
}

const gpsStyles = StyleSheet.create({
  screen:   {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999, justifyContent: 'center', alignItems: 'center', padding: 28,
  },
  card:     {
    width: '100%', borderRadius: 28, padding: 32, alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  iconWrap: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title:    { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  desc:     { fontSize: 13, lineHeight: 21, textAlign: 'center' },
  btn:      {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 16, marginTop: 8, width: '100%', justifyContent: 'center',
  },
  btnText:  { fontSize: 15, fontWeight: '700', color: '#fff' },
  hint:     { fontSize: 12, textAlign: 'center', marginTop: 4, lineHeight: 18 },
});

// ─── Banner lokasi ─────────────────────────────────────────────────────────────
function LocationBanner({ t, onGpsOff }: { t: typeof LIGHT; onGpsOff: (v: boolean) => void }) {
  const { loc, refetch } = useKecamatan();

  useEffect(() => {
    onGpsOff(loc.status === 'location_off');
  }, [loc.status]);

  const isInteractive = loc.status !== 'ok' && loc.status !== 'loading'
    && loc.status !== 'idle' && loc.status !== 'location_off';

  return (
    <TouchableOpacity
      activeOpacity={isInteractive ? 0.75 : 1}
      onPress={isInteractive ? refetch : undefined}
      style={[locStyles.banner, { backgroundColor: t.surface, borderColor: t.border }]}
    >
      <View style={[locStyles.pinBox, { backgroundColor: t.primaryMuted }]}>
        <Ionicons
          name={
            loc.status === 'ok' ? 'location'
            : loc.status === 'location_off' ? 'location-off-outline'
            : 'location-outline'
          }
          size={18}
          color={loc.status === 'ok' ? t.primary : t.textSub}
        />
      </View>

      <View style={locStyles.textWrap}>
        {(loc.status === 'idle' || loc.status === 'loading') && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ActivityIndicator size="small" color={t.primary} />
            <Text style={[locStyles.sub, { color: t.textSub }]}>Mendeteksi lokasi...</Text>
          </View>
        )}
        {loc.status === 'denied' && (
          <>
            <Text style={[locStyles.main, { color: t.text }]}>Izin lokasi belum diberikan</Text>
            <Text style={[locStyles.sub, { color: t.textSub }]}>Ketuk untuk coba lagi</Text>
          </>
        )}
        {loc.status === 'location_off' && (
          <>
            <Text style={[locStyles.main, { color: t.text }]}>Lokasi dimatikan</Text>
            <Text style={[locStyles.sub, { color: t.textSub }]}>Nyalakan GPS untuk melanjutkan</Text>
          </>
        )}
        {loc.status === 'error' && (
          <>
            <Text style={[locStyles.main, { color: t.text }]}>Gagal mendeteksi lokasi</Text>
            <Text style={[locStyles.sub, { color: t.textSub }]}>Ketuk untuk coba lagi</Text>
          </>
        )}
        {loc.status === 'ok' && (
          <>
            {/* Kecamatan — paling besar */}
            <Text style={[locStyles.kecamatan, { color: t.text }]} numberOfLines={1}>
              {loc.kecamatan}
            </Text>
            {/* Kabupaten/Kota */}
            {loc.kabupaten && (
              <Text style={[locStyles.kabupaten, { color: t.textSub }]} numberOfLines={1}>
                {loc.kabupaten}
              </Text>
            )}
            {/* Provinsi */}
            {loc.provinsi && (
              <Text style={[locStyles.provinsi, { color: t.textSub }]} numberOfLines={1}>
                {loc.provinsi}
              </Text>
            )}
          </>
        )}
      </View>

      {loc.status === 'ok' ? (
        <View style={[locStyles.chip, { backgroundColor: t.primaryMuted }]}>
          <Ionicons name="checkmark-circle-outline" size={12} color={t.primary} />
          <Text style={[locStyles.chipText, { color: t.primary }]}>Terdeteksi</Text>
        </View>
      ) : loc.status !== 'loading' && loc.status !== 'idle' ? (
        <Ionicons name="refresh-outline" size={18} color={t.textSub} />
      ) : null}
    </TouchableOpacity>
  );
}

const locStyles = StyleSheet.create({
  banner:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginBottom: 16, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  pinBox:    { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  textWrap:  { flex: 1 },
  kecamatan: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  kabupaten: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  provinsi:  { fontSize: 11, fontWeight: '400', marginTop: 1, opacity: 0.75 },
  main:      { fontSize: 14, fontWeight: '700' },
  sub:       { fontSize: 11, marginTop: 1 },
  chip:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  chipText:  { fontSize: 10, fontWeight: '700' },
});

// ─── Ads slideshow ────────────────────────────────────────────────────────────
const ADS = [
  { id:'1', title:'Sayur Segar Tiap Pagi',    sub:'Langsung dari kebun ke meja makanmu',        icon:'leaf-outline'             as const, colors:['#1A7A4A','#2A9960'] as [string,string] },
  { id:'2', title:'Gratis Ongkir Hari Ini!',  sub:'Untuk pembelian pertamamu, tanpa minimum',   icon:'bicycle-outline'          as const, colors:['#0D6E8A','#1A9DBF'] as [string,string] },
  { id:'3', title:'Produk 100% Organik',       sub:'Bersertifikat, bebas pestisida kimia',        icon:'shield-checkmark-outline' as const, colors:['#7A4A1A','#BF6A1A'] as [string,string] },
  { id:'4', title:'Paket Keluarga Hemat',      sub:'Hemat hingga 30% untuk pembelian mingguan',  icon:'cart-outline'             as const, colors:['#4A1A7A','#7A2ABF'] as [string,string] },
  { id:'5', title:'Dukung Petani Lokal',       sub:'Setiap pembelian mendukung 200+ petani',      icon:'people-outline'           as const, colors:['#1A4A7A','#2A6ABF'] as [string,string] },
];
const AD_WIDTH    = width - 40;
const AD_HEIGHT   = 140;
const AD_INTERVAL = 3500;

function AdSlideshow({ t }: { t: typeof LIGHT }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const flatRef  = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goTo = (idx: number) => { flatRef.current?.scrollToIndex({ index: idx, animated: true }); setActiveIdx(idx); };
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIdx(prev => { const next = (prev+1)%ADS.length; flatRef.current?.scrollToIndex({ index: next, animated: true }); return next; });
    }, AD_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / AD_WIDTH);
    setActiveIdx(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx(prev => { const next = (prev+1)%ADS.length; flatRef.current?.scrollToIndex({ index: next, animated: true }); return next; });
    }, AD_INTERVAL);
  };
  return (
    <View style={adStyles.wrapper}>
      <FlatList ref={flatRef} data={ADS} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id} onMomentumScrollEnd={handleMomentumEnd}
        getItemLayout={(_, i) => ({ length: AD_WIDTH, offset: AD_WIDTH*i, index: i })}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={{ width: AD_WIDTH }}>
            <LinearGradient colors={item.colors} start={{x:0,y:0}} end={{x:1,y:1}} style={adStyles.card}>
              <View style={adStyles.decoCircle} /><View style={adStyles.decoCircle2} />
              <View style={adStyles.content}>
                <View style={adStyles.iconBox}><Ionicons name={item.icon} size={28} color="rgba(255,255,255,0.95)" /></View>
                <View style={adStyles.textBox}>
                  <Text style={adStyles.adTitle}>{item.title}</Text>
                  <Text style={adStyles.adSub}>{item.sub}</Text>
                </View>
                <View style={adStyles.arrow}><Ionicons name="arrow-forward-outline" size={16} color="rgba(255,255,255,0.7)" /></View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
      <View style={adStyles.dots}>
        {ADS.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <View style={[adStyles.dot, { backgroundColor: i===activeIdx ? t.primary : t.border, width: i===activeIdx ? 20 : 6 }]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const adStyles = StyleSheet.create({
  wrapper:     { marginHorizontal: 20, marginBottom: 20 },
  card:        { width: AD_WIDTH, height: AD_HEIGHT, borderRadius: 18, padding: 20, overflow: 'hidden', justifyContent: 'center' },
  decoCircle:  { position:'absolute', width:160, height:160, borderRadius:80, backgroundColor:'rgba(255,255,255,0.08)', top:-40, right:-30 },
  decoCircle2: { position:'absolute', width:100, height:100, borderRadius:50, backgroundColor:'rgba(255,255,255,0.06)', bottom:-30, right:60 },
  content:     { flexDirection:'row', alignItems:'center', gap:14 },
  iconBox:     { width:52, height:52, borderRadius:16, backgroundColor:'rgba(255,255,255,0.18)', alignItems:'center', justifyContent:'center' },
  textBox:     { flex:1 },
  adTitle:     { fontSize:16, fontWeight:'800', color:'#fff', marginBottom:4, letterSpacing:-0.2 },
  adSub:       { fontSize:12, color:'rgba(255,255,255,0.75)', lineHeight:17 },
  arrow:       { width:30, height:30, borderRadius:15, backgroundColor:'rgba(255,255,255,0.15)', alignItems:'center', justifyContent:'center' },
  dots:        { flexDirection:'row', justifyContent:'center', alignItems:'center', gap:6, marginTop:10 },
  dot:         { height:6, borderRadius:3 },
});

// ─── Konstanta ────────────────────────────────────────────────────────────────
const PROMOS = [
  { id:'1', title:'Gratis Ongkir',        sub:'Min. belanja Rp 50.000'  },
  { id:'2', title:'Diskon 20% Pagi Hari', sub:'Pesan sebelum jam 07.00' },
  { id:'3', title:'Paket Mingguan',        sub:'Hemat hingga 30%'        },
];
const CATEGORIES = [
  { id:'1', label:'Semua',   icon:'apps-outline',             cat:'Semua'   },
  { id:'2', label:'Sayuran', icon:'leaf-outline',             cat:'Sayuran' },
  { id:'3', label:'Buah',    icon:'nutrition-outline',        cat:'Buah'    },
  { id:'4', label:'Rempah',  icon:'flask-outline',            cat:'Rempah'  },
  { id:'5', label:'Organik', icon:'shield-checkmark-outline', cat:'Organik' },
  { id:'6', label:'Lokal',   icon:'home-outline',             cat:'Lokal'   },
] as const;

type CartEntry = { productId: string; variantId: string; qty: number };

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { profileBadgeCount, profileBadgeAlert } = useApp();

  const [activeCategory, setActiveCategory] = useState('1');
  const [cart,           setCart]           = useState<CartEntry[]>([]);
  const [sheetProduct,   setSheetProduct]   = useState<ProductSheetItem | null>(null);
  const [gpsOff,         setGpsOff]         = useState(false);

  const scrollY      = useRef(new Animated.Value(0)).current;
  const headerShadow = scrollY.interpolate({ inputRange:[0,12], outputRange:[0,6],  extrapolate:'clamp' });
  const headerBorder = scrollY.interpolate({ inputRange:[0,8],  outputRange:[0,1],  extrapolate:'clamp' });

  const cartCount = cart.reduce((s,e) => s+e.qty, 0);

  const handleAddToCart = (productId: string, variantId: string, qty: number) => {
    setCart(prev => {
      const idx = prev.findIndex(e => e.productId===productId && e.variantId===variantId);
      if (idx >= 0) { const n=[...prev]; n[idx]={...n[idx], qty:n[idx].qty+qty}; return n; }
      return [...prev, { productId, variantId, qty }];
    });
  };

  const inCart   = (id: string) => cart.some(e => e.productId===id);
  const PRODUCTS = ALL_PRODUCTS.slice(0, 6);

  const showProfileBadge  = profileBadgeAlert || profileBadgeCount > 0;
  const profileBadgeBg    = profileBadgeAlert ? '#EF4444' : t.primary;
  const profileBadgeLabel = profileBadgeAlert ? '!' : String(profileBadgeCount > 9 ? '9+' : profileBadgeCount);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>

      {/* STICKY HEADER */}
      <Animated.View style={[
        styles.stickyHeader,
        {
          backgroundColor: t.bg,
          borderBottomColor: t.border,
          borderBottomWidth: headerBorder,
          shadowOpacity: headerShadow.interpolate({ inputRange:[0,6], outputRange:[0,0.09] }),
          shadowRadius:  headerShadow,
          elevation:     headerShadow,
        },
      ]}>
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: t.textSub }]}>Selamat datang</Text>
            <Text style={[styles.topTitle,  { color: t.text    }]}>GreenAja Market</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}
              onPress={() => router.push('/(tabs)/cart')}
            >
              <Ionicons name="bag-outline" size={20} color={t.text} />
              {cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: t.primary }]}>
                  <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Ionicons name="person-outline" size={20} color={t.text} />
              {showProfileBadge && (
                <View style={[styles.badge, { backgroundColor: profileBadgeBg }]}>
                  <Text style={styles.badgeText}>{profileBadgeLabel}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/search')}
          style={[styles.searchBarFake, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <Ionicons name="search-outline" size={18} color={t.textSub} />
          <Text style={[styles.searchPlaceholder, { color: t.textSub }]}>Cari produk, petani...</Text>
          <Ionicons name="mic-outline" size={18} color={t.textSub} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={{ marginTop: 16 }}><AdSlideshow t={t} /></View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoList}>
          {PROMOS.map(p => (
            <TouchableOpacity key={p.id} activeOpacity={0.82}>
              <LinearGradient colors={['#1A7A4A','#2A9960']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.promoBanner}>
                <Ionicons name="pricetag-outline" size={16} color="rgba(255,255,255,0.65)" style={{ marginBottom:8 }} />
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <LocationBanner t={t} onGpsOff={setGpsOff} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
          {CATEGORIES.map(c => {
            const active = activeCategory === c.id;
            return (
              <TouchableOpacity key={c.id}
                onPress={() => {
                  setActiveCategory(c.id);
                  router.push({ pathname:'/(tabs)/products', params:{ category: c.cat } });
                }}
                style={[styles.chip, { backgroundColor: active ? t.primary : t.surface, borderColor: active ? t.primary : t.border }]}
              >
                <Ionicons name={c.icon as any} size={14} color={active ? '#fff' : t.textSub} />
                <Text style={[styles.chipText, { color: active ? '#fff' : t.text }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Produk Segar</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/products')} style={styles.seeAllBtn}>
            <Text style={[styles.seeAllText, { color: t.primary }]}>Lihat semua</Text>
            <Ionicons name="chevron-forward-outline" size={14} color={t.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {PRODUCTS.map(p => {
            const added = inCart(p.id);
            return (
              <TouchableOpacity key={p.id}
                style={[styles.productCard, { backgroundColor:t.surface, borderColor:t.border }]}
                activeOpacity={0.88} onPress={() => setSheetProduct(p)}
              >
                <View style={[styles.productImgBox, { backgroundColor:t.accent }]}>
                  <Ionicons name="leaf-outline" size={36} color={t.primary} />
                </View>
                <View style={[styles.productTagBox, { backgroundColor:t.primaryMuted }]}>
                  <Text style={[styles.productTagText, { color:t.primary }]}>{p.tag}</Text>
                </View>
                <View style={styles.productBody}>
                  <Text style={[styles.productName, { color:t.text }]} numberOfLines={1}>{p.name}</Text>
                  <Text style={[styles.productFarm, { color:t.textSub }]} numberOfLines={1}>{p.farm}</Text>
                  <View style={styles.productFooter}>
                    <View>
                      <Text style={[styles.productPrice, { color:t.primary }]}>
                        {p.variants[0] ? 'Rp '+p.variants[0].price.toLocaleString('id-ID') : '-'}
                      </Text>
                      <Text style={[styles.productUnit, { color:t.textSub }]}>/{p.variants[0]?.unit}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.addBtn, { backgroundColor: added ? t.primary : t.primaryMuted, borderColor:t.primary }]}
                      onPress={() => setSheetProduct(p)} hitSlop={{top:8,bottom:8,left:8,right:8}}
                    >
                      <Ionicons name={added ? 'checkmark-outline' : 'add-outline'} size={18} color={added ? '#fff' : t.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Untukmu Hari Ini</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recList}>
          {ALL_PRODUCTS.slice(6).map(p => (
            <TouchableOpacity key={p.id}
              style={[styles.recCard, { backgroundColor:t.surface, borderColor:t.border }]}
              onPress={() => setSheetProduct(p)}
            >
              <View style={[styles.recImg, { backgroundColor:t.accent }]}>
                <Ionicons name="leaf-outline" size={26} color={t.primary} />
              </View>
              <Text style={[styles.recName, { color:t.text }]} numberOfLines={1}>{p.name}</Text>
              <Text style={[styles.recPrice, { color:t.primary }]}>Rp {p.variants[0]?.price.toLocaleString('id-ID')}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity style={styles.floatCartOuter} onPress={() => router.push('/(tabs)/cart')} activeOpacity={0.9}>
          <LinearGradient colors={['#1A7A4A','#2A9960']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.floatCartInner}>
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

      <ProductBottomSheet
        visible={!!sheetProduct}
        product={sheetProduct}
        onClose={() => setSheetProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {gpsOff && <LocationOffScreen t={t} />}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:              { flex:1 },
  stickyHeader:      { zIndex:10, shadowColor:'#000', shadowOffset:{width:0,height:2}, paddingBottom:12 },
  topBar:            { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingTop:12, paddingBottom:12 },
  greeting:          { fontSize:12, marginBottom:2 },
  topTitle:          { fontSize:20, fontWeight:'800', letterSpacing:-0.3 },
  topActions:        { flexDirection:'row', gap:8 },
  iconBtn:           { width:40, height:40, borderRadius:12, borderWidth:1, alignItems:'center', justifyContent:'center' },
  badge:             { position:'absolute', top:-4, right:-4, minWidth:17, height:17, borderRadius:9, alignItems:'center', justifyContent:'center', paddingHorizontal:3 },
  badgeText:         { fontSize:9, color:'#fff', fontWeight:'800' },
  searchBarFake:     { flexDirection:'row', alignItems:'center', marginHorizontal:20, borderRadius:14, borderWidth:1.5, paddingHorizontal:14, height:48, gap:10 },
  searchPlaceholder: { flex:1, fontSize:14 },
  promoList:         { paddingHorizontal:20, gap:12, marginBottom:20 },
  promoBanner:       { width:width*0.68, borderRadius:16, padding:18 },
  promoTitle:        { fontSize:15, fontWeight:'700', color:'#fff', marginBottom:4 },
  promoSub:          { fontSize:12, color:'rgba(255,255,255,0.72)' },
  catList:           { paddingHorizontal:20, gap:8, marginBottom:20 },
  chip:              { flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:14, paddingVertical:8, borderRadius:24, borderWidth:1 },
  chipText:          { fontSize:13, fontWeight:'600' },
  sectionRow:        { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, marginBottom:14 },
  sectionTitle:      { fontSize:16, fontWeight:'700' },
  seeAllBtn:         { flexDirection:'row', alignItems:'center', gap:2 },
  seeAllText:        { fontSize:13, fontWeight:'600' },
  grid:              { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:16, gap:12, marginBottom:28 },
  productCard:       { width:(width-44)/2, borderRadius:16, borderWidth:1, overflow:'hidden' },
  productImgBox:     { height:100, alignItems:'center', justifyContent:'center' },
  productTagBox:     { position:'absolute', top:10, left:10, paddingHorizontal:8, paddingVertical:3, borderRadius:20 },
  productTagText:    { fontSize:10, fontWeight:'700' },
  productBody:       { padding:12 },
  productName:       { fontSize:14, fontWeight:'700', marginBottom:2 },
  productFarm:       { fontSize:11, marginBottom:10 },
  productFooter:     { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end' },
  productPrice:      { fontSize:14, fontWeight:'800' },
  productUnit:       { fontSize:11 },
  addBtn:            { width:36, height:36, borderRadius:10, borderWidth:1.5, alignItems:'center', justifyContent:'center' },
  recList:           { paddingHorizontal:20, gap:12, marginBottom:24 },
  recCard:           { width:120, borderRadius:16, borderWidth:1, padding:14, alignItems:'center', gap:8 },
  recImg:            { width:52, height:52, borderRadius:14, alignItems:'center', justifyContent:'center' },
  recName:           { fontSize:12, fontWeight:'600', textAlign:'center' },
  recPrice:          { fontSize:13, fontWeight:'700' },
  floatCartOuter:    { position:'absolute', bottom:20, left:20, right:20, borderRadius:16, overflow:'hidden', elevation:6, shadowColor:'#1A7A4A', shadowOpacity:0.25, shadowRadius:12 },
  floatCartInner:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:15, paddingHorizontal:20 },
  floatLeft:         { flexDirection:'row', alignItems:'center', gap:8 },
  floatRight:        { flexDirection:'row', alignItems:'center', gap:6 },
  floatText:         { fontSize:14, fontWeight:'600', color:'#fff' },
});
