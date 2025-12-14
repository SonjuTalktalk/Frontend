// src/api/config.ts
import axios from 'axios';

// API 기본 URL (끝에 슬래시 제거!)
export const API_BASE_URL =
  'http://coopteam7-beanstalk-env.eba-xevuqgji.ap-northeast-2.elasticbeanstalk.com';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15초로 증가
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (디버깅용 상세 로그)
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('📤 API 요청:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: fullUrl,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('📤 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (상세 에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API 응답 성공:', {
      url: response.config.url,
      status: response.status,
      data: typeof response.data === 'string'
        ? response.data.substring(0, 100)
        : response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환했지만 2xx 범위를 벗어남
      console.error('📥 API 응답 에러:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      console.error('📥 API 네트워크 에러 (응답 없음):', {
        url: error.config?.url,
        message: error.message,
      });
    } else {
      // 요청 설정 중 에러 발생
      console.error('📥 API 설정 에러:', error.message);
    }
    return Promise.reject(error);
  }
);