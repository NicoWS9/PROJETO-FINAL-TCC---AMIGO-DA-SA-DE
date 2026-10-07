import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CardAcao({ titulo, subtitulo, icone, cor, corFundo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { borderColor: cor, backgroundColor: corFundo ?? '#fff' }]}
    >
      <View style={[styles.iconeBox, { backgroundColor: cor + '22' }]}>
        <Ionicons name={icone} size={24} color={cor} />
      </View>

      <View style={styles.textos}>
        <Text style={[styles.titulo, corFundo && { color: cor }]}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#333" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // ícone | textos | seta lado a lado
    alignItems: 'center', // centraliza na vertical
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  iconeBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textos: { flex: 1 }, // ocupa todo o espaço que sobra, empurrando a seta para a direita
  titulo: { fontSize: 18, fontWeight: '700', color: '#1F2D3D' },
  subtitulo: { fontSize: 13, color: '#444', marginTop: 2 },
});