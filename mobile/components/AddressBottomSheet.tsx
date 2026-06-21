import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, Animated,
  TextInput, ScrollView, useColorScheme, KeyboardAvoidingView,
  Platform, Dimensions, PanResponder, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LIGHT, DARK } from '../constants/Theme';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.92;

const MAPS_KEY = 'YOUR_GOOGLE_MAPS_STATIC_API_KEY';

function staticMapUrl(lat: number, lng: number, zoom = 15, w = 600, h = 300) {
  if (MAPS_KEY === 'YOUR_GOOGLE_MAPS_STATIC_API_KEY') {
    return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=${zoom}&l=map&size=${w},${h}&pt=${lng},${lat},pm2gnm`;
  }
  return (
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${lat},${lng}&zoom=${zoom}&size=${w}x${h}` +
    `&markers=color:green%7C${lat},${lng}` +
    `&key=${MAPS_KEY}`
  );
}

export type AddressForm = {
  label: string; name: string; phone: string;
  address: string; city: string; lat: number; lng: number;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: AddressForm) => void;
}

const DEFAULT = { lat: -6.5971, lng: 106.8060 };
const LABEL_OPTIONS = ['Rumah', 'Kantor', 'Kos', 'Orang Tua', 'Lainnya'];

export default function AddressBottomSheet({ visible, onClose, onSave }: Props) {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;

  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const dragY     = useRef(new Animated.Value(0)).current;

  const [step,       setStep]       = useState<'map' | 'form'>('map');
  const [pin,        setPin]        = useState(DEFAULT);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const [label,   setLabel]   = useState('');
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [address, setAddress] = useState('');
  const [city,    setCity]    = useState('');
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setStep('map'); setPin(DEFAULT);
      setLabel(''); setName(''); setPhone(''); setAddress(''); setCity('');
      setErrors({}); setMapLoading(true);
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 68, friction: 11 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SCREEN_H, duration: 260, useNativeDriver: true }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove:    (_, g) => { if (g.dy > 0) dragY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) { onClose(); dragY.setValue(0); }
        else Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const handleGPS = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setPin({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setMapLoading(true);
    } finally {
      setGpsLoading(false);
    }
  };

  const nudgePin = (dLat: number, dLng: number) => {
    setPin(p => ({ lat: p.lat + dLat, lng: p.lng + dLng }));
    setMapLoading(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!label)          e.label   = 'Pilih label alamat';
    if (!name.trim())    e.name    = 'Nama penerima wajib diisi';
    if (!phone.trim())   e.phone   = 'Nomor telepon wajib diisi';
    if (!address.trim()) e.address = 'Detail alamat wajib diisi';
    if (!city.trim())    e.city    = 'Kota/kecamatan wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ label, name, phone, address, city, lat: pin.lat, lng: pin.lng });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View style={[
        styles.sheet,
        { backgroundColor: t.bg, transform: [{ translateY: Animated.add(slideAnim, dragY) }] },
      ]}>
        {/* Handle */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={[styles.handle, { backgroundColor: t.border }]} />
        </View>

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: t.border }]}>
          {step === 'form' && (
            <TouchableOpacity onPress={() => setStep('map')} style={styles.headerBackBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={t.text} />
            </TouchableOpacity>
          )}
          <View style={[styles.headerIconWrap, { backgroundColor: t.primaryMuted }]}>
            <Ionicons
              name={step === 'map' ? 'location-outline' : 'document-text-outline'}
              size={18}
              color={t.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sheetTitle, { color: t.text }]}>
              {step === 'map' ? 'Tentukan Lokasi' : 'Detail Alamat'}
            </Text>
            <Text style={[styles.sheetSub, { color: t.textSub }]}>
              {step === 'map' ? 'Gunakan GPS atau geser pin secara manual' : 'Lengkapi informasi penerima'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: t.surface, borderColor: t.border }]}
          >
            <Ionicons name="close-outline" size={20} color={t.text} />
          </TouchableOpacity>
        </View>

        {/* Step indicator */}
        <View style={[styles.stepBar, { borderBottomColor: t.border }]}>
          {['Pin Lokasi', 'Detail Alamat'].map((s, i) => {
            const active = (step === 'map' && i === 0) || (step === 'form' && i === 1);
            const done   = step === 'form' && i === 0;
            return (
              <React.Fragment key={i}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepCircle, { backgroundColor: (active || done) ? t.primary : t.border }]}>
                    {done
                      ? <Ionicons name="checkmark" size={11} color="#fff" />
                      : <Text style={styles.stepNum}>{i + 1}</Text>
                    }
                  </View>
                  <Text style={[styles.stepLabel, { color: (active || done) ? t.primary : t.textSub }]}>{s}</Text>
                </View>
                {i === 0 && <View style={[styles.stepLine, { backgroundColor: done ? t.primary : t.border }]} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* STEP 1: MAP */}
        {step === 'map' && (
          <View style={{ flex: 1 }}>
            <View style={[styles.mapBox, { backgroundColor: t.accent }]}>
              {mapLoading && (
                <View style={styles.mapLoadingOverlay}>
                  <ActivityIndicator color={t.primary} size="large" />
                </View>
              )}
              <Image
                source={{ uri: staticMapUrl(pin.lat, pin.lng) }}
                style={styles.mapImage}
                resizeMode="cover"
                onLoad={() => setMapLoading(false)}
                onError={() => setMapLoading(false)}
              />
              <View pointerEvents="none" style={styles.pinOverlay}>
                <Ionicons name="location" size={36} color="#1A7A4A" />
                <View style={[styles.pinShadow, { backgroundColor: t.primary }]} />
              </View>
              <View style={styles.nudgeGroup}>
                <TouchableOpacity style={[styles.nudgeBtn, { backgroundColor: t.surface }]} onPress={() => nudgePin(0.001, 0)}>
                  <Ionicons name="arrow-up-outline" size={16} color={t.primary} />
                </TouchableOpacity>
                <View style={styles.nudgeRow}>
                  <TouchableOpacity style={[styles.nudgeBtn, { backgroundColor: t.surface }]} onPress={() => nudgePin(0, -0.001)}>
                    <Ionicons name="arrow-back-outline" size={16} color={t.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.nudgeBtn, { backgroundColor: t.surface }]} onPress={() => nudgePin(0, 0.001)}>
                    <Ionicons name="arrow-forward-outline" size={16} color={t.primary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.nudgeBtn, { backgroundColor: t.surface }]} onPress={() => nudgePin(-0.001, 0)}>
                  <Ionicons name="arrow-down-outline" size={16} color={t.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ paddingHorizontal: 20, paddingTop: 14, gap: 10 }}>
              <View style={[styles.coordBox, { backgroundColor: t.surface, borderColor: t.border }]}>
                <Ionicons name="location" size={14} color={t.primary} />
                <Text style={[styles.coordText, { color: t.text }]}>
                  {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.gpsButton, { backgroundColor: t.primaryMuted, borderColor: t.primary }]}
                onPress={handleGPS}
                disabled={gpsLoading}
              >
                {gpsLoading
                  ? <ActivityIndicator size="small" color={t.primary} />
                  : <Ionicons name="navigate-outline" size={16} color={t.primary} />
                }
                <Text style={[styles.gpsButtonText, { color: t.primary }]}>
                  {gpsLoading ? 'Mendeteksi GPS...' : 'Gunakan Lokasi Saat Ini'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: t.primary }]}
                onPress={() => setStep('form')}
              >
                <Text style={styles.confirmBtnText}>Konfirmasi Lokasi</Text>
                <Ionicons name="arrow-forward-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 2: FORM */}
        {step === 'form' && (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              contentContainerStyle={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[styles.miniMapBox, { borderColor: t.border }]}>
                <Image
                  source={{ uri: staticMapUrl(pin.lat, pin.lng, 15, 600, 200) }}
                  style={styles.miniMapImage}
                  resizeMode="cover"
                />
                <View pointerEvents="none" style={styles.miniPinOverlay}>
                  <Ionicons name="location" size={28} color="#1A7A4A" />
                </View>
                <TouchableOpacity
                  style={[styles.editPinBtn, { backgroundColor: t.surface, borderColor: t.border }]}
                  onPress={() => setStep('map')}
                >
                  <Ionicons name="pencil-outline" size={12} color={t.primary} />
                  <Text style={[styles.editPinText, { color: t.primary }]}>Edit Pin</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.fieldLabel, { color: t.text }]}>
                Label Alamat <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <View style={styles.labelRow}>
                {LABEL_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setLabel(opt)}
                    style={[styles.labelChip, {
                      backgroundColor: label === opt ? t.primary : t.surface,
                      borderColor:     label === opt ? t.primary : t.border,
                    }]}
                  >
                    <Text style={[styles.labelChipText, { color: label === opt ? '#fff' : t.text }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.label && <Text style={styles.err}>{errors.label}</Text>}

              <Field label="Nama Penerima"     value={name}    onChangeText={setName}    placeholder="Contoh: Budi Santoso"       error={errors.name}    t={t} />
              <Field label="Nomor Telepon"     value={phone}   onChangeText={setPhone}   placeholder="Contoh: 0812-3456-7890"     error={errors.phone}   t={t} keyboardType="phone-pad" />
              <Field label="Detail Alamat"    value={address} onChangeText={setAddress} placeholder="Nama jalan, no. rumah, RT/RW" error={errors.address} t={t} multiline />
              <Field label="Kota / Kecamatan" value={city}    onChangeText={setCity}    placeholder="Contoh: Bogor, Jawa Barat"  error={errors.city}    t={t} />

              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: t.primary }]} onPress={handleSave}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Simpan Alamat</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Animated.View>
    </Modal>
  );
}

