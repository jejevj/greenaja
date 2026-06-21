import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function MainLayout() {
  const scheme = useColorScheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="order-success" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="orders" />
        <Stack.Screen name="order-detail" />
        <Stack.Screen name="order-review" />
        <Stack.Screen name="products" />
        <Stack.Screen name="search" />
      </Stack>
    </>
  );
}
