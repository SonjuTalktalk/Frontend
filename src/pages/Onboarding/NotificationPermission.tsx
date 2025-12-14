// src/pages/Onboarding/NotificationPermission.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboardingStyles } from '../../styles/Template';
import ScaledText from '../../components/ScaledText';
import { requestNotificationPermission, initializeFCM } from '../../utils/fcm';

export default function NotificationPermissionScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    if (loading) return;

    try {
      setLoading(true);
      console.log('📱 [NotificationPermission] 알림 권한 요청 시작');

      // 1. 알림 권한 요청
      const granted = await requestNotificationPermission();

      if (granted) {
        console.log('✅ [NotificationPermission] 알림 권한 허용됨');

        // 2. FCM 초기화 및 토큰 등록
        const initialized = await initializeFCM();

        if (initialized) {
          console.log('✅ [NotificationPermission] FCM 초기화 성공');
          await AsyncStorage.setItem('notificationEnabled', 'true');

          // 온보딩 완료로 이동
          navigation.navigate('CharacterSetting', navigation.getState().params);
        } else {
          console.log('⚠️ [NotificationPermission] FCM 초기화 실패 - 계속 진행');
          Alert.alert(
            '알림 설정',
            '알림 설정에 실패했습니다.\n나중에 설정에서 다시 시도할 수 있습니다.',
            [
              {
                text: '확인',
                onPress: () => navigation.navigate('CharacterSetting', navigation.getState().params),
              },
            ]
          );
        }
      } else {
        console.log('⚠️ [NotificationPermission] 알림 권한 거부됨');
        await AsyncStorage.setItem('notificationEnabled', 'false');

        Alert.alert(
          '알림 권한 거부',
          '알림을 받으시려면 설정에서 알림 권한을 허용해주세요.\n나중에 설정에서 변경할 수 있습니다.',
          [
            {
              text: '확인',
              onPress: () => navigation.navigate('CharacterSetting', navigation.getState().params),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('❌ [NotificationPermission] 알림 권한 요청 실패:', error);
      Alert.alert('오류', '알림 설정 중 오류가 발생했습니다.\n계속 진행하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        {
          text: '계속',
          onPress: () => navigation.navigate('CharacterSetting', navigation.getState().params),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    console.log('⏭️ [NotificationPermission] 알림 권한 건너뛰기');
    await AsyncStorage.setItem('notificationEnabled', 'false');
    navigation.navigate('CharacterSetting', navigation.getState().params);
  };

  return (
    <View style={onboardingStyles.container1}>
      <Image
        source={require('../../../assets/images/sonjusmile.png')}
        style={onboardingStyles.welcomeImage}
        resizeMode="contain"
      />

      <ScaledText fontSize={32} style={onboardingStyles.title}>
        손주에게{'\n'}알림을 받아보세요!
      </ScaledText>

      <ScaledText fontSize={16} style={[onboardingStyles.subtitle, { textAlign: 'center', color: '#666' }]}>
        손주가 새로운 소식을 전할 때{'\n'}
        알림으로 알려드릴게요
      </ScaledText>

      <View style={{ width: '100%', paddingHorizontal: 20, gap: 12, marginTop: 40 }}>
        <TouchableOpacity
          style={onboardingStyles.button}
          onPress={handleAllow}
          disabled={loading}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#FFF" />
              <ScaledText fontSize={18} style={[onboardingStyles.buttonText, { marginLeft: 8 }]}>
                설정 중...
              </ScaledText>
            </View>
          ) : (
            <ScaledText fontSize={18} style={onboardingStyles.buttonText}>
              알림 허용하기
            </ScaledText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[onboardingStyles.button, { backgroundColor: '#F0F0F0' }]}
          onPress={handleSkip}
          disabled={loading}
        >
          <ScaledText fontSize={18} style={[onboardingStyles.buttonText, { color: '#666' }]}>
            나중에 하기
          </ScaledText>
        </TouchableOpacity>
      </View>

      <ScaledText fontSize={12} style={{ color: '#999', textAlign: 'center', marginTop: 20, paddingHorizontal: 40 }}>
        알림 설정은 나중에 설정 메뉴에서{'\n'}언제든지 변경할 수 있습니다
      </ScaledText>
    </View>
  );
}