function Field({ label, value, onChangeText, placeholder, error, t, keyboardType, multiline }: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder: string; error?: string; t: typeof LIGHT;
  keyboardType?: 'default' | 'phone-pad'; multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.fieldLabel, { color: t.text }]}>
        {label} <Text style={{ color: '#EF4444' }}>*</Text>
      </Text>
      <TextInput
        style={[styles.fieldInput, {
          backgroundColor: t.surface,
          borderColor: error ? '#EF4444' : t.border,
          color: t.text,
          height: multiline ? 80 : 48,
          textAlignVertical: multiline ? 'top' : 'center',
        }]}
        placeholder={placeholder}
        placeholderTextColor={t.textSub}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
      />
      {error && <Text style={styles.err}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop:          { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:             { position: 'absolute', bottom: 0, left: 0, right: 0, height: SHEET_H, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  handleArea:        { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle:            { width: 44, height: 4, borderRadius: 2 },
  sheetHeader:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerBackBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerIconWrap:    { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sheetTitle:        { fontSize: 16, fontWeight: '800' },
  sheetSub:          { fontSize: 12, marginTop: 1 },
  closeBtn:          { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepBar:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  stepItem:          { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepCircle:        { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepNum:           { fontSize: 10, fontWeight: '800', color: '#fff' },
  stepLabel:         { fontSize: 12, fontWeight: '600' },
  stepLine:          { width: 40, height: 2, marginHorizontal: 8 },
  mapBox:            { height: 260, position: 'relative', overflow: 'hidden' },
  mapImage:          { width: '100%', height: '100%' },
  mapLoadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  pinOverlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  pinShadow:         { width: 8, height: 4, borderRadius: 4, opacity: 0.3, marginTop: -4 },
  nudgeGroup:        { position: 'absolute', right: 12, top: '50%', transform: [{ translateY: -52 }], alignItems: 'center', gap: 4 },
  nudgeRow:          { flexDirection: 'row', gap: 4 },
  nudgeBtn:          { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4 },
  coordBox:          { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  coordText:         { fontSize: 12, flex: 1 },
  gpsButton:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 12, paddingVertical: 12 },
  gpsButtonText:     { fontSize: 13, fontWeight: '700' },
  confirmBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15 },
  confirmBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
  formScroll:        { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  miniMapBox:        { height: 130, borderRadius: 14, overflow: 'hidden', borderWidth: 1, marginBottom: 18, position: 'relative' },
  miniMapImage:      { width: '100%', height: '100%' },
  miniPinOverlay:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  editPinBtn:        { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  editPinText:       { fontSize: 11, fontWeight: '700' },
  fieldLabel:        { fontSize: 13, fontWeight: '700', marginBottom: 7 },
  labelRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  labelChip:         { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  labelChipText:     { fontSize: 13, fontWeight: '600' },
  fieldInput:        { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingTop: 12, fontSize: 14 },
  err:               { fontSize: 11, color: '#EF4444', marginTop: 4 },
  saveBtn:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  saveBtnText:       { fontSize: 15, fontWeight: '700', color: '#fff' },
});
