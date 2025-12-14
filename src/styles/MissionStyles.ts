// src/styles/MissionStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const MissionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 30,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard-Medium',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  infoText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
    right: 20
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  // ========== 미션 리스트 ==========
  missionList: {
    gap: 16,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 150
  },

  // ========== 미션 카드 스타일 ==========
  missionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Pretendard-Medium',

  },
  tagContainer: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tag: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  points: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  pointsLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  coinIcon: {
    fontSize: 20,
  },

  // ========== 미션 버튼 ==========
  missionButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  missionButtonCompleted: {
    backgroundColor: colors.secondary,
  },
  missionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  missionButtonTextCompleted: {
    color: colors.textSecondary,
  },

  // ========== 모달 스타일 ==========
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#212529',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6C757D',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ADB5BD',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CED4DA',
  },
});