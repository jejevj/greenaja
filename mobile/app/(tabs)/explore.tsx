import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';

const TOPICS = [
  { title: 'Energi Terbarukan', desc: 'Tips hemat energi di rumah', color: '#1a7a4a' },
  { title: 'Zero Waste', desc: 'Kurangi sampah setiap hari', color: '#388e3c' },
  { title: 'Transportasi Hijau', desc: 'Pilih moda ramah lingkungan', color: '#2e7d32' },
  { title: 'Pertanian Urban', desc: 'Berkebun di rumah sendiri', color: '#4caf50' },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text text40 marginB-4 marginT-16 marginH-16>Jelajahi Topik</Text>
      <Text text70 color={Colors.grey40} marginB-20 marginH-16>
        Temukan konten lingkungan terkini
      </Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { paddingBottom: 32 },
  topicCard: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
  },
});
