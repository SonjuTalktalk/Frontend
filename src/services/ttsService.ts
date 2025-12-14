// src/services/ttsService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

/**
 * TTS API 응답 타입
 */
export interface TTSResponse {
  tts_path: string;
}

/**
 * TTS 서비스
 */
export const ttsService = {
  /**
   * AccessToken 가져오기
   */
  getAccessToken: async (): Promise<string> => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    return token;
  },

  /**
   * 메시지 TTS 생성 및 경로 받기
   * POST /chats/messages/{chat_list_num}/{chat_num}/tts
   *
   * @param chatListNum - 채팅방 번호
   * @param chatNum - 메시지 번호
   * @returns { tts_path: "/static/tts/..." }
   */
  getTTS: async (chatListNum: number, chatNum: number): Promise<TTSResponse> => {
    try {
      const token = await ttsService.getAccessToken();

      console.log(`🔊 TTS API 호출: /chats/messages/${chatListNum}/${chatNum}/tts`);

      const response = await fetch(
        `${API_BASE_URL}/chats/messages/${chatListNum}/${chatNum}/tts`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // 빈 JSON
        }
      );

      console.log(`   응답 상태: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
          errorData.message ||
          `TTS 생성 실패 (${response.status})`
        );
      }

      const data: TTSResponse = await response.json();
      console.log(`   ✅ TTS 경로 받음:`, data.tts_path);

      return data;
    } catch (error) {
      console.error('❌ getTTS 에러:', error);
      throw error;
    }
  },

  /**
   * TTS 경로를 전체 URL로 변환
   *
   * @param ttsPath - API에서 받은 경로 (예: "/static/tts/uid_1_4_nova_20251204_173530.mp3")
   * @returns 전체 URL (예: "http://10.0.2.2:8000/static/tts/uid_1_4_nova_20251204_173530.mp3")
   */
  getFullTTSUrl: (ttsPath: string): string => {
    return `${API_BASE_URL}${ttsPath}`;
  },
};