import * as Notifications from 'expo-notifications';
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

export async function registerForPushNotifications(): Promise<string | null> {
  try {
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

    // Android: buat channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'GreenAja',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1A7A4A',
      });
      await Notifications.setNotificationChannelAsync('orders', {
        name: 'Update Pesanan',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200],
        lightColor: '#3B82F6',
      });
      await Notifications.setNotificationChannelAsync('promo', {
        name: 'Promo & Voucher',
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: '#F59E0B',
      });
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
    console.log('[GreenAja] Push Token:', token);
    return token;

  } catch (err) {
    console.warn('[GreenAja] Gagal mendapatkan push token:', err);
    return null;
  }
}

export function useNotificationListener() {
  const notifListener    = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    notifListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      console.log('[GreenAja] Notif diterima:', title, '-', body);
    });

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
