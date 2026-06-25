import { createContext, useContext, useState } from 'react';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  function login(newToken) {
    setToken(newToken);
    setAuthToken(newToken);
  }

  function logout() {
    setToken(null);
    setAuthToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}