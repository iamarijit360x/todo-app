import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';

interface User {
  name: string;
  // Add other properties as needed
}

type AuthContextType = {
  isAuthenticated: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  token: string;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const client = useApolloClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage only on the client side
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Run this effect only once on mount

  const login = (data: { token: string; user: User }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
    setIsAuthenticated(false);

    client.clearStore();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
