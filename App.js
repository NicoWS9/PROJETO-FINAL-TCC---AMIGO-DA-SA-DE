import { useEffect, useState } from 'react';
import {
  Pressable,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Login from './src/screens/login';

// IMPORTAÇÕES DAS TELAS (Verifique se as letras maiúsculas/minúsculas dos arquivos estão certas)
import Inicio from './src/screens/Inicio';
import Agenda from './src/screens/agenda';
import Perfil from './src/screens/perfil';
import Medicamentos from './src/screens/medicamentos';
import Exercicios from './src/screens/exercicios';
import Emergencia from './src/screens/emergencia';
import Contatos from './src/screens/contatos';
import { BARRA_ALTURA } from './src/constants/barra';

const Tab = createBottomTabNavigator();

const NAVY = '#1B2A5E';
const INATIVO = '#4A5578'; // ~6,4:1 sobre #F4F0EA

const ABAS = [
  { rota: 'Início', rotulo: 'Hoje', icone: 'home-outline', iconeAtivo: 'home' },
  { rota: 'Agenda', rotulo: 'Agenda', icone: 'calendar-outline', iconeAtivo: 'calendar' },
  { rota: 'Perfil', rotulo: 'Perfil', icone: 'person-outline', iconeAtivo: 'person' },
];

// Barra flutuante em vidro: a única do app
function BarraInferior({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const rotaAtual = state.routes[state.index].name;

  // Respeita "Reduzir transparência" do sistema
  const [semTransparencia, setSemTransparencia] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled?.()
      .then(setSemTransparencia)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setSemTransparencia
    );
    return () => sub.remove();
  }, []);

  const usarVidro = Platform.OS === 'ios' && !semTransparencia;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.barraFundo, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {/* sombra fica aqui; o recorte (overflow) fica no filho */}
      <View style={styles.barraSombra}>
        <View style={[styles.barra, !usarVidro && styles.barraSolida]}>
          {usarVidro && (
            <>
              <BlurView
                intensity={30}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, styles.vidroTinta]} />
            </>
          )}

          {ABAS.map((aba) => {
            const ativa = rotaAtual === aba.rota;
            return (
              <Pressable
                key={aba.rota}
                onPress={() => navigation.navigate(aba.rota)}
                accessibilityRole="tab"
                accessibilityLabel={aba.rotulo}
                accessibilityState={{ selected: ativa }}
                style={[styles.aba, ativa && styles.abaAtiva]}
              >
                <Ionicons
                  name={ativa ? aba.iconeAtivo : aba.icone}
                  size={22}
                  color={ativa ? NAVY : INATIVO}
                />
                <Text style={[styles.abaTexto, { color: ativa ? NAVY : INATIVO }]}>
                  {aba.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// Opções das telas "internas": ficam registradas nas abas, mas sem botão na barra,
// com cabeçalho próprio e uma seta de voltar.
const telaInterna = (titulo) => ({ navigation }) => ({
  title: titulo,
  headerShown: true,
  headerLeft: () => (
    <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
      <Ionicons name="arrow-back" size={24} color="#1F2D3D" />
    </Pressable>
  ),
});

// Tudo o que o usuário vê DEPOIS de logar
function AppLogado() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        backBehavior="history"
        tabBar={(props) => <BarraInferior {...props} />}
        screenOptions={{
          headerShown: false,
          // barra absoluta: o conteúdo passa por trás do vidro
          tabBarStyle: { position: 'absolute' },
        }}
      >
        <Tab.Screen name="Início" component={Inicio} />
        <Tab.Screen name="Agenda" component={Agenda} />
        <Tab.Screen name="Perfil" component={Perfil} />

        <Tab.Screen name="Medicamentos" component={Medicamentos} options={telaInterna('Meus Remédios')} />
        <Tab.Screen name="Exercicios" component={Exercicios} options={telaInterna('Exercícios Diários')} />
        <Tab.Screen name="Contatos" component={Contatos} options={telaInterna('Meus Contatos')} />
        <Tab.Screen name="Emergencia" component={Emergencia} options={telaInterna('Telefone de Emergência')} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Decide qual "lado" do app mostrar
function Rotas() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2B7BD6" />;
  }
  return usuario ? <AppLogado /> : <Login />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const sombra = Platform.select({
  ios: {
    shadowColor: '#1B2A4E',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
});

const styles = StyleSheet.create({
  // flutua sobre o conteúdo: sem fundo próprio
  barraFundo: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  barraSombra: {
    borderRadius: 32,
    ...sombra,
  },
  barra: {
    minHeight: BARRA_ALTURA,
    borderRadius: 32,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.7)', // borda clara = reflexo na quina do vidro
  },
  barraSolida: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(27,42,94,0.10)',
  },
  // tinta leve: deixa o blur aparecer
  vidroTinta: { backgroundColor: 'rgba(255,255,255,0.01)' },
  aba: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  abaAtiva: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(27,42,94,0.12)',
  },
  abaTexto: { fontSize: 12, fontWeight: '700' },
});