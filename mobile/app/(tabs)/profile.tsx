import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const MENU = [
  { label: 'Edit Profil', icon: '👤', sub: 'Ubah informasi akun' },
  { label: 'Riwayat Aktivitas', icon: '📋', sub: 'Lihat semua aktivitas' },
  { label: 'Pengaturan', icon: '⚙️', sub: 'Notifikasi & preferensi' },
  { label: 'Bantuan', icon: '❓', sub: 'FAQ & kontak support' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>GA</Text>
          </View>
          <Text style={styles.userName}>GreenAja User</Text>
          <Text style={styles.userLevel}>Level: Penjaga Bumi 🌍</Text>
        </LinearGradient>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          {[['248', 'Total Poin'], ['12', 'Tantangan'], ['5', 'Badge']].map(([val, lbl], i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={styles.vDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statVal}>{val}</Text>
                <Text style={styles.statLbl}>{lbl}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < MENU.length - 1 && styles.menuBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.logoutText}>🚪 Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { paddingBottom: 32 },
  header: { alignItems: 'center', paddingTop: 36, paddingBottom: 36 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  userLevel: { fontSize: 13, color: 'rgba(255,255,255,0.72)' },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 18,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', color: '#1a7a4a' },
  statLbl: { fontSize: 12, color: '#aaa', marginTop: 2 },
  vDivider: { width: 1, height: 36, backgroundColor: '#f0f0f0', alignSelf: 'center' },
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f0f9f4',
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  menuSub: { fontSize: 12, color: '#aaa', marginTop: 1 },
  menuArrow: { fontSize: 20, color: '#ccc' },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffebee',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#e53935' },
});
