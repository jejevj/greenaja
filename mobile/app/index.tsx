import { useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import { LIGHT, DARK } from '../constants/Theme';

export default function SplashEntry() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(auth)/login'), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.logoBox, { backgroundColor: t.primaryMuted, borderColor: t.border }]}>
        <Text style={[styles.logoText, { color: t.primary }]}>G</Text>
      </View>
      <Text style={[styles.appName, { color: t.text }]}>GreenAja</Text>
      <Text style={[styles.tagline, { color: t.textSub }]}>Pasar Sayur Lokal Terpercaya</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logoBox:    { width: 80, height: 80, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoText:   { fontSize: 40, fontWeight: '800' },
  appName:    { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  tagline:    { fontSize: 14 },
});
