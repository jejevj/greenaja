import React from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const MENU = [
  { label: 'Pesanan Saya',       icon: '📦', sub: 'Riwayat & status pesanan' },
  { label: 'Alamat Pengiriman',  icon: '📍', sub: 'Kelola alamat favorit' },
  { label: 'Petani Favorit',     icon: '❤️',  sub: '4 petani tersimpan' },
  { label: 'Voucher & Promo',    icon: '🎁', sub: '2 voucher aktif' },
  { label: 'Pengaturan',         icon: '⚙️',  sub: 'Notifikasi & akun' },
  { label: 'Bantuan',            icon: '❓', sub: 'FAQ & hubungi kami' },
];

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const bg    = dark ? '#0f1a14' : '#f4f9f6';
  const card  = dark ? '#1c2e22' : '#ffffff';
  const txt   = dark ? '#e8f5e9' : '#1a1a1a';
  const muted = dark ? '#7aab87' : '#888';
  const borderCol = dark ? '#2a4030' : '#efefef';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: txt }]}>← Kembali</Text>
        </TouchableOpacity>

        {/* Profile Card */}
        <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>GA</Text>
          </View>
          <Text style={styles.userName}>GreenAja User</Text>
          <Text style={styles.userSub}>Bergabung sejak Juni 2026 · Member Aktif</Text>

          <View style={styles.statsRow}>
            {[['12', 'Pesanan'], ['4', 'Favorit'], ['2', 'Voucher']].map(([val, lbl], i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.vDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{val}</Text>
                  <Text style={styles.statLbl}>{lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </LinearGradient>

        {/* Menu Card */}
        <View style={[styles.menuCard, { backgroundColor: card, borderColor: borderCol }]}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuItem,
                i < MENU.length - 1 && { borderBottomWidth: 1, borderColor: borderCol },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: dark ? '#22382a' : '#f0f9f4' }]}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuLabel, { color: txt }]}>{item.label}</Text>
                <Text style={[styles.menuSub, { color: muted }]}>{item.sub}</Text>
              </View>
              <Text style={[styles.menuArrow, { color: muted }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: dark ? '#4a2020' : '#ffebee' }]}
          activeOpacity={0.8}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutText}>🚪 Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  backBtn:      { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  backText:     { fontSize: 14, fontWeight: '500' },
  profileCard:  { marginHorizontal: 16, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:   { fontSize: 24, fontWeight: '800', color: '#fff' },
  userName:     { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  userSub:      { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 20, textAlign: 'center' },
  statsRow:     { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14, paddingVertical: 14, width: '100%' },
  statItem:     { flex: 1, alignItems: 'center' },
  statVal:      { fontSize: 20, fontWeight: '800', color: '#fff' },
  statLbl:      { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  vDivider:     { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center' },
  menuCard:     { marginHorizontal: 16, borderRadius: 18, borderWidth: 1.5, overflow: 'hidden', marginBottom: 16 },
  menuItem:     { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuIconBox:  { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel:    { fontSize: 15, fontWeight: '600' },
  menuSub:      { fontSize: 12, marginTop: 1 },
  menuArrow:    { fontSize: 22 },
  logoutBtn:    { marginHorizontal: 16, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5 },
  logoutText:   { fontSize: 15, fontWeight: '600', color: '#e53935' },
});
