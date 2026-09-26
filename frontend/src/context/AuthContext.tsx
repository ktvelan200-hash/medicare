import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { JwtAuthResponse, Role } from '../types';

interface UserState {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  roleSpecificId?: number;
}

interface AuthContextType {
  user: UserState | null;
  token: string | null;
  login: (credentials: any) => Promise<JwtAuthResponse>;
  register: (userData: any) => Promise<JwtAuthResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  const login = async (credentials: any): Promise<JwtAuthResponse> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const data: JwtAuthResponse = response.data.data;
      
      const userState: UserState = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        roleSpecificId: data.roleSpecificId,
      };

      setToken(data.accessToken);
      setUser(userState);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(userState));
      
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<JwtAuthResponse> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      const data: JwtAuthResponse = response.data.data;

      const userState: UserState = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        roleSpecificId: data.roleSpecificId,
      };

      setToken(data.accessToken);
      setUser(userState);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(userState));

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
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
