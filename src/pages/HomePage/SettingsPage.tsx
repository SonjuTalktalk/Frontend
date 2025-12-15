// src/pages/Setting/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFontSize } from '../../contexts/FontSizeContext';
import ScaledText from '../../components/ScaledText';
import {
  getMyProfile,
  updateMyName,
  updateMyPremium,
  deleteMyAccount,
  getMyAIProfile,
  updateAINickname,
} from '../../api/profileApi';
import { apiClient } from '../../api/config';
import { styles } from '../../styles/Setting';
import {
  initializeFCM,
  cleanupFCMToken,
  requestNotificationPermission,
  checkNotificationPermission,
} from '../../utils/fcm';

export default function SettingsPage() {
  const navigation = useNavigation();
  const { fontScale, updateFontScale } = useFontSize();

  const [userName, setUserName] = useState('김춘자');
  const [sonjuName, setSonjuName] = useState('돌쇠');
  const [isPremium, setIsPremium] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showSonjuNameModal, setShowSonjuNameModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<'여성' | '남성'>('여성');

  useEffect(() => {
    loadUserData();
    loadNotificationStatus();
  }, []);

  const loadNotificationStatus = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notificationEnabled');
      const hasPermission = await checkNotificationPermission();

      // 권한이 있고, 설정이 활성화된 경우에만 true
      setNotificationEnabled(enabled === 'true' && hasPermission);
    } catch (error) {
      console.error('알림 상태 로드 실패:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const localName = await AsyncStorage.getItem('userName');
      const localSonju = await AsyncStorage.getItem('sonjuName');
      const localProfile = await AsyncStorage.getItem('profileImage');

      if (localName) setUserName(localName);
      if (localSonju) setSonjuName(localSonju);
      if (localProfile) setSelectedProfile(localProfile as '여성' | '남성');

      try {
        const profile = await getMyProfile();
        if (profile?.name) {
          setUserName(profile.name);
          await AsyncStorage.setItem('userName', profile.name);
        }
        if (profile?.is_premium !== undefined) {
          setIsPremium(profile.is_premium);
        }
      } catch (apiError) {
        console.log('API 프로필 로드 실패 (로컬 데이터 사용):', apiError);
      }

      try {
        const aiProfile = await getMyAIProfile();
        if (aiProfile?.nickname) {
          setSonjuName(aiProfile.nickname);
          await AsyncStorage.setItem('sonjuName', aiProfile.nickname);
        }
      } catch (aiError) {
        console.log('AI 프로필 로드 실패 (로컬 데이터 사용):', aiError);
      }
    } catch (error) {
      console.error('프로필 데이터 로드 실패:', error);
    }
  };

  const handleToggleNotification = async (value: boolean) => {
    try {
      setIsLoading(true);

      if (value) {
        // 알림 켜기
        console.log('📱 [Settings] 알림 활성화 시작');

        const hasPermission = await checkNotificationPermission();

        if (!hasPermission) {
          // 권한이 없으면 권한 요청
          const granted = await requestNotificationPermission();

          if (!granted) {
            Alert.alert(
              '알림 권한 필요',
              '알림을 받으시려면 설정에서 알림 권한을 허용해주세요.',
              [{ text: '확인' }]
            );
            return;
          }
        }

        // FCM 초기화 및 토큰 등록
        const initialized = await initializeFCM();

        if (initialized) {
          await AsyncStorage.setItem('notificationEnabled', 'true');
          setNotificationEnabled(true);
          Alert.alert('성공', '알림이 활성화되었습니다');
        } else {
          Alert.alert('오류', '알림 설정에 실패했습니다');
        }
      } else {
        // 알림 끄기
        console.log('🔕 [Settings] 알림 비활성화 시작');

        await cleanupFCMToken();
        await AsyncStorage.setItem('notificationEnabled', 'false');
        setNotificationEnabled(false);
        Alert.alert('완료', '알림이 비활성화되었습니다');
      }
    } catch (error: any) {
      console.error('❌ [Settings] 알림 토글 실패:', error);
      Alert.alert('오류', '알림 설정 변경에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!tempName.trim()) {
      Alert.alert('오류', '이름을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);
      const response = await updateMyName(tempName.trim());
      console.log('이름 변경 API 응답:', response);

      await AsyncStorage.setItem('userName', tempName.trim());
      setUserName(tempName.trim());
      setShowNameModal(false);
      setTempName('');

      const message =
        typeof response === 'string'
          ? response
          : response?.message || '이름이 변경되었습니다';
      Alert.alert('성공', message);
    } catch (error: any) {
      console.error('이름 변경 실패:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        '이름 변경에 실패했습니다';
      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSonjuName = async () => {
    if (!tempName.trim()) {
      Alert.alert('오류', '손주 이름을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);
      const response = await updateAINickname(tempName.trim());
      console.log('손주 이름 변경 API 응답:', response);

      await AsyncStorage.setItem('sonjuName', tempName.trim());
      setSonjuName(tempName.trim());
      setShowSonjuNameModal(false);
      setTempName('');

      const message =
        typeof response === 'string'
          ? response
          : response?.message || '손주 이름이 변경되었습니다';
      Alert.alert('성공', message);
    } catch (error: any) {
      console.error('손주 이름 변경 실패:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        '손주 이름 변경에 실패했습니다';
      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('profileImage', selectedProfile);
      setShowProfileImageModal(false);
      Alert.alert('성공', '프로필 사진이 변경되었습니다');
    } catch (error) {
      console.error('프로필 사진 변경 실패:', error);
      Alert.alert('오류', '프로필 사진 변경에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeFontSize = async (scale: number) => {
    await updateFontScale(scale);
    setShowFontSizeMenu(false);
  };

  const handleTogglePremium = async () => {
    try {
      setIsLoading(true);
      const newPremiumStatus = !isPremium;
      const response = await updateMyPremium(newPremiumStatus);
      console.log('프리미엄 상태 변경 API 응답:', response);

      setIsPremium(newPremiumStatus);

      const message =
        typeof response === 'string'
          ? response
          : response?.message ||
            (newPremiumStatus
              ? '프리미엄이 활성화되었습니다'
              : '프리미엄이 비활성화되었습니다');
      Alert.alert('성공', message);
    } catch (error: any) {
      console.error('프리미엄 상태 변경 실패:', error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        '프리미엄 상태 변경에 실패했습니다';
      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoading(true);
            console.log('🔄 로그아웃 시작');

            // FCM 토큰 정리
            await cleanupFCMToken();

            await AsyncStorage.multiRemove([
              'userToken',
              'idToken',
              'accessToken',
              'refreshToken',
              'hasCompletedOnboarding',
              'aiProfile',
              'userName',
              'userPhone',
              'sonjuName',
            ]);
            console.log('✅ AsyncStorage 정리 완료');

            delete apiClient.defaults.headers.common.Authorization;
            console.log('✅ API 헤더 정리 완료');

            await new Promise((resolve) => setTimeout(resolve, 100));
            console.log('✅ 로그아웃 완료');
          } catch (error) {
            console.error('❌ 로그아웃 처리 중 오류:', error);
            Alert.alert('알림', '로그아웃되었습니다');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말로 계정을 삭제하시겠습니까?\n모든 데이터가 영구적으로 삭제됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);

              // FCM 토큰 정리
              await cleanupFCMToken();

              await deleteMyAccount();
              await AsyncStorage.clear();
              delete apiClient.defaults.headers.common.Authorization;
              Alert.alert('완료', '계정이 삭제되었습니다');
            } catch (error: any) {
              console.error('계정 삭제 실패:', error);
              const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                '계정 삭제에 실패했습니다';
              Alert.alert('오류', errorMessage);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // getFontSizeLabel 함수 수정
    const getFontSizeLabel = () => {
      if (fontScale === 1.0) return '작게';
      if (fontScale === 1.2) return '보통';
      if (fontScale === 1.4) return '크게';
      return '보통';
    };


  const getProfileImage = () => {
    return selectedProfile === '여성'
      ? require('../../../assets/images/춘자.png')
      : require('../../../assets/images/춘돌.png');
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#02BFDC" />
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={require('../../../assets/images/leftarrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <ScaledText fontSize={20} style={styles.headerTitle}>
            설정
          </ScaledText>
          <TouchableOpacity onPress={handleLogout}>
            <ScaledText fontSize={16} style={styles.logoutButton}>
              로그아웃
            </ScaledText>
          </TouchableOpacity>
        </View>

        {/* 프로필 이미지 */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image source={getProfileImage()} style={styles.profileImage} />
          </View>
          <ScaledText fontSize={18} style={styles.profileName}>
            {userName}
          </ScaledText>
        </View>

        {/* 프로필 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            프로필
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setTempName(userName);
              setShowNameModal(true);
            }}
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              이름 수정
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={16} style={styles.menuValue}>
                {userName}
              </ScaledText>
              <Icon name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setTempName(sonjuName);
              setShowSonjuNameModal(true);
            }}
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              손주 이름 수정
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={16} style={styles.menuValue}>
                {sonjuName}
              </ScaledText>
              <Icon name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowProfileImageModal(true)}
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              프로필 사진 변경
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={16} style={styles.menuValue}>
                {selectedProfile}
              </ScaledText>
              <Icon name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 알림 섹션 (새로 추가) */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            알림
          </ScaledText>

          <View style={styles.menuItem}>
            <ScaledText fontSize={16} style={styles.menuLabel}>
              푸시 알림
            </ScaledText>
            <Switch
              value={notificationEnabled}
              onValueChange={handleToggleNotification}
              trackColor={{ false: '#D1D5DB', true: '#02BFDC' }}
              thumbColor="#FFFFFF"
              disabled={isLoading}
            />
          </View>

          <ScaledText fontSize={12} style={styles.notificationDescription}>
            손주가 새로운 소식을 전할 때 알림을 받을 수 있습니다
          </ScaledText>
        </View>

        {/* 프리미엄 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            프리미엄
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleTogglePremium}
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              프리미엄 상태
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={16} style={styles.menuValue}>
                {isPremium ? '활성화됨' : '비활성화됨'}
              </ScaledText>
              <Icon name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert('알림', '프리미엄 혜택 안내 기능은 준비 중입니다')
            }
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              프리미엄 혜택 보기
            </ScaledText>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 개인정보 보호 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            개인정보 보호
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert('알림', '개인정보 동의서 기능은 준비 중입니다')
            }
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              개인 정보 동의서 보기
            </ScaledText>
            <ScaledText fontSize={16} style={styles.menuLink}>
              보기
            </ScaledText>
          </TouchableOpacity>
        </View>

        {/* 손쉬운 사용 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            손쉬운 사용
          </ScaledText>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowFontSizeMenu(!showFontSizeMenu)}
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              글자 크기 조정
            </ScaledText>
            <View style={styles.menuRight}>
              <ScaledText fontSize={16} style={styles.menuValue}>
                {getFontSizeLabel()}
              </ScaledText>
              <Icon
                name={showFontSizeMenu ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </View>
          </TouchableOpacity>

          {showFontSizeMenu && (
              <View style={styles.fontSizeMenu}>
                <TouchableOpacity
                  style={styles.fontSizeOption}
                  onPress={() => handleChangeFontSize(1.0)}
                >
                  <ScaledText fontSize={16} style={styles.fontSizeLabel}>
                    작게
                  </ScaledText>
                  {fontScale === 1.0 && (
                    <Icon name="checkmark" size={20} color="#02BFDC" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fontSizeOption}
                  onPress={() => handleChangeFontSize(1.2)}
                >
                  <ScaledText fontSize={16} style={styles.fontSizeLabel}>
                    보통
                  </ScaledText>
                  {fontScale === 1.2 && (
                    <Icon name="checkmark" size={20} color="#02BFDC" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.fontSizeOption}
                  onPress={() => handleChangeFontSize(1.4)}
                >
                  <ScaledText fontSize={16} style={styles.fontSizeLabel}>
                    크게
                  </ScaledText>
                  {fontScale === 1.4 && (
                    <Icon name="checkmark" size={20} color="#02BFDC" />
                  )}
                </TouchableOpacity>
              </View>
            )}
        </View>

        {/* 계정 섹션 */}
        <View style={styles.section}>
          <ScaledText fontSize={18} style={styles.sectionTitle}>
            계정
          </ScaledText>

          <View style={styles.menuItem}>
            <ScaledText fontSize={16} style={styles.menuLabel}>
              버전
            </ScaledText>
            <ScaledText fontSize={16} style={styles.menuValue}>
              1.0.0
            </ScaledText>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeleteAccount}
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              계정 삭제
            </ScaledText>
            <ScaledText fontSize={16} style={[styles.menuLink, { color: '#FF3B30' }]}>
              삭제하기
            </ScaledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert('알림', '고객센터 기능은 준비 중입니다')
            }
            disabled={isLoading}
          >
            <ScaledText fontSize={16} style={styles.menuLabel}>
              문의
            </ScaledText>
            <ScaledText fontSize={16} style={styles.menuLink}>
              고객센터로 이동
            </ScaledText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 이름 수정 모달 */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>
              이름 수정
            </ScaledText>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="새로운 이름을 입력하세요"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowNameModal(false);
                  setTempName('');
                }}
                disabled={isLoading}
              >
                <ScaledText fontSize={16} style={styles.modalButtonTextCancel}>
                  취소
                </ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateName}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ScaledText fontSize={16} style={styles.modalButtonTextConfirm}>
                    확인
                  </ScaledText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 손주 이름 수정 모달 */}
      <Modal
        visible={showSonjuNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSonjuNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>
              손주 이름 수정
            </ScaledText>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="새로운 손주 이름을 입력하세요"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowSonjuNameModal(false);
                  setTempName('');
                }}
                disabled={isLoading}
              >
                <ScaledText fontSize={16} style={styles.modalButtonTextCancel}>
                  취소
                </ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateSonjuName}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ScaledText fontSize={16} style={styles.modalButtonTextConfirm}>
                    확인
                  </ScaledText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 프로필 사진 변경 모달 */}
      <Modal
        visible={showProfileImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScaledText fontSize={18} style={styles.modalTitle}>
              프로필 사진 선택
            </ScaledText>

            <View style={{ gap: 16, marginBottom: 20 }}>
              <TouchableOpacity
                style={[
                  styles.profileOption,
                  selectedProfile === '여성' && styles.profileOptionSelected,
                ]}
                onPress={() => setSelectedProfile('여성')}
              >
                <Image
                  source={require('../../../assets/images/춘자.png')}
                  style={styles.profileOptionImage}
                />
                <ScaledText fontSize={16} style={styles.profileOptionText}>
                  여성
                </ScaledText>
                {selectedProfile === '여성' && (
                  <Icon name="checkmark-circle" size={24} color="#02BFDC" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.profileOption,
                  selectedProfile === '남성' && styles.profileOptionSelected,
                ]}
                onPress={() => setSelectedProfile('남성')}
              >
                <Image
                  source={require('../../../assets/images/춘돌.png')}
                  style={styles.profileOptionImage}
                />
                <ScaledText fontSize={16} style={styles.profileOptionText}>
                  남성
                </ScaledText>
                {selectedProfile === '남성' && (
                  <Icon name="checkmark-circle" size={24} color="#02BFDC" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowProfileImageModal(false)}
                disabled={isLoading}
              >
                <ScaledText fontSize={16} style={styles.modalButtonTextCancel}>
                  취소
                </ScaledText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleUpdateProfileImage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ScaledText fontSize={16} style={styles.modalButtonTextConfirm}>
                    확인
                  </ScaledText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}