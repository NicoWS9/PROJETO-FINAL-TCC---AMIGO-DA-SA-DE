import { useState } from 'react';
import {View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await entrar(email, senha);
      // ao dar certo, o App troca a tela sozinho (usuario deixa de ser null)
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.conteudo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.titulo}>Olá!</Text>
        <Text style={styles.subtitulo}>Entre na sua conta para continuar</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seuemail@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.senhaBox}>
          <TextInput
            style={[styles.input, styles.inputSenha]}
            value={senha}
            onChangeText={setSenha}
            placeholder="Sua senha"
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.olho}>
            <Ionicons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555" />
          </Pressable>
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <Pressable
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleEntrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' },
  conteudo: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 34, fontWeight: '800', color: '#1F2D3D' },
  subtitulo: { fontSize: 16, color: '#333', marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '600', color: '#1F2D3D', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2B7BD6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    marginBottom: 16,
  },
  senhaBox: { justifyContent: 'center' },
  inputSenha: { paddingRight: 48 },
  olho: { position: 'absolute', right: 14, top: 14 },
  erro: { color: '#C62828', fontSize: 15, marginBottom: 12 },
  botao: {
    backgroundColor: '#2B7BD6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },
});