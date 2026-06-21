import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, useColorScheme, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LIGHT, DARK } from '../../constants/Theme';
import { useApp } from '../../context/AppContext';

const GENDERS = [
  { key: 'male',   label: 'Laki-laki', icon: 'male-outline' },
  { key: 'female', label: 'Perempuan', icon: 'female-outline' },
] as const;

function InputField({
  label, value, onChangeText, placeholder, keyboardType, editable, icon, t, multiline,
}: {
  label: string; value: string; onChangeText?: (v: string) => void;
  placeholder?: string; keyboardType?: any; editable?: boolean;
  icon: string; t: typeof LIGHT; multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: t.textSub }]}>{label}</Text>
      <View style={[
        styles.fieldRow,
        { backgroundColor: t.surface, borderColor: focused ? t.primary : t.border },
        editable === false && { opacity: 0.55 },
      ]}>
        <View style={[styles.fieldIconBox, { backgroundColor: t.accent }]}>
          <Ionicons name={icon as any} size={16} color={t.primary} />
        </View>
        <TextInput
          style={[styles.fieldInput, { color: t.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={t.textSub}
          keyboardType={keyboardType ?? 'default'}
          editable={editable !== false}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {editable === false && (
          <Ionicons name="lock-closed-outline" size={14} color={t.textSub} style={{ marginRight: 12 }} />
        )}
      </View>
    </View>
  );
}

export default function EditProfileScreen() {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;
  const { user, updateUser } = useApp();

  const [name,      setName]      = useState(user.name);
  const [phone,     setPhone]     = useState(user.phone);
  const [gender,    setGender]    = useState(user.gender);
  const [birthdate, setBirthdate] = useState(user.birthdate);

  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'GA';

  const hasChanges =
    name !== user.name ||
    phone !== user.phone ||
    gender !== user.gender ||
    birthdate !== user.birthdate;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Nama tidak boleh kosong', 'Isi nama lengkap kamu terlebih dahulu.');
      return;
    }
    if (phone && !/^(08|\+62)\d{7,12}$/.test(phone.trim())) {
      Alert.alert('Nomor tidak valid', 'Format nomor HP harus diawali 08 atau +62.');
      return;
    }
    updateUser({ name: name.trim(), phone: phone.trim(), gender, birthdate });
    Alert.alert('Berhasil disimpan', 'Data profil kamu sudah diperbarui.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleDiscard = () => {
    if (!hasChanges) { router.back(); return; }
    Alert.alert('Buang perubahan?', 'Perubahan yang belum disimpan akan hilang.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Buang', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: t.border }]}>
          <TouchableOpacity onPress={handleDiscard} style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Ionicons name="arrow-back-outline" size={20} color={t.text} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: t.text }]}>Edit Profil</Text>
          {hasChanges ? (
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveHeaderBtn, { backgroundColor: t.primary }]}
            >
              <Text style={styles.saveHeaderText}>Simpan</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.saveHeaderBtn} />
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarCircle, { backgroundColor: t.primaryMuted }]}>
              <Text style={[styles.avatarInitials, { color: t.primary }]}>{initials}</Text>
            </View>
            <TouchableOpacity style={[styles.changeAvatarBtn, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Ionicons name="camera-outline" size={14} color={t.primary} />
              <Text style={[styles.changeAvatarText, { color: t.primary }]}>Ganti Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Informasi Pribadi</Text>

            <InputField label="Nama Lengkap" value={name} onChangeText={setName}
              placeholder="Nama lengkap kamu" icon="person-outline" t={t} />

            <InputField label="Email" value={user.email}
              placeholder="Email" icon="mail-outline" t={t} editable={false} />

            <InputField label="Nomor HP" value={phone} onChangeText={setPhone}
              placeholder="08xxxxxxxxxx" icon="call-outline" t={t} keyboardType="phone-pad" />
          </View>

          {/* Gender */}
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Jenis Kelamin</Text>
            <View style={styles.genderRow}>
              {GENDERS.map(g => {
                const selected = gender === g.key;
                return (
                  <TouchableOpacity
                    key={g.key}
                    style={[
                      styles.genderBtn,
                      { borderColor: selected ? t.primary : t.border, backgroundColor: selected ? t.primaryMuted : t.surface },
                    ]}
                    onPress={() => setGender(g.key)}
                  >
                    <Ionicons name={g.icon as any} size={20} color={selected ? t.primary : t.textSub} />
                    <Text style={[styles.genderLabel, { color: selected ? t.primary : t.textSub, fontWeight: selected ? '700' : '400' }]}>
                      {g.label}
                    </Text>
                    {selected && <Ionicons name="checkmark-circle" size={16} color={t.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Tanggal lahir */}
          <View style={[styles.section, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Text style={[styles.sectionTitle, { color: t.text }]}>Tanggal Lahir</Text>
            <InputField label="" value={birthdate} onChangeText={setBirthdate}
              placeholder="YYYY-MM-DD" icon="calendar-outline" t={t} keyboardType="numbers-and-punctuation" />
            <Text style={[styles.hint, { color: t.textSub }]}>Format: YYYY-MM-DD  contoh: 1995-06-15</Text>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: hasChanges ? t.primary : t.border },
            ]}
            onPress={handleSave}
            disabled={!hasChanges}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1 },
  header:           { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  iconBtn:          { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pageTitle:        { flex: 1, fontSize: 18, fontWeight: '800' },
  saveHeaderBtn:    { minWidth: 68, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  saveHeaderText:   { fontSize: 13, fontWeight: '700', color: '#fff' },
  content:          { padding: 20, gap: 14, paddingBottom: 48 },
  avatarSection:    { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatarCircle:     { width: 88, height: 88, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarInitials:   { fontSize: 30, fontWeight: '800' },
  changeAvatarBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  changeAvatarText: { fontSize: 13, fontWeight: '600' },
  section:          { borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  sectionTitle:     { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  fieldWrap:        { gap: 5, marginBottom: 10 },
  fieldLabel:       { fontSize: 11, fontWeight: '600', marginLeft: 2 },
  fieldRow:         { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, overflow: 'hidden' },
  fieldIconBox:     { width: 42, height: 48, alignItems: 'center', justifyContent: 'center' },
  fieldInput:       { flex: 1, fontSize: 14, height: 48, paddingHorizontal: 8 },
  genderRow:        { flexDirection: 'row', gap: 12 },
  genderBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 12, paddingVertical: 14 },
  genderLabel:      { fontSize: 14 },
  hint:             { fontSize: 11, marginTop: -4, marginLeft: 2 },
  saveBtn:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, padding: 16, marginTop: 6 },
  saveBtnText:      { fontSize: 15, fontWeight: '700', color: '#fff' },
});
