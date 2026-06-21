import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Avatar, Colors } from 'react-native-ui-lib';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header} center>
        <Avatar
          size={80}
          label="GA"
          backgroundColor="#4caf50"
          containerStyle={{ marginBottom: 12 }}
        />
        <Text text40 color={Colors.white} marginB-4>GreenAja User</Text>
        <Text text70 color={Colors.white70}>Level: Penjaga Bumi</Text>
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
        {['Edit Profil', 'Riwayat Aktivitas', 'Pengaturan', 'Bantuan', 'Keluar'].map((item, i) => (
          <View key={i} style={styles.menuItem} row spread centerV>
            <Text text65>{item}</Text>
            <Text text70 color={Colors.grey40}>›</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: '#1a7a4a',
    paddingTop: 56,
    paddingBottom: 32,
  },
  statsRow: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menu: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});
