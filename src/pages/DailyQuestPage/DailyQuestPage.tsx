// src/pages/DailyQuestPage.tsx 병합본
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import { useMission } from '../../contexts/MissionContext';
import { usePoints } from '../../contexts/PointContext';
import { usePremium } from '../../contexts/PremiumContext';
import { MissionStyles } from '../../styles/MissionStyles';
import { colors } from '../../styles/colors';
import missionService from '../../services/missionService';
import { createNotification } from '../../api/notificationApi';

type DailyQuestNavigationProp = NativeStackNavigationProp<any>;

const DailyQuestPage = () => {
  const navigation = useNavigation<DailyQuestNavigationProp>();
  const { points } = usePoints();
  const { isPremium, refreshPremiumStatus } = usePremium();
  const {
    challenges,
    loading,
    error,
    loadChallenges
  } = useMission();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [refreshCount, setRefreshCount] = React.useState(0);

  // ✅ 프리미엄 상태 새로고침
  useEffect(() => {
    refreshPremiumStatus();
  }, []);

  // 🎯 페이지를 떠날 때 미완료 미션 체크
  useEffect(() => {
    return () => {
      checkIncompleteMissions();
    };
  }, [challenges]);

  const checkIncompleteMissions = async () => {
    if (!Array.isArray(challenges) || challenges.length === 0) return;

    const incompleteChallenges = challenges.filter(c => !c.is_complete);

    if (incompleteChallenges.length > 0) {
      await createNotification(
        '미완료 챌린지 알림',
        '아직 ' + incompleteChallenges.length + '개의 챌린지가 남아있어요! 완료하고 포인트를 획득하세요.'
      );
    }
  };

  const handlePullRefresh = async () => {
    setRefreshing(true);
    try {
      await loadChallenges();
    } catch (err) {
      console.error('Pull refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshChallenges = async () => {
    // 최대 새로고침 횟수 체크 (일반: 1회, 프리미엄: 4회)
    const maxRefresh = isPremium ? 4 : 1;

    if (refreshCount >= maxRefresh) {
      Alert.alert(
        '새로고침 제한',
        isPremium
          ? '오늘의 새로고침 횟수를 모두 사용했습니다.\n내일 다시 시도해주세요.'
          : '일반 회원은 하루 1회만 새로고침할 수 있습니다.\n프리미엄 회원은 4회까지 가능합니다.\n\n프리미엄으로 업그레이드하시겠습니까?',
        isPremium
          ? [{ text: '확인' }]
          : [
              { text: '취소', style: 'cancel' },
              { text: '업그레이드', onPress: () => navigation.navigate('Settings') }
            ]
      );
      return;
    }

    Alert.alert(
      '미션 새로고침',
      `현재 미션을 모두 삭제하고 새로운 미션 4개를 받으시겠습니까?\n(완료된 미션도 삭제됩니다)\n\n남은 새로고침: ${maxRefresh - refreshCount}/${maxRefresh}회${isPremium ? ' (프리미엄)' : ''}`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '새로고침',
          onPress: async () => {
            setIsRefreshing(true);
            try {
              const response = await missionService.refreshDailyChallenges();
              console.log('✅ 미션 새로고침 성공:', response);

              // 새로고침 횟수 증가
              setRefreshCount(prev => prev + 1);

              Alert.alert(
                '새로고침 완료',
                `새로운 미션 ${response.challenges.length}개가 생성되었습니다!\n남은 새로고침 횟수: ${maxRefresh - refreshCount - 1}회`,
                [{
                  text: '확인',
                  onPress: async () => {
                    await loadChallenges();
                  }
                }]
              );
            } catch (err: any) {
              console.error('❌ 미션 새로고침 실패:', err);
              Alert.alert(
                '오류',
                err.message || '미션 새로고침에 실패했습니다.',
                [{ text: '확인' }]
              );
            } finally {
              setIsRefreshing(false);
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={MissionStyles.container}>
        <View style={[MissionStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <ScaledText fontSize={16} style={MissionStyles.loadingText}>
            오늘의 챌린지를 불러오는 중...
          </ScaledText>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing && (!Array.isArray(challenges) || challenges.length === 0)) {
    return (
      <SafeAreaView style={MissionStyles.container}>
        <View style={[MissionStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Icon name="alert-circle-outline" size={64} color={colors.error} />
          <ScaledText fontSize={16} style={MissionStyles.errorText}>{error}</ScaledText>
          <TouchableOpacity
            style={MissionStyles.retryButton}
            onPress={handlePullRefresh}
          >
            <Icon name="refresh-outline" size={20} color="#FFF" />
            <ScaledText fontSize={16} style={MissionStyles.retryButtonText}>다시 시도</ScaledText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const maxRefresh = isPremium ? 4 : 1;

  return (
    <SafeAreaView style={MissionStyles.container}>
      <View style={MissionStyles.container}>
        <PageHeader
          title="오늘의 챌린지"
          onBack={() => navigation.goBack()}
          safeArea={true}
          rightButton={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {/* ✅ 새로고침 횟수 표시 */}
              <View style={styles.refreshCountBadge}>
                <ScaledText fontSize={12} style={styles.refreshCountText}>
                  {refreshCount}/{maxRefresh}
                </ScaledText>
              </View>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefreshChallenges}
                disabled={isRefreshing}
              >
                <Icon
                  name="refresh-outline"
                  size={24}
                  color={isRefreshing ? colors.border : colors.text}
                />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          style={MissionStyles.content}
          contentContainerStyle={MissionStyles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handlePullRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* ✅ 프리미엄 안내 */}
          <View style={styles.infoContainer}>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Icon name="star" size={12} color="#FFD700" />
                <ScaledText fontSize={12} style={styles.premiumBadgeText}>
                  프리미엄
                </ScaledText>
              </View>
            )}
            <ScaledText fontSize={14} style={MissionStyles.infoText}>
              매일 밤 12시에 챌린지가 초기화돼요
            </ScaledText>
          </View>

          <View style={MissionStyles.statsContainer}>
            <View style={MissionStyles.statItem}>
              <ScaledText fontSize={16} style={MissionStyles.statLabel}>오늘 완료한 미션</ScaledText>
              <ScaledText fontSize={24} style={MissionStyles.statValue}>
                {Array.isArray(challenges)
                  ? challenges.filter(c => c.is_complete).length + '개'
                  : '0개'}
              </ScaledText>
            </View>
            <View style={MissionStyles.statDivider} />
            <View style={MissionStyles.statItem}>
              <ScaledText fontSize={16} style={MissionStyles.statLabel}>보유 포인트</ScaledText>
              <ScaledText fontSize={24} style={MissionStyles.statValue}>
                {points || 0}P
              </ScaledText>
            </View>
          </View>

          {!Array.isArray(challenges) || challenges.length === 0 ? (
            <View style={MissionStyles.emptyContainer}>
              <Icon name="calendar-outline" size={64} color={colors.border} />
              <ScaledText fontSize={16} style={MissionStyles.emptyText}>
                등록된 챌린지가 없습니다
              </ScaledText>
              <ScaledText fontSize={14} style={MissionStyles.emptySubtext}>
                내일 새로운 챌린지를 확인해보세요!
              </ScaledText>
            </View>
          ) : (
            <View style={MissionStyles.missionList}>
              {challenges
                .sort((a, b) => {
                  const aCompleted = a.is_complete || false;
                  const bCompleted = b.is_complete || false;

                  if (aCompleted && !bCompleted) return 1;
                  if (!aCompleted && bCompleted) return -1;
                  return 0;
                })
                .map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onRefresh={loadChallenges}
                  />
                ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const ChallengeCard = ({
  challenge,
  onRefresh
}: {
  challenge: any;
  onRefresh: () => Promise<void>;
}) => {
  const [loading, setLoading] = React.useState(false);
  const { refreshPoints } = usePoints();

  const isCompleted = challenge.is_complete || false;

  const handleComplete = async () => {
    if (isCompleted) {
      Alert.alert('알림', '이미 완료한 미션입니다.');
      return;
    }

    try {
      setLoading(true);

      const response = await missionService.completeChallenge(challenge.id);

      console.log('✅ 미션 완료 응답:', response);

      if (response.earned_point > 0) {
        // 🎯 미션 완료 알림 생성
        await createNotification(
          '미션 완료!',
          challenge.title + '을(를) 완료하고 ' + response.earned_point + 'P를 획득했습니다!'
        );

        Alert.alert(
          '미션 완료! 🎉',
          response.earned_point + 'P를 획득했습니다!\n총 포인트: ' + response.total_point + 'P',
          [{
            text: '확인',
            onPress: async () => {
              await refreshPoints();
              await onRefresh();
            }
          }]
        );
      } else {
        Alert.alert(
          '알림',
          '이미 완료한 미션입니다.',
          [{
            text: '확인',
            onPress: async () => {
              await onRefresh();
            }
          }]
        );
      }

    } catch (err: any) {
      console.error('❌ 미션 완료 실패:', err);
      Alert.alert(
        '오류',
        err.message || '미션 완료 처리에 실패했습니다.',
        [{ text: '확인' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      <View style={styles.cardHeader}>
        <Icon
          name={isCompleted ? "checkmark-circle" : "flag-outline"}
          size={24}
          color={isCompleted ? "#9CA3AF" : colors.primary}
        />
        <View style={styles.cardHeaderText}>
          <ScaledText
            fontSize={20}
            style={[styles.cardTitle, isCompleted && styles.cardTitleCompleted]}
          >
            {challenge.title}
          </ScaledText>
          <ScaledText
            fontSize={16}
            style={[styles.cardSubtitle, isCompleted && styles.cardSubtitleCompleted]}
          >
            {challenge.subtitle}
          </ScaledText>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.pointBadge}>
          <Icon name="star" size={16} color="#FFD700" />
          <ScaledText fontSize={16} style={styles.pointText}>
            {challenge.give_point}P
          </ScaledText>
        </View>

        {isCompleted ? (
          <View style={styles.completedBadge}>
            <ScaledText fontSize={16} style={styles.completedText}>
              미션 완료
            </ScaledText>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.completeBtn, loading && styles.completeBtnDisabled]}
            onPress={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <ScaledText fontSize={16} style={styles.completeTxt}>
                미션 시작
              </ScaledText>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ✅ 새로고침 횟수 배지
  refreshCountBadge: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#02BFDC',
  },
  refreshCountText: {
    fontFamily: 'Pretendard-Bold',
    color: '#02BFDC',
    fontSize: 12,
  },
  // ✅ 프리미엄 배지
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
    fontSize: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  cardTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  cardSubtitle: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cardSubtitleCompleted: {
    color: '#D1D5DB',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pointBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pointText: {
    color: '#D4AF37',
    fontWeight: '600',
  },
  completeBtn: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  completeBtnDisabled: {
    opacity: 0.6,
  },
  completeTxt: {
    color: '#FFF',
    fontWeight: '600',
  },
  completedBadge: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  completedText: {
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default DailyQuestPage;