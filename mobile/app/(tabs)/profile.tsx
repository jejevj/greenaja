import React from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const MENU: { label: string; icon: any; sub: string }[] = [
  { label: 'Pesanan Saya',      icon: 'cube-outline',             sub: 'Riwayat & status pesanan' },
  { label: 'Alamat',           icon: 'location-outline',          sub: 'Kelola alamat pengiriman'  },
  { label: 'Petani Favorit',   icon: 'heart-outline',             sub: '4 petani tersimpan'       },
  { label: 'Voucher',          icon: 'pricetag-outline',          sub: '2 voucher aktif'          },
  { label: 'Pengaturan',       icon: 'settings-outline',          sub: 'Notifikasi & akun'        },
  { label: 'Bantuan',          icon: 'help-circle-outline',       sub: 'FAQ & kontak kami'        },
];

export default function ProfileScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}
          >
            <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: t.text }]}>Profil</Text>
        </View>

        {/* Profile Card */}
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

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {[['12', 'Pesanan', 'cube-outline'], ['4', 'Favorit', 'heart-outline'], ['2', 'Voucher', 'pricetag-outline']].map(
            ([val, lbl, icon], i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={[styles.statDivider, { backgroundColor: t.border }]} />}
                <View style={styles.statItem}>
                  <Ionicons name={icon as any} size={18} color={t.primary} style={{ marginBottom: 6 }} />
                  <Text style={[styles.statVal, { color: t.text }]}>{val}</Text>
                  <Text style={[styles.statLbl, { color: t.textSub }]}>{lbl}</Text>
                </View>
              </React.Fragment>
            )
          )}
        </View>

        {/* Menu */}
        <View style={[styles.menuCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuRow,
                i < MENU.length - 1 && { borderBottomWidth: 1, borderColor: t.border },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: t.accent }]}>
                <Ionicons name={item.icon} size={18} color={t.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuLabel, { color: t.text }]}>{item.label}</Text>
                <Text style={[styles.menuSub, { color: t.textSub }]}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={18} color={t.textSub} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
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
  safe:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:      { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:    { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  profileCard:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, gap: 14, marginBottom: 12 },
  avatarBox:    { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: 20, fontWeight: '800' },
  userName:     { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  userEmail:    { fontSize: 12, marginBottom: 6 },
  memberBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  memberText:   { fontSize: 11, fontWeight: '700' },
  editBtn:      { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  statsCard:    { flexDirection: 'row', marginHorizontal: 20, borderRadius: 16, borderWidth: 1, paddingVertical: 18, marginBottom: 12 },
  statItem:     { flex: 1, alignItems: 'center' },
  statVal:      { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statLbl:      { fontSize: 11 },
  statDivider:  { width: 1, marginVertical: 8 },
  menuCard:     { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  menuRow:      { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIconBox:  { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel:    { fontSize: 14, fontWeight: '600', marginBottom: 1 },
  menuSub:      { fontSize: 12 },
  logoutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 15 },
  logoutText:   { fontSize: 14, fontWeight: '600' },
});
