import React, { useState, useRef } from 'react';
import {
  ScrollView, StyleSheet, View, Text, TouchableOpacity,
  useColorScheme, TextInput, Animated, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT, DARK } from '../../constants/Theme';

const { width } = Dimensions.get('window');

// ── Dummy data (keyed by orderId) ──────────────────────────────────────────────
const ORDER_ITEMS: Record<string, { id: string; name: string; unit: string; price: number; qty: number }[]> = {
  'GRN-20260618-3102': [
    { id: 'i1', name: 'Kangkung Segar',  unit: '/ikat',  price: 5000,  qty: 3 },
    { id: 'i2', name: 'Cabai Merah',     unit: '/250g',  price: 12500, qty: 1 },
  ],
  'GRN-20260610-5577': [
    { id: 'i3', name: 'Brokoli Organik', unit: '/pcs',   price: 18000, qty: 1 },
    { id: 'i4', name: 'Bayam Segar',     unit: '/ikat',  price: 4500,  qty: 2 },
  ],
};

// ── StarRating component ───────────────────────────────────────────────────────
function StarRating({
  value, onChange, size = 28, color = '#F59E0B',
}: { value: number; onChange: (v: number) => void; size?: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <TouchableOpacity key={s} onPress={() => onChange(s)} activeOpacity={0.7}>
          <Ionicons
            name={s <= value ? 'star' : 'star-outline'}
            size={size}
            color={s <= value ? color : '#D1D5DB'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function OrderReviewScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const items = ORDER_ITEMS[orderId ?? ''] ?? ORDER_ITEMS['GRN-20260618-3102'];

  // State: rating & catatan per item, plus overall
  const [itemRatings, setItemRatings]   = useState<Record<string, number>>({});
  const [itemNotes,   setItemNotes]     = useState<Record<string, string>>({});
  const [itemPhotos,  setItemPhotos]    = useState<Record<string, string[]>>({});
  const [overallRating, setOverallRating] = useState(0);
  const [overallNote,   setOverallNote]   = useState('');
  const [overallPhotos, setOverallPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted]         = useState(false);

  const submitAnim = useRef(new Animated.Value(1)).current;
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const setItemRating = (id: string, v: number) =>
    setItemRatings(p => ({ ...p, [id]: v }));
  const setItemNote = (id: string, v: string) =>
    setItemNotes(p => ({ ...p, [id]: v }));

  // Simulate pick photo (just pushes a placeholder)
  const addPhoto = (key: 'overall' | string) => {
    const placeholder = `photo_${key}_${Date.now()}.jpg`;
    if (key === 'overall') {
      setOverallPhotos(p => [...p, placeholder]);
    } else {
      setItemPhotos(p => ({ ...p, [key]: [...(p[key] ?? []), placeholder] }));
    }
  };

  const removePhoto = (key: 'overall' | string, idx: number) => {
    if (key === 'overall') {
      setOverallPhotos(p => p.filter((_, i) => i !== idx));
    } else {
      setItemPhotos(p => ({ ...p, [key]: (p[key] ?? []).filter((_, i) => i !== idx) }));
    }
  };

  const allItemsRated = items.every(item => (itemRatings[item.id] ?? 0) > 0);

  const handleSubmit = () => {
    if (!allItemsRated) {
      Alert.alert('Belum lengkap', 'Berikan rating untuk semua produk terlebih dahulu.');
      return;
    }
    Animated.sequence([
      Animated.timing(submitAnim, { toValue: 0.94, duration: 80,  useNativeDriver: true }),
      Animated.timing(submitAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start(() => setSubmitted(true));
  };

  // ── Submitted state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top', 'bottom']}>
        <View style={styles.doneCenter}>
          <LinearGradient
            colors={['#1A7A4A', '#2A9960', '#3DB870']}
            style={styles.doneCircle}
          >
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
          <Text style={[styles.doneTitle, { color: t.text }]}>Terima Kasih!</Text>
          <Text style={[styles.doneSub,   { color: t.textSub }]}>
            Ulasanmu membantu petani lokal{`\n`}berkembang lebih baik 🌱
          </Text>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: t.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneBtnText}>Kembali ke Pesanan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main review form ─────────────────────────────────────────────────────────
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
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: t.text }]}>Beri Ulasan</Text>
          <Text style={[styles.subtitle, { color: t.textSub }]}>{orderId}</Text>
        </View>
        {/* Progress pill */}
        <View style={[styles.progressPill, { backgroundColor: t.primaryMuted }]}>
          <Text style={[styles.progressText, { color: t.primary }]}>
            {Object.keys(itemRatings).filter(k => (itemRatings[k] ?? 0) > 0).length}/{items.length}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── PER-ITEM REVIEW ── */}
        {items.map((item, idx) => {
          const rating = itemRatings[item.id] ?? 0;
          const note   = itemNotes[item.id]   ?? '';
          const photos = itemPhotos[item.id]  ?? [];
          const rated  = rating > 0;
          return (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: t.surface,
                  borderColor: rated ? t.primary : t.border,
                  borderWidth: rated ? 1.5 : 1,
                },
              ]}
            >
              {/* Item header */}
              <View style={styles.itemHeader}>
                <View style={[styles.itemNum, { backgroundColor: rated ? t.primaryMuted : t.accent }]}>
                  <Text style={[styles.itemNumText, { color: rated ? t.primary : t.textSub }]}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: t.text }]}>{item.name}</Text>
                  <Text style={[styles.itemMeta, { color: t.textSub }]}>
                    {item.qty}× {fmt(item.price)}{item.unit}
                  </Text>
                </View>
                {rated && (
                  <View style={[styles.ratedBadge, { backgroundColor: t.primaryMuted }]}>
                    <Ionicons name="checkmark-circle" size={14} color={t.primary} />
                    <Text style={[styles.ratedBadgeText, { color: t.primary }]}>Dinilai</Text>
                  </View>
                )}
              </View>

              {/* Stars */}
              <View style={styles.starsRow}>
                <StarRating value={rating} onChange={v => setItemRating(item.id, v)} />
                {rating > 0 && (
                  <Text style={[styles.ratingLabel, { color: '#F59E0B' }]}>
                    {['', 'Sangat Buruk', 'Kurang Baik', 'Cukup', 'Baik', 'Sangat Baik'][rating]}
                  </Text>
                )}
              </View>

              {/* Note */}
              <TextInput
                style={[
                  styles.noteInput,
                  { backgroundColor: t.accent, borderColor: t.border, color: t.text },
                ]}
                placeholder={`Tuliskan catatanmu tentang ${item.name}... (opsional)`}
                placeholderTextColor={t.textSub}
                multiline
                numberOfLines={3}
                value={note}
                onChangeText={v => setItemNote(item.id, v)}
              />

              {/* Photos */}
              <View style={styles.photoRow}>
                {photos.map((p, i) => (
                  <View key={i} style={[styles.photoThumb, { backgroundColor: t.accent, borderColor: t.border }]}>
                    <Ionicons name="image-outline" size={22} color={t.textSub} />
                    <TouchableOpacity
                      style={styles.photoRemove}
                      onPress={() => removePhoto(item.id, i)}
                    >
                      <Ionicons name="close-circle" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                {photos.length < 3 && (
                  <TouchableOpacity
                    style={[styles.photoAdd, { backgroundColor: t.accent, borderColor: t.border }]}
                    onPress={() => addPhoto(item.id)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="camera-outline" size={22} color={t.textSub} />
                    <Text style={[styles.photoAddText, { color: t.textSub }]}>Foto</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* ── OVERALL REVIEW ── */}
        <View style={[styles.overallCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.overallHeader}>
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              style={styles.overallIconBox}
            >
              <Ionicons name="storefront-outline" size={16} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.overallTitle, { color: t.text }]}>Ulasan Keseluruhan</Text>
              <Text style={[styles.overallSub, { color: t.textSub }]}>Pengalaman belanja secara umum</Text>
            </View>
            <Text style={[styles.overallOptional, { color: t.textSub }]}>Opsional</Text>
          </View>

          {/* Stars */}
          <View style={styles.starsRow}>
            <StarRating value={overallRating} onChange={setOverallRating} size={32} />
            {overallRating > 0 && (
              <Text style={[styles.ratingLabel, { color: '#F59E0B' }]}>
                {['', 'Sangat Buruk', 'Kurang Baik', 'Cukup', 'Baik', 'Sangat Baik'][overallRating]}
              </Text>
            )}
          </View>

          {/* Note */}
          <TextInput
            style={[
              styles.noteInput,
              { backgroundColor: t.accent, borderColor: t.border, color: t.text },
            ]}
            placeholder="Ceritakan pengalaman belanjamu secara keseluruhan... (opsional)"
            placeholderTextColor={t.textSub}
            multiline
            numberOfLines={4}
            value={overallNote}
            onChangeText={setOverallNote}
          />

          {/* Photos */}
          <View style={styles.photoRow}>
            {overallPhotos.map((p, i) => (
              <View key={i} style={[styles.photoThumb, { backgroundColor: t.accent, borderColor: t.border }]}>
                <Ionicons name="image-outline" size={22} color={t.textSub} />
                <TouchableOpacity
                  style={styles.photoRemove}
                  onPress={() => removePhoto('overall', i)}
                >
                  <Ionicons name="close-circle" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            {overallPhotos.length < 5 && (
              <TouchableOpacity
                style={[styles.photoAdd, { backgroundColor: t.accent, borderColor: t.border }]}
                onPress={() => addPhoto('overall')}
                activeOpacity={0.75}
              >
                <Ionicons name="camera-outline" size={22} color={t.textSub} />
                <Text style={[styles.photoAddText, { color: t.textSub }]}>Foto</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── HINT ── */}
        <View style={[styles.hintBox, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}>
          <Ionicons name="information-circle-outline" size={16} color={t.primary} />
          <Text style={[styles.hintText, { color: t.primary }]}>
            Rating per produk wajib diisi. Catatan dan foto bersifat opsional.
          </Text>
        </View>

      </ScrollView>

      {/* ── SUBMIT BUTTON ── */}
      <View style={[styles.bottomBar, { backgroundColor: t.bg }]}>
        <Animated.View style={[{ flex: 1, transform: [{ scale: submitAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.submitBtnWrap,
              { opacity: allItemsRated ? 1 : 0.5 },
            ]}
            onPress={handleSubmit}
            activeOpacity={0.9}
            disabled={!allItemsRated}
          >
            <LinearGradient
              colors={allItemsRated ? ['#1A7A4A', '#2A9960'] : ['#9CA3AF', '#9CA3AF']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Ionicons name="star" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Kirim Ulasan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1 },
  header:           { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:          { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:            { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:         { fontSize: 11, marginTop: 1 },
  progressPill:     { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  progressText:     { fontSize: 13, fontWeight: '800' },

  // item card
  itemCard:         { borderRadius: 16, padding: 16, marginBottom: 14 },
  itemHeader:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  itemNum:          { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemNumText:      { fontSize: 14, fontWeight: '800' },
  itemName:         { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemMeta:         { fontSize: 12 },
  ratedBadge:       { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  ratedBadgeText:   { fontSize: 11, fontWeight: '700' },

  starsRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  ratingLabel:      { fontSize: 13, fontWeight: '700' },

  noteInput:        { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 13, textAlignVertical: 'top', marginBottom: 12, minHeight: 72 },

  photoRow:         { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  photoThumb:       { width: 64, height: 64, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  photoRemove:      { position: 'absolute', top: -6, right: -6 },
  photoAdd:         { width: 64, height: 64, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 3 },
  photoAddText:     { fontSize: 10, fontWeight: '600' },

  // overall
  overallCard:      { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  overallHeader:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  overallIconBox:   { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  overallTitle:     { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  overallSub:       { fontSize: 12 },
  overallOptional:  { fontSize: 11, fontStyle: 'italic' },

  // hint
  hintBox:          { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
  hintText:         { flex: 1, fontSize: 12, lineHeight: 18 },

  // submit
  bottomBar:        { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },
  submitBtnWrap:    { borderRadius: 14, overflow: 'hidden' },
  submitBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  submitBtnText:    { fontSize: 15, fontWeight: '800', color: '#fff' },

  // done
  doneCenter:       { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  doneCircle:       { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  doneTitle:        { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  doneSub:          { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  doneBtn:          { marginTop: 8, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  doneBtnText:      { fontSize: 14, fontWeight: '700', color: '#fff' },
});
