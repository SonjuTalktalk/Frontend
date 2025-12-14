// src/utils/dateParser.ts

/**
 * 자연어 날짜를 ISO 형식으로 변환
 * 예: "내일", "오늘", "다음 주 월요일" → "2024-01-15"
 */
export const parseNaturalDate = (naturalDate: string): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  // "오늘"
  if (naturalDate.includes('오늘')) {
    return formatDate(today);
  }

  // "내일"
  if (naturalDate.includes('내일')) {
    const tomorrow = new Date(year, month, date + 1);
    return formatDate(tomorrow);
  }

  // "모레"
  if (naturalDate.includes('모레')) {
    const dayAfterTomorrow = new Date(year, month, date + 2);
    return formatDate(dayAfterTomorrow);
  }

  // "다음 주"
  if (naturalDate.includes('다음 주') || naturalDate.includes('다음주')) {
    const nextWeek = new Date(year, month, date + 7);
    return formatDate(nextWeek);
  }

  // "이번 주"
  if (naturalDate.includes('이번 주') || naturalDate.includes('이번주')) {
    return formatDate(today);
  }

  // 요일 파싱 (월요일, 화요일 등)
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  for (let i = 0; i < weekdays.length; i++) {
    if (naturalDate.includes(weekdays[i])) {
      const targetDay = i;
      const currentDay = today.getDay();
      let daysToAdd = targetDay - currentDay;
      
      if (daysToAdd <= 0) {
        daysToAdd += 7; // 다음 주 같은 요일
      }
      
      const targetDate = new Date(year, month, date + daysToAdd);
      return formatDate(targetDate);
    }
  }

  // 기본값: 오늘
  return formatDate(today);
};

/**
 * 자연어 시간을 HH:MM 형식으로 변환
 * 예: "오전 10시", "오후 3시 30분" → "10:00", "15:30"
 */
export const parseNaturalTime = (naturalTime: string): string => {
  let hour = 0;
  let minute = 0;

  // 오전/오후 구분
  const isPM = naturalTime.includes('오후') || naturalTime.includes('저녁');

  // 시간 추출
  const hourMatch = naturalTime.match(/(\d+)시/);
  if (hourMatch) {
    hour = parseInt(hourMatch[1], 10);
    if (isPM && hour < 12) {
      hour += 12;
    }
    if (!isPM && hour === 12) {
      hour = 0; // 오전 12시 = 00시
    }
  }

  // 분 추출
  const minuteMatch = naturalTime.match(/(\d+)분/);
  if (minuteMatch) {
    minute = parseInt(minuteMatch[1], 10);
  }

  // 특수 키워드 처리
  if (naturalTime.includes('정오') || naturalTime.includes('낮')) {
    hour = 12;
    minute = 0;
  }
  if (naturalTime.includes('자정')) {
    hour = 0;
    minute = 0;
  }

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 날짜와 시간을 받아서 할일 저장용 객체 생성
 */
export const createTodoDateTime = (naturalDate?: string, naturalTime?: string) => {
  let dueDate: string | undefined;
  let dueTime: string | undefined;

  if (naturalDate) {
    dueDate = parseNaturalDate(naturalDate);
  }

  if (naturalTime) {
    dueTime = parseNaturalTime(naturalTime);
  }

  return { dueDate, dueTime };
};

/**
 * ISO 날짜를 한국어 형식으로 변환
 * 예: "2024-01-15" → "2024년 1월 15일"
 */
export const formatDateToKorean = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * HH:MM 시간을 한국어 형식으로 변환
 * 예: "15:30" → "오후 3시 30분"
 */
export const formatTimeToKorean = (time: string): string => {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour >= 12 ? '오후' : '오전';
  if (hour > 12) {
    hour -= 12;
  }
  if (hour === 0) {
    hour = 12;
  }

  if (minute === 0) {
    return `${period} ${hour}시`;
  }
  return `${period} ${hour}시 ${minute}분`;
};