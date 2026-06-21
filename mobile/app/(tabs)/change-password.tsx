import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, useColorScheme, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LIGHT, DARK } from '../../constants/Theme';

function PasswordField({
  label, value, onChangeText, placeholder, t, show, onToggleShow, hint,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder: string; t: typeof LIGHT;
  show: boolean; onToggleShow: () => void; hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  // Strength indicator (only for new password field)
  const strength = (() => {
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8)  score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'][strength];

  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: t.textSub }]}>{label}</Text>
      <View style={[
        styles.fieldRow,
        { backgroundColor: t.surface, borderColor: focused ? t.primary : t.border },
      ]}>
        <View style={[styles.fieldIconBox, { backgroundColor: t.accent }]}>
          <Ionicons name="lock-closed-outline" size={16} color={t.primary} />
        </View>
        <TextInput
          style={[styles.fieldInput, { color: t.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={t.textSub}
          secureTextEntry={!show}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={onToggleShow} style={styles.eyeBtn}>
          <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={t.textSub} />
        </TouchableOpacity>
      </View>

      {/* Strength bar — hanya tampil jika ada konten */}
      {value.length > 0 && label !== 'Kata Sandi Saat Ini' && (
        <View style={styles.strengthWrap}>
          <View style={styles.strengthBars}>
            {[1, 2, 3, 4].map(i => (
              <View
                key={i}
                style={[
                  styles.strengthBar,
                  { backgroundColor: i <= strength ? strengthColor : t.border },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
        </View>
      )}

      {hint && <Text style={[styles.hint, { color: t.textSub }]}>{hint}</Text>}
    </View>
  );
}

export default function ChangePasswordScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;

  const [current,  setCurrent]  = useState('');
  const [newPass,   setNewPass]  = useState('');
  const [confirm,  setConfirm]  = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const matchError  = confirm.length > 0 && newPass !== confirm;
  const sameAsCurrent = current.length > 0 && newPass.length > 0 && newPass === current;

  const isReady =
    current.length >= 6 &&
    newPass.length >= 8 &&
    newPass === confirm &&
    !sameAsCurrent;

  const handleSave = () => {
    if (!current) { Alert.alert('Kata sandi saat ini wajib diisi.'); return; }
    if (newPass.length < 8) { Alert.alert('Kata sandi baru minimal 8 karakter.'); return; }
    if (sameAsCurrent) { Alert.alert('Kata sandi baru tidak boleh sama dengan kata sandi saat ini.'); return; }
    if (newPass !== confirm) { Alert.alert('Konfirmasi kata sandi tidak cocok.'); return; }

    // Simulasi sukses
    Alert.alert(
      '✓ Kata Sandi Diperbarui',
      'Kata sandi kamu berhasil diganti. Gunakan kata sandi baru untuk masuk berikutnya.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  const TIPS = [
    'Minimal 8 karakter',
    'Kombinasi huruf besar & kecil',
    'Sertakan angka',
    'Tambahkan simbol (!@#$%) untuk kata sandi lebih kuat',
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: t.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pageTitle, { color: t.text }]}>Ganti Kata Sandi</Text>
            <Text style={[styles.pageSub, { color: t.textSub }]}>Keamanan akun</Text>
          </View>
          <View style={[styles.shieldBadge, { backgroundColor: t.accent }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={t.primary} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <PasswordField
              label="Kata Sandi Saat Ini"
              value={current}
              onChangeText={setCurrent}
              placeholder="Masukkan kata sandi lama"
              t={t}
              show={showCurrent}
              onToggleShow={() => setShowCurrent(p => !p)}
            />

            <View style={[styles.separator, { backgroundColor: t.border }]} />

            <PasswordField
              label="Kata Sandi Baru"
              value={newPass}
              onChangeText={setNewPass}
              placeholder="Minimal 8 karakter"
              t={t}
              show={showNew}
              onToggleShow={() => setShowNew(p => !p)}
            />

            {sameAsCurrent && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.errorText}>Kata sandi baru tidak boleh sama dengan yang lama</Text>
              </View>
            )}

            <PasswordField
              label="Konfirmasi Kata Sandi Baru"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Ulangi kata sandi baru"
              t={t}
              show={showConfirm}
              onToggleShow={() => setShowConfirm(p => !p)}
            />

            {matchError && (
              <View style={styles.errorRow}>
                <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                <Text style={styles.errorText}>Kata sandi tidak cocok</Text>
              </View>
            )}

            {!matchError && confirm.length > 0 && newPass === confirm && (
              <View style={styles.successRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#22C55E" />
                <Text style={styles.successText}>Kata sandi cocok</Text>
              </View>
            )}
          </View>

          {/* Tips Card */}
          <View style={[styles.tipsCard, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={16} color={t.primary} />
              <Text style={[styles.tipsTitle, { color: t.text }]}>Tips Kata Sandi Kuat</Text>
            </View>
            {TIPS.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={[styles.tipDot, { backgroundColor: t.primary }]} />
                <Text style={[styles.tipText, { color: t.textSub }]}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isReady}
            onPress={handleSave}
            style={[styles.saveBtn, !isReady && { opacity: 0.45 }]}
          >
            <LinearGradient
              colors={['#1A7A4A', '#2A9960']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.saveBtnGradient}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Simpan Kata Sandi Baru</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1 },
  header:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn:        { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:      { fontSize: 18, fontWeight: '800' },
  pageSub:        { fontSize: 12, marginTop: 2 },
  shieldBadge:    { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content:        { padding: 20, gap: 14, paddingBottom: 40 },
  formCard:       { borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  separator:      { height: 1, marginVertical: 8 },
  fieldWrap:      { gap: 5 },
  fieldLabel:     { fontSize: 11, fontWeight: '600', marginLeft: 2 },
  fieldRow:       { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, overflow: 'hidden' },
  fieldIconBox:   { width: 42, height: 50, alignItems: 'center', justifyContent: 'center' },
  fieldInput:     { flex: 1, fontSize: 14, height: 50, paddingHorizontal: 8 },
  eyeBtn:         { paddingHorizontal: 14, height: 50, alignItems: 'center', justifyContent: 'center' },
  strengthWrap:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  strengthBars:   { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar:    { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel:  { fontSize: 11, fontWeight: '700', minWidth: 72, textAlign: 'right' },
  hint:           { fontSize: 11, marginLeft: 2 },
  errorRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, marginBottom: 4 },
  errorText:      { fontSize: 12, color: '#EF4444', flex: 1 },
  successRow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, marginBottom: 4 },
  successText:    { fontSize: 12, color: '#22C55E' },
  tipsCard:       { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  tipsHeader:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  tipsTitle:      { fontSize: 13, fontWeight: '700' },
  tipRow:         { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipDot:         { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  tipText:        { flex: 1, fontSize: 13, lineHeight: 19 },
  saveBtn:        { borderRadius: 16, overflow: 'hidden' },
  saveBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  saveBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
