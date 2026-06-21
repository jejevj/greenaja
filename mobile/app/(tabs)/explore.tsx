import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Card, Colors, Badge } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOPICS = [
  { title: 'Energi Terbarukan', desc: 'Tips hemat energi di rumah', tag: 'Populer', color: '#1a7a4a' },
  { title: 'Zero Waste', desc: 'Kurangi sampah setiap hari', tag: 'Baru', color: '#388e3c' },
  { title: 'Transportasi Hijau', desc: 'Pilih moda ramah lingkungan', tag: 'Trending', color: '#2e7d32' },
  { title: 'Pertanian Urban', desc: 'Berkebun di rumah sendiri', tag: 'Tips', color: '#4caf50' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text heading>Jelajahi</Text>
          <Text body color={Colors.textMuted} marginT-4>Konten lingkungan terkini</Text>
        </View>

        {TOPICS.map((topic, i) => (
          <TouchableOpacity key={i} activeOpacity={0.85}>
            <Card
              style={[styles.card, { borderLeftColor: topic.color }]}
              marginH-16
              marginB-12
              padding-16
              elevation={2}
            >
              <View row spread centerV marginB-8>
                <Text subheading>{topic.title}</Text>
                <Badge
                  label={topic.tag}
                  size={20}
                  backgroundColor={topic.color}
                />
              </View>
              <Text body color={Colors.textMuted}>{topic.desc}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgLight },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 8 },
  card: {
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
  },
});
