// src/contexts/PointContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

interface UserInfo {
  phone_number: string;
  name: string;
  gender: string;
  birthdate: string;
  point: number;
  is_premium: boolean;
}

interface PointContextType {
  points: number;
  isPremium: boolean;
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  refreshPoints: () => Promise<void>;
  deductPoints: (amount: number) => void;
  addPoints: (amount: number) => void;
}

const PointContext = createContext<PointContextType | undefined>(undefined);

export const PointProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ useCallback으로 고정
  const getAccessToken = useCallback(async (): Promise<string> => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    }
    return token;
  }, []);

  const refreshPoints = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();

      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await AsyncStorage.removeItem('accessToken');
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.message || '사용자 정보를 불러올 수 없습니다.'
        );
      }

      const data: UserInfo = await response.json();

      setUserInfo(data);
      setPoints(data.point);
      setIsPremium(data.is_premium);

      console.log('✅ 사용자 정보 조회 성공:', {
        name: data.name,
        point: data.point,
        is_premium: data.is_premium,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '포인트를 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('❌ 사용자 정보 조회 실패:', err);

      if (errorMessage.includes('인증') || errorMessage.includes('로그인')) {
        setPoints(0);
        setIsPremium(false);
        setUserInfo(null);
      }
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  const deductPoints = useCallback((amount: number) => {
    setPoints((prev) => Math.max(0, prev - amount));
    console.log(`💰 포인트 차감: -${amount}`);
  }, []);

  const addPoints = useCallback((amount: number) => {
    setPoints((prev) => prev + amount);
    console.log(`💰 포인트 추가: +${amount}`);
  }, []);

  return (
    <PointContext.Provider
      value={{
        points,
        isPremium,
        userInfo,
        loading,
        error,
        refreshPoints,
        deductPoints,
        addPoints,
      }}
    >
      {children}
    </PointContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointContext);
  if (!context) throw new Error('usePoints must be used within PointProvider');
  return context;
};
