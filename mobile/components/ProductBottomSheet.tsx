import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Dimensions, ScrollView, useColorScheme, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT, DARK } from '../constants/Theme';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.72;

export type Variant = { id: string; label: string; price: number; unit: string; stock: number };

export type ProductSheetItem = {
  id: string;
  name: string;
  farm: string;
  tag: string;
  description: string;
  variants: Variant[];
};

type Props = {
  visible: boolean;
  product: ProductSheetItem | null;
  onClose: () => void;
  onAddToCart: (productId: string, variantId: string, qty: number) => void;
};

export default function ProductBottomSheet({ visible, product, onClose, onAddToCart }: Props) {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const slideAnim = useRef(new Animated.Value(SHEET_H)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  // reset state setiap produk berganti
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]?.id ?? null);
      setQty(1);
    }
  }, [product?.id]);

  // animasi masuk / keluar
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SHEET_H, duration: 240, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,       duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!product) return null;

  const variant = product.variants.find(v => v.id === selectedVariant);
  const totalPrice = variant ? variant.price * qty : 0;
  const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const handleAdd = () => {
    if (!selectedVariant) return;
    onAddToCart(product.id, selectedVariant, qty);
    onClose();
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} statusBarTranslucent animationType="none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: t.bg, height: SHEET_H, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleWrap}>
          <View style={[styles.handle, { backgroundColor: t.border }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* Product header */}
          <View style={styles.productHeader}>
            <View style={[styles.productIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="leaf-outline" size={44} color={t.primary} />
            </View>
            <View style={[styles.tagBox, { backgroundColor: t.primaryMuted }]}>
              <Text style={[styles.tagText, { color: t.primary }]}>{product.tag}</Text>
            </View>
          </View>

          <View style={styles.productMeta}>
            <Text style={[styles.productName, { color: t.text }]}>{product.name}</Text>
            <View style={styles.farmRow}>
              <Ionicons name="location-outline" size={13} color={t.textSub} />
              <Text style={[styles.farmText, { color: t.textSub }]}>{product.farm}</Text>
            </View>
            <Text style={[styles.desc, { color: t.textSub }]}>{product.description}</Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: t.border }]} />

          {/* Variant selector */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: t.text }]}>Pilih Varian</Text>
            <View style={styles.variantList}>
              {product.variants.map(v => {
                const active = selectedVariant === v.id;
                const outOfStock = v.stock === 0;
                return (
                  <TouchableOpacity
                    key={v.id}
                    disabled={outOfStock}
                    onPress={() => { setSelectedVariant(v.id); setQty(1); }}
                    style={[
                      styles.variantChip,
                      {
                        borderColor: active ? t.primary : t.border,
                        backgroundColor: active ? t.primaryMuted : t.surface,
                        opacity: outOfStock ? 0.4 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.variantLabel, { color: active ? t.primary : t.text }]}>{v.label}</Text>
                    <Text style={[styles.variantPrice, { color: active ? t.primary : t.textSub }]}>{fmt(v.price)}</Text>
                    <Text style={[styles.variantUnit,  { color: t.textSub }]}>{v.unit}</Text>
                    {outOfStock && (
                      <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>Habis</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: t.border }]} />

          {/* Qty stepper */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: t.text }]}>Jumlah</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, { borderColor: t.border, backgroundColor: t.surface }]}
                onPress={() => setQty(q => Math.max(1, q - 1))}
              >
                <Ionicons name="remove-outline" size={18} color={t.text} />
              </TouchableOpacity>
              <View style={[styles.qtyDisplay, { backgroundColor: t.accent }]}>
                <Text style={[styles.qtyText, { color: t.text }]}>{qty}</Text>
              </View>
              <TouchableOpacity
                style={[styles.qtyBtn, { borderColor: t.primary, backgroundColor: t.primary }]}
                onPress={() => setQty(q => Math.min(variant?.stock ?? 99, q + 1))}
              >
                <Ionicons name="add-outline" size={18} color="#fff" />
              </TouchableOpacity>
              {variant && (
                <Text style={[styles.stockNote, { color: t.textSub }]}>Stok: {variant.stock} {variant.unit}</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* CTA bar pinned bottom */}
        <View style={[styles.ctaBar, { backgroundColor: t.bg }]}>
          <View style={styles.ctaPriceRow}>
            <Text style={[styles.ctaPriceLabel, { color: t.textSub }]}>Total harga</Text>
            <Text style={[styles.ctaPrice, { color: t.primary }]}>{fmt(totalPrice)}</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtnOuter} onPress={handleAdd} activeOpacity={0.88}>
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.ctaBtnInner}
            >
              <Ionicons name="bag-add-outline" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Tambah ke Keranjang</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:         { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:            { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  handleWrap:       { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle:           { width: 36, height: 4, borderRadius: 2 },
  productHeader:    { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  productIconBox:   { width: 100, height: 100, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  tagBox:           { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  tagText:          { fontSize: 11, fontWeight: '700' },
  productMeta:      { paddingHorizontal: 20, paddingBottom: 16, alignItems: 'center' },
  productName:      { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 6, textAlign: 'center' },
  farmRow:          { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  farmText:         { fontSize: 13 },
  desc:             { fontSize: 13, lineHeight: 20, textAlign: 'center' },
  divider:          { height: 1, marginHorizontal: 20, marginVertical: 16 },
  section:          { paddingHorizontal: 20, marginBottom: 4 },
  sectionLabel:     { fontSize: 13, fontWeight: '700', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  variantList:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  variantChip:      { borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, minWidth: 90, alignItems: 'center', gap: 2, overflow: 'hidden' },
  variantLabel:     { fontSize: 13, fontWeight: '700' },
  variantPrice:     { fontSize: 13, fontWeight: '800' },
  variantUnit:      { fontSize: 11 },
  outOfStockOverlay:{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  outOfStockText:   { fontSize: 11, fontWeight: '700', color: '#888' },
  qtyRow:           { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn:           { width: 42, height: 42, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  qtyDisplay:       { width: 52, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qtyText:          { fontSize: 18, fontWeight: '800' },
  stockNote:        { fontSize: 12, marginLeft: 4 },
  ctaBar:           { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  ctaPriceRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ctaPriceLabel:    { fontSize: 13 },
  ctaPrice:         { fontSize: 20, fontWeight: '800' },
  ctaBtnOuter:      { borderRadius: 16, overflow: 'hidden' },
  ctaBtnInner:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaBtnText:       { fontSize: 16, fontWeight: '700', color: '#fff' },
});
