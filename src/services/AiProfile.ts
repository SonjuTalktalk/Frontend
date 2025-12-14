// src/services/aiProfile.ts
import { apiClient } from '../api/config';
import {
  AiProfile,
  CreateAiProfileRequest,
  UpdateAiProfileRequest
} from '../types/ai';

/**
 * AI 프로필 관련 API
 */
export const aiProfileAPI = {
  /**
   * AI 프로필 생성 (온보딩)
   * POST /ai
   */
  createAiProfile: async (data: CreateAiProfileRequest): Promise<AiProfile> => {
    try {
      console.log('🔄 AI 프로필 생성 요청:', data);
      
      const response = await apiClient.post<AiProfile>('/ai', {
        nickname: data.nickname,
        personality: data.personality,
      });

      console.log('✅ AI 프로필 생성 성공:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ AI 프로필 생성 실패:', error.response?.data || error.message);

      // 네트워크 에러
      if (!error.response) {
        throw new Error('네트워크 연결을 확인해주세요');
      }

      const status = error.response?.status;

      // 401 인증 에러
      if (status === 401) {
        throw new Error('로그인이 필요합니다');
      }

      // 409 이미 존재
      if (status === 409) {
        throw new Error('이미 AI 프로필이 존재합니다');
      }

      // 400 잘못된 요청
      if (status === 400) {
        const errorMessage = error.response?.data?.detail || '입력값을 확인해주세요';
        throw new Error(errorMessage);
      }

      // 기타 에러
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'AI 프로필 생성에 실패했습니다';
      throw new Error(errorMessage);
    }
  },

  /**
   * AI 프로필 조회
   * GET /ai/me
   */
  getAiProfile: async (): Promise<AiProfile> => {
    try {
      console.log('🔄 AI 프로필 조회 요청');
      
      const response = await apiClient.get<AiProfile>('/ai/me');

      console.log('✅ AI 프로필 조회 성공:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ AI 프로필 조회 실패:', error.response?.data || error.message);

      // 네트워크 에러
      if (!error.response) {
        throw new Error('네트워크 연결을 확인해주세요');
      }

      const status = error.response?.status;

      // 401 인증 에러
      if (status === 401) {
        throw new Error('로그인이 필요합니다');
      }

      // 404 프로필 없음
      if (status === 404) {
        throw new Error('AI 프로필이 존재하지 않습니다');
      }

      // 기타 에러
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'AI 프로필을 불러오는데 실패했습니다';
      throw new Error(errorMessage);
    }
  },

  /**
   * AI 닉네임 수정
   * PUT /ai/nickname
   */
  updateNickname: async (nickname: string): Promise<AiProfile> => {
    try {
      console.log('🔄 AI 닉네임 수정 요청:', nickname);
      
      const response = await apiClient.put<AiProfile>('/ai/nickname', {
        nickname: nickname,
      });

      console.log('✅ AI 닉네임 수정 성공:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ AI 닉네임 수정 실패:', error.response?.data || error.message);

      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'AI 닉네임 수정에 실패했습니다';
      throw new Error(errorMessage);
    }
  },

  /**
   * AI 성격(preferences) 수정
   * PUT /ai/preferences
   */
  updatePreferences: async (personality: string): Promise<AiProfile> => {
    try {
      console.log('🔄 AI 성격 수정 요청:', personality);
      
      const response = await apiClient.put<AiProfile>('/ai/preferences', {
        personality: personality,
      });

      console.log('✅ AI 성격 수정 성공:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('❌ AI 성격 수정 실패:', error.response?.data || error.message);

      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        'AI 성격 수정에 실패했습니다';
      throw new Error(errorMessage);
    }
  },

  /**
   * AI 프로필 수정 (통합)
   */
  updateAiProfile: async (data: UpdateAiProfileRequest): Promise<AiProfile> => {
    try {
      // nickname만 수정
      if (data.nickname && !data.personality) {
        return await aiProfileAPI.updateNickname(data.nickname);
      }
      
      // personality만 수정
      if (data.personality && !data.nickname) {
        return await aiProfileAPI.updatePreferences(data.personality);
      }
      
      // 둘 다 수정 (순차적으로)
      if (data.nickname && data.personality) {
        await aiProfileAPI.updateNickname(data.nickname);
        return await aiProfileAPI.updatePreferences(data.personality);
      }

      throw new Error('수정할 항목이 없습니다');
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * AI 프로필 삭제
   * (Swagger에 없음 - 백엔드 확인 필요)
   */
  deleteAiProfile: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      // TODO: 백엔드에 DELETE API 추가 필요
      throw new Error('프로필 삭제 API가 구현되지 않았습니다');
    } catch (error: any) {
      throw error;
    }
  },
};