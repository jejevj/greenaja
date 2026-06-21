import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT = [
  { title: 'Naik sepeda ke kantor', pts: '+10 poin', icon: '🚴' },
  { title: 'Daur ulang plastik', pts: '+8 poin', icon: '♻️' },
  { title: 'Tanam pohon', pts: '+20 poin', icon: '🌳' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Selamat datang 👋</Text>
              <Text style={styles.userName}>GreenAja User</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>GA</Text>
            </View>
          </View>

          {/* Stats inside header */}
          <View style={styles.statsRow}>
            {[['12', 'Aktivitas'], ['3.2kg', 'CO₂ Hemat'], ['85', 'Poin']].map(([val, lbl], i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statVal}>{val}</Text>
                <Text style={styles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>📝</Text>
                <Text style={styles.actionLabel}>Catat{`\n`}Aktivitas</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient colors={['#f9a825', '#f4b942']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>🏆</Text>
                <Text style={styles.actionLabel}>Tantangan</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient colors={['#0288d1', '#0299e6']} style={styles.actionGradient}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionLabel}>Statistik</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          {RECENT.map((item, i) => (
            <TouchableOpacity key={i} style={styles.actItem} activeOpacity={0.75}>
              <View style={styles.actIcon}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actTitle}>{item.title}</Text>
                <Text style={styles.actSub}>Hari ini</Text>
              </View>
              <View style={styles.actBadge}>
                <Text style={styles.actPts}>{item.pts}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { paddingBottom: 32 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 2 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '700', color: '#fff' },
  statLbl: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section: { padding: 20, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 14 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  actionGradient: { paddingVertical: 18, alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center' },
  actItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  actIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#f0f9f4',
    alignItems: 'center', justifyContent: 'center',
  },
  actTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  actSub: { fontSize: 12, color: '#aaa', marginTop: 2 },
  actBadge: { backgroundColor: '#edf7f1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  actPts: { fontSize: 12, fontWeight: '600', color: '#1a7a4a' },
});
