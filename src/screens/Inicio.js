import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAlturaBarra } from '../components/BarraInferior';
import { cores } from '../styles/tema';
import { estilosInicio } from '../styles/inicioStyles';

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
      style={({ pressed }) => [estilosInicio.linhaCard, pressed && estilosInicio.pressionado]}
    >
      <View style={[estilosInicio.linhaIcone, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={26} color={cor} />
      </View>
      <View style={estilosInicio.linhaTextos}>
        <Text style={estilosInicio.linhaTitulo}>{titulo}</Text>
        <Text style={estilosInicio.linhaSubtitulo}>{subtitulo}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={cores.azulTinta} />
    </Pressable>
  );
}

function CardMeio({ icone, cor, corFundo, titulo, subtitulo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilosInicio.cardMeio, pressed && estilosInicio.pressionado]}
    >
      <View style={[estilosInicio.cardMeioIcone, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={22} color={cor} />
      </View>
      <Text style={estilosInicio.cardMeioTitulo}>{titulo}</Text>
      <Text style={estilosInicio.cardMeioSubtitulo}>{subtitulo}</Text>
    </Pressable>
  );
}

export default function Inicio({ navigation }) {
  const alturaBarra = useAlturaBarra();
  const agora = new Date();
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
    <SafeAreaView style={estilosInicio.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[estilosInicio.conteudo, { paddingBottom: alturaBarra + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={estilosInicio.cabecalho}>
          <View style={{ flex: 1 }}>
            <Text style={estilosInicio.data}>{data}</Text>
            <Text style={estilosInicio.saudacao}>{saudacaoDoDia(agora.getHours())}, Maria</Text>
          </View>
          <Pressable
            style={estilosInicio.botaoAjustes}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Ionicons name="options-outline" size={22} color={cores.azulTinta} />
          </Pressable>
        </View>

        {/* Próxima dose */}
        <View style={estilosInicio.heroCard}>
          <View style={[estilosInicio.circulo, { width: 220, height: 220, right: -70, top: -90 }]} />
          <View style={[estilosInicio.circulo, { width: 150, height: 150, right: -35, top: -55 }]} />

          <View style={estilosInicio.heroTopo}>
            <View style={estilosInicio.heroRotulo}>
              <View style={estilosInicio.ponto} />
              <Text style={estilosInicio.heroRotuloTexto}>
                {concluido ? 'TUDO CERTO' : 'PRÓXIMA DOSE'}
              </Text>
            </View>
            <Text style={estilosInicio.heroContagem}>
              {Math.min(indice + 1, total)} de {total} hoje
            </Text>
          </View>

          <Text style={estilosInicio.heroNome}>
            {concluido ? 'Doses de hoje concluídas' : dose.nome}
          </Text>

          {!concluido && (
            <View style={estilosInicio.heroDetalhe}>
              <Ionicons name="time-outline" size={16} color={cores.textoClaro} />
              <Text style={estilosInicio.heroDetalheTexto}>
                {dose.horario} · {dose.qtd}
              </Text>
            </View>
          )}

          <Pressable
            onPress={marcarTomado}
            disabled={concluido}
            style={({ pressed }) => [
              estilosInicio.botaoTomado,
              concluido && { opacity: 0.5 },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons name="checkmark" size={22} color={cores.azulTinta} />
            <Text style={estilosInicio.botaoTomadoTexto}>Marcar como tomado</Text>
          </Pressable>

          <View style={estilosInicio.progresso}>
            {DOSES.map((_, i) => (
              <View
                key={i}
                style={[estilosInicio.segmento, i <= indice && estilosInicio.segmentoAtivo]}
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
        <View style={estilosInicio.linhaDupla}>
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

      {/* Emergência fixa, logo acima da barra flutuante */}
      <Pressable
        onPress={() => navigation.navigate('Emergencia')}
        style={({ pressed }) => [
          estilosInicio.emergencia,
          { bottom: alturaBarra + 10 },
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={estilosInicio.emergenciaIcone}>
          <Ionicons name="call-outline" size={22} color={cores.branco} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={estilosInicio.emergenciaTitulo}>Emergência</Text>
          <Text style={estilosInicio.emergenciaSubtitulo}>Avisa SAMU e família</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={cores.branco} />
      </Pressable>
    </SafeAreaView>
  );
}