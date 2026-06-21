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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    // Dummy register — redirect ke login
    setTimeout(() => {
      setLoading(false);
      router.replace('/(auth)/login');
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Buat Akun Baru</Text>
          <Text style={styles.subtitle}>Bergabung bersama komunitas GreenAja</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Nama Lengkap"
            placeholder="Nama kamu"
            value={name}
            onChangeText={setName}
          />

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
            placeholder="Min. 8 karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <InputField
            label="Konfirmasi Password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            label={loading ? 'Mendaftar...' : 'Daftar'}
            disabled={loading}
            onPress={handleRegister}
            style={styles.registerBtn}
            backgroundColor="#1a7a4a"
            borderRadius={12}
            size={Button.sizes.large}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { flexGrow: 1, padding: 24 },
  backBtn: { marginTop: 48, marginBottom: 8 },
  backText: { fontSize: 14, color: '#1a7a4a', fontWeight: '500' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 6 },
  form: { gap: 16 },
  registerBtn: { marginTop: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    paddingBottom: 24,
  },
  footerText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#1a7a4a', fontWeight: '600' },
});
