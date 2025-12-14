// src/types/ai.types.ts

/**
 * AI 성격 타입 (백엔드 Personality Enum과 일치)
 */
export enum Personality {
  FRIENDLY = 'friendly',   // 다정한
  ACTIVE = 'active',       // 활발한
  PLEASANT = 'pleasant',   // 유쾌한
  RELIABLE = 'reliable',   // 듬직한
}

/**
 * 성격 한글 레이블
 */
export const PersonalityLabels: Record<Personality, string> = {
  [Personality.FRIENDLY]: '다정한',
  [Personality.ACTIVE]: '활발한',
  [Personality.PLEASANT]: '유쾌한',
  [Personality.RELIABLE]: '듬직한',
};

/**
 * AI 프로필 데이터 타입
 */
export interface AiProfile {
  owner_cognito_id: string;
  nickname: string;
  personality: Personality;
}

/**
 * AI 프로필 생성 요청
 */
export interface CreateAiProfileRequest {
  nickname: string;
  personality: Personality;
}

/**
 * AI 프로필 업데이트 요청
 */
export interface UpdateAiProfileRequest {
  nickname?: string;
  personality?: Personality;
}