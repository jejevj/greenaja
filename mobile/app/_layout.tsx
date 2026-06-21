import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors, ThemeManager } from 'react-native-ui-lib';

SplashScreen.preventAutoHideAsync();

Colors.loadColors({
  primaryGreen: '#1a7a4a',
  lightGreen: '#4caf50',
  darkGreen: '#0d4a2c',
  accent: '#f9a825',
  background: '#f4f9f6',
});

ThemeManager.setComponentTheme('Button', {
  borderRadius: 12,
});

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
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
