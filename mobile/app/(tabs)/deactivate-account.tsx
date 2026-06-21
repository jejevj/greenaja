import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, useColorScheme, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const REASONS = [
  { icon: 'pause-circle-outline',   label: 'Butuh istirahat sementara dari belanja online' },
  { icon: 'shield-outline',         label: 'Khawatir dengan keamanan akun saya' },
  { icon: 'airplane-outline',       label: 'Sedang bepergian / tidak aktif dalam waktu dekat' },
  { icon: 'notifications-off-outline', label: 'Terlalu banyak notifikasi yang mengganggu' },
  { icon: 'person-outline',         label: 'Ingin mengelola penggunaan aplikasi' },
  { icon: 'ellipsis-horizontal-outline', label: 'Alasan lainnya' },
];

export default function DeactivateAccountScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason,    setOtherReason]    = useState('');
  const [confirmed,      setConfirmed]      = useState(false);

  const isOther   = selectedReason === 'Alasan lainnya';
  const canSubmit = selectedReason !== '' && (!isOther || otherReason.trim().length > 0) && confirmed;

  const handleDeactivate = () => {
    Alert.alert(
      'Nonaktifkan Akun?',
      'Akunmu akan dinonaktifkan sementara. Kamu bisa mengaktifkannya kembali kapan saja dengan login ulang.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Nonaktifkan',
          style: 'destructive',
          onPress: () => {
            setTimeout(() => router.replace('/(auth)/login'), 300);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: t.border }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}
          >
            <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pageTitle, { color: t.text }]}>Nonaktifkan Akun</Text>
            <Text style={[styles.pageSub, { color: t.textSub }]}>Sementara waktu</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="pause-circle-outline" size={20} color="#F59E0B" />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
            <Ionicons name="information-circle-outline" size={20} color="#F59E0B" />
            <Text style={[styles.infoBannerText, { color: '#78350F' }]}>
              Akunmu akan disembunyikan sementara. Semua data, pesanan, dan voucher akan tetap tersimpan dan bisa diakses kembali saat kamu login ulang.
            </Text>
          </View>

          {/* Yang Terjadi Saat Nonaktif */}
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.cardTitle, { color: t.text }]}>Yang terjadi saat akun nonaktif</Text>
            {[
              { icon: 'eye-off-outline',       color: '#6B7280', label: 'Profil tidak dapat ditemukan oleh pengguna lain' },
              { icon: 'cube-outline',          color: '#3B82F6', label: 'Riwayat pesanan tetap tersimpan dengan aman' },
              { icon: 'pricetag-outline',      color: '#1A7A4A', label: 'Voucher aktif tetap tersimpan (tidak hangus)' },
              { icon: 'notifications-off-outline', color: '#F59E0B', label: 'Semua notifikasi akan dihentikan sementara' },
              { icon: 'log-in-outline',        color: '#1A7A4A', label: 'Akun langsung aktif kembali saat login ulang' },
            ].map((item, i) => (
              <View key={i} style={[styles.infoRow, i > 0 && { borderTopWidth: 1, borderColor: t.border }]}>
                <View style={[styles.infoIconBox, { backgroundColor: t.accent }]}>
                  <Ionicons name={item.icon as any} size={16} color={item.color} />
                </View>
                <Text style={[styles.infoText, { color: t.text }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Pilih Alasan */}
          <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.cardTitle, { color: t.text }]}>Alasan nonaktifkan akun</Text>
            <Text style={[styles.cardSub, { color: t.textSub }]}>Pilih satu alasan yang paling sesuai</Text>
            <View style={styles.reasonList}>
              {REASONS.map((r, i) => {
                const selected = selectedReason === r.label;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.reasonBtn,
                      {
                        borderColor:     selected ? '#F59E0B' : t.border,
                        backgroundColor: selected ? '#FFFBEB' : t.bg,
                      },
                    ]}
                    onPress={() => setSelectedReason(r.label)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.reasonIconBox, { backgroundColor: selected ? '#FEF3C7' : t.accent }]}>
                      <Ionicons name={r.icon as any} size={16} color={selected ? '#F59E0B' : t.textSub} />
                    </View>
                    <Text style={[styles.reasonText, { color: selected ? '#92400E' : t.text, fontWeight: selected ? '600' : '400' }]}>
                      {r.label}
                    </Text>
                    {selected
                      ? <Ionicons name="checkmark-circle" size={18} color="#F59E0B" />
                      : <View style={[styles.radioEmpty, { borderColor: t.border }]} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input jika alasan lainnya */}
            {isOther && (
              <View style={[styles.otherInputWrap, { borderColor: t.border, backgroundColor: t.bg }]}>
                <TextInput
                  style={[styles.otherInput, { color: t.text }]}
                  value={otherReason}
                  onChangeText={setOtherReason}
                  placeholder="Ceritakan alasanmu di sini..."
                  placeholderTextColor={t.textSub}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
                <Text style={[styles.charCount, { color: t.textSub }]}>{otherReason.length}/200</Text>
              </View>
            )}
          </View>

          {/* Checkbox Konfirmasi */}
          <TouchableOpacity
            style={[styles.checkRow, { backgroundColor: t.surface, borderColor: confirmed ? '#F59E0B' : t.border }]}
            onPress={() => setConfirmed(p => !p)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.checkbox,
              { borderColor: confirmed ? '#F59E0B' : t.border, backgroundColor: confirmed ? '#F59E0B' : 'transparent' },
            ]}>
              {confirmed && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={[styles.checkText, { color: t.textSub }]}>
              Saya mengerti akun saya akan dinonaktifkan sementara dan dapat diaktifkan kembali dengan login ulang.
            </Text>
          </TouchableOpacity>

          {/* Tombol */}
          <TouchableOpacity
            style={[
              styles.deactivateBtn,
              { backgroundColor: canSubmit ? '#F59E0B' : t.border, opacity: canSubmit ? 1 : 0.5 },
            ]}
            onPress={handleDeactivate}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Ionicons name="pause-circle-outline" size={20} color="#fff" />
            <Text style={styles.deactivateBtnText}>Nonaktifkan Akun Sementara</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={[styles.cancelBtnText, { color: t.textSub }]}>Batal, kembali ke pengaturan</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:         { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:       { fontSize: 18, fontWeight: '800' },
  pageSub:         { fontSize: 12, marginTop: 2 },
  headerIcon:      { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content:         { padding: 20, gap: 14, paddingBottom: 40 },
  infoBanner:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderWidth: 1, borderRadius: 14, padding: 14 },
  infoBannerText:  { flex: 1, fontSize: 13, lineHeight: 20 },
  card:            { borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardTitle:       { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  cardSub:         { fontSize: 12, marginBottom: 8, marginTop: -2 },
  infoRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  infoIconBox:     { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoText:        { flex: 1, fontSize: 13, lineHeight: 19 },
  reasonList:      { gap: 8, marginTop: 4 },
  reasonBtn:       { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 12 },
  reasonIconBox:   { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  reasonText:      { flex: 1, fontSize: 13, lineHeight: 19 },
  radioEmpty:      { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  otherInputWrap:  { borderWidth: 1.5, borderRadius: 12, padding: 12, marginTop: 8 },
  otherInput:      { fontSize: 13, lineHeight: 20, minHeight: 64 },
  charCount:       { fontSize: 10, textAlign: 'right', marginTop: 4 },
  checkRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  checkbox:        { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkText:       { flex: 1, fontSize: 13, lineHeight: 19 },
  deactivateBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, padding: 16 },
  deactivateBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cancelBtn:       { alignItems: 'center', paddingVertical: 8 },
  cancelBtnText:   { fontSize: 13 },
});
