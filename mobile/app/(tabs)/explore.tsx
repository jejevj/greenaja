import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, TextInput, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

const FARMS = [
  { id: '1', name: 'Kebun Pak Budi',  loc: 'Bogor, Jawa Barat',  rating: '4.9', products: 24 },
  { id: '2', name: 'Farm Cisarua',    loc: 'Cisarua, Jawa Barat', rating: '4.8', products: 31 },
  { id: '3', name: 'Kebun Bu Sari',   loc: 'Malang, Jawa Timur',  rating: '4.7', products: 18 },
  { id: '4', name: 'Farm Lembang',    loc: 'Lembang, Jawa Barat', rating: '5.0', products: 42 },
];

const ARTICLES = [
  { id: '1', title: 'Tips Simpan Sayur Agar Tahan Lama',  tag: 'Tips'    },
  { id: '2', title: '5 Sayuran Lokal Paling Bergizi',      tag: 'Nutrisi' },
  { id: '3', title: 'Cara Masak Bayam yang Benar',         tag: 'Resep'   },
];

export default function ExploreScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [search, setSearch] = useState('');
  const [focus, setFocus] = useState(false);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.title, { color: t.text }]}>Jelajahi</Text>
            <Text style={[styles.subtitle, { color: t.textSub }]}>Petani & produk lokal Indonesia</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: t.surface, borderColor: focus ? t.primary : t.border }]}>
          <Ionicons name="search-outline" size={18} color={t.textSub} />
          <TextInput
            style={[styles.searchInput, { color: t.text }]}
            placeholder="Cari petani atau produk..."
            placeholderTextColor={t.textSub}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </View>

        {/* Farms */}
        <Text style={[styles.sectionTitle, { color: t.text }]}>Petani Mitra</Text>
        {FARMS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.farmCard, { backgroundColor: t.surface, borderColor: t.border }]}
            activeOpacity={0.8}
          >
            <View style={[styles.farmAvatar, { backgroundColor: t.accent }]}>
              <Ionicons name="leaf-outline" size={22} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.farmName, { color: t.text }]}>{f.name}</Text>
              <View style={styles.farmMeta}>
                <Ionicons name="location-outline" size={12} color={t.textSub} />
                <Text style={[styles.farmLoc, { color: t.textSub }]}>{f.loc}</Text>
              </View>
              <View style={styles.farmMeta}>
                <Ionicons name="cube-outline" size={12} color={t.textSub} />
                <Text style={[styles.farmLoc, { color: t.textSub }]}>{f.products} produk</Text>
              </View>
            </View>
            <View style={[styles.ratingPill, { backgroundColor: t.primaryMuted }]}>
              <Ionicons name="star-outline" size={12} color={t.primary} />
              <Text style={[styles.ratingText, { color: t.primary }]}>{f.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Articles */}
        <Text style={[styles.sectionTitle, { color: t.text, marginTop: 8 }]}>Artikel & Tips</Text>
        {ARTICLES.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.articleCard, { backgroundColor: t.surface, borderColor: t.border }]}
            activeOpacity={0.8}
          >
            <View style={[styles.articleIcon, { backgroundColor: t.accent }]}>
              <Ionicons name="document-text-outline" size={20} color={t.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.articleTitle, { color: t.text }]}>{a.title}</Text>
              <View style={[styles.articleTag, { backgroundColor: t.primaryMuted }]}>
                <Text style={[styles.articleTagText, { color: t.primary }]}>{a.tag}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={18} color={t.textSub} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1 },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn:        { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title:          { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  subtitle:       { fontSize: 13, marginTop: 2 },
  searchBar:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, height: 48, gap: 10, marginBottom: 20 },
  searchInput:    { flex: 1, fontSize: 14 },
  sectionTitle:   { fontSize: 16, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 },
  farmCard:       { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, borderRadius: 16, borderWidth: 1, padding: 14, gap: 14 },
  farmAvatar:     { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  farmName:       { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  farmMeta:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  farmLoc:        { fontSize: 12 },
  ratingPill:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  ratingText:     { fontSize: 12, fontWeight: '700' },
  articleCard:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, borderRadius: 16, borderWidth: 1, padding: 14, gap: 14 },
  articleIcon:    { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  articleTitle:   { fontSize: 14, fontWeight: '600', marginBottom: 6, flex: 1 },
  articleTag:     { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  articleTagText: { fontSize: 11, fontWeight: '700' },
});
