// src/contexts/PremiumContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyProfile } from '../api/profileApi';

interface PremiumContextType {
  isPremium: boolean;
  loading: boolean;
  refreshPremiumStatus: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshPremiumStatus = async () => {
    try {
      console.log('🔄 프리미엄 상태 확인 중...');
      const profile = await getMyProfile();
      console.log('✅ 프로필 조회 성공:', profile);
      console.log('📋 is_premium:', profile.is_premium);
      setIsPremium(profile.is_premium);
    } catch (error) {
      console.error('❌ 프리미엄 상태 확인 실패:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPremiumStatus();
  }, []);

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        loading,
        refreshPremiumStatus,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};