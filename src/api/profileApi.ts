// src/api/profileApi.ts
import { apiClient } from './config';

// ==================== 타입 정의 ====================

export interface UserProfile {
  phone_number: string;
  name: string;
  gender: string;
  birthdate: string;
  point: number;
  is_premium: boolean;
}

export interface AIProfile {
  nickname: string;
  personality: 'friendly' | 'active' | 'pleasant' | 'reliable';
}

export interface UpdateNicknameRequest {
  new_nickname: string;
}

export interface UpdatePreferencesRequest {
  personality: 'friendly' | 'active' | 'pleasant' | 'reliable';
}

export interface UpdatePremiumRequest {
  is_premium: boolean;
}

// API 응답 타입
export interface ApiResponse {
  message?: string;
  detail?: string;
  [key: string]: any;
}

// ==================== 프로필 API ====================

/**
 * 내 프로필 조회
 * GET /profile/me
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>('/profile/me');
    console.log('✅ 프로필 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 프로필 조회 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 내 이름 수정
 * PUT /profile/me/name
 */
export const updateMyName = async (newName: string): Promise<string | ApiResponse> => {
  try {
    const response = await apiClient.put('/profile/me/name', {
      new_name: newName,
    });

    console.log('✅ 이름 수정 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 이름 수정 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 프리미엄 상태 변경
 * PUT /profile/me/premium
 */
export const updateMyPremium = async (isPremium: boolean): Promise<string | ApiResponse> => {
  try {
    const response = await apiClient.put('/profile/me/premium', {
      is_premium: isPremium,
    });

    console.log('✅ 프리미엄 상태 변경 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 프리미엄 상태 변경 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 계정 삭제
 * DELETE /profile/me
 */
export const deleteMyAccount = async (): Promise<void> => {
  try {
    await apiClient.delete('/profile/me');
    console.log('✅ 계정 삭제 성공');
  } catch (error: any) {
    console.error('❌ 계정 삭제 실패:', error.response?.data || error.message);
    throw error;
  }
};

// ==================== AI 프로필 API ====================

/**
 * 내 AI 프로필 조회
 * GET /ai/me
 */
export const getMyAIProfile = async (): Promise<AIProfile> => {
  try {
    const response = await apiClient.get<AIProfile>('/ai/me');
    console.log('✅ AI 프로필 조회 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ AI 프로필 조회 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * AI 닉네임 수정
 * PUT /ai/nickname
 */
export const updateAINickname = async (newNickname: string): Promise<string | ApiResponse> => {
  try {
    const response = await apiClient.put('/ai/nickname', {
      new_nickname: newNickname,
    });

    console.log('✅ AI 닉네임 수정 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ AI 닉네임 수정 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * AI 성격 설정 수정
 * PUT /ai/preferences
 */
export const updateAIPreferences = async (
  personality: 'friendly' | 'active' | 'pleasant' | 'reliable'
): Promise<AIProfile> => {
  try {
    const response = await apiClient.put<AIProfile>('/ai/preferences', {
      personality,
    });

    console.log('✅ AI 성격 설정 수정 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ AI 성격 설정 수정 실패:', error.response?.data || error.message);
    throw error;
  }
};

export const updateFontSize = async (
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  const response = await apiClient.patch<string>('/profile/me/fontsize', null, {
    params: { size },
  });
  return response.data;
};