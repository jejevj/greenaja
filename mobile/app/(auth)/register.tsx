import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  View,
  Text,
  Button,
  Colors,
  TextField,
} from 'react-native-ui-lib';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text heading>Buat Akun Baru</Text>
          <Text body style={styles.subtitle}>Bergabung bersama komunitas GreenAja</Text>
        </View>

        <View style={styles.form}>
          <TextField
            placeholder="Nama kamu"
            label="Nama Lengkap"
            value={name}
            onChangeText={setName}
            fieldStyle={styles.field}
            labelStyle={styles.label}
          />

          <TextField
            placeholder="contoh@email.com"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            fieldStyle={styles.field}
            labelStyle={styles.label}
          />

          <TextField
            placeholder="Min. 8 karakter"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            fieldStyle={styles.field}
            labelStyle={styles.label}
          />

          <TextField
            placeholder="Ulangi password"
            label="Konfirmasi Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            fieldStyle={styles.field}
            labelStyle={styles.label}
          />

          <Button
            label={loading ? 'Mendaftar...' : 'Daftar'}
            disabled={loading}
            onPress={handleRegister}
            size={Button.sizes.large}
            style={styles.btn}
          />
        </View>

        <View style={styles.footer}>
          <Text body style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  content: { flexGrow: 1, padding: 24 },
  backBtn: { marginTop: 48, marginBottom: 8 },
  backText: { fontSize: 14, color: Colors.primaryGreen, fontWeight: '500' },
  header: { marginBottom: 28 },
  subtitle: { color: Colors.textMuted, marginTop: 6 },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 6 },
  field: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: Colors.white,
    fontSize: 15,
  },
  btn: { marginTop: 8, backgroundColor: Colors.primaryGreen },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingBottom: 24 },
  footerText: { color: Colors.textMuted },
  link: { fontSize: 14, color: Colors.primaryGreen, fontWeight: '600' },
});
