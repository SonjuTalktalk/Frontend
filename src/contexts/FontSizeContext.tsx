// src/contexts/FontSizeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateFontSize as updateFontSizeAPI } from '../api/profileApi';

interface FontSizeContextType {
  fontScale: number;
  updateFontScale: (scale: number) => Promise<void>;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const [fontScale, setFontScale] = useState<number>(1.3); // 기본값 1.1 (보통)

  // 앱 시작 시 저장된 글자 크기 불러오기
  useEffect(() => {
    loadFontScale();
  }, []);

  const loadFontScale = async () => {
    try {
      const savedScale = await AsyncStorage.getItem('fontScale');
      if (savedScale !== null) {
        setFontScale(parseFloat(savedScale));
      }
    } catch (error) {
      console.error('글자 크기 불러오기 실패:', error);
    }
  };

  // scale을 API 형식으로 변환
  const scaleToApiSize = (scale: number): 'small' | 'medium' | 'large' => {
    if (scale === 1.2) return 'small';
    if (scale === 1.4) return 'large';
    return 'medium';
  };

  const updateFontScale = async (scale: number): Promise<void> => {
    try {
      // 1. 로컬 먼저 업데이트 (빠른 UI 반응)
      setFontScale(scale);
      await AsyncStorage.setItem('fontScale', scale.toString());
      console.log('✅ 로컬 폰트 크기 저장:', scale);

      // 2. 서버 API 호출
      try {
        const apiSize = scaleToApiSize(scale);
        const response = await updateFontSizeAPI(apiSize);
        console.log('✅ 서버 폰트 크기 업데이트 성공:', response);
      } catch (apiError) {
        console.error('❌ 서버 폰트 크기 업데이트 실패 (로컬은 유지):', apiError);
        // API 실패해도 로컬은 이미 업데이트됨
      }
    } catch (error) {
      console.error('❌ 폰트 크기 저장 실패:', error);
      throw error;
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontScale, updateFontScale }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize는 FontSizeProvider 내에서 사용되어야 합니다');
  }
  return context;
};