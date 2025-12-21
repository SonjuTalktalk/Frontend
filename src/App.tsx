import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// 1. DefaultTheme 추가 (라이트 모드 테마)
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootNavigator from './navigation/RootNavigator';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { ChatProvider } from './contexts/ChatContext';
import { PointProvider } from './contexts/PointContext';
import { MissionProvider } from './contexts/MissionContext';
import { PremiumProvider } from './contexts/PremiumContext';  // ✅ 추가
import { apiClient } from './api/config';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  // 2. 시스템 설정 무시하고 강제로 라이트 모드(false)로 고정
  // const isDarkMode = useColorScheme() === 'dark'; 
  const isDarkMode = false;

  // 앱 시작 시 저장된 accessToken을 불러와 axios 헤더에 설정
  useEffect(() => {
    const initAuth = async () => {
      try {
        // accessToken 키로 통일 (userToken 사용 안 함)
        const token = await AsyncStorage.getItem('accessToken');

        if (token) {
          // axios 기본 헤더에 토큰 설정
          apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
          console.log('✅ [App.tsx] 저장된 토큰으로 API 클라이언트 헤더 설정 완료');
        } else {
          console.log('ℹ️ [App.tsx] 저장된 토큰 없음');
        }
      } catch (e) {
        console.error('❌ [App.tsx] 토큰 불러오기 실패:', e);
      }
    };

    initAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <FontSizeProvider>
        <AuthProvider>
          <PremiumProvider>  {/* ✅ 추가 */}
            <ChatProvider>
              <PointProvider>
                <MissionProvider>
                  {/* 3. StatusBar도 항상 어두운 글자(dark-content)와 흰 배경으로 고정 */}
                  <StatusBar 
                    barStyle="dark-content" 
                    backgroundColor="#ffffff" 
                  />
                  {/* 4. NavigationContainer에 theme={DefaultTheme} 추가하여 배경 흰색 고정 */}
                  <NavigationContainer theme={DefaultTheme}>
                    <RootNavigator />
                  </NavigationContainer>
                </MissionProvider>
              </PointProvider>
            </ChatProvider>
          </PremiumProvider>  {/* ✅ 추가 */}
        </AuthProvider>
      </FontSizeProvider>
    </SafeAreaProvider>
  );
}