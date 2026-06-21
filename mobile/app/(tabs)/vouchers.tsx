import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, useColorScheme, Modal,
  Pressable, Share, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import { useApp, Voucher } from '../../context/AppContext';

type Tab = 'active' | 'used' | 'expired';

const TYPE_META: Record<string, { icon: string; label: string; colors: [string, string] }> = {
  percent: { icon: 'pricetag-outline',  label: 'Diskon %',   colors: ['#1A7A4A', '#2A9960'] },
  flat:    { icon: 'cash-outline',      label: 'Potongan Rp', colors: ['#0D6E8A', '#1A9DBF'] },
  ongkir:  { icon: 'bicycle-outline',  label: 'Gratis Ongkir', colors: ['#7A4A1A', '#BF7A2A'] },
};

function formatValue(v: Voucher) {
  if (v.type === 'ongkir') return 'GRATIS ONGKIR';
  if (v.type === 'percent') return `${v.value}% OFF`;
  return `Rp ${v.value.toLocaleString('id-ID')}`;
}

function formatMinPurchase(v: Voucher) {
  if (v.minPurchase === 0) return 'Tanpa minimum';
  return `Min. Rp ${v.minPurchase.toLocaleString('id-ID')}`;
}

// ── Detail Modal ────────────────────────────────────────────────────────────
function VoucherDetailModal({
  voucher, onClose, t,
}: { voucher: Voucher; onClose: () => void; t: typeof LIGHT }) {
  const meta = TYPE_META[voucher.type];
  const isActive = voucher.status === 'active';

  const handleCopy = () => {
    Alert.alert('✓ Disalin!', `Kode voucher "${voucher.code}" berhasil disalin.`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Gunakan kode voucher GreenAja: ${voucher.code}\n${voucher.title}\n${voucher.description}`,
        title: 'Voucher GreenAja',
      });
    } catch (_) {}
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={[styles.modalSheet, { backgroundColor: t.bg }]} onPress={() => {}}>

          {/* Drag handle */}
          <View style={[styles.dragHandle, { backgroundColor: t.border }]} />

          {/* Gradient header */}
          <LinearGradient
            colors={isActive ? meta.colors : ['#9CA3AF', '#6B7280']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.modalGradient}
          >
            <View style={styles.modalDecoCircle} />
            <View style={styles.modalDecoCircle2} />
            <View style={styles.modalGradTop}>
              <View style={[styles.modalTypeChip, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name={meta.icon as any} size={13} color="#fff" />
                <Text style={styles.modalTypeText}>{meta.label}</Text>
              </View>
              {!isActive && (
                <View style={[styles.modalTypeChip, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
                  <Text style={styles.modalTypeText}>
                    {voucher.status === 'used' ? 'TERPAKAI' : 'KADALUARSA'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.modalValue}>{formatValue(voucher)}</Text>
            <Text style={styles.modalTitle}>{voucher.title}</Text>
          </LinearGradient>

          {/* Code box */}
          <View style={[styles.codeRow, { backgroundColor: t.surface, borderColor: isActive ? t.primary : t.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.codeLabel, { color: t.textSub }]}>Kode Voucher</Text>
              <Text style={[styles.codeValue, { color: isActive ? t.primary : t.textSub, letterSpacing: 2 }]}>
                {voucher.code}
              </Text>
            </View>
            {isActive && (
              <TouchableOpacity
                style={[styles.copyBtn, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}
                onPress={handleCopy}
              >
                <Ionicons name="copy-outline" size={16} color={t.primary} />
                <Text style={[styles.copyBtnText, { color: t.primary }]}>Salin</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Detail rows */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Description */}
            <View style={[styles.detailCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text style={[styles.detailSectionTitle, { color: t.text }]}>Deskripsi</Text>
              <Text style={[styles.detailDesc, { color: t.textSub }]}>{voucher.description}</Text>
            </View>

            {/* Info rows */}
            <View style={[styles.detailCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text style={[styles.detailSectionTitle, { color: t.text }]}>Detail Voucher</Text>
              {[
                { icon: 'cash-outline',          label: 'Minimum Pembelian', val: formatMinPurchase(voucher) },
                ...(voucher.maxDiscount ? [{ icon: 'trending-down-outline', label: 'Maks. Diskon', val: `Rp ${voucher.maxDiscount.toLocaleString('id-ID')}` }] : []),
                { icon: 'calendar-outline',      label: 'Berlaku Hingga',    val: voucher.expiry },
                ...(voucher.usedAt ? [{ icon: 'checkmark-circle-outline', label: 'Digunakan Pada', val: voucher.usedAt }] : []),
              ].map((row, i) => (
                <View key={i} style={[styles.detailRow, i > 0 && { borderTopWidth: 1, borderColor: t.border }]}>
                  <View style={[styles.detailIconBox, { backgroundColor: t.accent }]}>
                    <Ionicons name={row.icon as any} size={14} color={t.primary} />
                  </View>
                  <Text style={[styles.detailRowLabel, { color: t.textSub }]}>{row.label}</Text>
                  <Text style={[styles.detailRowVal, { color: t.text }]}>{row.val}</Text>
                </View>
              ))}
            </View>

            {/* Syarat & Ketentuan */}
            <View style={[styles.detailCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Text style={[styles.detailSectionTitle, { color: t.text }]}>Syarat & Ketentuan</Text>
              {[
                'Voucher hanya berlaku satu kali pakai per akun.',
                'Tidak dapat digabungkan dengan promo lain.',
                'Berlaku untuk produk yang tertera di deskripsi.',
                'GreenAja berhak membatalkan voucher jika terdapat indikasi penyalahgunaan.',
              ].map((s, i) => (
                <View key={i} style={styles.snkRow}>
                  <View style={[styles.snkDot, { backgroundColor: t.primary }]} />
                  <Text style={[styles.snkText, { color: t.textSub }]}>{s}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Action buttons */}
          {isActive && (
            <View style={[styles.modalActions, { borderTopColor: t.border, backgroundColor: t.bg }]}>
              <TouchableOpacity
                style={[styles.shareBtn, { borderColor: t.border }]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={18} color={t.text} />
                <Text style={[styles.shareBtnText, { color: t.text }]}>Bagikan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.useVoucherBtn}
                onPress={() => { onClose(); router.push('/(tabs)/cart'); }}
              >
                <LinearGradient
                  colors={['#1A7A4A', '#2A9960']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.useVoucherGradient}
                >
                  <Ionicons name="bag-check-outline" size={18} color="#fff" />
                  <Text style={styles.useVoucherText}>Pakai Sekarang</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          {!isActive && (
            <View style={[styles.modalActions, { borderTopColor: t.border, backgroundColor: t.bg }]}>
              <TouchableOpacity
                style={[styles.closeModalBtn, { borderColor: t.border }]}
                onPress={onClose}
              >
                <Text style={[styles.closeModalText, { color: t.text }]}>Tutup</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Voucher Card ─────────────────────────────────────────────────────────────
function VoucherCard({
  voucher, onPress, t,
}: { voucher: Voucher; onPress: () => void; t: typeof LIGHT }) {
  const meta    = TYPE_META[voucher.type];
  const isActive = voucher.status === 'active';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, { backgroundColor: t.surface, borderColor: isActive ? t.primary : t.border, opacity: isActive ? 1 : 0.65 }]}
    >
      {/* Left gradient strip */}
      <LinearGradient
        colors={isActive ? meta.colors : ['#9CA3AF', '#6B7280']}
        style={styles.cardStrip}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      >
        <Ionicons name={meta.icon as any} size={20} color="rgba(255,255,255,0.9)" />
      </LinearGradient>

      {/* Punched hole decoration */}
      <View style={[styles.holeTop, { backgroundColor: t.bg }]} />
      <View style={[styles.holeBottom, { backgroundColor: t.bg }]} />

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={[styles.cardValue, { color: isActive ? t.primary : t.textSub }]}>
            {formatValue(voucher)}
          </Text>
          {voucher.status === 'used' && (
            <View style={[styles.statusChip, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.statusText, { color: '#6B7280' }]}>Terpakai</Text>
            </View>
          )}
          {voucher.status === 'expired' && (
            <View style={[styles.statusChip, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.statusText, { color: '#EF4444' }]}>Kadaluarsa</Text>
            </View>
          )}
        </View>
        <Text style={[styles.cardTitle, { color: t.text }]} numberOfLines={1}>{voucher.title}</Text>
        <Text style={[styles.cardMin, { color: t.textSub }]}>{formatMinPurchase(voucher)}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardExpiryRow}>
            <Ionicons name="calendar-outline" size={11} color={t.textSub} />
            <Text style={[styles.cardExpiry, { color: t.textSub }]}>s/d {voucher.expiry}</Text>
          </View>
          <View style={[styles.codeChip, { backgroundColor: isActive ? t.primaryMuted : t.accent }]}>
            <Text style={[styles.codeChipText, { color: isActive ? t.primary : t.textSub }]}>
              {voucher.code}
            </Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" size={16} color={t.textSub} style={{ marginRight: 14 }} />
    </TouchableOpacity>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function VouchersScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { vouchers, activeVoucherCount } = useApp();
  const [activeTab,      setActiveTab]      = useState<Tab>('active');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const filtered = vouchers.filter(v => v.status === activeTab);

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'active',  label: 'Aktif',      count: vouchers.filter(v => v.status === 'active').length },
    { key: 'used',    label: 'Terpakai',   count: vouchers.filter(v => v.status === 'used').length },
    { key: 'expired', label: 'Kadaluarsa', count: vouchers.filter(v => v.status === 'expired').length },
  ];

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
          <Text style={[styles.pageTitle, { color: t.text }]}>Voucher Saya</Text>
          <Text style={[styles.pageSub, { color: t.textSub }]}>
            {activeVoucherCount} voucher aktif tersedia
          </Text>
        </View>
        <View style={[styles.headerBadge, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}>
          <Ionicons name="pricetag-outline" size={13} color={t.primary} />
          <Text style={[styles.headerBadgeText, { color: t.primary }]}>{activeVoucherCount}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: t.border }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { borderBottomWidth: 2.5, borderBottomColor: t.primary },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.key ? t.primary : t.textSub, fontWeight: activeTab === tab.key ? '700' : '500' },
            ]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={[styles.tabBadge, {
                backgroundColor: activeTab === tab.key ? t.primary : t.border,
              }]}>
                <Text style={[styles.tabBadgeText, {
                  color: activeTab === tab.key ? '#fff' : t.textSub,
                }]}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.emptyListContent,
        ]}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={[styles.emptyIconBox, { backgroundColor: t.accent }]}>
              <Ionicons name="pricetag-outline" size={36} color={t.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: t.text }]}>
              Tidak ada voucher {activeTab === 'active' ? 'aktif' : activeTab === 'used' ? 'terpakai' : 'kadaluarsa'}
            </Text>
            <Text style={[styles.emptySub, { color: t.textSub }]}>
              {activeTab === 'active' ? 'Pantau terus promo GreenAja untuk voucher terbaru!' : 'Voucher yang sudah tidak aktif akan muncul di sini.'}
            </Text>
          </View>
        ) : (
          filtered.map(v => (
            <VoucherCard
              key={v.id}
              voucher={v}
              t={t}
              onPress={() => setSelectedVoucher(v)}
            />
          ))
        )}
      </ScrollView>

      {selectedVoucher && (
        <VoucherDetailModal
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
          t={t}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:               { flex: 1 },
  header:             { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:            { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:          { fontSize: 18, fontWeight: '800' },
  pageSub:            { fontSize: 12, marginTop: 2 },
  headerBadge:        { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  headerBadgeText:    { fontSize: 13, fontWeight: '800' },
  // tabs
  tabRow:             { flexDirection: 'row', borderBottomWidth: 1 },
  tab:                { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 13 },
  tabText:            { fontSize: 13 },
  tabBadge:           { minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabBadgeText:       { fontSize: 10, fontWeight: '700' },
  // list
  listContent:        { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 12 },
  emptyListContent:   { flexGrow: 1, justifyContent: 'center' },
  emptyWrap:          { alignItems: 'center', gap: 12, paddingVertical: 60, paddingHorizontal: 20 },
  emptyIconBox:       { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle:         { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptySub:           { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  // card
  card:               { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 16, overflow: 'hidden' },
  cardStrip:          { width: 52, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  holeTop:            { position: 'absolute', left: 40, top: -10, width: 20, height: 20, borderRadius: 10 },
  holeBottom:         { position: 'absolute', left: 40, bottom: -10, width: 20, height: 20, borderRadius: 10 },
  cardContent:        { flex: 1, paddingVertical: 14, paddingLeft: 14, paddingRight: 4, gap: 3 },
  cardTop:            { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardValue:          { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  statusChip:         { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  statusText:         { fontSize: 10, fontWeight: '700' },
  cardTitle:          { fontSize: 13, fontWeight: '600' },
  cardMin:            { fontSize: 11 },
  cardFooter:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  cardExpiryRow:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardExpiry:         { fontSize: 11 },
  codeChip:           { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  codeChipText:       { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  // modal
  modalBackdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet:         { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%', overflow: 'hidden' },
  dragHandle:         { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 0 },
  modalGradient:      { margin: 16, borderRadius: 16, padding: 20, overflow: 'hidden', marginBottom: 0 },
  modalDecoCircle:    { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)', top: -40, right: -20 },
  modalDecoCircle2:   { position: 'absolute', width: 80,  height: 80,  borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.06)', bottom: -20, right: 50 },
  modalGradTop:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  modalTypeChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  modalTypeText:      { fontSize: 11, fontWeight: '700', color: '#fff' },
  modalValue:         { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 4 },
  modalTitle:         { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  codeRow:            { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderWidth: 1.5, borderRadius: 12, padding: 14 },
  codeLabel:          { fontSize: 11, marginBottom: 2 },
  codeValue:          { fontSize: 16, fontWeight: '800' },
  copyBtn:            { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  copyBtnText:        { fontSize: 13, fontWeight: '700' },
  detailCard:         { borderWidth: 1, borderRadius: 14, padding: 14, gap: 0 },
  detailSectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  detailDesc:         { fontSize: 13, lineHeight: 20 },
  detailRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  detailIconBox:      { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  detailRowLabel:     { flex: 1, fontSize: 13 },
  detailRowVal:       { fontSize: 13, fontWeight: '600' },
  snkRow:             { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  snkDot:             { width: 5, height: 5, borderRadius: 3, marginTop: 6 },
  snkText:            { flex: 1, fontSize: 12, lineHeight: 18 },
  modalActions:       { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 28, borderTopWidth: 1 },
  shareBtn:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderRadius: 14, paddingVertical: 13 },
  shareBtnText:       { fontSize: 14, fontWeight: '600' },
  useVoucherBtn:      { flex: 2, borderRadius: 14, overflow: 'hidden' },
  useVoucherGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  useVoucherText:     { fontSize: 14, fontWeight: '700', color: '#fff' },
  closeModalBtn:      { flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 14, paddingVertical: 13 },
  closeModalText:     { fontSize: 14, fontWeight: '600' },
});
