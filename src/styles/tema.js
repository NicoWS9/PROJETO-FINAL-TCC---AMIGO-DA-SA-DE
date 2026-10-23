// Valores compartilhados entre os arquivos de estilo (cores, sombra, fonte).
import { Platform } from 'react-native';

export const cores = {
  azulMarinho: '#1B2A5E',
  azulTinta: '#1B2A4E',
  ouro: '#EBCB8B',
  ouroEscuro: '#A66A12',
  fundoCreme: '#F6F0E6',
  textoEscuro: '#14213D',
  textoSuave: '#5B6475',
  textoClaro: '#D9DEEA',
  inativo: '#4A5578', // ~6,4:1 sobre #F4F0EA
  emergencia: '#B23A2A',
  emergenciaSuave: '#FBE3DF',
  branco: '#fff',
};

export const fonteSerifada = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

export const sombraPadrao = Platform.select({
  ios: {
    shadowColor: cores.azulTinta,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
});