import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, TextInput, useColorScheme, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const FARMS = [
  { id: '1', name: 'Kebun Pak Budi',  loc: 'Bogor, Jabar',   emoji: '🥬', rating: '4.9', products: 24 },
  { id: '2', name: 'Farm Cisarua',    loc: 'Cisarua, Jabar',  emoji: '🥦', rating: '4.8', products: 31 },
  { id: '3', name: 'Kebun Bu Sari',   loc: 'Malang, Jatim',  emoji: '🌶️', rating: '4.7', products: 18 },
  { id: '4', name: 'Farm Lembang',    loc: 'Lembang, Jabar',  emoji: '🥕', rating: '5.0', products: 42 },
];

const ARTICLES = [
  { id: '1', title: 'Tips Simpan Sayur Agar Tahan Lama',  tag: 'Tips',    emoji: '💡' },
  { id: '2', title: '5 Sayuran Lokal Paling Bergizi',      tag: 'Nutrisi', emoji: '💪' },
  { id: '3', title: 'Cara Masak Bayam yang Benar',         tag: 'Resep',   emoji: '👨‍🍳' },
];

export default function ExploreScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const [search, setSearch] = useState('');

  const bg    = dark ? '#0f1a14' : '#f4f9f6';
  const card  = dark ? '#1c2e22' : '#ffffff';
  const txt   = dark ? '#e8f5e9' : '#1a1a1a';
  const muted = dark ? '#7aab87' : '#888';
  const borderCol = dark ? '#2a4030' : '#efefef';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backText, { color: txt }]}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: txt }]}>Jelajahi</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Temukan petani & produk lokal</Text>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: card, borderColor: borderCol }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: txt }]}
            placeholder="Cari petani, produk..."
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Farms */}
        <Text style={[styles.sectionTitle, { color: txt, paddingHorizontal: 16 }]}>🏡 Petani Mitra</Text>
        {FARMS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.farmCard, { backgroundColor: card, borderColor: borderCol }]}
            activeOpacity={0.8}
          >
            <View style={[styles.farmEmoji, { backgroundColor: dark ? '#22382a' : '#f0f9f4' }]}>
              <Text style={{ fontSize: 28 }}>{f.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.farmName, { color: txt }]}>{f.name}</Text>
              <Text style={[styles.farmLoc, { color: muted }]}>📍 {f.loc}</Text>
              <Text style={[styles.farmLoc, { color: muted }]}>🌿 {f.products} produk tersedia</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>⭐ {f.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Articles */}
        <Text style={[styles.sectionTitle, { color: txt, paddingHorizontal: 16, marginTop: 8 }]}>📰 Artikel & Tips</Text>
        {ARTICLES.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.articleCard, { backgroundColor: card, borderColor: borderCol }]}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 28 }}>{a.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.articleTitle, { color: txt }]}>{a.title}</Text>
              <View style={styles.articleTag}>
                <Text style={styles.articleTagText}>{a.tag}</Text>
              </View>
            </View>
            <Text style={[styles.arrow, { color: muted }]}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  backBtn:      { marginBottom: 12 },
  backText:     { fontSize: 14, fontWeight: '500' },
  title:        { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  subtitle:     { fontSize: 13 },
  searchWrap:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 20, gap: 8 },
  searchIcon:   { fontSize: 16 },
  searchInput:  { flex: 1, fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  farmCard:     { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, borderRadius: 16, borderWidth: 1.5, padding: 14, gap: 14 },
  farmEmoji:    { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  farmName:     { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  farmLoc:      { fontSize: 12, marginBottom: 2 },
  ratingBox:    { backgroundColor: '#edf7f1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  ratingText:   { fontSize: 12, fontWeight: '700', color: '#1a7a4a' },
  articleCard:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, borderRadius: 16, borderWidth: 1.5, padding: 14, gap: 14 },
  articleTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6, flex: 1 },
  articleTag:   { backgroundColor: '#edf7f1', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  articleTagText: { fontSize: 11, fontWeight: '700', color: '#1a7a4a' },
  arrow:        { fontSize: 24 },
});
