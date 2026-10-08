import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// IMPORTAÇÕES DAS TELAS (Verifique se as letras maiúsculas/minúsculas dos arquivos estão certas)
import Inicio from './src/screens/Inicio';
import Agenda from './src/screens/agenda';
import Perfil from './src/screens/perfil';
import Medicamentos from './src/screens/medicamentos';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Definição das abas inferiores
function AbasPrincipais() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2B7BD6', }}>
      <Tab.Screen
        name="Início"
        component={Inicio}
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={Agenda}
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> 
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{ 
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
}

// 2. Fluxo Principal do App
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }}> 
          {/* Tela principal que carrega o menu de abas */}
          <Stack.Screen name="Home" component={AbasPrincipais} options={{ headerShown: false }} />
          <Stack.Screen name="Medicamentos" component={Medicamentos} options={{ title: 'Meus Remédios' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
