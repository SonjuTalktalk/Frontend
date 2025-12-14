// src/contexts/MissionContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import missionService, { Challenge } from '../services/missionService';

interface MissionContextType {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  loadChallenges: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 챌린지 목록 로드
   */
  const loadChallenges = async () => {
  setLoading(true);
  setError(null);

  try {
    const { challenges } = await missionService.getDailyChallenges(); // 수정됨
    setChallenges(challenges);  // drop refresh_remaining (UI에서 쓸 생각이면 따로 저장)
  } catch (err) {
    const msg = err instanceof Error ? err.message : '챌린지를 불러오는데 실패했습니다.';
    if (challenges.length === 0) setError(msg);
  } finally {
    setLoading(false);
  }
};

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadChallenges();
  }, []);

  return (
    <MissionContext.Provider
      value={{
        challenges,
        loading,
        error,
        loadChallenges,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within MissionProvider');
  }
  return context;
};