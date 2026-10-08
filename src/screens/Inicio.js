import { Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardAcao from '../components/CardAcao';

export default function Inicio({navigation}) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.saudacao}>Olá, Maria!</Text>
        <Text style={styles.pergunta}>Como você está hoje?</Text>

        <CardAcao
          titulo="Meus Medicamentos"
          subtitulo="4 remédios para hoje"
          icone="medkit-outline"
          cor="#2B7BD6"
          corFundo="#3976B826"
          onPress={() => navigation.navigate('Medicamentos')}
        />
        <CardAcao
          titulo="Exercícios Diários"
          subtitulo="3 atividades fáceis (15 min)"
          icone="fitness-outline"
          cor="#2FA37A"
          corFundo="#63B89C26"
          onPress={() => {}}
        />
        <CardAcao
          titulo="Contatos de Apoio"
          subtitulo="Ligue para a família"
          icone="call-outline"
          cor="#7B63C9"
          corFundo="#8B7BB826"
          onPress={() => {}}
        />
        <CardAcao
          titulo="EMERGÊNCIA"
          subtitulo="Ligar para o SAMU 192"
          icone="call"
          cor="#F28C28"
          corFundo="#FDE9D0"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' },
  conteudo: { padding: 20, gap: 16 },
  saudacao: { fontSize: 30, fontWeight: '800', color: '#1F2D3D' },
  pergunta: { fontSize: 16, color: '#333', marginBottom: 8 },
});