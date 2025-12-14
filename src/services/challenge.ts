// src/services/challenge.ts
import { apiClient } from '../api/config';
import { CompleteChallengeResponse } from '../types/point';

export interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  give_point: number;
}

export const challengeAPI = {
  /**
   * 오늘의 데일리 챌린지 4개 조회
   * GET /challenges/daily
   */
  getDailyChallenges: async (): Promise<Challenge[]> => {
    try {
      const response = await apiClient.get('/challenges/daily');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: '챌린지를 불러오는데 실패했습니다' 
      };
    }
  },

  /**
   * 챌린지 완료 및 포인트 적립
   * POST /challenges/{challengeId}/complete
   */
  completeChallenge: async (challengeId: number): Promise<CompleteChallengeResponse> => {
    try {
      const response = await apiClient.post(`/challenges/${challengeId}/complete`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: '챌린지 완료 처리에 실패했습니다' 
      };
    }
  },

  /**
   * 내 포인트 조회
   * GET /users/me/points
   */
  getMyPoints: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/users/me/points');
      return response.data.point || 0;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: '포인트 조회에 실패했습니다'
      };
    }
  },

  /**
   * 포인트 증가
   * POST /point/increase
   */
  increasePoints: async (point: number): Promise<string> => {
    try {
      const response = await apiClient.post('/point/increase', { point });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || {
        success: false,
        message: '포인트 증가에 실패했습니다'
      };
    }
  },
};