import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  token: string | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (!user) {
         axios.get('/api/users/profile')
           .then(res => setUser(res.data))
           .catch(() => {
             console.log("Token inválido, saliendo");
             logout();
           });
      }

    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, user]); 

  const login = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        logout, 
        isAuthenticated: !!token // TRUE si el token existe
      }}>
      {children}
    </AuthContext.Provider>
  );
};