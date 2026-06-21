import { useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SplashEntry() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#1a7a4a', '#0d4a2c']} style={styles.container}>
      <View style={styles.center}>
        <View style={styles.iconBox}>
          <Ionicons name="leaf-outline" size={48} color="#fff" />
        </View>
        <Text style={styles.appName}>GreenAja</Text>
        <Text style={styles.tagline}>Hidup Lebih Hijau, Mulai Hari Ini</Text>
      </View>
      <Text style={styles.version}>v1.0.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center:    { alignItems: 'center' },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appName:  { fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  tagline:  { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 8 },
  version:  { position: 'absolute', bottom: 40, fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});
