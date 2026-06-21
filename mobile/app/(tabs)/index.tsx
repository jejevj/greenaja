import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Button, Card, Colors } from 'react-native-ui-lib';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text text30 color={Colors.white} marginB-4>
          Selamat Datang
        </Text>
        <Text text60 color={Colors.white80}>
          GreenAja — Hidup Lebih Hijau
        </Text>
      </View>

      <Card style={styles.card} elevation={2}>
        <Text text50 marginB-8>Ringkasan Hari Ini</Text>
        <View row spread>
          <View center>
            <Text text40 color="#1a7a4a">12</Text>
            <Text text80 color={Colors.grey40}>Aktivitas</Text>
          </View>
          <View center>
            <Text text40 color="#1a7a4a">3.2kg</Text>
            <Text text80 color={Colors.grey40}>CO₂ Hemat</Text>
          </View>
          <View center>
            <Text text40 color="#1a7a4a">85</Text>
            <Text text80 color={Colors.grey40}>Poin</Text>
          </View>
        </View>
      </Card>

      <Text text60 marginB-8 marginT-16 marginH-16>Aksi Cepat</Text>
      <View row gap-12 marginH-16>
        <Button
          flex
          label="Catat Aktivitas"
          backgroundColor="#1a7a4a"
          borderRadius={10}
          size={Button.sizes.large}
        />
        <Button
          flex
          label="Tantangan"
          backgroundColor="#f9a825"
          borderRadius={10}
          size={Button.sizes.large}
        />
      </View>

      <Text text60 marginB-8 marginT-20 marginH-16>Aktivitas Terbaru</Text>
      {['Naik sepeda ke kantor', 'Daur ulang plastik', 'Tanam pohon'].map((item, i) => (
        <Card key={i} style={styles.activityCard} row centerV padding-12 marginB-8 marginH-16>
          <View style={styles.dot} backgroundColor="#1a7a4a" marginR-12 />
          <Text text70>{item}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: '#1a7a4a',
    padding: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  activityCard: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
