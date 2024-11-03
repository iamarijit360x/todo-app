import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (data: { token: string; user: object }) => void;
  logout: () => void;
  token: string;
  user: object | null; // Assuming you want to store user info
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const client = useApolloClient();

  const login = (data: { token: string; user: object }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
