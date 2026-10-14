import { Pressable, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

const Tab = createBottomTabNavigator();

// Opções das telas "internas": ficam registradas nas abas, mas sem botão na barra,
// com cabeçalho próprio e uma seta de voltar.
const telaInterna = (titulo) => ({ navigation }) => ({
  title: titulo,
  headerShown: true,
  tabBarItemStyle: { display: 'none' },
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
        screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2B7BD6' }}
      >
        <Tab.Screen
          name="Início"
          component={Inicio}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Agenda"
          component={Agenda}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Perfil}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />

        <Tab.Screen name="Medicamentos" component={Medicamentos} options={telaInterna('Meus Remédios')} />
        <Tab.Screen name="Exercicios" component={Exercicios} options={telaInterna('Exercícios Diários')} />
        <Tab.Screen name="Contatos" component={Contatos} options={telaInterna('Meus Contatos')} />
        <Tab.Screen name="Emergência" component={Emergencia} options={telaInterna('Telefone de Emergência')} />
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