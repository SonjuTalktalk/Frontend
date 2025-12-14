// src/pages/HomePage/NotificationPage.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScaledText from '../../components/ScaledText';

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time?: string;
}

export default function NotificationPage() {
  const navigation = useNavigation();

  const notifications: NotificationItem[] = [
    {
      id: '1',
      icon: '🥗',
      title: '미션 완료',
      description: '오늘의 뉴스 3줄 요약 미션이 완료되었어요!\n+3 포인트 지급 중',
      time: '',
    },
    {
      id: '2',
      icon: '💬',
      title: 'AI 답변 준비 완료',
      description: '저가 요청하신 답변을 모두 생성했어요.\n놀러서 대화로 돌아가보세요.',
      time: '',
    },
    {
      id: '3',
      icon: '🎵',
      title: '주간 리포트 생성됨',
      description: '이번 주 활동 리포트가 준비되었어요.\nAI 캐릭터 또는 53회, 질병 관리 중이에요. ✓',
      time: '',
    },
    {
      id: '4',
      icon: '🍔',
      title: '오늘의 미션 제안',
      description: '오늘은 없은 날이에요.\n가벼운 스트레칭 미션을 시작해볼까요?',
      time: '',
    },
    {
      id: '5',
      icon: '🎯',
      title: '투두리스트 알림',
      description: '오후 2시까지 중병 맛있게 꼭 드세요.\n함께 운동을 잊지 마세요.',
      time: '',
    },
  ];

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/images/leftarrow.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={styles.headerTitle}>
          알림 센터
        </ScaledText>
      </View>

      {/* 알림 목록 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.iconContainer}>
              <ScaledText fontSize={24} style={styles.icon}>
                {notification.icon}
              </ScaledText>
            </View>
            <View style={styles.contentContainer}>
              <ScaledText fontSize={20} style={styles.title}>
                {notification.title}
              </ScaledText>
              <ScaledText fontSize={18} style={styles.description}>
                {notification.description}
              </ScaledText>
            </View>
          </View>
        ))}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Pretendard-Regular',
    color: '#666666',
    lineHeight: 24,
  },
});