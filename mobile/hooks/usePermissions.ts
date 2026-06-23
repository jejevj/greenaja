import { useEffect, useState, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// ─── Tipe satu izin ───────────────────────────────────────────────────────────
export type PermissionKey = 'location' | 'notifications';

export type PermissionItem = {
  key: PermissionKey;
  label: string;         // Nama ramah tampil di modal
  description: string;   // Alasan kenapa dibutuhkan
  icon: string;          // Ionicons name
  status: 'granted' | 'denied' | 'undetermined' | 'loading';
};

// ─── Deep-link langsung ke halaman izin aplikasi ──────────────────────────────
export async function openAppPermissionSettings(key: PermissionKey) {
  if (Platform.OS === 'ios') {
    // iOS: buka Settings app — tidak bisa deep-link ke izin spesifik
    await Linking.openURL('app-settings:');
  } else {
    // Android: buka langsung ke detail izin aplikasi
    await Linking.openSettings();
  }
}

// ─── Hook utama ───────────────────────────────────────────────────────────────
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      key: 'location',
      label: 'Lokasi',
      description: 'Diperlukan untuk menampilkan kecamatan kamu dan menemukan produk serta petani di sekitarmu.',
      icon: 'location-outline',
      status: 'loading',
    },
    {
      key: 'notifications',
      label: 'Notifikasi',
      description: 'Diperlukan untuk mengirimkan update pesanan, promo, dan pengingat penting dari GreenAja.',
      icon: 'notifications-outline',
      status: 'loading',
    },
  ]);

  const [ready, setReady] = useState(false); // true setelah semua izin dicek

  // Fungsi update status satu izin
  const updateStatus = (key: PermissionKey, status: PermissionItem['status']) =>
    setPermissions(prev =>
      prev.map(p => (p.key === key ? { ...p, status } : p))
    );

  // Request semua izin secara paralel
  const requestAll = useCallback(async () => {
    setReady(false);

    await Promise.all([
      // ── Lokasi ──────────────────────────────────────────────────────────────
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          updateStatus('location', status === 'granted' ? 'granted' : 'denied');
        } catch {
          updateStatus('location', 'denied');
        }
      })(),

      // ── Notifikasi ──────────────────────────────────────────────────────────
      (async () => {
        try {
          const { status } = await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true },
          });
          updateStatus(
            'notifications',
            status === 'granted' ? 'granted' : 'denied'
          );
        } catch {
          updateStatus('notifications', 'denied');
        }
      })(),
    ]);

    setReady(true);
  }, []);

  // Jalankan saat app pertama kali load
  useEffect(() => {
    requestAll();
  }, []);

  // Izin yang ditolak (untuk ditampilkan di modal)
  const denied = permissions.filter(p => p.status === 'denied');

  return {
    permissions,
    denied,
    ready,
    retryAll: requestAll,
  };
}
