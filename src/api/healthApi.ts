// src/api/healthApi.ts
import { apiClient } from './config';

export interface HealthMemoRequest {
  memo_date: string; // YYYY-MM-DD 형식
  memo_text: string;
}

export interface HealthMemoResponse {
  response_message: string;
  memo_text: string;
  memo_date: string;
  status: string;
}

/**
 * 건강 일지 저장/수정
 * POST /health/memos
 */
export const saveHealthMemo = async (
  memo_date: string,
  memo_text: string
): Promise<HealthMemoResponse> => {
  try {
    const response = await apiClient.post<HealthMemoResponse>('/health/memos', {
      memo_date,
      memo_text,
    });

    console.log('✅ 건강 일지 저장 성공:', response.data.response_message);
    return response.data;
  } catch (error: any) {
    console.error('❌ 건강 일지 저장 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 특정 날짜의 건강 일지 조회
 * GET /health/memos/date?requested_date=YYYY-MM-DD
 */
export const getHealthMemo = async (requested_date: string): Promise<HealthMemoResponse | null> => {
  try {
    console.log(`🔍 일지 조회 시도: /health/memos/date?requested_date=${requested_date}`);

    const response = await apiClient.get<HealthMemoResponse>('/health/memos/date', {
      params: { requested_date },
    });

    console.log(`✅ 건강 일지 조회 성공 (${requested_date}):`, response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 건강 일지 조회 실패:', error.response?.data || error.message);
    return null;
  }
};

/**
 * 특정 월의 모든 일지 조회
 * GET /health/memos/month?requested_month=YYYY-MM
 */
export const getHealthMemosForMonth = async (
  year: number,
  month: number
): Promise<{ memos: { [key: string]: string }; statuses: { [key: string]: string } }> => {
  try {
    // requested_month 파라미터 사용 (YYYY-MM 형식)
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    console.log(`🔍 월별 일지 조회 시도: /health/memos/month?requested_month=${monthStr}`);

    const response = await apiClient.get<HealthMemoResponse[]>('/health/memos/month', {
      params: { requested_month: monthStr },
    });

    console.log(`📦 API 응답 받음:`, response.data);

    const memos: { [key: string]: string } = {};
    const statuses: { [key: string]: string } = {};

    // API 응답이 배열 형태로 옴
    if (Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((item: HealthMemoResponse) => {
        if (item.memo_date && item.memo_text) {
          // YYYY-MM-DD를 YYYY/MM/DD로 변환
          const displayDateKey = item.memo_date.replace(/-/g, '/');
          memos[displayDateKey] = item.memo_text;

          // ✅ status 정보도 함께 저장
          if (item.status) {
            statuses[displayDateKey] = item.status;
            console.log(`  ✓ ${displayDateKey}: ${item.memo_text.substring(0, 20)}... [${item.status}]`);
          } else {
            console.log(`  ✓ ${displayDateKey}: ${item.memo_text.substring(0, 20)}...`);
          }
        }
      });
    } else {
      console.log('  ℹ️ 해당 월에 일지 데이터가 없습니다.');
    }

    console.log(`✅ ${year}년 ${month}월 일지 조회 완료: ${Object.keys(memos).length}개`);
    return { memos, statuses };
  } catch (error: any) {
    console.error('❌ 월별 일지 조회 실패:', {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return { memos: {}, statuses: {} };
  }
};