import React from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const {
    orders,
    activeOrderCount, needReviewCount,
    hasAddress, addresses,
    activeVoucherCount,
  } = useApp();

  type MenuBadge = { count?: number; alert?: boolean } | null;

  const MENU: { label: string; icon: any; sub: string; route?: string; badge: MenuBadge }[] = [
    {
      label: 'Pesanan Saya', icon: 'cube-outline', route: '/(tabs)/orders',
      sub: activeOrderCount > 0
        ? `${activeOrderCount} pesanan sedang diproses`
        : needReviewCount > 0
        ? `${needReviewCount} pesanan menunggu ulasan`
        : 'Riwayat & status pesanan',
      badge: activeOrderCount > 0
        ? { count: activeOrderCount }
        : needReviewCount > 0
        ? { count: needReviewCount }
        : null,
    },
    {
      label: 'Alamat', icon: 'location-outline', route: '/(tabs)/address',
      sub: hasAddress ? `${addresses.length} alamat tersimpan` : 'Belum ada alamat, tambahkan sekarang',
      badge: !hasAddress ? { alert: true } : null,
    },
    {
      label: 'Voucher', icon: 'pricetag-outline', route: '/(tabs)/vouchers',
      sub: activeVoucherCount > 0 ? `${activeVoucherCount} voucher aktif` : 'Tidak ada voucher aktif',
      badge: activeVoucherCount > 0 ? { count: activeVoucherCount } : null,
    },
    {
      label: 'Pengaturan', icon: 'settings-outline',
      sub: 'Notifikasi & akun',
      badge: null,
    },
    {
      label: 'Bantuan', icon: 'help-circle-outline',
      sub: 'FAQ & kontak kami',
      badge: null,
    },
  ];

  const totalBadge = MENU.reduce((sum, m) => sum + (m.badge?.count ?? 0), 0)
    + (MENU.some(m => m.badge?.alert) ? 1 : 0);

  // Stats row: Pesanan | Alamat | Voucher
  const STATS = [
    { val: String(orders.length),         lbl: 'Pesanan', icon: 'cube-outline',     route: '/(tabs)/orders' },
    { val: String(addresses.length),      lbl: 'Alamat',  icon: 'location-outline', route: '/(tabs)/address' },
    { val: String(activeVoucherCount),    lbl: 'Voucher', icon: 'pricetag-outline', route: '/(tabs)/vouchers' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}
          >
            <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pageTitle, { color: t.text }]}>Profil</Text>
          </View>
          {totalBadge > 0 && (
            <View style={[styles.headerBadgeWrap, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}>
              <Ionicons name="notifications-outline" size={13} color={t.primary} />
              <Text style={[styles.headerBadgeText, { color: t.primary }]}>{totalBadge} notifikasi</Text>
            </View>
          )}
        </View>

        <View style={[styles.profileCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={[styles.avatarBox, { backgroundColor: t.primaryMuted }]}>
            <Text style={[styles.avatarText, { color: t.primary }]}>GA</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: t.text }]}>GreenAja User</Text>
            <Text style={[styles.userEmail, { color: t.textSub }]}>user@greenaja.id</Text>
            <View style={[styles.memberBadge, { backgroundColor: t.primaryMuted }]}>
              <Ionicons name="shield-checkmark-outline" size={12} color={t.primary} />
              <Text style={[styles.memberText, { color: t.primary }]}>Member Aktif</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editBtn, { borderColor: t.border }]}>
            <Ionicons name="pencil-outline" size={16} color={t.textSub} />
          </TouchableOpacity>
        </View>

        <View style={[styles.statsCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {STATS.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={[styles.statDivider, { backgroundColor: t.border }]} />}
              <TouchableOpacity
                style={styles.statItem}
                onPress={() => s.route ? router.push(s.route as any) : undefined}
                activeOpacity={s.route ? 0.7 : 1}
              >
                <Ionicons name={s.icon as any} size={18} color={t.primary} style={{ marginBottom: 6 }} />
                <Text style={[styles.statVal, { color: t.text }]}>{s.val}</Text>
                <Text style={[styles.statLbl, { color: t.textSub }]}>{s.lbl}</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <View style={[styles.menuCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {MENU.map((item, i) => {
            const hasCount = (item.badge?.count ?? 0) > 0;
            const hasAlert = item.badge?.alert === true;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.menuRow,
                  i < MENU.length - 1 && { borderBottomWidth: 1, borderColor: t.border },
                ]}
                activeOpacity={0.7}
                onPress={() => item.route ? router.push(item.route as any) : undefined}
              >
                <View style={[styles.menuIconBox, { backgroundColor: hasAlert ? '#FEE2E2' : t.accent }]}>
                  <Ionicons name={item.icon} size={18} color={hasAlert ? '#EF4444' : t.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuLabel, { color: t.text }]}>{item.label}</Text>
                  <Text style={[styles.menuSub, {
                    color: hasAlert ? '#EF4444' : t.textSub,
                    fontWeight: (hasAlert || hasCount) ? '600' : '400',
                  }]}>{item.sub}</Text>
                </View>
                {hasCount && (
                  <View style={[styles.menuBadge, { backgroundColor: t.primary }]}>
                    <Text style={styles.menuBadgeText}>{item.badge!.count! > 9 ? '9+' : item.badge!.count}</Text>
                  </View>
                )}
                {hasAlert && !hasCount && (
                  <View style={[styles.menuBadge, { backgroundColor: '#EF4444' }]}>
                    <Text style={styles.menuBadgeText}>!</Text>
                  </View>
                )}
                <Ionicons
                  name="chevron-forward-outline"
                  size={18}
                  color={hasAlert ? '#EF4444' : item.route ? t.primary : t.textSub}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: t.surface, borderColor: t.border }]}
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={t.danger} />
          <Text style={[styles.logoutText, { color: t.danger }]}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:         { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:       { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  headerBadgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  headerBadgeText: { fontSize: 12, fontWeight: '700' },
  profileCard:     { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, gap: 14, marginBottom: 12 },
  avatarBox:       { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText:      { fontSize: 20, fontWeight: '800' },
  userName:        { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  userEmail:       { fontSize: 12, marginBottom: 6 },
  memberBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  memberText:      { fontSize: 11, fontWeight: '700' },
  editBtn:         { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  statsCard:       { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, paddingVertical: 18, marginBottom: 12 },
  statItem:        { flex: 1, alignItems: 'center' },
  statVal:         { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statLbl:         { fontSize: 11 },
  statDivider:     { width: 1, marginVertical: 8 },
  menuCard:        { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  menuRow:         { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIconBox:     { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel:       { fontSize: 14, fontWeight: '600', marginBottom: 1 },
  menuSub:         { fontSize: 12 },
  menuBadge:       { minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  menuBadgeText:   { fontSize: 11, fontWeight: '800', color: '#fff' },
  logoutBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 15 },
  logoutText:      { fontSize: 14, fontWeight: '600' },
});
