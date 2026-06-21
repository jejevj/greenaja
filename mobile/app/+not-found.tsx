import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text text40 marginB-8>Halaman tidak ditemukan.</Text>
        <Link href="/(tabs)">
          <Text text65 color="#1a7a4a">Kembali ke Beranda</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
