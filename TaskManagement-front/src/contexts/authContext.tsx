import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Role {
  is_admin: boolean;
  name: string; // Puedes agregar más propiedades si es necesario
}

interface AuthUser {
  _id: string;
  role: Role;
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('authToken'));
  
 // const [user, setUserState] = useState<AuthUser | null>(localStorage.getItem('AuthUser'));
const [user, setUserState] = useState<AuthUser | null>(() => {
  const storedUser = localStorage.getItem('newUser');
  return storedUser ? JSON.parse(storedUser) as AuthUser : null;
});
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
    if (newUser) {
      localStorage.setItem('newUser', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('newUser');
    }
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