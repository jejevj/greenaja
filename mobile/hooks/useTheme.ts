import { useColorScheme } from 'react-native';
import { LIGHT, DARK } from '../constants/Theme';

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DARK : LIGHT;
}
