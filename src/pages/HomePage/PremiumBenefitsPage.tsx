// src/pages/HomePage/PremiumBenefitsPage.tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_BASE_URL } from '../../api/config';

export default function PremiumBenefitsPage() {
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

  const benefits = [
    {
      icon: '💬',
      title: '채팅 사용 한도 업그레이드',
      description: '무제한 AI 채팅 이용',
    },
    {
      icon: '🔄',
      title: '미션 새로고침 횟수 업그레이드',
      description: '하루 4회까지 새로운 미션 받기',
    },
    {
      icon: '⭐',
      title: '프리미엄 전용 프롬프트',
      description: '더 정교한 AI 성격 설정',
    },
    {
      icon: '🎨',
      title: '상점 배경 옵션',
      description: '다양한 테마 배경 사용 가능',
    },
  ];

  /**
   * 결제 시작 핸들러
   */
  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await fetch(
        `${API_BASE_URL}/pay/kakaopay/ready?client=mobile`,  // ← app → mobile로 변경
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 5000,
            item_name: 'Premium 월간 구독',
            quantity: 1,
            tax_free_amount: 0,
          }),
        }
      );

      const data = await response.json();
      console.log('✅ 결제 준비 완료:', data);

      // mobile > pc 우선순위로 시도 (app 제외)
      const paymentUrl = data.redirect?.mobile || data.redirect?.pc;

      if (!paymentUrl) {
        throw new Error('결제 URL을 받지 못했습니다.');
      }

      console.log('🔗 결제 URL:', paymentUrl);

      // Linking.canOpenURL 체크 없이 바로 시도
      await Linking.openURL(paymentUrl);
      console.log('✅ 카카오페이 결제창 열림');

    } catch (error: any) {
      console.error('❌ 결제 시작 실패:', error);

      // 에러 상세 로그
      if (error.message?.includes('결제 URL')) {
        Alert.alert(
          '결제 오류',
          '결제 페이지를 열 수 없습니다.\n브라우저로 결제를 진행하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '브라우저 열기',
              onPress: () => {
                // 브라우저로 강제 열기 시도
                Linking.openURL(paymentUrl).catch(console.error);
              },
            },
          ]
        );
      } else {
        Alert.alert('결제 오류', error?.message || '결제를 시작할 수 없습니다.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
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
          프리미엄 혜택
        </ScaledText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 프리미엄 아이콘 */}
        <View style={styles.premiumIconContainer}>
          <View style={styles.premiumIcon}>
            <Icon name="diamond" size={48} color="#02BFDC" />
          </View>
        </View>

        {/* 타이틀 */}
        <View style={styles.titleContainer}>
          <ScaledText fontSize={28} style={styles.title}>
            프리미엄으로
          </ScaledText>
          <ScaledText fontSize={28} style={styles.title}>
            더 많은 기능을 누리세요
          </ScaledText>
        </View>

        {/* 설명 */}
        <ScaledText fontSize={16} style={styles.subtitle}>
          프리미엄 구독으로 제한 없이 모든 기능을 사용하세요
        </ScaledText>

        {/* 혜택 목록 */}
        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={styles.benefitIconContainer}>
                <ScaledText fontSize={32} style={styles.benefitIcon}>
                  {benefit.icon}
                </ScaledText>
              </View>
              <View style={styles.benefitTextContainer}>
                <ScaledText fontSize={18} style={styles.benefitTitle}>
                  {benefit.title}
                </ScaledText>
                <ScaledText fontSize={14} style={styles.benefitDescription}>
                  {benefit.description}
                </ScaledText>
              </View>
              <Icon name="checkmark-circle" size={24} color="#02BFDC" />
            </View>
          ))}
        </View>

        {/* 가격 정보 */}
        <View style={styles.priceContainer}>
          <View style={styles.priceCard}>
            <ScaledText fontSize={16} style={styles.priceLabel}>
              월간 구독
            </ScaledText>
            <View style={styles.priceRow}>
              <ScaledText fontSize={36} style={styles.priceAmount}>
                ₩5,000
              </ScaledText>
              <ScaledText fontSize={18} style={styles.priceUnit}>
                /월
              </ScaledText>
            </View>
            <ScaledText fontSize={14} style={styles.priceNote}>
              자동 갱신 • 언제든 취소 가능
            </ScaledText>
          </View>
        </View>

        {/* 구독 버튼 */}
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isProcessing && styles.subscribeButtonDisabled
          ]}
          onPress={handleSubscribe}
          disabled={isProcessing}
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ScaledText fontSize={18} style={styles.subscribeButtonText}>
              월 ₩5,000으로 업그레이드
            </ScaledText>
          )}
        </TouchableOpacity>

        {/* 안내 사항 */}
        <View style={styles.noticeContainer}>
          <ScaledText fontSize={12} style={styles.noticeText}>
            • 구독은 자동으로 갱신됩니다
          </ScaledText>
          <ScaledText fontSize={12} style={styles.noticeText}>
            • 언제든 설정에서 구독을 취소할 수 있습니다
          </ScaledText>
          <ScaledText fontSize={12} style={styles.noticeText}>
            • 취소 시 현재 구독 기간이 끝날 때까지 이용 가능합니다
          </ScaledText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#B8E9F5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  premiumIconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  premiumIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  benefitsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitIcon: {
    textAlign: 'center',
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
  },
  priceContainer: {
    marginBottom: 24,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#02BFDC',
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  priceLabel: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceAmount: {
    fontFamily: 'Pretendard-Bold',
    color: '#02BFDC',
    marginRight: 4,
  },
  priceUnit: {
    fontFamily: 'Pretendard-Medium',
    color: '#6B7280',
  },
  priceNote: {
    fontFamily: 'Pretendard-Regular',
    color: '#9CA3AF',
  },
  subscribeButton: {
    backgroundColor: '#02BFDC',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#02BFDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subscribeButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  subscribeButtonText: {
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  noticeContainer: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 12,
    gap: 8,
    marginBottom: 40,
  },
  noticeText: {
    fontFamily: 'Pretendard-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
});