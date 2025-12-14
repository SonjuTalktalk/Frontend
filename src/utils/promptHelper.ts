// src/utils/promptHelper.ts
import { Personality } from '../types/ai';

/**
 * 프롬프트 설정 정보
 */
interface PromptConfig {
  label: string;
  description: string;
}

/**
 * 백엔드 Personality enum과 일치하는 프롬프트 설정
 */
export const promptConfigs: Record<Personality, PromptConfig> = {
  [Personality.FRIENDLY]: {
    label: '다정한',
    description: '따뜻하고 친근한 대화를 나눠요',
  },
  [Personality.ACTIVE]: {
    label: '활발한',
    description: '에너지 넘치고 활기찬 대화를 나눠요',
  },
  [Personality.PLEASANT]: {
    label: '유쾌한',
    description: '유쾌하고 재미있는 대화를 나눠요',
  },
  [Personality.RELIABLE]: {
    label: '듬직한',
    description: '믿음직하고 안정적인 대화를 나눠요',
  },
};