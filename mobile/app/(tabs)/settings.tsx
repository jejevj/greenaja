import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, useColorScheme, Switch, Alert, TextInput, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT, DARK } from '../../constants/Theme';
import { useApp } from '../../context/AppContext';

// ── Toggle Row
function ToggleRow({
  icon, label, sub, value, onChange, t,
}: {
  icon: string; label: string; sub?: string;
  value: boolean; onChange: (v: boolean) => void;
  t: typeof LIGHT;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={[styles.toggleIcon, { backgroundColor: t.accent }]}>
        <Ionicons name={icon as any} size={18} color={t.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.toggleLabel, { color: t.text }]}>{label}</Text>
        {sub && <Text style={[styles.toggleSub, { color: t.textSub }]}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: t.border, true: t.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

// ── Delete Account Modal
function DeleteAccountModal({ onClose, t }: { onClose: () => void; t: typeof LIGHT }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const CONFIRM_WORD = 'HAPUS AKUN';

  const REASONS = [
    'Saya tidak lagi menggunakan aplikasi ini',
    'Saya memiliki akun lain',
    'Aplikasi tidak sesuai kebutuhan saya',
    'Masalah privasi & keamanan data',
    'Layanan tidak memuaskan',
    'Alasan lainnya',
  ];

  const handleFinalDelete = () => {
    if (confirmText.toUpperCase() !== CONFIRM_WORD) {
      Alert.alert('Konfirmasi salah', `Ketik "${CONFIRM_WORD}" untuk melanjutkan.`);
      return;
    }
    onClose();
    setTimeout(() => router.replace('/(auth)/login'), 300);
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={[styles.modalSheet, { backgroundColor: t.bg }]} onPress={() => {}}>
          <View style={[styles.dragHandle, { backgroundColor: t.border }]} />

          {/* Step 1 */}
          {step === 1 && (
            <ScrollView contentContainerStyle={styles.deleteContent} showsVerticalScrollIndicator={false}>
              <View style={styles.deleteIconWrap}>
                <View style={[styles.deleteIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="warning-outline" size={36} color="#EF4444" />
                </View>
              </View>
              <Text style={[styles.deleteTitle, { color: t.text }]}>Hapus Akun</Text>
              <Text style={[styles.deleteSub, { color: t.textSub }]}>
                Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Pastikan kamu sudah memahami konsekuensinya.
              </Text>
              <View style={[styles.warningCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                <Text style={[styles.warningTitle, { color: '#991B1B' }]}>Data yang akan dihapus secara permanen:</Text>
                {[
                  'Profil dan informasi akun kamu',
                  'Seluruh riwayat pesanan',
                  'Alamat pengiriman yang tersimpan',
                  'Voucher dan reward yang belum digunakan',
                  'Ulasan dan rating produk yang pernah diberikan',
                ].map((item, i) => (
                  <View key={i} style={styles.warningRow}>
                    <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                    <Text style={[styles.warningText, { color: '#7F1D1D' }]}>{item}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.warningCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                <Text style={[styles.warningTitle, { color: '#92400E' }]}>Alternatif sebelum hapus akun:</Text>
                {[
                  'Nonaktifkan notifikasi jika terlalu banyak',
                  'Ganti kata sandi jika akun dirasa tidak aman',
                  'Hubungi CS jika ada masalah layanan',
                ].map((item, i) => (
                  <View key={i} style={styles.warningRow}>
                    <Ionicons name="bulb-outline" size={14} color="#F59E0B" />
                    <Text style={[styles.warningText, { color: '#78350F' }]}>{item}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.deleteActions}>
                <TouchableOpacity style={[styles.cancelDeleteBtn, { borderColor: t.border }]} onPress={onClose}>
                  <Text style={[styles.cancelDeleteText, { color: t.text }]}>Batal, Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextDeleteBtn} onPress={() => setStep(2)}>
                  <Text style={styles.nextDeleteText}>Lanjutkan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <ScrollView contentContainerStyle={styles.deleteContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.deleteTitle, { color: t.text }]}>Alasan Penghapusan</Text>
              <Text style={[styles.deleteSub, { color: t.textSub }]}>Bantu kami berkembang. Apa alasanmu menghapus akun?</Text>
              <View style={{ gap: 8, width: '100%' }}>
                {REASONS.map((r, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.reasonBtn, { borderColor: reason === r ? '#EF4444' : t.border, backgroundColor: reason === r ? '#FEE2E2' : t.surface }]}
                    onPress={() => setReason(r)}
                  >
                    <View style={[styles.reasonRadio, { borderColor: reason === r ? '#EF4444' : t.border, backgroundColor: reason === r ? '#EF4444' : 'transparent' }]} />
                    <Text style={[styles.reasonText, { color: reason === r ? '#991B1B' : t.text }]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.deleteActions}>
                <TouchableOpacity style={[styles.cancelDeleteBtn, { borderColor: t.border }]} onPress={() => setStep(1)}>
                  <Ionicons name="arrow-back-outline" size={16} color={t.text} />
                  <Text style={[styles.cancelDeleteText, { color: t.text }]}>Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.nextDeleteBtn, !reason && { opacity: 0.4 }]} onPress={() => reason && setStep(3)} disabled={!reason}>
                  <Text style={styles.nextDeleteText}>Lanjutkan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <ScrollView contentContainerStyle={styles.deleteContent} showsVerticalScrollIndicator={false}>
              <View style={styles.deleteIconWrap}>
                <View style={[styles.deleteIconCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="trash-outline" size={36} color="#EF4444" />
                </View>
              </View>
              <Text style={[styles.deleteTitle, { color: t.text }]}>Konfirmasi Terakhir</Text>
              <Text style={[styles.deleteSub, { color: t.textSub }]}>
                Untuk memastikan kamu serius, ketik{' '}
                <Text style={{ fontWeight: '800', color: '#EF4444' }}>{CONFIRM_WORD}</Text>{' '}di bawah ini.
              </Text>
              <View style={[styles.confirmInputWrap, {
                borderColor: confirmText.toUpperCase() === CONFIRM_WORD ? '#EF4444' : t.border,
                backgroundColor: t.surface,
              }]}>
                <TextInput
                  style={[styles.confirmInput, { color: t.text }]}
                  value={confirmText}
                  onChangeText={setConfirmText}
                  placeholder={CONFIRM_WORD}
                  placeholderTextColor={t.textSub}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.deleteActions}>
                <TouchableOpacity style={[styles.cancelDeleteBtn, { borderColor: t.border }]} onPress={() => setStep(2)}>
                  <Ionicons name="arrow-back-outline" size={16} color={t.text} />
                  <Text style={[styles.cancelDeleteText, { color: t.text }]}>Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.finalDeleteBtn, confirmText.toUpperCase() !== CONFIRM_WORD && { opacity: 0.4 }]}
                  onPress={handleFinalDelete}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.finalDeleteText}>Hapus Akun Sekarang</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Main Screen
export default function SettingsScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { notifSettings, updateNotif } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: t.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Ionicons name="arrow-back-outline" size={20} color={t.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.pageTitle, { color: t.text }]}>Pengaturan</Text>
          <Text style={[styles.pageSub, { color: t.textSub }]}>Notifikasi & Akun</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Notifikasi Push */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="notifications-outline" size={18} color={t.primary} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: t.text }]}>Notifikasi Push</Text>
              <Text style={[styles.cardSub, { color: t.textSub }]}>Pesan langsung ke perangkatmu</Text>
            </View>
          </View>
          <ToggleRow icon="cube-outline" label="Update Pesanan"
            sub="Status pengiriman & konfirmasi pesanan"
            value={notifSettings.orderUpdate} onChange={v => updateNotif({ orderUpdate: v })} t={t} />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <ToggleRow icon="pricetag-outline" label="Promo & Voucher"
            sub="Diskon, voucher baru, dan flash sale"
            value={notifSettings.promo} onChange={v => updateNotif({ promo: v })} t={t} />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <ToggleRow icon="leaf-outline" label="Produk Baru"
            sub="Hasil panen terbaru dari petani GreenAja"
            value={notifSettings.newProduct} onChange={v => updateNotif({ newProduct: v })} t={t} />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <ToggleRow icon="star-outline" label="Pengingat Ulasan"
            sub="Ingatkan untuk memberi ulasan setelah terima pesanan"
            value={notifSettings.review} onChange={v => updateNotif({ review: v })} t={t} />
        </View>

        {/* Saluran Lain */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="mail-outline" size={18} color={t.primary} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: t.text }]}>Saluran Lain</Text>
              <Text style={[styles.cardSub, { color: t.textSub }]}>Email dan SMS</Text>
            </View>
          </View>
          <ToggleRow icon="mail-outline" label="Notifikasi Email"
            sub="Ringkasan pesanan & promo dikirim via email"
            value={notifSettings.emailNotif} onChange={v => updateNotif({ emailNotif: v })} t={t} />
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <ToggleRow icon="chatbubble-outline" label="Notifikasi SMS"
            sub="OTP dan konfirmasi via pesan SMS"
            value={notifSettings.smsNotif} onChange={v => updateNotif({ smsNotif: v })} t={t} />
        </View>

        {/* Keamanan Akun — hanya Ganti Kata Sandi */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="shield-outline" size={18} color={t.primary} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: t.text }]}>Keamanan Akun</Text>
              <Text style={[styles.cardSub, { color: t.textSub }]}>Kelola kata sandi akun kamu</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.menuBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/change-password')}
          >
            <View style={[styles.toggleIcon, { backgroundColor: t.accent }]}>
              <Ionicons name="key-outline" size={18} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: t.text }]}>Ganti Kata Sandi</Text>
              <Text style={[styles.toggleSub, { color: t.textSub }]}>Perbarui kata sandi secara berkala untuk keamanan akun</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color={t.primary} />
          </TouchableOpacity>
        </View>

        {/* Zona Berbahaya */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: '#FECACA' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Zona Berbahaya</Text>
              <Text style={[styles.cardSub, { color: t.textSub }]}>Tindakan permanen & tidak dapat dibatalkan</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.deactivateBtn]} activeOpacity={0.7}>
            <View style={[styles.toggleIcon, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="pause-circle-outline" size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: '#92400E' }]}>Nonaktifkan Akun Sementara</Text>
              <Text style={[styles.toggleSub, { color: t.textSub }]}>Akun dapat diaktifkan kembali kapan saja</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color={t.textSub} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: '#FECACA' }]} />
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8} onPress={() => setShowDeleteModal(true)}>
            <LinearGradient
              colors={['#DC2626', '#EF4444']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.deleteBtnGradient}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteBtnText}>Hapus Akun Secara Permanen</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} t={t} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1 },
  header:           { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:          { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:        { fontSize: 18, fontWeight: '800' },
  pageSub:          { fontSize: 12, marginTop: 2 },
  content:          { padding: 20, gap: 14, paddingBottom: 40 },
  card:             { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
  cardHeader:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingBottom: 12 },
  cardIconBox:      { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle:        { fontSize: 14, fontWeight: '700' },
  cardSub:          { fontSize: 12, marginTop: 2 },
  divider:          { height: 1, marginHorizontal: 14 },
  toggleRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  toggleIcon:       { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toggleLabel:      { fontSize: 14, fontWeight: '600' },
  toggleSub:        { fontSize: 12, marginTop: 1 },
  menuBtn:          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  deactivateBtn:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  deleteBtn:        { margin: 14, marginTop: 12, borderRadius: 12, overflow: 'hidden' },
  deleteBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  deleteBtnText:    { flex: 1, fontSize: 14, fontWeight: '700', color: '#fff' },
  modalBackdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet:       { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  dragHandle:       { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  deleteContent:    { padding: 20, gap: 14, alignItems: 'center', paddingBottom: 36 },
  deleteIconWrap:   { marginTop: 4 },
  deleteIconCircle: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  deleteTitle:      { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  deleteSub:        { fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: -4 },
  warningCard:      { width: '100%', borderWidth: 1, borderRadius: 14, padding: 14, gap: 8 },
  warningTitle:     { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  warningRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  warningText:      { flex: 1, fontSize: 12, lineHeight: 18 },
  deleteActions:    { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  cancelDeleteBtn:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 14, paddingVertical: 13 },
  cancelDeleteText: { fontSize: 14, fontWeight: '600' },
  nextDeleteBtn:    { flex: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EF4444', borderRadius: 14, paddingVertical: 13 },
  nextDeleteText:   { fontSize: 14, fontWeight: '700', color: '#fff' },
  finalDeleteBtn:   { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#DC2626', borderRadius: 14, paddingVertical: 13 },
  finalDeleteText:  { fontSize: 14, fontWeight: '700', color: '#fff' },
  reasonBtn:        { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  reasonRadio:      { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  reasonText:       { flex: 1, fontSize: 13, lineHeight: 19 },
  confirmInputWrap: { width: '100%', borderWidth: 2, borderRadius: 12, paddingHorizontal: 16, height: 52, justifyContent: 'center' },
  confirmInput:     { fontSize: 18, fontWeight: '800', letterSpacing: 1, textAlign: 'center' },
});
