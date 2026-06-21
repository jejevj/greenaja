import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
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
        {/* Top gradient header */}
        <LinearGradient colors={['#1a7a4a', '#2d9966']} style={styles.topBar}>
          <View style={styles.logoRow}>
            <Text style={styles.logoIcon}>🌿</Text>
            <Text style={styles.logoText}>GreenAja</Text>
          </View>
          <Text style={styles.welcomeText}>Selamat datang kembali</Text>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.formTitle}>Masuk</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="contoh@email.com"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.pwWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0, paddingRight: 0 }]}
                placeholder="Masukkan password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Lupa password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [styles.loginBtnOuter, pressed && { opacity: 0.85 }]}
          >
            <LinearGradient
              colors={['#1a7a4a', '#2d9966']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtnInner}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginBtnText}>Masuk</Text>
              }
            </LinearGradient>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Daftar sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f9f6' },
  content: { flexGrow: 1 },
  topBar: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 28,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  welcomeText: { fontSize: 15, color: 'rgba(255,255,255,0.75)' },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    flex: 1,
    padding: 28,
    paddingTop: 32,
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#ebebeb',
  },
  pwWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ebebeb',
    paddingHorizontal: 16,
  },
  eyeBtn: { paddingLeft: 8, paddingVertical: 14 },
  eyeIcon: { fontSize: 16 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 13, color: '#1a7a4a', fontWeight: '500' },
  loginBtnOuter: { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  loginBtnInner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#efefef' },
  dividerText: { fontSize: 13, color: '#bbb' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14, color: '#888' },
  registerLink: { fontSize: 14, color: '#1a7a4a', fontWeight: '700' },
});
