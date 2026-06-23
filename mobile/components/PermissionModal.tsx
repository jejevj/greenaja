import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LIGHT, DARK } from '../constants/Theme';
import { PermissionItem, PermissionKey, openAppPermissionSettings } from '../hooks/usePermissions';

const { height: SCREEN_H } = Dimensions.get('window');

type Props = {
  denied: PermissionItem[];
  onRetry: () => void;
};

export default function PermissionModal({ denied, onRetry }: Props) {
  const t      = useColorScheme() === 'dark' ? DARK : LIGHT;
  const slideY = useRef(new Animated.Value(SCREEN_H)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const visible = denied.length > 0;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: SCREEN_H,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const handleOpenSettings = async (key: PermissionKey) => {
    await openAppPermissionSettings(key);
  };

  return (
    <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
      {/* Overlay gelap */}
      <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>
        {/* Sheet dari bawah */}
        <Animated.View
          style={[
            s.sheet,
            { backgroundColor: t.bg, transform: [{ translateY: slideY }] },
          ]}
        >
          {/* Handle bar */}
          <View style={[s.handle, { backgroundColor: t.border }]} />

          {/* Header */}
          <View style={s.headerRow}>
            <View style={[s.headerIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="shield-outline" size={26} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.title, { color: t.text }]}>Izin Diperlukan</Text>
              <Text style={[s.subtitle, { color: t.textSub }]}>
                GreenAja memerlukan izin berikut agar dapat berfungsi dengan baik.
              </Text>
            </View>
          </View>

          {/* Daftar izin yang ditolak */}
          <View style={s.list}>
            {denied.map(item => (
              <View
                key={item.key}
                style={[s.permRow, { backgroundColor: t.surface, borderColor: t.border }]}
              >
                {/* Ikon */}
                <View style={[s.permIconWrap, { backgroundColor: t.primaryMuted }]}>
                  <Ionicons name={item.icon as any} size={22} color={t.primary} />
                </View>

                {/* Teks */}
                <View style={{ flex: 1 }}>
                  <Text style={[s.permLabel, { color: t.text }]}>{item.label}</Text>
                  <Text style={[s.permDesc,  { color: t.textSub }]}>{item.description}</Text>
                </View>

                {/* Tombol buka settings */}
                <TouchableOpacity
                  style={[s.settingsBtn, { borderColor: t.primary }]}
                  onPress={() => handleOpenSettings(item.key)}
                  activeOpacity={0.75}
                >
                  <Ionicons name="settings-outline" size={14} color={t.primary} />
                  <Text style={[s.settingsBtnText, { color: t.primary }]}>Izinkan</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Info tambahan */}
          <View style={[s.infoBox, { backgroundColor: t.surface, borderColor: t.border }]}>
            <Ionicons name="information-circle-outline" size={16} color={t.textSub} />
            <Text style={[s.infoText, { color: t.textSub }]}>
              Setelah mengizinkan di Pengaturan, kembali ke aplikasi dan ketuk tombol di bawah.
            </Text>
          </View>

          {/* Tombol coba lagi */}
          <TouchableOpacity
            style={[s.retryBtn, { backgroundColor: t.primary }]}
            onPress={onRetry}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh-outline" size={18} color="#fff" />
            <Text style={s.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:         { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:           { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 40, paddingTop: 14 },
  handle:          { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  headerRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 20 },
  headerIconWrap:  { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title:           { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  subtitle:        { fontSize: 13, lineHeight: 18 },
  list:            { gap: 12, marginBottom: 16 },
  permRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  permIconWrap:    { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  permLabel:       { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  permDesc:        { fontSize: 12, lineHeight: 17 },
  settingsBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  settingsBtnText: { fontSize: 12, fontWeight: '700' },
  infoBox:         { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 20 },
  infoText:        { flex: 1, fontSize: 12, lineHeight: 17 },
  retryBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  retryBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
