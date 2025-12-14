// src/services/auth.ts
import { apiClient } from '../api/config';

export interface SignUpWithCognitoRequest {
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYYMMDD
  phone: string;
  password: string;
}

export interface ConfirmSignUpRequest {
  phone: string;
  verificationCode: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export const authAPI = {
  // Cognito 회원가입
  signUpWithCognito: async (data: SignUpWithCognitoRequest) => {
    try {
      const response = await apiClient.post('/auth/cognito/signup', {
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate,
        phoneNumber: data.phone,
        password: data.password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: '회원가입에 실패했습니다' 
      };
    }
  },

  // Cognito 인증번호 확인
  confirmSignUp: async (data: ConfirmSignUpRequest) => {
    try {
      const response = await apiClient.post('/auth/cognito/confirm', {
        phoneNumber: data.phone,
        confirmationCode: data.verificationCode,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: '인증에 실패했습니다' 
      };
    }
  },

  // 인증번호 재발송
  resendVerificationCode: async (data: { phone: string }) => {
    try {
      const response = await apiClient.post('/auth/cognito/resend', {
        phoneNumber: data.phone,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { 
        success: false, 
        message: '재발송에 실패했습니다' 
      };
    }
  },

  // 로그인 (Cognito)
  login: async (data: LoginRequest): Promise<string> => {
    try {
      console.log('🔄 로그인 시도:', data.phone);
      
      const response = await apiClient.post<string>('/auth/login', {
        phoneNumber: data.phone,
        password: data.password,
      });

      // 응답이 단순 문자열 토큰
      const token = response.data;
      
      console.log('✅ 로그인 성공, 토큰:', token.substring(0, 20) + '...');
      
      return token;
    } catch (error: any) {
      console.error('❌ 로그인 실패:', error.response?.data || error.message);
      
      throw error.response?.data || { 
        success: false, 
        message: '로그인에 실패했습니다' 
      };
    }
  },
};