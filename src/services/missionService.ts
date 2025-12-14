// src/services/missionService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../api/config';

export interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  give_point: number;
}

interface DailyChallengeResponse {
  challenges: Challenge[];
  refresh_remaining: number;
}

interface CompleteChallengeRequest {
  challenge_id: number;
}

interface CompleteChallengeResponse {
  challenge_id: number;
  is_complete: boolean;
  earned_point: number;
  total_point: number;
}

class MissionService {

  private async getAccessToken(): Promise<string> {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
    return token;
  }

  /** 🔹 오늘의 미션 불러오기 (처음 4개 생성 → 이후 동일 값 반환) */
  async getDailyChallenges(): Promise<DailyChallengeResponse> {
    const token = await this.getAccessToken();

    const res = await fetch(`${API_BASE_URL}/challenges/daily`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "챌린지를 불러오지 못했습니다.");
    }

    return await res.json(); // { challenges[], refresh_remaining }
  }

  /** 🔥 미션 새로고침 (프리미엄만 남은 횟수 다름) */
  async refreshDailyChallenges(): Promise<DailyChallengeResponse> {
    const token = await this.getAccessToken();

    const res = await fetch(`${API_BASE_URL}/challenges/daily/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "새로고침 실패");
    }
    return await res.json(); // { challenges[], refresh_remaining }
  }

  /** ✅ 미션 완료 처리 (NEW) */
  async completeChallenge(challengeId: number): Promise<CompleteChallengeResponse> {
    const token = await this.getAccessToken();

    const res = await fetch(`${API_BASE_URL}/challenges/daily/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ challenge_id: challengeId })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "미션 완료 처리 실패");
    }

    return await res.json(); // { challenge_id, is_complete, earned_point, total_point }
  }

  /** 🪷 미션 성공 → give_point 만큼 포인트 지급 (기존 방식 - 이제 사용 안 함) */
  async earnPoint(point: number) {
    const token = await this.getAccessToken();

    const res = await fetch(`${API_BASE_URL}/profile/me/point/earn`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ point })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "포인트 지급 실패");
    }

    return await res.json(); // 보통 "success" string
  }
}

export default new MissionService();