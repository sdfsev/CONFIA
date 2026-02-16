import React, { createContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebaseService';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthContext: Setting up onAuthStateChanged listener');
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('🔐 Auth state changed:', currentUser ? 'User logged in' : 'User logged out');
        setUser(currentUser);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ AuthContext setup error:', error);
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
