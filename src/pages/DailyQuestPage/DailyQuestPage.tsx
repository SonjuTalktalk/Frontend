// src/pages/DailyQuestPage.tsx
import React from 'react';
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
import { MissionStyles } from '../../styles/MissionStyles';
import { colors } from '../../styles/colors';
import missionService from '../../services/missionService';

type DailyQuestNavigationProp = NativeStackNavigationProp<any>;

const DailyQuestPage = () => {
  const navigation = useNavigation<DailyQuestNavigationProp>();
  const {
    challenges,
    loading,
    error,
    loadChallenges
  } = useMission();

  const [refreshing, setRefreshing] = React.useState(false);

  /**
   * Pull-to-refresh 핸들러
   */
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

  /**
   * 로딩 상태
   */
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

  /**
   * 에러 상태 (챌린지가 없을 때만)
   */
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

  return (
    <SafeAreaView style={MissionStyles.container}>
      <View style={MissionStyles.container}>
        {/* Header */}
        <PageHeader
          title="오늘의 챌린지"
          onBack={() => navigation.goBack()}
          safeArea={true}
          rightButton={
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handlePullRefresh}
              disabled={refreshing}
            >
              <Icon
                name="refresh-outline"
                size={24}
                color={refreshing ? colors.border : colors.text}
              />
            </TouchableOpacity>
          }
        />

        {/* Content */}
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
          <ScaledText fontSize={14} style={MissionStyles.infoText}>
            매일 밤 12시에 챌린지가 초기화돼요
          </ScaledText>

          {/* 챌린지 통계 */}
          <View style={MissionStyles.statsContainer}>
            <View style={MissionStyles.statItem}>
              <ScaledText fontSize={16} style={MissionStyles.statLabel}>오늘의 챌린지</ScaledText>
              <ScaledText fontSize={24} style={MissionStyles.statValue}>
                {Array.isArray(challenges) ? challenges.length : 0}개
              </ScaledText>
            </View>
            <View style={MissionStyles.statDivider} />
            <View style={MissionStyles.statItem}>
              <ScaledText fontSize={16} style={MissionStyles.statLabel}>총 포인트</ScaledText>
              <ScaledText fontSize={24} style={MissionStyles.statValue}>
                {Array.isArray(challenges) ? challenges.reduce((sum, c) => sum + c.give_point, 0) : 0}P
              </ScaledText>
            </View>
          </View>

          {/* 챌린지 목록 */}
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
                  // 완료되지 않은 미션을 위로 정렬
                  // is_complete가 없으면 미완료로 간주
                  const aCompleted = a.is_complete || false;
                  const bCompleted = b.is_complete || false;

                  if (aCompleted && !bCompleted) return 1;  // a가 완료면 아래로
                  if (!aCompleted && bCompleted) return -1; // b가 완료면 아래로
                  return 0; // 둘 다 같은 상태면 순서 유지
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

/**
 * 챌린지 카드 컴포넌트 (완료 상태 표시 추가)
 */
const ChallengeCard = ({
  challenge,
  onRefresh
}: {
  challenge: any;
  onRefresh: () => Promise<void>;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const { refreshPoints } = usePoints();

  /** ✅ 미션 완료 처리 (새 API 사용) */
  const handleComplete = async () => {
    if (isCompleted) return; // 이미 완료된 경우 무시

    try {
      setLoading(true);

      // 미션 완료 API 호출
      const response = await missionService.completeChallenge(challenge.id);

      console.log('✅ 미션 완료 응답:', response);

      // 포인트 획득 여부 확인
      if (response.earned_point > 0) {
        setIsCompleted(true); // 완료 상태로 변경

        Alert.alert(
          '미션 완료! 🎉',
          `${response.earned_point}P를 획득했습니다!\n총 포인트: ${response.total_point}P`,
          [{ text: '확인' }]
        );

        // 포인트 컨텍스트 새로고침
        await refreshPoints();

        // 챌린지 목록 새로고침
        await onRefresh();
      } else {
        // 이미 완료된 미션
        setIsCompleted(true);
        Alert.alert(
          '알림',
          '이미 완료한 미션입니다.',
          [{ text: '확인' }]
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

        {/* 미션 완료/시작 버튼 */}
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
