// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('📱 앱 활성화 - 인증 상태 재확인');
      checkAuth();
    }
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

      console.log('🔍 인증 상태 확인:', {
        hasToken: !!token,
        hasCompletedOnboarding
      });

      const newLoginState = !!token && hasCompletedOnboarding === 'true';
      setIsLoggedIn(newLoginState);
    } catch (error) {
      console.error('❌ 인증 확인 실패:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    console.log('🔄 인증 강제 새로고침');
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};