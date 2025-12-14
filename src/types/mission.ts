// src/types/mission.ts

/**
 * 미션(챌린지) 타입
 * 백엔드 Challenge와 매핑
 */
export interface Mission {
  id: number;          // 챌린지 ID
  title: string;       // 제목
  subtitle: string;    // 부제목
  points: number;      // 포인트 (백엔드의 give_point)
  completed: boolean;  // 완료 여부 (로컬 상태)
  startedAt?: Date;    // 시작 시간 (로컬 상태)
}

/**. ㅋ
 * 미션 상태
 */
export enum MissionStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}