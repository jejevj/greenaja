import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Avatar, Colors } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const MENU_ITEMS = [
  { label: 'Edit Profil', icon: '👤' },
  { label: 'Riwayat Aktivitas', icon: '📋' },
  { label: 'Pengaturan', icon: '⚙️' },
  { label: 'Bantuan', icon: '❓' },
];

export default function ProfileScreen() {
  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header} center>
          <Avatar
            size={80}
            label="GA"
            backgroundColor="#4caf50"
            containerStyle={{ marginBottom: 12 }}
          />
          <Text style={styles.userName}>GreenAja User</Text>
          <Text style={styles.userLevel}>Level: Penjaga Bumi 🌍</Text>
        </View>

        <View style={styles.statsRow} row spread padding-20>
          <View center>
            <Text text40 color="#1a7a4a">248</Text>
            <Text text80 color={Colors.grey40}>Total Poin</Text>
          </View>
          <View center>
            <Text text40 color="#1a7a4a">12</Text>
            <Text text80 color={Colors.grey40}>Tantangan</Text>
          </View>
          <View center>
            <Text text40 color="#1a7a4a">5</Text>
            <Text text80 color={Colors.grey40}>Badge</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem}>
              <View row centerV>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <View row centerV>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuLabel, styles.logoutText]}>Keluar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f9f6' },
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: '#1a7a4a',
    paddingTop: 32,
    paddingBottom: 28,
  },
  userName: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  userLevel: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  statsRow: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menu: { backgroundColor: '#ffffff', margin: 16, borderRadius: 14, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { fontSize: 15, color: '#1a1a1a' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  logoutItem: { borderBottomWidth: 0 },
  logoutText: { color: '#e53935' },
});
