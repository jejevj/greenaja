import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, Button, Card, Colors, Avatar } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT = [
  { title: 'Naik sepeda ke kantor', pts: '+10 poin' },
  { title: 'Daur ulang plastik', pts: '+8 poin' },
  { title: 'Tanam pohon', pts: '+20 poin' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header} row spread centerV>
          <View>
            <Text style={styles.greeting}>Selamat datang 👋</Text>
            <Text style={styles.name}>GreenAja User</Text>
          </View>
          <Avatar
            size={42}
            label="GA"
            backgroundColor={Colors.lightGreen}
          />
        </View>

        {/* Stats Card */}
        <Card style={styles.statsCard} elevation={3}>
          <Text subheading marginB-16>Ringkasan Hari Ini</Text>
          <View row spread>
            <View center>
              <Text style={styles.statNum}>12</Text>
              <Text caption color={Colors.textMuted}>Aktivitas</Text>
            </View>
            <View style={styles.divider} />
            <View center>
              <Text style={styles.statNum}>3.2kg</Text>
              <Text caption color={Colors.textMuted}>CO₂ Hemat</Text>
            </View>
            <View style={styles.divider} />
            <View center>
              <Text style={styles.statNum}>85</Text>
              <Text caption color={Colors.textMuted}>Poin</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text subheading style={styles.sectionTitle}>Aksi Cepat</Text>
        <View row gap-12 paddingH-16>
          <Button
            flex
            label="Catat Aktivitas"
            backgroundColor={Colors.primaryGreen}
            size={Button.sizes.large}
          />
          <Button
            flex
            label="Tantangan"
            backgroundColor={Colors.accent}
            size={Button.sizes.large}
          />
        </View>

        {/* Recent */}
        <Text subheading style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        {RECENT.map((item, i) => (
          <Card key={i} style={styles.actCard} row spread centerV padding-14 marginH-16 marginB-8>
            <View row centerV>
              <View style={styles.dot} />
              <Text body marginL-10>{item.title}</Text>
            </View>
            <Text caption color={Colors.primaryGreen}>{item.pts}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgLight },
  content: { paddingBottom: 32 },
  header: {
    backgroundColor: Colors.primaryGreen,
    padding: 20,
    paddingTop: 16,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  name: { fontSize: 20, fontWeight: '700', color: Colors.white, marginTop: 2 },
  statsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  statNum: { fontSize: 24, fontWeight: '700', color: Colors.primaryGreen },
  divider: { width: 1, height: 40, backgroundColor: '#f0f0f0' },
  sectionTitle: { marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  actCard: { borderRadius: 12, backgroundColor: Colors.white },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryGreen },
});
