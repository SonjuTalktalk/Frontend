// src/utils/backgroundConfig.ts

export interface BackgroundItem {
  id: string;
  name: string;
  price: number;
  previewImageUrl: any;
  backgroundNumber: number;
  mainBackground: any;      // 메인 화면 배경
  healthBackground: any;    // 건강 화면 배경
}

// 기본 배경 (구매 전)
export const DEFAULT_BACKGROUNDS = {
  main: require('../../assets/images/배경.png'),
  main2: require('../../assets/images/배경2.png'),
  health: require('../../assets/images/건강배경.png'),
  health2: require('../../assets/images/배경2.png'),
};

// 구매 가능한 배경 목록
export const BACKGROUND_ITEMS: BackgroundItem[] = [
  {
    id: 'background-1',
    name: '리본 배경',
    price: 30,
    previewImageUrl: require('../../assets/images/리본배경.png'),
    backgroundNumber: 1,
    mainBackground: require('../../assets/images/리본배경.png'),
    healthBackground: require('../../assets/images/리본건강배경.png'),
  },
  {
    id: 'background-2',
    name: '교실 배경',
    price: 30,
    previewImageUrl: require('../../assets/images/교실배경.png'),
    backgroundNumber: 2,
    mainBackground: require('../../assets/images/교실배경.png'),
    healthBackground: require('../../assets/images/교실건강배경.png'),
  },
  {
    id: 'background-3',
    name: '등산 배경',
    price: 30,
    previewImageUrl: require('../../assets/images/등산배경.png'),
    backgroundNumber: 3,
    mainBackground: require('../../assets/images/등산배경.png'),
    healthBackground: require('../../assets/images/등산모자건강배경.png'),
  },
  {
    id: 'background-4',
    name: '토끼 배경',
    price: 30,
    previewImageUrl: require('../../assets/images/토끼머리띠배경.png'),
    backgroundNumber: 4,
    mainBackground: require('../../assets/images/토끼머리띠배경.png'),
    healthBackground: require('../../assets/images/토끼머리띠건강배경.png'),
  },
  {
    id: 'background-5',
    name: '마법사 배경',
    price: 30,
    previewImageUrl: require('../../assets/images/마법사모자배경.png'),
    backgroundNumber: 5,
    mainBackground: require('../../assets/images/마법사모자배경.png'),
    healthBackground: require('../../assets/images/마법사모자건강배경.png'),
  },
  {
    id: 'background-6',
    name: '왕관 배경',
    price: 30,
    previewImageUrl: require('../../assets/images/왕관배경.png'),
    backgroundNumber: 6,
    mainBackground: require('../../assets/images/왕관배경.png'),
    healthBackground: require('../../assets/images/왕관건강배경.png'),
  },
];

/**
 * 배경 ID로 배경 정보 가져오기
 */
export const getBackgroundById = (backgroundId: string | null): BackgroundItem | null => {
  if (!backgroundId) return null;
  return BACKGROUND_ITEMS.find(bg => bg.id === backgroundId) || null;
};

/**
 * 현재 장착된 배경의 이미지 가져오기
 * - 기본 배경: 2개 이미지 사용 (배경 + 배경2)
 * - 구매 배경: 1개 이미지만 사용
 */
export const getCurrentBackgrounds = (
  equippedBackgroundId: string | null,
  type: 'main' | 'health'
) => {
  const background = getBackgroundById(equippedBackgroundId);
  
  if (!background) {
    // 기본 배경 반환 (2개 이미지)
    return type === 'main' 
      ? { bg1: DEFAULT_BACKGROUNDS.main, bg2: DEFAULT_BACKGROUNDS.main2 }
      : { bg1: DEFAULT_BACKGROUNDS.health, bg2: DEFAULT_BACKGROUNDS.health2 };
  }
  
  // 구매한 배경 반환 (1개 이미지만 사용, bg2는 투명/없음)
  return type === 'main'
    ? { bg1: background.mainBackground, bg2: null }
    : { bg1: background.healthBackground, bg2: null };
};