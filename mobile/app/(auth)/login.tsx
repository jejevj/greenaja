import React, { useState } from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity, View, Text,
  TextInput, ActivityIndicator, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

export default function LoginScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace('/(tabs)'); }, 900);
  };

  const borderOf = (field: string) =>
    focusField === field ? t.primary : t.border;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: t.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { backgroundColor: t.bg }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand */}
        <View style={styles.brand}>
          <View style={[styles.logoBox, { backgroundColor: t.primaryMuted, borderColor: t.border }]}>
            <Text style={[styles.logoText, { color: t.primary }]}>G</Text>
          </View>
          <Text style={[styles.appName, { color: t.text }]}>GreenAja</Text>
          <Text style={[styles.appSub, { color: t.textSub }]}>Pasar Sayur Lokal Terpercaya</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Text style={[styles.formTitle, { color: t.text }]}>Masuk</Text>

          {/* Email */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: t.textSub }]}>Email</Text>
            <View style={[styles.inputRow, { borderColor: borderOf('email'), backgroundColor: t.bg }]}>
              <Ionicons name="mail-outline" size={17} color={focusField === 'email' ? t.primary : t.textSub} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: t.text }]}
                placeholder="nama@email.com"
                placeholderTextColor={t.textSub}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: t.textSub }]}>Password</Text>
            <View style={[styles.inputRow, { borderColor: borderOf('password'), backgroundColor: t.bg }]}>
              <Ionicons name="lock-closed-outline" size={17} color={focusField === 'password' ? t.primary : t.textSub} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: t.text, flex: 1 }]}
                placeholder="Masukkan password"
                placeholderTextColor={t.textSub}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField(null)}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPw ? 'eye-outline' : 'eye-off-outline'}
                  size={17}
                  color={t.textSub}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot */}
          <TouchableOpacity style={styles.forgotRow}>
            <Text style={[styles.forgotText, { color: t.primary }]}>Lupa password?</Text>
          </TouchableOpacity>

          {/* Login button — gradient flat */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.87}
            style={styles.loginBtnOuter}
          >
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtnInner}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.loginBtnContent}>
                  <Ionicons name="log-in-outline" size={18} color="#fff" />
                  <Text style={styles.loginBtnText}>Masuk</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.divLine, { backgroundColor: t.border }]} />
            <Text style={[styles.divText, { color: t.textSub }]}>atau</Text>
            <View style={[styles.divLine, { backgroundColor: t.border }]} />
          </View>

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: t.textSub }]}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={[styles.footerLink, { color: t.primary }]}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content:          { flexGrow: 1, padding: 24, justifyContent: 'center' },
  brand:            { alignItems: 'center', marginBottom: 32, gap: 8 },
  logoBox:          { width: 64, height: 64, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  logoText:         { fontSize: 32, fontWeight: '800' },
  appName:          { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  appSub:           { fontSize: 13 },
  card:             { borderRadius: 20, borderWidth: 1, padding: 24 },
  formTitle:        { fontSize: 20, fontWeight: '700', marginBottom: 24 },
  field:            { marginBottom: 16 },
  label:            { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow:         { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 50 },
  inputIcon:        { marginRight: 10 },
  input:            { flex: 1, fontSize: 15 },
  eyeBtn:           { paddingLeft: 10 },
  forgotRow:        { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText:       { fontSize: 13, fontWeight: '600' },
  loginBtnOuter:    { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  loginBtnInner:    { height: 52, alignItems: 'center', justifyContent: 'center' },
  loginBtnContent:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginBtnText:     { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  divider:          { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  divLine:          { flex: 1, height: 1 },
  divText:          { fontSize: 12 },
  footer:           { flexDirection: 'row', justifyContent: 'center' },
  footerText:       { fontSize: 14 },
  footerLink:       { fontSize: 14, fontWeight: '700' },
});
