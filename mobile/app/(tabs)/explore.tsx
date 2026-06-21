import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOPICS = [
  { title: 'Energi Terbarukan', desc: 'Tips hemat energi di rumah', color: '#1a7a4a' },
  { title: 'Zero Waste', desc: 'Kurangi sampah setiap hari', color: '#388e3c' },
  { title: 'Transportasi Hijau', desc: 'Pilih moda ramah lingkungan', color: '#2e7d32' },
  { title: 'Pertanian Urban', desc: 'Berkebun di rumah sendiri', color: '#4caf50' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Jelajahi</Text>
          <Text style={styles.subtitle}>Konten lingkungan terkini</Text>
        </View>
        {TOPICS.map((topic, i) => (
          <Card
            key={i}
            style={[styles.topicCard, { borderLeftColor: topic.color }]}
            padding-16
            marginH-16
            marginB-12
            elevation={1}
          >
            <Text text60 marginB-4>{topic.title}</Text>
            <Text text70 color={Colors.grey40}>{topic.desc}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f9f6' },
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  topicCard: { borderRadius: 12, backgroundColor: '#ffffff', borderLeftWidth: 4 },
});
