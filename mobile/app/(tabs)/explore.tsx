import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOPICS = [
  { title: 'Energi Terbarukan', desc: 'Tips hemat energi di rumah', tag: 'Populer', icon: '⚡', grad: ['#1a7a4a', '#2d9966'] },
  { title: 'Zero Waste', desc: 'Kurangi sampah setiap hari', tag: 'Baru', icon: '♻️', grad: ['#0288d1', '#0299e6'] },
  { title: 'Transportasi Hijau', desc: 'Pilih moda ramah lingkungan', tag: 'Trending', icon: '🚗', grad: ['#388e3c', '#4caf50'] },
  { title: 'Pertanian Urban', desc: 'Berkebun di rumah sendiri', tag: 'Tips', icon: '🌱', grad: ['#f9a825', '#f4b942'] },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Jelajahi</Text>
          <Text style={styles.subtitle}>Konten lingkungan terkini</Text>
        </View>

        {TOPICS.map((topic, i) => (
          <TouchableOpacity key={i} style={styles.card} activeOpacity={0.82}>
            <LinearGradient colors={topic.grad as [string, string]} style={styles.iconBox}>
              <Text style={styles.topicIcon}>{topic.icon}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{topic.title}</Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{topic.tag}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{topic.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { padding: 20, paddingBottom: 32 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  topicIcon: { fontSize: 26 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  cardDesc: { fontSize: 13, color: '#888' },
  tag: { backgroundColor: '#edf7f1', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginLeft: 8 },
  tagText: { fontSize: 11, fontWeight: '600', color: '#1a7a4a' },
});
