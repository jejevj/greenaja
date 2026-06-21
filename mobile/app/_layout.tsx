import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';
import { useNotificationListener } from '../hooks/useNotifications';
import * as Notifications from 'expo-notifications';

// ── Tangkap notifikasi saat app dibuka dari killed state
export async function getInitialNotification() {
  const response = await Notifications.getLastNotificationResponseAsync();
  return response;
}

function RootLayoutNav() {
  // Listener aktif selama app hidup
  useNotificationListener();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
