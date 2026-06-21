import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, useColorScheme, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import { useApp } from '../../context/AppContext';
import AddressBottomSheet, { AddressForm } from '../../components/AddressBottomSheet';

const LABEL_ICONS: Record<string, string> = {
  Rumah:      'home-outline',
  Kantor:     'business-outline',
  Kos:        'bed-outline',
  'Orang Tua':'people-outline',
  Lainnya:    'location-outline',
};

export default function AddressScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { addresses, addAddress, removeAddress, setPrimary, hasAddress } = useApp();
  const [showSheet, setShowSheet] = useState(false);

  const handleSave = (data: AddressForm) => {
    addAddress({
      id:        String(Date.now()),
      label:     data.label,
      name:      data.name,
      phone:     data.phone,
      address:   data.address,
      city:      data.city,
      isPrimary: !hasAddress, // auto primary jika pertama
      lat:       data.lat,
      lng:       data.lng,
    });
  };

  const handleDelete = (id: string, label: string) => {
    Alert.alert(
      'Hapus Alamat',
      `Hapus alamat "${label}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => removeAddress(id) },
      ]
    );
  };

  const handleSetPrimary = (id: string) => {
    setPrimary(id);
  };

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
          <Text style={[styles.pageTitle, { color: t.text }]}>Alamat Saya</Text>
          <Text style={[styles.pageSub, { color: t.textSub }]}>
            {addresses.length > 0 ? `${addresses.length} alamat tersimpan` : 'Belum ada alamat'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addHeaderBtn, { backgroundColor: t.primary }]}
          onPress={() => setShowSheet(true)}
        >
          <Ionicons name="add-outline" size={18} color="#fff" />
          <Text style={styles.addHeaderBtnText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, addresses.length === 0 && styles.emptyContent]}
      >
        {addresses.length === 0 ? (
          /* Empty state */
          <View style={styles.emptyWrap}>
            <View style={[styles.emptyIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="location-outline" size={44} color={t.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: t.text }]}>Belum ada alamat</Text>
            <Text style={[styles.emptySub,   { color: t.textSub }]}>
              Tambahkan alamat pengiriman agar kamu bisa checkout lebih cepat.
            </Text>
            <TouchableOpacity
              style={[styles.emptyAddBtn, { backgroundColor: t.primary }]}
              onPress={() => setShowSheet(true)}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.emptyAddBtnText}>Tambah Alamat Pertama</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {addresses.map((addr, i) => {
              const labelIcon = (LABEL_ICONS[addr.label] ?? 'location-outline') as any;
              return (
                <View
                  key={addr.id}
                  style={[
                    styles.addrCard,
                    {
                      backgroundColor: t.surface,
                      borderColor: addr.isPrimary ? t.primary : t.border,
                      borderWidth: addr.isPrimary ? 1.5 : 1,
                    },
                  ]}
                >
                  {/* Top row: label + primary badge + actions */}
                  <View style={styles.cardTop}>
                    <View style={[styles.labelBadge, { backgroundColor: addr.isPrimary ? t.primaryMuted : t.accent }]}>
                      <Ionicons name={labelIcon} size={12} color={addr.isPrimary ? t.primary : t.textSub} />
                      <Text style={[styles.labelText, { color: addr.isPrimary ? t.primary : t.textSub }]}>
                        {addr.label}
                      </Text>
                    </View>
                    {addr.isPrimary && (
                      <View style={[styles.primaryBadge, { backgroundColor: t.primary }]}>
                        <Ionicons name="star" size={10} color="#fff" />
                        <Text style={styles.primaryText}>Utama</Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }} />
                    {/* Set primary */}
                    {!addr.isPrimary && (
                      <TouchableOpacity
                        style={[styles.actionChip, { borderColor: t.border }]}
                        onPress={() => handleSetPrimary(addr.id)}
                      >
                        <Ionicons name="star-outline" size={12} color={t.textSub} />
                        <Text style={[styles.actionChipText, { color: t.textSub }]}>Jadikan Utama</Text>
                      </TouchableOpacity>
                    )}
                    {/* Delete */}
                    <TouchableOpacity
                      style={[styles.deleteBtn, { backgroundColor: '#FEE2E2' }]}
                      onPress={() => handleDelete(addr.id, addr.label + ' - ' + addr.name)}
                    >
                      <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Info */}
                  <Text style={[styles.addrName,   { color: t.text }]}>{addr.name}</Text>
                  <Text style={[styles.addrPhone,  { color: t.textSub }]}>{addr.phone}</Text>
                  <Text style={[styles.addrStreet, { color: t.text }]}>{addr.address}</Text>
                  <Text style={[styles.addrCity,   { color: t.textSub }]}>{addr.city}</Text>

                  {/* Koordinat pin (jika ada) */}
                  {addr.lat != null && (
                    <View style={[styles.coordRow, { backgroundColor: t.accent }]}>
                      <Ionicons name="location" size={11} color={t.primary} />
                      <Text style={[styles.coordText, { color: t.primary }]}>
                        {addr.lat.toFixed(5)}, {addr.lng?.toFixed(5)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Tombol tambah di bawah list */}
            <TouchableOpacity
              style={[styles.addListBtn, { borderColor: t.primary, backgroundColor: t.primaryMuted }]}
              onPress={() => setShowSheet(true)}
            >
              <Ionicons name="add-circle-outline" size={18} color={t.primary} />
              <Text style={[styles.addListBtnText, { color: t.primary }]}>Tambah Alamat Baru</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <AddressBottomSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:         { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:       { fontSize: 18, fontWeight: '800' },
  pageSub:         { fontSize: 12, marginTop: 2 },
  addHeaderBtn:    { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 },
  addHeaderBtnText:{ fontSize: 13, fontWeight: '700', color: '#fff' },

  listContent:     { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 12 },
  emptyContent:    { flex: 1, justifyContent: 'center' },

  // empty state
  emptyWrap:       { alignItems: 'center', gap: 12, paddingVertical: 60 },
  emptyIconBox:    { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle:      { fontSize: 18, fontWeight: '700' },
  emptySub:        { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  emptyAddBtn:     { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 8 },
  emptyAddBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // address card
  addrCard:        { borderRadius: 16, padding: 14, gap: 3 },
  cardTop:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  labelBadge:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  labelText:       { fontSize: 11, fontWeight: '700' },
  primaryBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  primaryText:     { fontSize: 10, fontWeight: '800', color: '#fff' },
  actionChip:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  actionChipText:  { fontSize: 10, fontWeight: '600' },
  deleteBtn:       { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addrName:        { fontSize: 14, fontWeight: '700' },
  addrPhone:       { fontSize: 12, marginBottom: 2 },
  addrStreet:      { fontSize: 13 },
  addrCity:        { fontSize: 12, marginTop: 1 },
  coordRow:        { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  coordText:       { fontSize: 11, fontWeight: '600' },

  // add button at bottom
  addListBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14 },
  addListBtnText:  { fontSize: 14, fontWeight: '700' },
});
