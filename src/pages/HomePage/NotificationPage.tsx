// src/pages/HomePage/NotificationPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScaledText from '../../components/ScaledText';
import {
  getAllNotifications,
  clearAllNotifications,
  formatNotificationTime,
  groupNotificationsByDate,
  NotificationItem
} from '../../api/notificationApi.ts';

export default function NotificationPage() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 화면에 포커스될 때마다 알림 로드
  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('알림 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      '알림 전체 삭제',
      '모든 알림을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await clearAllNotifications();
              if (result) {
                setNotifications([]);
                Alert.alert('완료', `${result.deleted}개의 알림이 삭제되었습니다`);
              }
            } catch (error) {
              console.error('알림 삭제 실패:', error);
              Alert.alert('오류', '알림 삭제에 실패했습니다');
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (title: string): string => {
    if (title.includes('복약') || title.includes('약')) return '💊';
    if (title.includes('할일') || title.includes('할 일')) return '✅';
    if (title.includes('미션')) return '🎯';
    if (title.includes('리포트')) return '📊';
    return '🔔';
  };

  const grouped = groupNotificationsByDate(notifications);

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
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <ScaledText fontSize={16} style={styles.clearButton}>
              전체 삭제
            </ScaledText>
          </TouchableOpacity>
        )}
      </View>

      {/* 알림 목록 */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#02BFDC" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ScaledText fontSize={40} style={styles.emptyIcon}>🔔</ScaledText>
          <ScaledText fontSize={20} style={styles.emptyText}>
            알림이 없습니다
          </ScaledText>
          <ScaledText fontSize={16} style={styles.emptySubText}>
            새로운 알림이 도착하면 여기에 표시됩니다
          </ScaledText>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#02BFDC"
            />
          }
        >
          {/* 오늘 알림 */}
          {grouped.today.length > 0 && (
            <View style={styles.section}>
              <ScaledText fontSize={18} style={styles.sectionTitle}>
                오늘
              </ScaledText>
              {grouped.today.map((notification) => (
                <View key={notification.notification_id} style={styles.notificationCard}>
                  <View style={styles.iconContainer}>
                    <ScaledText fontSize={24} style={styles.icon}>
                      {getNotificationIcon(notification.title)}
                    </ScaledText>
                  </View>
                  <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                      <ScaledText fontSize={18} style={styles.title}>
                        {notification.title}
                      </ScaledText>
                      <ScaledText fontSize={14} style={styles.time}>
                        {formatNotificationTime(notification.date, notification.time)}
                      </ScaledText>
                    </View>
                    <ScaledText fontSize={16} style={styles.description}>
                      {notification.text}
                    </ScaledText>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 이전 알림 */}
          {grouped.earlier.length > 0 && (
            <View style={styles.section}>
              <ScaledText fontSize={18} style={styles.sectionTitle}>
                이전 알림
              </ScaledText>
              {grouped.earlier.map((notification) => (
                <View key={notification.notification_id} style={styles.notificationCard}>
                  <View style={styles.iconContainer}>
                    <ScaledText fontSize={24} style={styles.icon}>
                      {getNotificationIcon(notification.title)}
                    </ScaledText>
                  </View>
                  <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                      <ScaledText fontSize={18} style={styles.title}>
                        {notification.title}
                      </ScaledText>
                      <ScaledText fontSize={14} style={styles.time}>
                        {formatNotificationTime(notification.date, notification.time)}
                      </ScaledText>
                    </View>
                    <ScaledText fontSize={16} style={styles.description}>
                      {notification.text}
                    </ScaledText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  clearButton: {
    fontFamily: 'Pretendard-Medium',
    color: '#FF3B30',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: 'Pretendard-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Pretendard-Medium',
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  time: {
    fontFamily: 'Pretendard-Regular',
    color: '#999999',
    marginLeft: 8,
  },
  description: {
    fontFamily: 'Pretendard-Regular',
    color: '#666666',
    lineHeight: 22,
  },
});