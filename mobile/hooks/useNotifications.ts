import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// ── Tampilkan notifikasi meski app sedang foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Minta izin push notification dan kembalikan Expo Push Token.
 * Kembalikan null jika bukan perangkat fisik atau izin ditolak.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[GreenAja] Push notification hanya berjalan di perangkat fisik.');
    return null;
  }

  // Cek & minta izin
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('[GreenAja] Izin push notification ditolak.');
    return null;
  }

  // Ambil Expo Push Token
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn('[GreenAja] EAS projectId tidak ditemukan di app.json.');
    return null;
  }
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  // Android: buat channel default
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'GreenAja',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1A7A4A',
    });
    // Channel khusus pesanan
    await Notifications.setNotificationChannelAsync('orders', {
      name: 'Update Pesanan',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200],
      lightColor: '#3B82F6',
    });
    // Channel promosi
    await Notifications.setNotificationChannelAsync('promo', {
      name: 'Promo & Voucher',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#F59E0B',
    });
  }

  console.log('[GreenAja] Push Token:', token);
  return token;
}

/**
 * Hook untuk mendengarkan notifikasi masuk dan tap notifikasi.
 * Taruh di root layout agar selalu aktif.
 */
export function useNotificationListener() {
  const notifListener    = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Notifikasi diterima saat app foreground
    notifListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      console.log('[GreenAja] Notif diterima:', title, '-', body);
    });

    // User tap notifikasi (foreground/background/killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as Record<string, any>;
      handleNotificationNavigation(data);
    });

    return () => {
      notifListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}

/**
 * Navigasi otomatis berdasarkan data payload notifikasi.
 * Payload contoh: { screen: 'order-detail', orderId: 'GRN-xxx' }
 */
function handleNotificationNavigation(data: Record<string, any>) {
  if (!data?.screen) return;
  switch (data.screen) {
    case 'order-detail':
      if (data.orderId) router.push({ pathname: '/(tabs)/order-detail', params: { id: data.orderId } });
      break;
    case 'orders':
      router.push('/(tabs)/orders');
      break;
    case 'vouchers':
      router.push('/(tabs)/vouchers');
      break;
    case 'explore':
      router.push('/(tabs)/explore');
      break;
    default:
      router.push('/(tabs)/');
  }
}
