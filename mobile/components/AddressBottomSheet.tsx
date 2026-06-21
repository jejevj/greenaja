import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, Animated,
  TextInput, ScrollView, useColorScheme, KeyboardAvoidingView,
  Platform, Dimensions, PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LIGHT, DARK } from '../constants/Theme';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.92;

export type AddressForm = {
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: AddressForm) => void;
}

const DEFAULT_REGION: Region = {
  latitude:      -6.5971,
  longitude:     106.8060,
  latitudeDelta:  0.01,
  longitudeDelta: 0.01,
};

const LABEL_OPTIONS = ['Rumah', 'Kantor', 'Kos', 'Orang Tua', 'Lainnya'];

export default function AddressBottomSheet({ visible, onClose, onSave }: Props) {
  const t = useColorScheme() === 'dark' ? DARK : LIGHT;

  // Sheet animation
  const slideAnim = useRef(new Animated.Value(SHEET_H)).current;
  const mapRef    = useRef<MapView>(null);

  // Step: 'map' | 'form'
  const [step, setStep] = useState<'map' | 'form'>('map');

  // Map state
  const [pinCoord, setPinCoord] = useState({ lat: DEFAULT_REGION.latitude, lng: DEFAULT_REGION.longitude });
  const [region,   setRegion]   = useState<Region>(DEFAULT_REGION);

  // Form state
  const [label,   setLabel]   = useState('');
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [address, setAddress] = useState('');
  const [city,    setCity]    = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setStep('map');
      setLabel('');
      setName('');
      setPhone('');
      setAddress('');
      setCity('');
      setErrors({});
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 68, friction: 11 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: SHEET_H, duration: 260, useNativeDriver: true }).start();
    }
  }, [visible]);

  // Drag to dismiss
  const dragY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => { if (g.dy > 0) dragY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) { onClose(); dragY.setValue(0); }
        else Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPinCoord({ lat: latitude, lng: longitude });
    setRegion(r => ({ ...r, latitude, longitude }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!label)   e.label   = 'Pilih label alamat';
    if (!name.trim())    e.name    = 'Nama penerima wajib diisi';
    if (!phone.trim())   e.phone   = 'Nomor telepon wajib diisi';
    if (!address.trim()) e.address = 'Detail alamat wajib diisi';
    if (!city.trim())    e.city    = 'Kota/kecamatan wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ label, name, phone, address, city, lat: pinCoord.lat, lng: pinCoord.lng });
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: t.bg, transform: [{ translateY: Animated.add(slideAnim, dragY) }] },
        ]}
      >
        {/* Handle */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={[styles.handle, { backgroundColor: t.border }]} />
        </View>

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: t.border }]}>
          {step === 'form' && (
            <TouchableOpacity onPress={() => setStep('map')} style={styles.stepBackBtn}>
              <Ionicons name="arrow-back-outline" size={20} color={t.text} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[styles.sheetTitle, { color: t.text }]}>
              {step === 'map' ? 'Pin Lokasi' : 'Detail Alamat'}
            </Text>
            <Text style={[styles.sheetSub, { color: t.textSub }]}>
              {step === 'map' ? 'Tap peta untuk menentukan titik lokasi' : 'Lengkapi informasi penerima'}
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
        <View style={styles.stepRow}>
          {['Pin Lokasi', 'Detail Alamat'].map((s, i) => {
            const done    = (step === 'map' && i === 0) || (step === 'form' && i <= 1);
            const current = (step === 'map' && i === 0) || (step === 'form' && i === 1);
            return (
              <View key={i} style={styles.stepItem}>
                <View style={[styles.stepDot, {
                  backgroundColor: done ? t.primary : t.border,
                  width: current ? 28 : 20,
                  borderRadius: current ? 8 : 10,
                }]}>
                  {step === 'form' && i === 0
                    ? <Ionicons name="checkmark-outline" size={12} color="#fff" />
                    : <Text style={styles.stepNum}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepLabel, { color: done ? t.primary : t.textSub }]}>{s}</Text>
                {i < 1 && <View style={[styles.stepLine, { backgroundColor: step === 'form' ? t.primary : t.border }]} />}
              </View>
            );
          })}
        </View>

        {/* ── STEP 1: MAP ── */}
        {step === 'map' && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={DEFAULT_REGION}
              region={region}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton={false}
              mapType="standard"
            >
              <Marker
                coordinate={{ latitude: pinCoord.lat, longitude: pinCoord.lng }}
                pinColor="#1A7A4A"
              />
            </MapView>

            {/* Pin center overlay hint */}
            <View style={styles.mapHint}>
              <Ionicons name="information-circle-outline" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.mapHintText}>Tap peta untuk pindahkan pin</Text>
            </View>

            {/* Koordinat preview */}
            <View style={[styles.coordBox, { backgroundColor: t.surface, borderColor: t.border }]}>
              <Ionicons name="location" size={14} color={t.primary} />
              <Text style={[styles.coordText, { color: t.textSub }]}>
                {pinCoord.lat.toFixed(5)}, {pinCoord.lng.toFixed(5)}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: t.primary }]}
              onPress={() => setStep('form')}
            >
              <Text style={styles.nextBtnText}>Konfirmasi Lokasi</Text>
              <Ionicons name="arrow-forward-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: FORM ── */}
        {step === 'form' && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              contentContainerStyle={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Mini map preview */}
              <View style={[styles.miniMapWrap, { borderColor: t.border }]}>
                <MapView
                  style={styles.miniMap}
                  region={{ latitude: pinCoord.lat, longitude: pinCoord.lng, latitudeDelta: 0.004, longitudeDelta: 0.004 }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker coordinate={{ latitude: pinCoord.lat, longitude: pinCoord.lng }} pinColor="#1A7A4A" />
                </MapView>
                <TouchableOpacity
                  style={[styles.editPinBtn, { backgroundColor: t.surface, borderColor: t.border }]}
                  onPress={() => setStep('map')}
                >
                  <Ionicons name="pencil-outline" size={13} color={t.primary} />
                  <Text style={[styles.editPinText, { color: t.primary }]}>Edit Pin</Text>
                </TouchableOpacity>
              </View>

              {/* Label pilihan */}
              <Text style={[styles.fieldLabel, { color: t.text }]}>Label Alamat <Text style={{ color: '#EF4444' }}>*</Text></Text>
              <View style={styles.labelRow}>
                {LABEL_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setLabel(opt)}
                    style={[
                      styles.labelChip,
                      {
                        backgroundColor: label === opt ? t.primary      : t.surface,
                        borderColor:     label === opt ? t.primary      : t.border,
                      },
                    ]}
                  >
                    <Text style={[styles.labelChipText, { color: label === opt ? '#fff' : t.text }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.label && <Text style={styles.errorText}>{errors.label}</Text>}

              {/* Nama */}
              <Field
                label="Nama Penerima" value={name} onChangeText={setName}
                placeholder="Contoh: Budi Santoso" error={errors.name} t={t}
              />
              {/* Telepon */}
              <Field
                label="Nomor Telepon" value={phone} onChangeText={setPhone}
                placeholder="Contoh: 0812-3456-7890" keyboardType="phone-pad" error={errors.phone} t={t}
              />
              {/* Detail */}
              <Field
                label="Detail Alamat" value={address} onChangeText={setAddress}
                placeholder="Nama jalan, no. rumah, RT/RW" error={errors.address} t={t} multiline
              />
              {/* Kota */}
              <Field
                label="Kota / Kecamatan" value={city} onChangeText={setCity}
                placeholder="Contoh: Bogor, Jawa Barat 16151" error={errors.city} t={t}
              />

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: t.primary }]}
                onPress={handleSave}
              >
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

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({
  label, value, onChangeText, placeholder, error, t, keyboardType, multiline,
}: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder: string; error?: string; t: typeof LIGHT;
  keyboardType?: 'default' | 'phone-pad' | 'numeric';
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.fieldLabel, { color: t.text }]}>
        {label} <Text style={{ color: '#EF4444' }}>*</Text>
      </Text>
      <TextInput
        style={[
          styles.fieldInput,
          {
            backgroundColor: t.surface,
            borderColor: error ? '#EF4444' : t.border,
            color: t.text,
            height: multiline ? 80 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={t.textSub}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:          { position: 'absolute', bottom: 0, left: 0, right: 0, height: SHEET_H, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  handleArea:     { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle:         { width: 44, height: 4, borderRadius: 2 },
  sheetHeader:    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  stepBackBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sheetTitle:     { fontSize: 17, fontWeight: '800', letterSpacing: -0.2 },
  sheetSub:       { fontSize: 12, marginTop: 1 },
  closeBtn:       { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  // steps
  stepRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 40, gap: 0 },
  stepItem:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepDot:        { height: 20, alignItems: 'center', justifyContent: 'center' },
  stepNum:        { fontSize: 10, fontWeight: '800', color: '#fff' },
  stepLabel:      { fontSize: 12, fontWeight: '600' },
  stepLine:       { width: 40, height: 2, marginHorizontal: 6 },

  // map step
  mapContainer:   { flex: 1, position: 'relative' },
  map:            { flex: 1 },
  mapHint:        { position: 'absolute', top: 12, left: 0, right: 0, alignItems: 'center' },
  mapHintText:    { fontSize: 12, color: 'rgba(255,255,255,0.92)', backgroundColor: 'rgba(0,0,0,0.38)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  coordBox:       { position: 'absolute', bottom: 80, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  coordText:      { fontSize: 12, flex: 1 },
  nextBtn:        { position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16 },
  nextBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },

  // form step
  formScroll:     { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  miniMapWrap:    { height: 140, borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 20, position: 'relative' },
  miniMap:        { flex: 1 },
  editPinBtn:     { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  editPinText:    { fontSize: 11, fontWeight: '700' },
  fieldLabel:     { fontSize: 13, fontWeight: '700', marginBottom: 7 },
  labelRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  labelChip:      { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  labelChipText:  { fontSize: 13, fontWeight: '600' },
  fieldInput:     { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingTop: 12, fontSize: 14 },
  errorText:      { fontSize: 11, color: '#EF4444', marginTop: 4 },
  saveBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, marginTop: 8 },
  saveBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
