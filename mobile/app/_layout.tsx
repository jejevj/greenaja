import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors, Typography, ThemeManager } from 'react-native-ui-lib';

SplashScreen.preventAutoHideAsync();

Colors.loadColors({
  primaryGreen: '#1a7a4a',
  lightGreen: '#4caf50',
  darkGreen: '#0d4a2c',
  accent: '#f9a825',
  bgLight: '#f4f9f6',
  textPrimary: '#1a1a1a',
  textMuted: '#888888',
  white: '#ffffff',
  error: '#e53935',
});

Typography.loadTypographies({
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  subheading: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  body: { fontSize: 15, color: '#1a1a1a' },
  caption: { fontSize: 12, color: '#888888' },
});

ThemeManager.setComponentTheme('Button', { borderRadius: 12 });

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
