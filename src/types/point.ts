// src/types/point.types.ts

/**
 * 포인트 응답 타입
 */
export interface PointResponse {
  point: number;
}

/**
 * 챌린지 완료 응답
 */
export interface CompleteChallengeResponse {
  success: boolean;
  point: number;        // 업데이트된 총 포인트
  earned: number;       // 이번에 획득한 포인트
  message?: string;
}