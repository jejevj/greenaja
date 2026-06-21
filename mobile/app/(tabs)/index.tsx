import React from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const RECENT = [
  { title: 'Naik sepeda ke kantor', pts: '+10 poin', icon: '🚴', sub: 'Hari ini' },
  { title: 'Daur ulang plastik',    pts: '+8 poin',  icon: '♻️', sub: 'Hari ini' },
  { title: 'Tanam pohon',           pts: '+20 poin', icon: '🌳', sub: 'Kemarin' },
];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  return (
    <SafeAreaView style={[styles.safe, dark && styles.safeDark]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header gradient */}
        <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Selamat datang 👋</Text>
              <Text style={styles.userName}>GreenAja User</Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.avatarText}>GA</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {[['12', 'Aktivitas'], ['3.2kg', 'CO₂ Hemat'], ['85', 'Poin']].map(
              ([val, lbl], i) => (
                <View key={i} style={styles.statItem}>
                  <Text style={styles.statVal}>{val}</Text>
                  <Text style={styles.statLbl}>{lbl}</Text>
                </View>
              )
            )}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dark && styles.textDark]}>Aksi Cepat</Text>
          <View style={styles.actionRow}>
            {[
              { icon: '📝', label: 'Catat\nAktivitas', grad: ['#1a7a4a', '#2d9966'] as [string,string] },
              { icon: '🏆', label: 'Tantangan',         grad: ['#f9a825', '#f4b942'] as [string,string] },
              { icon: '📊', label: 'Statistik',         grad: ['#0288d1', '#0299e6'] as [string,string] },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={styles.actionCard} activeOpacity={0.8}>
                <LinearGradient colors={a.grad} style={styles.actionGradient}>
                  <Text style={styles.actionIcon}>{a.icon}</Text>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dark && styles.textDark]}>Aktivitas Terbaru</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>Lihat semua</Text>
            </TouchableOpacity>
          </View>
          {RECENT.map((item, i) => (
            <View key={i} style={[styles.actItem, dark && styles.actItemDark]}>
              <View style={styles.actIcon}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.actTitle, dark && styles.textDark]}>{item.title}</Text>
                <Text style={styles.actSub}>{item.sub}</Text>
              </View>
              <View style={styles.actBadge}>
                <Text style={styles.actPts}>{item.pts}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#f4f9f6' },
  safeDark:     { backgroundColor: '#0f1a14' },
  content:      { paddingBottom: 40 },
  header:       { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  headerRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:     { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  userName:     { fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 2 },
  avatar:       { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: 14, fontWeight: '700', color: '#fff' },
  statsRow:     { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, paddingVertical: 16 },
  statItem:     { flex: 1, alignItems: 'center' },
  statVal:      { fontSize: 22, fontWeight: '700', color: '#fff' },
  statLbl:      { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  section:      { padding: 20, paddingBottom: 0 },
  sectionHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  textDark:     { color: '#e8f5e9' },
  seeAll:       { fontSize: 13, color: '#1a7a4a', fontWeight: '600' },
  actionRow:    { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionCard:   { flex: 1, borderRadius: 16, overflow: 'hidden' },
  actionGradient: { paddingVertical: 18, alignItems: 'center', gap: 6 },
  actionIcon:   { fontSize: 24 },
  actionLabel:  { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center' },
  actItem:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  actItemDark:  { backgroundColor: '#1c2e22' },
  actIcon:      { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0f9f4', alignItems: 'center', justifyContent: 'center' },
  actTitle:     { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  actSub:       { fontSize: 12, color: '#aaa', marginTop: 2 },
  actBadge:     { backgroundColor: '#edf7f1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  actPts:       { fontSize: 12, fontWeight: '600', color: '#1a7a4a' },
});
