// src/api/medicineApi.ts
import { apiClient } from './config';

// ========== 타입 정의 ==========

export interface MedicineItem {
  medicine_name: string;
  medicine_daily: number;
  medicine_period: number;
  medicine_date: string; // YYYY-MM-DD 형식
}

// POST /health/medicine - 등록 요청
export interface CreateMedicineRequest {
  target: MedicineItem[];
}

// POST /health/medicine - 등록 응답
export interface CreateMedicineResponseItem {
  response_message: string;
  registered: boolean;
  medicine_name: string;
  medicine_daily: number;
  medicine_period: number;
  medicine_date: string;
}

export interface CreateMedicineResponse {
  response: CreateMedicineResponseItem[];
}

// GET /health/medicine - 조회 응답
export interface GetMedicineResponse {
  result: MedicineItem[];
}

// DELETE /health/medicine - 삭제 요청
export interface DeleteMedicineRequest {
  medicine_name: string;
  medicine_date: string;
}

// DELETE /health/medicine - 삭제 응답
export interface DeleteMedicineResponse {
  response_message: string;
  medicine_name: string;
  medicine_date: string;
}

// PATCH /health/medicine - 수정 요청
export interface UpdateMedicineRequest {
  current_name: string;
  current_date: string;
  update: {
    update_name?: string;
    update_daily?: number;
    update_period?: number;
    update_date?: string;
  };
}

// PATCH /health/medicine - 수정 응답
export interface UpdateMedicineResponse {
  response_message: string;
  old_name: string;
  old_date: string;
  updated: {
    update_name?: string;
    update_daily?: number;
    update_period?: number;
    update_date?: string;
  };
}

// POST /health/automedicine - OCR 응답
export interface OCRMedicineResponse {
  result: MedicineItem[];
}

// ========== API 함수들 ==========

/**
 * 복약 루틴 등록 (단일 또는 다수)
 * POST /health/medicine
 */
