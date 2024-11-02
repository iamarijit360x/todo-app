import { createContext, useContext, useState, ReactNode } from 'react';
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
  const [user, setUser] = useState<any>(null); // You may want to type this based on your user structure

  // Get the Apollo Client instance here
  const client = useApolloClient();

  const login = (data: { token: string; user: object }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // Store user as string

    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken("");
    setUser(null);
    setIsAuthenticated(false);

    // Clear Apollo Client store here
    client.clearStore(); // This is now valid as client is declared at the top level
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
