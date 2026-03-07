'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, auth } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => User;
  logout: () => void;
  updateUserRole: (role: 'buyer' | 'artisan') => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email: string, name: string): User => {
    const newUser = auth.login(email, name);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const updateUserRole = (role: 'buyer' | 'artisan') => {
    auth.updateUserRole(role);
    const updatedUser = auth.getCurrentUser();
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateUserRole,
    isAuthenticated: user !== null,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}