import React, { useState } from 'react';
import {
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, TouchableOpacity, View, Text,
  TextInput, Pressable, ActivityIndicator, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';

export default function RegisterScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  const border = (f: string) => focus === f ? t.primary : t.border;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: t.bg }]} keyboardShouldPersistTaps="handled">

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          <Text style={[styles.backText, { color: t.text }]}>Kembali</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: t.text }]}>Buat Akun</Text>
        <Text style={[styles.subtitle, { color: t.textSub }]}>Bergabung dengan komunitas sayur lokal</Text>

        <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.border }]}>
          {([
            { key: 'name',     label: 'Nama Lengkap', icon: 'person-outline',       placeholder: 'Nama kamu',         secure: false, kb: 'default' },
            { key: 'email',    label: 'Email',        icon: 'mail-outline',          placeholder: 'nama@email.com',    secure: false, kb: 'email-address' },
            { key: 'password', label: 'Password',     icon: 'lock-closed-outline',  placeholder: 'Min. 8 karakter',   secure: true,  kb: 'default' },
            { key: 'confirm',  label: 'Konfirmasi',   icon: 'shield-checkmark-outline', placeholder: 'Ulangi password', secure: true, kb: 'default' },
          ] as any[]).map(f => (
            <View key={f.key} style={styles.field}>
              <Text style={[styles.label, { color: t.textSub }]}>{f.label}</Text>
              <View style={[styles.inputRow, { borderColor: border(f.key), backgroundColor: t.bg }]}>
                <Ionicons name={f.icon} size={18} color={t.textSub} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: t.text, flex: 1 }]}
                  placeholder={f.placeholder}
                  placeholderTextColor={t.textSub}
                  secureTextEntry={f.secure && !showPw}
                  keyboardType={f.kb}
                  autoCapitalize="none"
                  onFocus={() => setFocus(f.key)}
                  onBlur={() => setFocus(null)}
                />
                {f.key === 'password' && (
                  <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                    <Ionicons name={showPw ? 'eye-outline' : 'eye-off-outline'} size={18} color={t.textSub} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <Pressable
            onPress={() => { setLoading(true); setTimeout(() => { setLoading(false); router.replace('/(auth)/login'); }, 900); }}
            disabled={loading}
            style={({ pressed }) => [styles.btn, { backgroundColor: t.primary, opacity: pressed ? 0.85 : 1, marginTop: 8 }]}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Daftar Sekarang</Text>}
          </Pressable>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: t.textSub }]}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={[styles.footerLink, { color: t.primary }]}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content:    { flexGrow: 1, padding: 24, paddingTop: 56 },
  backBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28 },
  backText:   { fontSize: 15, fontWeight: '500' },
  title:      { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  subtitle:   { fontSize: 14, marginBottom: 28 },
  card:       { borderRadius: 20, borderWidth: 1, padding: 24 },
  field:      { marginBottom: 16 },
  label:      { fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow:   { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 50 },
  inputIcon:  { marginRight: 10 },
  input:      { fontSize: 15 },
  eyeBtn:     { paddingLeft: 8 },
  btn:        { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  btnText:    { fontSize: 16, fontWeight: '700', color: '#fff' },
  footer:     { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14, fontWeight: '700' },
});
