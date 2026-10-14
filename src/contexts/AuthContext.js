import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, setAuthToken } from '../services/api';

// O contexto guarda "quem está logado" e deixa qualquer tela acessar isso.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, tenta recuperar o login salvo no aparelho
  useEffect(() => {
    async function restaurar() {
      try {
        const token = await SecureStore.getItemAsync('token');
        const salvo = await SecureStore.getItemAsync('usuario');
        if (token && salvo) {
          setAuthToken(token);
          setUsuario(JSON.parse(salvo));
          // Com o back-end pronto, valide o token aqui (ex.: GET /me)
          // e faça sair() se ele tiver expirado.
        }
      } catch (e) {
        // se falhar, o usuário simplesmente vê a tela de login
      } finally {
        setCarregando(false);
      }
    }
    restaurar();
  }, []);

  async function entrar(email, senha) {
    const { token, usuario: dadosUsuario } = await loginApi(email, senha);
    setAuthToken(token);
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('usuario', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  async function sair() {
    setAuthToken(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}