import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { InputField } from '@/components/ui/InputField';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Dummy login — langsung masuk
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌿</Text>
          <Text style={styles.title}>GreenAja</Text>
          <Text style={styles.subtitle}>Masuk ke akun kamu</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="contoh@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          <Button
            label={loading ? 'Masuk...' : 'Masuk'}
            disabled={loading}
            onPress={handleLogin}
            style={styles.loginBtn}
            backgroundColor="#1a7a4a"
            borderRadius={12}
            size={Button.sizes.large}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Daftar sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '700', color: '#1a7a4a' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 6 },
  form: { gap: 16 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 13, color: '#1a7a4a' },
  loginBtn: { marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 24,
  },
  footerText: { fontSize: 14, color: '#666' },
  registerLink: { fontSize: 14, color: '#1a7a4a', fontWeight: '600' },
});
