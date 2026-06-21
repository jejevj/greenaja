import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Avatar, Card, Colors, ListItem } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const MENU = [
  { label: 'Edit Profil', icon: '👤' },
  { label: 'Riwayat Aktivitas', icon: '📋' },
  { label: 'Pengaturan', icon: '⚙️' },
  { label: 'Bantuan', icon: '❓' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header} center>
          <Avatar size={80} label="GA" backgroundColor={Colors.lightGreen} marginB-12 />
          <Text heading color={Colors.white}>GreenAja User</Text>
          <Text caption color="rgba(255,255,255,0.75)" marginT-4>
            Level: Penjaga Bumi 🌍
          </Text>
        </View>

        {/* Stats */}
        <Card style={styles.statsCard} row spread padding-20>
          <View center>
            <Text style={styles.statNum}>248</Text>
            <Text caption color={Colors.textMuted}>Total Poin</Text>
          </View>
          <View style={styles.vDivider} />
          <View center>
            <Text style={styles.statNum}>12</Text>
            <Text caption color={Colors.textMuted}>Tantangan</Text>
          </View>
          <View style={styles.vDivider} />
          <View center>
            <Text style={styles.statNum}>5</Text>
            <Text caption color={Colors.textMuted}>Badge</Text>
          </View>
        </Card>

        {/* Menu */}
        <Card style={styles.menuCard} marginH-16>
          {MENU.map((item, i) => (
            <ListItem
              key={i}
              height={54}
              onPress={() => {}}
              style={i < MENU.length - 1 ? styles.menuBorder : undefined}
            >
              <ListItem.Part left>
                <Text style={styles.icon}>{item.icon}</Text>
              </ListItem.Part>
              <ListItem.Part middle>
                <Text body>{item.label}</Text>
              </ListItem.Part>
              <ListItem.Part right>
                <Text style={styles.arrow}>›</Text>
              </ListItem.Part>
            </ListItem>
          ))}

          {/* Logout */}
          <ListItem height={54} onPress={() => router.replace('/(auth)/login')}>
            <ListItem.Part left>
              <Text style={styles.icon}>🚪</Text>
            </ListItem.Part>
            <ListItem.Part middle>
              <Text body color={Colors.error}>Keluar</Text>
            </ListItem.Part>
          </ListItem>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgLight },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: Colors.primaryGreen,
    paddingTop: 32,
    paddingBottom: 28,
  },
  statsCard: {
    marginHorizontal: 16,
    marginTop: -1,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  statNum: { fontSize: 22, fontWeight: '700', color: Colors.primaryGreen },
  vDivider: { width: 1, height: 36, backgroundColor: '#f0f0f0' },
  menuCard: { borderRadius: 14, backgroundColor: Colors.white, marginTop: 16, overflow: 'hidden' },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  icon: { fontSize: 18, marginHorizontal: 16 },
  arrow: { fontSize: 20, color: '#ccc', marginRight: 12 },
});
