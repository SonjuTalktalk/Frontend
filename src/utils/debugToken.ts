// src/utils/debugToken.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AccessToken 디버깅
 */
export const debugToken = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  
  console.log('');
  console.log('======================');
  console.log('🔍 TOKEN DEBUG INFO');
  console.log('======================');
  console.log('Token exists:', !!token);
  
  if (!token) {
    console.log('❌ Token is missing!');
    console.log('======================');
    console.log('');
    return null;
  }
  
  console.log('Token length:', token.length);
  console.log('Token preview:', token.substring(0, 50) + '...');
  
  // JWT 토큰인지 확인
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log('✅ JWT Token detected');
      console.log('Payload:', payload);
      
      if (payload.exp) {
        const expiry = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = expiry < now;
        
        console.log('Expiry:', expiry.toISOString());
        console.log('Now:', now.toISOString());
        console.log('Is expired:', isExpired);
        
        if (isExpired) {
          console.log('⚠️ Token is EXPIRED!');
        } else {
          const remainingMinutes = Math.floor((expiry.getTime() - now.getTime()) / 1000 / 60);
          console.log(`✅ Token valid for ${remainingMinutes} minutes`);
        }
      }
    } catch (error) {
      console.log('⚠️ Failed to decode JWT:', error);
    }
  } else {
    console.log('ℹ️ Token is not JWT format');
  }
  
  console.log('======================');
  console.log('');
  
  return token;
};

/**
 * 모든 AsyncStorage 키 확인
 */
export const debugAllStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  
  console.log('');
  console.log('======================');
  console.log('📦 STORAGE DEBUG INFO');
  console.log('======================');
  console.log('Total keys:', keys.length);
  console.log('Keys:', keys);
  
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(`\n${key}:`);
    console.log(value?.substring(0, 100) + (value && value.length > 100 ? '...' : ''));
  }
  
  console.log('======================');
  console.log('');
};