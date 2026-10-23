import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet, AccessibilityInfo } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { cores } from '../styles/tema';
import { estilosBarraInferior } from '../styles/BarraInferiorStyles';


export const BARRA_ALTURA = 64;

// Altura total ocupada pela barra flutuante (barra + margem inferior).
// Use nas telas para reservar espaço no fim do conteúdo.
export function useAlturaBarra() {
  const insets = useSafeAreaInsets();
  return BARRA_ALTURA + Math.max(insets.bottom, 10);
}
//-------------------------------------------
// Só estas três rotas aparecem na barra.
const ABAS = [
  { rota: 'Início', rotulo: 'Hoje', icone: 'home-outline', iconeAtivo: 'home' },
  { rota: 'Agenda', rotulo: 'Agenda', icone: 'calendar-outline', iconeAtivo: 'calendar' },
  { rota: 'Perfil', rotulo: 'Perfil', icone: 'person-outline', iconeAtivo: 'person' },
];

// Acompanha a opção "Reduzir transparência" do iOS.
function useReduzirTransparencia() {
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios') return undefined;
    let montado = true;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((valor) => montado && setAtivo(valor))
      .catch(() => {});
    const assinatura = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setAtivo);
    return () => {
      montado = false;
      assinatura.remove();
    };
  }, []);

  return ativo;
}

function ItemAba({ aba, ativa, aoPressionar }) {
  const cor = ativa ? cores.azulMarinho : cores.inativo;
  return (
    <Pressable
      onPress={() => aoPressionar(aba.rota)}
      accessibilityRole="tab"
      accessibilityLabel={aba.rotulo}
      accessibilityState={{ selected: ativa }}
      style={[estilosBarraInferior.aba, ativa && estilosBarraInferior.abaAtiva]}
    >
      <Ionicons name={ativa ? aba.iconeAtivo : aba.icone} size={22} color={cor} />
      <Text style={[estilosBarraInferior.abaTexto, { color: cor }]}>{aba.rotulo}</Text>
    </Pressable>
  );
}

// Barra flutuante em vidro: a única do app. Entregue ao navigator via `tabBar`,
// por isso aparece em todas as telas (inclusive nas internas).
export default function BarraInferior({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const semTransparencia = useReduzirTransparencia();
  const usarVidro = Platform.OS === 'ios' && !semTransparencia;
  const rotaAtual = state.routes[state.index].name;

  const aoPressionar = useCallback(
    (nomeRota) => {
      const rota = state.routes.find((r) => r.name === nomeRota);
      if (!rota) return;
      const evento = navigation.emit({
        type: 'tabPress',
        target: rota.key,
        canPreventDefault: true,
      });
      if (rotaAtual !== nomeRota && !evento.defaultPrevented) {
        navigation.navigate(nomeRota);
      }
    },
    [state.routes, rotaAtual, navigation]
  );

  return (
    <View
      pointerEvents="box-none"
      style={[estilosBarraInferior.fundo, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={estilosBarraInferior.sombra}>
        <View style={[estilosBarraInferior.vidro, !usarVidro && estilosBarraInferior.solido]}>
          {usarVidro && (
            <>
              <BlurView
                intensity={15}
                tint="systemChromeMaterialLight"
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, estilosBarraInferior.pelicula]} />
            </>
          )}
          {ABAS.map((aba) => (
            <ItemAba
              key={aba.rota}
              aba={aba}
              ativa={rotaAtual === aba.rota}
              aoPressionar={aoPressionar}
            />
          ))}
        </View>
      </View>
    </View>
  );
}