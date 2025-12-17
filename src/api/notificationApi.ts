// src/api/notificationApi.ts
import { apiClient } from './config';

// ========== 타입 정의 ==========

export interface NotificationItem {
  notification_id: number;
  title: string;
  text: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
}

export interface CreateNotificationRequest {
  title: string;
  text: string;
}

export interface CreateNotificationResponse {
  notification_id: number;
}

export interface DeleteNotificationResponse {
  deleted: number;
}

// ========== API 함수들 ==========

/**
 * 전체 알림 조회
 * GET /notifications
 */
export const getAllNotifications = async (): Promise<NotificationItem[]> => {
  try {
    console.log('🔍 알림 조회 API 호출');

    const response = await apiClient.get<NotificationItem[]>('/notifications');

    console.log('✅ 알림 조회 성공:', response.data);
    return response.data || [];
  } catch (error: any) {
    console.error('❌ 알림 조회 실패:', error.response?.data || error.message);
    return [];
  }
};

/**
 * 알림 생성
 * POST /notifications
 */
export const createNotification = async (
  title: string,
  text: string
): Promise<CreateNotificationResponse | null> => {
  try {
    console.log('📤 알림 생성 API 호출:', { title, text });

    const response = await apiClient.post<CreateNotificationResponse>(
      '/notifications',
      { title, text }
    );

    console.log('✅ 알림 생성 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 알림 생성 실패:', error.response?.data || error.message);
    return null;
  }
};

/**
 * 전체 알림 삭제
 * DELETE /notifications
 */
export const clearAllNotifications = async (): Promise<DeleteNotificationResponse | null> => {
  try {
    console.log('🗑️ 전체 알림 삭제 API 호출');

    const response = await apiClient.delete<DeleteNotificationResponse>('/notifications');

    console.log('✅ 전체 알림 삭제 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ 전체 알림 삭제 실패:', error.response?.data || error.message);
    return null;
  }
};

// ========== 유틸리티 함수 ==========

/**
 * 날짜/시간 포맷팅 (상대 시간)
 */
export const formatNotificationTime = (date: string, time: string): string => {
  const now = new Date();
  const notificationDate = new Date(`${date}T${time}`);
  const diffMs = now.getTime() - notificationDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 7일 이상이면 날짜 표시
  const [year, month, day] = date.split('-');
  return `${year.slice(2)}.${month}.${day}`;
};

/**
 * 그룹화된 알림 데이터 (오늘/이전)
 */
export interface GroupedNotifications {
  today: NotificationItem[];
  earlier: NotificationItem[];
}

export const groupNotificationsByDate = (
  notifications: NotificationItem[]
): GroupedNotifications => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const grouped: GroupedNotifications = {
    today: [],
    earlier: [],
  };

  notifications.forEach((notification) => {
    if (notification.date === today) {
      grouped.today.push(notification);
    } else {
      grouped.earlier.push(notification);
    }
  });

  return grouped;
};