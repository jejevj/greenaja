import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors, Typography, ThemeManager } from 'react-native-ui-lib';

SplashScreen.preventAutoHideAsync();

// Setup RNUILIB colors per official docs
Colors.loadColors({
  primaryGreen: '#1a7a4a',
  lightGreen: '#4caf50',
  darkGreen: '#0d4a2c',
  accent: '#f9a825',
  bgLight: '#f4f9f6',
  textPrimary: '#1a1a1a',
  textMuted: '#666666',
  white: '#ffffff',
  error: '#e53935',
});

// Setup Typography
Typography.loadTypographies({
  heading: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  subheading: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  body: { fontSize: 15, color: Colors.textPrimary },
  caption: { fontSize: 12, color: Colors.textMuted },
});

// Setup default component themes
ThemeManager.setComponentTheme('Button', {
  borderRadius: 12,
  backgroundColor: Colors.primaryGreen,
});

ThemeManager.setComponentTheme('TextField', {
  borderRadius: 12,
  fieldStyle: {
    borderWidth: 1.5,
    borderColor: Colors.$outlineDefault,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
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