export const createMedicine = async (
  medicines: MedicineItem[]
): Promise<CreateMedicineResponse> => {
  try {
    console.log('🔵 복약 등록 API 호출:', medicines);

    const response = await apiClient.post<CreateMedicineResponse>(
      '/health/medicine',
      { target: medicines }
    );

    console.log('✅ 복약 등록 API 응답:', response.data);

    // 등록 실패한 항목 로깅
    response.data.response.forEach((item, index) => {
      if (!item.registered) {
        console.warn(`⚠️ 복약 등록 실패 [${index}]:`, item.response_message);
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('❌ 복약 등록 API 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 특정 날짜의 복약 루틴 조회
 * GET /health/medicine?requested_date=YYYY-MM-DD
 */
export const getMedicinesByDate = async (
  requested_date: string
): Promise<MedicineItem[]> => {
  try {
    console.log(`🔍 복약 조회 API 호출: ${requested_date}`);

    const response = await apiClient.get<GetMedicineResponse>('/health/medicine', {
      params: { requested_date },
    });

    console.log('✅ 복약 조회 API 응답:', response.data);
    return response.data.result || [];
  } catch (error: any) {
    console.error('❌ 복약 조회 API 실패:', error.response?.data || error.message);
    return [];
  }
};

/**
 * 복약 루틴 삭제
 * DELETE /health/medicine
 */
export const deleteMedicine = async (
  medicine_name: string,
  medicine_date: string
): Promise<DeleteMedicineResponse> => {
  try {
    console.log('🗑️ 복약 삭제 API 호출:', { medicine_name, medicine_date });

    const response = await apiClient.delete<DeleteMedicineResponse>(
      '/health/medicine',
      {
        data: {
          medicine_name,
          medicine_date,
        },
      }
    );

    console.log('✅ 복약 삭제 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 복약 삭제 API 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * 복약 루틴 수정
 * PATCH /health/medicine
 */
export const updateMedicine = async (
  current_name: string,
  current_date: string,
  updates: {
    update_name?: string;
    update_daily?: number;
    update_period?: number;
    update_date?: string;
  }
): Promise<UpdateMedicineResponse> => {
  try {
    // 변경사항이 없으면 에러
    if (Object.keys(updates).length === 0) {
      throw new Error('변경할 내용이 없습니다.');
    }

    console.log('✏️ 복약 수정 API 호출:', {
      current_name,
      current_date,
      updates,
    });

    const response = await apiClient.patch<UpdateMedicineResponse>(
      '/health/medicine',
      {
        current_name,
        current_date,
        update: updates,
      }
    );

    console.log('✅ 복약 수정 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 복약 수정 API 실패:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * OCR을 통한 복약 루틴 자동 인식
 * POST /health/automedicine
 */
export const scanMedicineByOCR = async (
  imageFile: any
): Promise<MedicineItem[]> => {
  try {
    console.log('📸 OCR API 호출');
    console.log('이미지 파일:', imageFile);

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.post<OCRMedicineResponse>(
      '/health/automedicine',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [(data) => data], // FormData를 변환하지 않고 그대로 전달
        timeout: 60000, // OCR은 시간이 오래 걸릴 수 있으므로 60초
      }
    );

    console.log('✅ OCR API 응답:', response.data);
    return response.data.result || [];
  } catch (error: any) {
    console.error('❌ OCR API 실패:', error.response?.data || error.message);
    throw error;
  }
};

// ========== 유틸리티 함수 ==========

/**
 * 날짜 형식 변환: YYYY/MM/DD -> YYYY-MM-DD
 */
export const convertDateToAPIFormat = (date: string): string => {
  return date.replace(/\//g, '-');
};

/**
 * 날짜 형식 변환: YYYY-MM-DD -> YYYY/MM/DD
 */
export const convertDateToDisplayFormat = (date: string): string => {
  return date.replace(/-/g, '/');
};

/**
 * API 응답에서 숫자 추출
 * 입력이 이미 숫자면 문자열로 변환
 * "3(하루 세 번)" -> "3"
 * 3 -> "3"
 */
export const extractNumber = (value: string | number): string => {
  if (typeof value === 'number') {
    return String(value);
  }
  const match = value.match(/^\d+/);
  return match ? match[0] : value;
};

// ========== MedicationSettings에서 사용할 래퍼 함수 ==========

/**
 * 복약 루틴 수정 (화면용 날짜 포맷 지원)
 * @param medicineName 약 이름
 * @param displayDate 화면용 날짜 (YYYY/MM/DD)
 * @param updates 수정할 내용
 */
export const updateMedicineRoutine = async (
  medicineName: string,
  displayDate: string,
  updates: {
    update_name?: string;
    update_daily?: number;
    update_period?: number;
    update_display_date?: string; // YYYY/MM/DD
  }
): Promise<UpdateMedicineResponse> => {
  // 화면용 날짜를 API용 날짜로 변환
  const apiDate = convertDateToAPIFormat(displayDate);

  // update_display_date가 있으면 API용으로 변환
  const apiUpdates: any = { ...updates };
  if (updates.update_display_date) {
    apiUpdates.update_date = convertDateToAPIFormat(updates.update_display_date);
    delete apiUpdates.update_display_date;
  }

  return updateMedicine(medicineName, apiDate, apiUpdates);
};

/**
 * 복약 루틴 삭제 (화면용 날짜 포맷 지원)
 * @param medicineName 약 이름
 * @param displayDate 화면용 날짜 (YYYY/MM/DD)
 */
export const deleteMedicineRoutine = async (
  medicineName: string,
  displayDate: string
): Promise<DeleteMedicineResponse> => {
  // 화면용 날짜를 API용 날짜로 변환
  const apiDate = convertDateToAPIFormat(displayDate);
  return deleteMedicine(medicineName, apiDate);
};

/**
 * 특정 날짜의 복약 루틴 조회 (화면용 날짜 포맷 지원)
 * @param displayDate 화면용 날짜 (YYYY/MM/DD)
 */
export const getMedicineRoutinesByDate = async (
  displayDate: string
): Promise<MedicineItem[]> => {
  // 화면용 날짜를 API용 날짜로 변환
  const apiDate = convertDateToAPIFormat(displayDate);
  return getMedicinesByDate(apiDate);
};