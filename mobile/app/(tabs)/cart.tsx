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
import { useApp } from '../../context/AppContext';
import AddressBottomSheet, { AddressForm } from '../../components/AddressBottomSheet';

const INIT_ITEMS = [
  { id:'1', name:'Bayam Segar',   price:4500,  unit:'/ikat', farm:'Kebun Pak Budi', qty:2 },
  { id:'2', name:'Tomat Organik', price:12000, unit:'/500g', farm:'Farm Cisarua',   qty:1 },
  { id:'3', name:'Wortel Baby',   price:9000,  unit:'/250g', farm:'Farm Lembang',   qty:1 },
];

export default function CartScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { addresses, addAddress, hasAddress } = useApp();

  const [items,        setItems]        = useState(INIT_ITEMS);
  const [selectedAddr, setSelectedAddr] = useState<string | null>(
    addresses.find(a => a.isPrimary)?.id ?? addresses[0]?.id ?? null
  );
  const [showPicker,   setShowPicker]   = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);

  // Sinkronisasi selectedAddr ke primary jika belum dipilih
  const activeAddr = addresses.find(a => a.id === selectedAddr)
    ?? addresses.find(a => a.isPrimary)
    ?? addresses[0]
    ?? null;

  const updateQty = (id: string, delta: number) =>
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
          .filter(i => i.qty > 0)
    );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fmt   = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  const handleSaveAddress = (data: AddressForm) => {
    const newAddr = {
      id:        String(Date.now()),
      label:     data.label,
      name:      data.name,
      phone:     data.phone,
      address:   data.address,
      city:      data.city,
      isPrimary: !hasAddress,
      lat:       data.lat,
      lng:       data.lng,
    };
    addAddress(newAddr);
    setSelectedAddr(newAddr.id);
  };

  const handleCheckout = () => {
    router.push({
      pathname: '/(tabs)/checkout',
      params: { total: String(total), addressId: selectedAddr ?? '', itemCount: String(items.length) },
    });
  };

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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 180, paddingTop: 4 }}
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: t.accent }]}>
              <Ionicons name="bag-outline" size={40} color={t.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: t.text }]}>Keranjang kosong</Text>
            <Text style={[styles.emptySub,   { color: t.textSub }]}>Tambahkan produk segar pilihanmu</Text>
            <TouchableOpacity
              style={[styles.shopBtn, { backgroundColor: t.primary }]}
              onPress={() => router.back()}
            >
              <Text style={styles.shopBtnText}>Mulai Belanja</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ALAMAT PENGIRIMAN */}
            <Text style={[styles.sectionLabel, { color: t.text }]}>Alamat Pengiriman</Text>

            {activeAddr ? (
              <View style={[styles.addressCard, { backgroundColor: t.surface, borderColor: t.primary }]}>
                <View style={styles.addressTop}>
                  <View style={[styles.addressLabelBadge, { backgroundColor: t.primaryMuted }]}>
                    <Ionicons name="location-outline" size={12} color={t.primary} />
                    <Text style={[styles.addressLabelText, { color: t.primary }]}>{activeAddr.label}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={[styles.changeBtn, { borderColor: t.primary }]}
                  >
                    <Text style={[styles.changeBtnText, { color: t.primary }]}>Ganti</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.addressName,   { color: t.text }]}>{activeAddr.name}</Text>
                <Text style={[styles.addressPhone,  { color: t.textSub }]}>{activeAddr.phone}</Text>
                <Text style={[styles.addressStreet, { color: t.text }]}>{activeAddr.address}</Text>
                <Text style={[styles.addressCity,   { color: t.textSub }]}>{activeAddr.city}</Text>
                {activeAddr.lat != null && (
                  <View style={styles.coordRow}>
                    <Ionicons name="location" size={12} color={t.primary} />
                    <Text style={[styles.coordText, { color: t.textSub }]}>
                      {activeAddr.lat.toFixed(5)}, {activeAddr.lng?.toFixed(5)}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              /* Belum ada alamat */
              <TouchableOpacity
                style={[styles.noAddressCard, { backgroundColor: t.surface, borderColor: '#EF4444' }]}
                onPress={() => setShowAddSheet(true)}
              >
                <View style={[styles.noAddrIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="location-outline" size={22} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.noAddrTitle, { color: '#EF4444' }]}>Belum ada alamat</Text>
                  <Text style={[styles.noAddrSub,   { color: t.textSub }]}>Ketuk untuk tambah alamat pengiriman</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            )}

            {/* ADDRESS PICKER */}
            {showPicker && (
              <View style={[styles.pickerOverlay, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={styles.pickerHeader}>
                  <Text style={[styles.pickerTitle, { color: t.text }]}>Pilih Alamat</Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Ionicons name="close-outline" size={22} color={t.text} />
                  </TouchableOpacity>
                </View>
                {addresses.map(addr => (
                  <TouchableOpacity
                    key={addr.id}
                    style={[
                      styles.pickerItem,
                      {
                        borderColor: selectedAddr === addr.id ? t.primary : t.border,
                        backgroundColor: selectedAddr === addr.id ? t.primaryMuted : t.bg,
                      },
                    ]}
                    onPress={() => { setSelectedAddr(addr.id); setShowPicker(false); }}
                  >
                    <View style={styles.pickerItemTop}>
                      <View style={[styles.addressLabelBadge, { backgroundColor: t.accent }]}>
                        <Ionicons name="location-outline" size={11} color={t.primary} />
                        <Text style={[styles.addressLabelText, { color: t.primary }]}>{addr.label}</Text>
                      </View>
                      {selectedAddr === addr.id && (
                        <Ionicons name="checkmark-circle" size={18} color={t.primary} />
                      )}
                    </View>
                    <Text style={[styles.addressName, { color: t.text, fontSize: 13 }]}>{addr.name}</Text>
                    <Text style={[styles.addressStreet, { color: t.textSub, fontSize: 12 }]} numberOfLines={1}>
                      {addr.address}
                    </Text>
                    <Text style={[styles.addressCity, { color: t.textSub, fontSize: 12 }]}>{addr.city}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.addAddressBtn, { borderColor: t.primary, backgroundColor: t.primaryMuted }]}
                  onPress={() => { setShowPicker(false); setTimeout(() => setShowAddSheet(true), 200); }}
                >
                  <Ionicons name="add-circle-outline" size={16} color={t.primary} />
                  <Text style={[styles.addAddressText, { color: t.primary }]}>Tambah Alamat Baru</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CART ITEMS */}
            <Text style={[styles.sectionLabel, { color: t.text, marginTop: 20 }]}>Produk ({items.length})</Text>
            {items.map(item => (
              <View
                key={item.id}
                style={[styles.cartCard, { backgroundColor: t.surface, borderColor: t.border }]}
              >
                <View style={[styles.itemIcon, { backgroundColor: t.accent }]}>
                  <Ionicons name="leaf-outline" size={24} color={t.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName,  { color: t.text }]}>{item.name}</Text>
                  <Text style={[styles.itemFarm,  { color: t.textSub }]}>{item.farm}</Text>
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

            {/* RINGKASAN */}
            <View style={[styles.summary, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text style={[styles.summaryTitle, { color: t.text }]}>Ringkasan Belanja</Text>
              {items.map(i => (
                <View key={i.id} style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: t.textSub }]}>{i.name} x{i.qty}</Text>
                  <Text style={[styles.summaryValue, { color: t.text }]}>{fmt(i.price * i.qty)}</Text>
                </View>
              ))}
              <View style={[styles.divider, { backgroundColor: t.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: t.text, fontWeight: '700' }]}>Total Produk</Text>
                <Text style={[styles.summaryValue, { color: t.primary, fontWeight: '800', fontSize: 15 }]}>
                  {fmt(total)}
                </Text>
              </View>
              <Text style={[styles.summaryNote, { color: t.textSub }]}>
                * Ongkos kirim dihitung di halaman checkout
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Checkout bar */}
      {items.length > 0 && (
        <View style={[styles.checkoutBar, { backgroundColor: t.bg }]}>
          <TouchableOpacity activeOpacity={0.9} style={styles.checkoutOuter} onPress={handleCheckout}>
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.checkoutInner}
            >
              <View style={styles.checkoutLeft}>
                <Ionicons name="bag-check-outline" size={18} color="#fff" />
                <Text style={styles.checkoutText}>Lanjut Checkout</Text>
              </View>
              <Text style={styles.checkoutAmt}>{fmt(total)}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <AddressBottomSheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onSave={handleSaveAddress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1 },
  header:            { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:           { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:             { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:          { fontSize: 13, marginTop: 2 },
  sectionLabel:      { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  addressCard:       { borderRadius: 16, borderWidth: 1.5, padding: 16, marginBottom: 4, gap: 3 },
  addressTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addressLabelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  addressLabelText:  { fontSize: 11, fontWeight: '700' },
  changeBtn:         { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  changeBtnText:     { fontSize: 12, fontWeight: '700' },
  addressName:       { fontSize: 14, fontWeight: '700' },
  addressPhone:      { fontSize: 12, marginBottom: 4 },
  addressStreet:     { fontSize: 13 },
  addressCity:       { fontSize: 12, marginTop: 2 },
  coordRow:          { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  coordText:         { fontSize: 11 },
  noAddressCard:     { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 16, padding: 14, marginBottom: 4 },
  noAddrIconBox:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  noAddrTitle:       { fontSize: 14, fontWeight: '700' },
  noAddrSub:         { fontSize: 12, marginTop: 2 },
  pickerOverlay:     { borderRadius: 16, borderWidth: 1, padding: 16, marginVertical: 8, gap: 10 },
  pickerHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pickerTitle:       { fontSize: 15, fontWeight: '700' },
  pickerItem:        { borderWidth: 1.5, borderRadius: 12, padding: 12, gap: 3 },
  pickerItemTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  addAddressBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 12, paddingVertical: 13, marginTop: 4 },
  addAddressText:    { fontSize: 13, fontWeight: '700' },
  cartCard:          { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10, gap: 12 },
  itemIcon:          { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemName:          { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  itemFarm:          { fontSize: 12, marginBottom: 4 },
  itemPrice:         { fontSize: 14, fontWeight: '700' },
  stepper:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn:           { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepQty:           { fontSize: 15, fontWeight: '700', minWidth: 22, textAlign: 'center' },
  summary:           { borderRadius: 16, borderWidth: 1, padding: 16, marginTop: 6 },
  summaryTitle:      { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  summaryRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel:      { fontSize: 13 },
  summaryValue:      { fontSize: 13 },
  summaryNote:       { fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  divider:           { height: 1, marginVertical: 10 },
  checkoutBar:       { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32 },
  checkoutOuter:     { borderRadius: 16, overflow: 'hidden' },
  checkoutInner:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 17, paddingHorizontal: 22 },
  checkoutLeft:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkoutText:      { fontSize: 16, fontWeight: '700', color: '#fff' },
  checkoutAmt:       { fontSize: 16, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  empty:             { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon:         { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle:        { fontSize: 18, fontWeight: '700' },
  emptySub:          { fontSize: 14 },
  shopBtn:           { marginTop: 8, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  shopBtnText:       { fontSize: 15, fontWeight: '700', color: '#fff' },
});
