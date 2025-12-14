// src/utils/fcm.ts
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/config';

/**
 * FCM 토큰 타입
 */
export interface FCMTokenData {
  token: string;
  platform: 'android' | 'ios' | 'web' | 'unknown';
  device_id?: string;
}

/**
 * 알림 권한 요청
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('📱 [FCM] 알림 권한 상태:', authStatus, enabled ? '허용' : '거부');
    return enabled;
  } catch (error) {
    console.error('❌ [FCM] 알림 권한 요청 실패:', error);
    return false;
  }
};

/**
 * FCM 토큰 가져오기
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const fcmToken = await messaging().getToken();
    console.log('✅ [FCM] 토큰 가져오기 성공:', fcmToken);
    return fcmToken;
  } catch (error) {
    console.error('❌ [FCM] 토큰 가져오기 실패:', error);
    return null;
  }
};

/**
 * 백엔드에 FCM 토큰 등록
 */
export const registerFCMToken = async (token: string): Promise<boolean> => {
  try {
    const platform = Platform.OS === 'ios' ? 'ios' :
                     Platform.OS === 'android' ? 'android' :
                     Platform.OS === 'web' ? 'web' : 'unknown';

    const payload: FCMTokenData = {
      token,
      platform,
      device_id: await AsyncStorage.getItem('deviceId') || undefined,
    };

    console.log('📤 [FCM] 백엔드에 토큰 등록 시작:', payload);

    const response = await apiClient.post('/fcm/token', payload);
    console.log('✅ [FCM] 백엔드 토큰 등록 성공:', response.data);

    // 로컬에 저장
    await AsyncStorage.setItem('fcmToken', token);
    await AsyncStorage.setItem('fcmTokenRegistered', 'true');

    return true;
  } catch (error: any) {
    console.error('❌ [FCM] 백엔드 토큰 등록 실패:', error);
    console.error('📋 [FCM] 에러 상세:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return false;
  }
};

/**
 * 백엔드에서 FCM 토큰 해제
 */
export const unregisterFCMToken = async (token: string): Promise<boolean> => {
  try {
    console.log('📤 [FCM] 백엔드에서 토큰 해제 시작:', token);

    const response = await apiClient.delete('/fcm/token', {
      params: { token }
    });

    console.log('✅ [FCM] 백엔드 토큰 해제 성공:', response.data);

    // 로컬에서 삭제
    await AsyncStorage.removeItem('fcmToken');
    await AsyncStorage.removeItem('fcmTokenRegistered');

    return true;
  } catch (error: any) {
    console.error('❌ [FCM] 백엔드 토큰 해제 실패:', error);
    return false;
  }
};

/**
 * FCM 초기화 및 토큰 등록
 */
export const initializeFCM = async (): Promise<boolean> => {
  try {
    console.log('🔧 [FCM] 초기화 시작');

    // 1. 알림 권한 확인
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('⚠️ [FCM] 알림 권한이 없습니다');
      return false;
    }

    // 2. FCM 토큰 가져오기
    const token = await getFCMToken();
    if (!token) {
      console.log('⚠️ [FCM] 토큰을 가져올 수 없습니다');
      return false;
    }

    // 3. 백엔드에 등록
    const registered = await registerFCMToken(token);
    if (!registered) {
      console.log('⚠️ [FCM] 백엔드 등록 실패');
      return false;
    }

    // 4. 토큰 갱신 리스너 설정
    messaging().onTokenRefresh(async (newToken) => {
      console.log('🔄 [FCM] 토큰 갱신됨:', newToken);
      await registerFCMToken(newToken);
    });

    console.log('✅ [FCM] 초기화 완료');
    return true;
  } catch (error) {
    console.error('❌ [FCM] 초기화 실패:', error);
    return false;
  }
};

/**
 * FCM 토큰 정리 (로그아웃 시)
 */
export const cleanupFCMToken = async (): Promise<void> => {
  try {
    console.log('🧹 [FCM] 토큰 정리 시작');

    const token = await AsyncStorage.getItem('fcmToken');
    if (token) {
      await unregisterFCMToken(token);
    }

    await messaging().deleteToken();
    console.log('✅ [FCM] 토큰 정리 완료');
  } catch (error) {
    console.error('❌ [FCM] 토큰 정리 실패:', error);
  }
};

/**
 * 포그라운드 메시지 핸들러 설정
 */
export const setupForegroundMessageHandler = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('📬 [FCM] 포그라운드 메시지 수신:', remoteMessage);

    Alert.alert(
      remoteMessage.notification?.title || '알림',
      remoteMessage.notification?.body || '',
      [{ text: '확인' }]
    );
  });
};

/**
 * 백그라운드 메시지 핸들러 설정
 */
export const setupBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📬 [FCM] 백그라운드 메시지 수신:', remoteMessage);
  });
};

/**
 * 알림 권한 상태 확인
 */
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (error) {
    console.error('❌ [FCM] 알림 권한 확인 실패:', error);
    return false;
  }
};