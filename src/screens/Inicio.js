import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAlturaBarra } from '../constants/barra';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const DIAS = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
const MESES = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

function saudacaoDoDia(h) {
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const DOSES = [
  { nome: 'Dipirona 500 mg', horario: '06:00', qtd: '1 comprimido' },
  { nome: 'Losartana 50 mg', horario: '09:00', qtd: '1 comprimido' },
  { nome: 'Metformina 850 mg', horario: '13:00', qtd: '1 comprimido' },
  { nome: 'Sinvastatina 20 mg', horario: '21:00', qtd: '1 comprimido' },
];

function LinhaCard({ icone, cor, corFundo, titulo, subtitulo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.linhaCard, pressed && styles.pressionado]}
    >
      <View style={[styles.linhaIcone, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={26} color={cor} />
      </View>
      <View style={styles.linhaTextos}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>
        <Text style={styles.linhaSubtitulo}>{subtitulo}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#1B2A4E" />
    </Pressable>
  );
}

function CardMeio({ icone, cor, corFundo, titulo, subtitulo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardMeio, pressed && styles.pressionado]}
    >
      <View style={[styles.cardMeioIcone, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={22} color={cor} />
      </View>
      <Text style={styles.cardMeioTitulo}>{titulo}</Text>
      <Text style={styles.cardMeioSubtitulo}>{subtitulo}</Text>
    </Pressable>
  );
}

export default function Inicio({ navigation }) {
  const agora = new Date();
  const alturaBarra = useAlturaBarra();
  const data = `${DIAS[agora.getDay()]} · ${agora.getDate()} DE ${MESES[agora.getMonth()]}`;

  // índice da próxima dose a ser tomada (1 = "2 de 4")
  const [indice, setIndice] = useState(1);
  const total = DOSES.length;
  const concluido = indice >= total;
  const dose = DOSES[Math.min(indice, total - 1)];

  const marcarTomado = () => {
    if (!concluido) setIndice(indice + 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingBottom: alturaBarra + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <View style={{ flex: 1 }}>
            <Text style={styles.data}>{data}</Text>
            <Text style={styles.saudacao}>{saudacaoDoDia(agora.getHours())}, Maria</Text>
          </View>
          <Pressable
            style={styles.botaoAjustes}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Ionicons name="options-outline" size={22} color="#1B2A4E" />
          </Pressable>
        </View>

        {/* Próxima dose */}
        <View style={styles.heroCard}>
          <View style={[styles.circulo, { width: 220, height: 220, right: -70, top: -90 }]} />
          <View style={[styles.circulo, { width: 150, height: 150, right: -35, top: -55 }]} />

          <View style={styles.heroTopo}>
            <View style={styles.heroRotulo}>
              <View style={styles.ponto} />
              <Text style={styles.heroRotuloTexto}>
                {concluido ? 'TUDO CERTO' : 'PRÓXIMA DOSE'}
              </Text>
            </View>
            <Text style={styles.heroContagem}>
              {Math.min(indice + 1, total)} de {total} hoje
            </Text>
          </View>

          <Text style={styles.heroNome}>
            {concluido ? 'Doses de hoje concluídas' : dose.nome}
          </Text>

          {!concluido && (
            <View style={styles.heroDetalhe}>
              <Ionicons name="time-outline" size={16} color="#D9DEEA" />
              <Text style={styles.heroDetalheTexto}>
                {dose.horario} · {dose.qtd}
              </Text>
            </View>
          )}

          <Pressable
            onPress={marcarTomado}
            disabled={concluido}
            style={({ pressed }) => [
              styles.botaoTomado,
              concluido && { opacity: 0.5 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons name="checkmark" size={22} color="#1B2A4E" />
            <Text style={styles.botaoTomadoTexto}>Marcar como tomado</Text>
          </Pressable>

          <View style={styles.progresso}>
            {DOSES.map((_, i) => (
              <View
                key={i}
                style={[styles.segmento, i <= indice && styles.segmentoAtivo]}
              />
            ))}
          </View>
        </View>

        {/* Como você está hoje? */}
        <LinhaCard
          icone="happy-outline"
          cor="#7B63C9"
          corFundo="#E7E1F6"
          titulo="Como você está hoje?"
          subtitulo="Um toque avisa sua família"
          onPress={() => navigation.navigate('Contatos')}
        />

        {/* Meus medicamentos */}
        <LinhaCard
          icone="medical-outline"
          cor="#2B7BD6"
          corFundo="#DCE8F7"
          titulo="Meus medicamentos"
          subtitulo="4 remédios para hoje"
          onPress={() => navigation.navigate('Medicamentos')}
        />

        {/* Exercícios / Apoio */}
        <View style={styles.linhaDupla}>
          <CardMeio
            icone="pulse-outline"
            cor="#B7791F"
            corFundo="#F6E3B8"
            titulo="Exercícios"
            subtitulo="3 atividades fáceis (15 min)"
            onPress={() => navigation.navigate('Exercicios')}
          />
          <CardMeio
            icone="people-outline"
            cor="#7B63C9"
            corFundo="#E7E1F6"
            titulo="Apoio"
            subtitulo="Ligue para a família"
            onPress={() => navigation.navigate('Contatos')}
          />
        </View>
      </ScrollView>

      {/* Emergência fixa (logo acima da barra do App.js) */}
      <Pressable
        onPress={() => navigation.navigate('Emergencia')}
        style={({ pressed }) => [
          styles.emergencia,
          { bottom: alturaBarra + 10 },
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={styles.emergenciaIcone}>
          <Ionicons name="call-outline" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.emergenciaTitulo}>Emergência</Text>
          <Text style={styles.emergenciaSubtitulo}>Avisa SAMU e família</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const NAVY = '#1B2A5E';
const OURO = '#EBCB8B';

const sombra = Platform.select({
  ios: {
    shadowColor: '#1B2A4E',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  conteudo: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100, gap: 14 },
  pressionado: { opacity: 0.85, transform: [{ scale: 0.99 }] },

  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  data: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#A66A12',
    marginBottom: 2,
  },
  saudacao: { fontFamily: SERIF, fontSize: 32, fontWeight: '800', color: '#14213D' },
  botaoAjustes: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra,
  },

  heroCard: {
    backgroundColor: NAVY,
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
    ...sombra,
  },
  circulo: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroRotulo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ponto: { width: 8, height: 8, borderRadius: 4, backgroundColor: OURO },
  heroRotuloTexto: { color: OURO, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  heroContagem: { color: '#D9DEEA', fontSize: 13 },
  heroNome: {
    fontFamily: SERIF,
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 14,
  },
  heroDetalhe: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  heroDetalheTexto: { color: '#D9DEEA', fontSize: 15 },
  botaoTomado: {
    marginTop: 16,
    backgroundColor: OURO,
    borderRadius: 18,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botaoTomadoTexto: { fontSize: 18, fontWeight: '800', color: '#1B2A4E' },
  progresso: { flexDirection: 'row', gap: 8, marginTop: 14 },
  segmento: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  segmentoAtivo: { backgroundColor: OURO },

  linhaCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...sombra,
  },
  linhaIcone: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaTextos: { flex: 1 },
  linhaTitulo: { fontSize: 17, fontWeight: '800', color: '#14213D' },
  linhaSubtitulo: { fontSize: 14, color: '#5B6475', marginTop: 2 },

  linhaDupla: { flexDirection: 'row', gap: 14 },
  cardMeio: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 16,
    minHeight: 130,
    ...sombra,
  },
  cardMeioIcone: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardMeioTitulo: { fontSize: 17, fontWeight: '800', color: '#14213D' },
  cardMeioSubtitulo: { fontSize: 13, color: '#5B6475', marginTop: 2 },

  emergencia: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 8,
    backgroundColor: '#B23A2A',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...sombra,
  },
  emergenciaIcone: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergenciaTitulo: { color: '#fff', fontSize: 17, fontWeight: '800' },
  emergenciaSubtitulo: { color: '#FBE3DF', fontSize: 13 },
});