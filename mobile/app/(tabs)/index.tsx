import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Button, Card, Colors } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Selamat datang 👋</Text>
            <Text style={styles.name}>GreenAja User</Text>
          </View>
        </View>

        <Card style={styles.card} elevation={2}>
          <Text text50 marginB-12>Ringkasan Hari Ini</Text>
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

        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View row gap-12 marginH-16>
          <Button
            flex
            label="Catat Aktivitas"
            backgroundColor="#1a7a4a"
            borderRadius={12}
            size={Button.sizes.large}
          />
          <Button
            flex
            label="Tantangan"
            backgroundColor="#f9a825"
            borderRadius={12}
            size={Button.sizes.large}
          />
        </View>

        <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        {['Naik sepeda ke kantor', 'Daur ulang plastik', 'Tanam pohon'].map((item, i) => (
          <Card key={i} style={styles.activityCard} row centerV padding-14 marginB-8 marginH-16>
            <View style={styles.dot} backgroundColor="#1a7a4a" marginR-12 />
            <Text text70>{item}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#1a7a4a',
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  name: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginTop: 2 },
  card: { margin: 16, padding: 20, borderRadius: 14, backgroundColor: '#ffffff' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 20,
  },
  activityCard: { borderRadius: 10, backgroundColor: '#ffffff', marginHorizontal: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
