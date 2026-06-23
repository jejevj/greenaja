import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { useNotificationListener } from '../hooks/useNotifications';
import { usePermissions } from '../hooks/usePermissions';
import PermissionModal from '../components/PermissionModal';
import * as Notifications from 'expo-notifications';

// ── Tangkap notifikasi saat app dibuka dari killed state
export async function getInitialNotification() {
  const response = await Notifications.getLastNotificationResponseAsync();
  return response;
}

function RootLayoutNav() {
  useNotificationListener();

  // Request semua izin saat app pertama load
  const { denied, retryAll } = usePermissions();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      {/* Modal muncul otomatis jika ada izin yang ditolak */}
      <PermissionModal denied={denied} onRetry={retryAll} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
