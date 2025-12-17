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
    console.log('✅ [FCM] 토큰 가져오기 성공 (길이:', fcmToken?.length, ')');
    console.log('📝 [FCM] 토큰:', fcmToken?.substring(0, 50) + '...');
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
    // ✅ 인증 토큰 확인
    const authToken = await AsyncStorage.getItem('accessToken');
    if (!authToken) {
      console.error('❌ [FCM] 인증 토큰이 없습니다. 로그인이 필요합니다.');
      return false;
    }

    const platform = Platform.OS === 'ios' ? 'ios' :
                     Platform.OS === 'android' ? 'android' :
                     Platform.OS === 'web' ? 'web' : 'unknown';

    // ✅ device_id 생성 또는 가져오기
    let deviceId = await AsyncStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await AsyncStorage.setItem('deviceId', deviceId);
    }

    const payload: FCMTokenData = {
      token,
      platform,
      device_id: deviceId,
    };

    console.log('📤 [FCM] 백엔드에 토큰 등록 시작');
    console.log('📋 [FCM] Platform:', platform);
    console.log('📋 [FCM] Device ID:', deviceId);
    console.log('📋 [FCM] Token length:', token.length);
    console.log('📋 [FCM] Auth header:', authToken ? '있음' : '없음');

    const response = await apiClient.post('/fcm/token', payload, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ [FCM] 백엔드 토큰 등록 성공');
    console.log('📋 [FCM] 응답:', response.data);

    // 로컬에 저장
    await AsyncStorage.setItem('fcmToken', token);
    await AsyncStorage.setItem('fcmTokenRegistered', 'true');

    return true;
  } catch (error: any) {
    console.error('❌ [FCM] 백엔드 토큰 등록 실패:', error);
    console.error('📋 [FCM] 에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers,
    });

    // ✅ 401/403은 인증 문제 - 명확하게 로깅
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('🔒 [FCM] 인증 실패 - 로그인이 필요하거나 토큰이 만료되었습니다');
      return false;
    }

    // ✅ 500 에러는 서버 문제 - 로컬에만 저장
    if (error.response?.status === 500) {
      console.warn('⚠️ [FCM] 서버 오류 - 로컬에만 토큰 저장');
      await AsyncStorage.setItem('fcmToken', token);
      await AsyncStorage.setItem('fcmTokenRegistered', 'pending');
      return false;
    }

    // ✅ 422는 유효성 검사 실패
    if (error.response?.status === 422) {
      console.error('📋 [FCM] 유효성 검사 실패:', error.response.data?.detail);
      return false;
    }

    return false;
  }
};

/**
 * 백엔드에서 FCM 토큰 해제
 */
export const unregisterFCMToken = async (token: string): Promise<boolean> => {
  try {
    console.log('📤 [FCM] 백엔드에서 토큰 해제 시작');

    // ✅ 인증 토큰 확인
    const authToken = await AsyncStorage.getItem('accessToken');
    if (!authToken) {
      console.warn('⚠️ [FCM] 인증 토큰이 없어 서버 해제 스킵 (로컬만 삭제)');
      await AsyncStorage.removeItem('fcmToken');
      await AsyncStorage.removeItem('fcmTokenRegistered');
      return true;
    }

    const response = await apiClient.delete('/fcm/token', {
      params: { token },
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    console.log('✅ [FCM] 백엔드 토큰 해제 성공:', response.data);

    // 로컬에서 삭제
    await AsyncStorage.removeItem('fcmToken');
    await AsyncStorage.removeItem('fcmTokenRegistered');

    return true;
  } catch (error: any) {
    console.error('❌ [FCM] 백엔드 토큰 해제 실패:', error);

    // ✅ 서버 오류여도 로컬에서는 삭제
    if (error.response?.status === 500 || error.response?.status === 404 || error.response?.status === 401) {
      console.warn('⚠️ [FCM] 서버 오류/인증 실패 - 로컬에서만 토큰 삭제');
      await AsyncStorage.removeItem('fcmToken');
      await AsyncStorage.removeItem('fcmTokenRegistered');
      return true;
    }

    return false;
  }
};

/**
 * FCM 초기화 및 토큰 등록
 */
export const initializeFCM = async (): Promise<boolean> => {
  try {
    console.log('🔧 [FCM] 초기화 시작');

    // ✅ 인증 확인
    const authToken = await AsyncStorage.getItem('accessToken');
    if (!authToken) {
      console.warn('⚠️ [FCM] 인증 토큰이 없습니다. 로그인 후 다시 시도하세요.');
      return false;
    }

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
      console.log('🔄 [FCM] 토큰 갱신됨');
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
    // ✅ 정리 실패해도 로컬 데이터는 삭제
    await AsyncStorage.removeItem('fcmToken');
    await AsyncStorage.removeItem('fcmTokenRegistered');
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