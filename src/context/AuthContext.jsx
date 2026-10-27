import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../utils/authClient';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshSession: async () => {}
});

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => authClient.getState());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state updates
    const unsubscribe = authClient.subscribe((newState) => {
      setAuthState(newState);
    });

    // Check existing session on boot
    authClient
      .refreshSession()
      .then((state) => {
        setAuthState(state);
      })
      .finally(() => {
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return await authClient.signIn({ email, password });
  };

  const register = async (email, password, name) => {
    return await authClient.signUp({ email, password, name });
  };

  const logout = async () => {
    return await authClient.signOut();
  };

  const refreshSession = async () => {
    return await authClient.refreshSession();
  };

  const signInWithGoogle = async () => {
    return await authClient.signInWithGoogle();
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshSession,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
