import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthUser {
  _id: string;
  role: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (newToken: string | null) => void;
  user: AuthUser | null;
  setUser: (newUser: AuthUser | null) => void;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('authToken'));
  console.log('token', token);
  const [user, setUserState] = useState<AuthUser | null>(null);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    // Si quieres persistir el usuario, puedes usar localStorage aquí también
    // if (newUser) {
    //   localStorage.setItem('authUser', JSON.stringify(newUser));
    // } else {
    //   localStorage.removeItem('authUser');
    // }
  };

  const isAuthenticated = !!token;

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    console.log('logout');
    setToken(null);
    setUser(null);
    // Puedes agregar redirección aquí si lo necesitas
  };

  return (
    <AuthContext.Provider value={{
      token, setToken, user, setUser, isAuthenticated, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};