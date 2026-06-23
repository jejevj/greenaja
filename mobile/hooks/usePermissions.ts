import { useEffect, useState, useCallback } from 'react';
import { Linking, Platform, AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// ─── Tipe satu izin ───────────────────────────────────────────────────────────
export type PermissionKey = 'location' | 'notifications';

export type PermissionItem = {
  key: PermissionKey;
  label: string;
  description: string;
  icon: string;
  status: 'granted' | 'denied' | 'undetermined' | 'loading';
};

// ─── Buka Settings ────────────────────────────────────────────────────────────
export async function openAppPermissionSettings(_key?: PermissionKey) {
  if (Platform.OS === 'ios') {
    await Linking.openURL('app-settings:');
  } else {
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

  const [ready, setReady] = useState(false);

  const updateStatus = (key: PermissionKey, status: PermissionItem['status']) =>
    setPermissions(prev =>
      prev.map(p => (p.key === key ? { ...p, status } : p))
    );

  // ── Request SEMUA izin (dipanggil saat app pertama load) ──────────────────
  const requestAll = useCallback(async () => {
    setReady(false);
    await Promise.all([
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          updateStatus('location', status === 'granted' ? 'granted' : 'denied');
        } catch {
          updateStatus('location', 'denied');
        }
      })(),
      (async () => {
        try {
          const { status } = await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true },
          });
          updateStatus('notifications', status === 'granted' ? 'granted' : 'denied');
        } catch {
          updateStatus('notifications', 'denied');
        }
      })(),
    ]);
    setReady(true);
  }, []);

  // ── Re-check status saja (dipanggil saat kembali ke foreground) ───────────
  const recheckAll = useCallback(async () => {
    const [locPerm, notifPerm] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Notifications.getPermissionsAsync(),
    ]);
    updateStatus('location', locPerm.status === 'granted' ? 'granted' : 'denied');
    updateStatus('notifications', notifPerm.status === 'granted' ? 'granted' : 'denied');
  }, []);

  // ── Saat tombol "Coba Lagi" ditekan ──────────────────────────────────────
  // Jika sudah pernah ditolak OS tidak akan munculkan dialog lagi,
  // maka kita arahkan ke Settings. Jika masih undetermined, request ulang.
  const retryAll = useCallback(async () => {
    const denied = permissions.filter(p => p.status === 'denied');
    if (denied.length === 0) return;

    // Cek apakah SEMUA yang denied sudah pernah ditolak permanen
    const locPerm   = await Location.getForegroundPermissionsAsync();
    const notifPerm = await Notifications.getPermissionsAsync();

    const locDenied   = denied.find(p => p.key === 'location');
    const notifDenied = denied.find(p => p.key === 'notifications');

    // Jika OS masih izinkan re-request (canAskAgain), minta lagi
    const canAskLoc   = locDenied   && locPerm.canAskAgain;
    const canAskNotif = notifDenied && notifPerm.canAskAgain;

    if (canAskLoc || canAskNotif) {
      await Promise.all([
        canAskLoc ? (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          updateStatus('location', status === 'granted' ? 'granted' : 'denied');
        })() : Promise.resolve(),
        canAskNotif ? (async () => {
          const { status } = await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true },
          });
          updateStatus('notifications', status === 'granted' ? 'granted' : 'denied');
        })() : Promise.resolve(),
      ]);
    } else {
      // Sudah ditolak permanen → buka Settings
      await openAppPermissionSettings();
    }
  }, [permissions]);

  // ── AppState listener: re-check setiap kembali ke foreground ─────────────
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') recheckAll();
    });
    return () => sub.remove();
  }, [recheckAll]);

  // ── Jalankan request saat pertama kali load ───────────────────────────────
  useEffect(() => {
    requestAll();
  }, []);

  const denied = permissions.filter(p => p.status === 'denied');

  return { permissions, denied, ready, retryAll, recheckAll };
}
