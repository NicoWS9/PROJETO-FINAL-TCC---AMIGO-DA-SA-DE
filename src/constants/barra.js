import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BARRA_ALTURA = 64;

// Altura total ocupada pela barra flutuante (barra + margem inferior)
export function useAlturaBarra() {
  const insets = useSafeAreaInsets();
  return BARRA_ALTURA + Math.max(insets.bottom, 10);
}