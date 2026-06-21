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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
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
          <Text heading style={styles.title}>GreenAja</Text>
          <Text body style={styles.subtitle}>Masuk ke akun kamu</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextField
            placeholder="Email"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            fieldStyle={styles.field}
            labelStyle={styles.label}
          />

          <TextField
            placeholder="Password"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            fieldStyle={styles.field}
            labelStyle={styles.label}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          <Button
            label={loading ? 'Masuk...' : 'Masuk'}
            disabled={loading}
            onPress={handleLogin}
            size={Button.sizes.large}
            style={styles.btn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text body style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Daftar sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  content: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { color: Colors.primaryGreen },
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
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, color: Colors.primaryGreen },
  btn: { marginTop: 8, backgroundColor: Colors.primaryGreen },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingBottom: 24 },
  footerText: { color: Colors.textMuted },
  link: { fontSize: 14, color: Colors.primaryGreen, fontWeight: '600' },
});
