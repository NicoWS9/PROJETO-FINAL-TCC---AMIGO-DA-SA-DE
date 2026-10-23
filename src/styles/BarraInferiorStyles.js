import { StyleSheet } from 'react-native';
import { BARRA_ALTURA } from '../components/BarraInferior';
import { sombraPadrao } from './tema';

export const estilosBarraInferior = StyleSheet.create({
  // flutua sobre o conteúdo: sem fundo próprio
  fundo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  // a sombra fica aqui; o recorte (overflow) fica no filho
  sombra: {
    borderRadius: 32,
    ...sombraPadrao,
  },
  vidro: {
    minHeight: BARRA_ALTURA,
    borderRadius: 32,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.7)', // reflexo na quina do vidro
  },
  solido: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(27,42,94,0.10)',
  },
  pelicula: { backgroundColor: 'rgba(255,255,255,0.32)' },
  aba: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  abaAtiva: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(27,42,94,0.12)',
  },
  abaTexto: { fontSize: 12, fontWeight: '700' },
});