// src/pages/HealthPage/HealthPage.tsx 최종본
import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';
import { getHealthMemosForMonth } from '../../api/healthApi';

const STORAGE_KEY = '@health_diary_entries';
const STATUS_STORAGE_KEY = '@health_diary_status';
const MEDICATION_STORAGE_KEY = '@medication_data';

type StatusType = 'healthy' | 'warning' | 'danger' | null;

export default function HealthPage() {
  const navigation = useNavigation<any>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState<{ [key: string]: string }>({});
  const [diaryStatuses, setDiaryStatuses] = useState<{ [key: string]: string }>({});

  // ✅ 복약 알림 카드용 상태
  const [reminderTimeText, setReminderTimeText] = useState<string>('—');
  const [reminderDescription, setReminderDescription] = useState<string>('오늘 복약 알림이 없습니다.');

  // ✅ 배경 시스템 상태
  const [backgrounds, setBackgrounds] = useState<{
    bg1: any;
    bg2: any | null;
  }>({
    bg1: require('../../../assets/images/healthbackground.png'),
    bg2: require('../../../assets/images/background2.png'),
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useFocusEffect(
    React.useCallback(() => {
      loadDiaryEntriesFromServer();
      loadMedicationReminder();
    }, [currentYear, currentMonth])
  );

  // ✅ 서버에서 일지 + status 가져오기
  const loadDiaryEntriesFromServer = async () => {
    try {
      console.log(`📡 서버에서 ${currentYear}년 ${currentMonth + 1}월 데이터 요청 중...`);

      // API에서 해당 월의 일지 + status 가져오기
      const { memos, statuses } = await getHealthMemosForMonth(currentYear, currentMonth + 1);

      console.log('📥 서버에서 받은 memos:', memos);
      console.log('📥 서버에서 받은 statuses:', statuses);

      // ✅ memos와 statuses가 올바른 형식인지 확인
      const validatedMemos: { [key: string]: string } = {};
      const validatedStatuses: { [key: string]: string } = {};

      // memos 처리 (undefined 체크)
      if (memos && typeof memos === 'object') {
        Object.entries(memos).forEach(([key, value]) => {
          validatedMemos[key] = typeof value === 'string' ? value : '';
        });
      }

      // statuses 처리 (undefined 체크)
      if (statuses && typeof statuses === 'object') {
        Object.entries(statuses).forEach(([key, value]) => {
          validatedStatuses[key] = typeof value === 'string' ? value : '';
        });
      }

      // ✅ 상태 업데이트 (서버 데이터로)
      setDiaryEntries(validatedMemos);
      setDiaryStatuses(validatedStatuses);

      // 로컬 스토리지에도 저장 (오프라인 대응)
      const allStored = await AsyncStorage.getItem(STORAGE_KEY);
      const allEntries = allStored ? JSON.parse(allStored) : {};
      Object.assign(allEntries, validatedMemos);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));

      // status도 로컬 스토리지에 저장
      const allStatusStored = await AsyncStorage.getItem(STATUS_STORAGE_KEY);
      const allStatuses = allStatusStored ? JSON.parse(allStatusStored) : {};
      Object.assign(allStatuses, validatedStatuses);
      await AsyncStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(allStatuses));

      console.log('✅ 서버 데이터로 업데이트 완료');
      console.log('  - 일지 개수:', Object.keys(validatedMemos).length);
      console.log('  - status 개수:', Object.keys(validatedStatuses).length);

    } catch (error) {
      console.error('❌ 서버에서 일지 데이터 로드 실패:', error);

      // API 실패 시 로컬 스토리지 데이터 사용
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const statusStored = await AsyncStorage.getItem(STATUS_STORAGE_KEY);

        if (stored) {
          const localEntries = JSON.parse(stored);
          const filteredEntries: { [key: string]: string } = {};
          Object.entries(localEntries).forEach(([date, content]) => {
            if (date.startsWith(`${currentYear}/${String(currentMonth + 1).padStart(2, '0')}`)) {
              filteredEntries[date] = typeof content === 'string' ? content : '';
            }
          });
          setDiaryEntries(filteredEntries);
          console.log('📂 로컬 스토리지에서 일지 로드:', Object.keys(filteredEntries).length);
        }

        if (statusStored) {
          const localStatuses = JSON.parse(statusStored);
          setDiaryStatuses(localStatuses);
          console.log('📂 로컬 스토리지에서 status 로드:', Object.keys(localStatuses).length);
        }
      } catch (localError) {
        console.error('로컬 스토리지 로드도 실패:', localError);
      }
    }
  };

  // ===== 복약 알림 계산 유틸 =====
  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const slotTo24h = (slotTime: string): string => {
    const isAM = slotTime.includes('오전');
    const num = parseInt(slotTime.replace(/[^\d]/g, ''), 10);
    let h = num;
    if (!isAM) {
      if (h !== 12) h += 12;
    } else {
      if (h === 12) h = 0;
    }
    return `${String(h).padStart(2, '0')}:00`;
  };

  const WINDOW_SLOTS = [
    { hour: 8,  time: '오전 8시',  label: '아침' },
    { hour: 12, time: '오후 12시', label: '점심' },
    { hour: 18, time: '오후 6시',  label: '저녁' },
    { hour: 22, time: '오후 10시', label: '취침' },
  ] as const;

  const getCurrentWindowIndex = (): number => {
    const now = new Date();
    const h = now.getHours();

    if (h < 8) return 0;
    if (h < 12) return 0;
    if (h < 18) return 1;
    if (h < 22) return 2;
    return 3;
  };

  const loadMedicationReminder = async () => {
    try {
      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      const medData: { [key: string]: { time: string; label: string; medications: any[] }[] } =
        stored ? JSON.parse(stored) : {};

      const dateKey = formatDateKey(new Date());
      const todaySlots = medData[dateKey] || [];

      if (!todaySlots.length) {
        setReminderTimeText('—');
        setReminderDescription('오늘 복약 알림이 없습니다.');
        return;
      }

      const currentWindowIdx = getCurrentWindowIndex();

      for (let i = currentWindowIdx; i < WINDOW_SLOTS.length; i++) {
        const window = WINDOW_SLOTS[i];
        const slot = todaySlots.find(s => s.time === window.time);

        if (!slot) continue;

        const unchecked = slot.medications?.filter((m: any) => !m.checked).map((m: any) => m.name) || [];

        if (unchecked.length > 0) {
          const t24 = slotTo24h(window.time);
          setReminderTimeText(t24);

          if (unchecked.length === 1) {
            setReminderDescription(`${unchecked[0]} 을/를 드셔야 해요.`);
          } else {
            setReminderDescription(`${unchecked[0]} 외 ${unchecked.length - 1}개 드셔야 해요.`);
          }
          return;
        }
      }

      setReminderTimeText('—');
      setReminderDescription('오늘 드실 약을 모두 드셨어요! 👍');

    } catch (e) {
      console.error('복약 알림 계산 실패:', e);
      setReminderTimeText('—');
      setReminderDescription('복약 알림을 불러오지 못했습니다.');
    }
  };
  // ==============================

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isFutureDate = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const hasEntryForDay = (day: number) => {
    const dateKey = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    const entry = diaryEntries[dateKey];

    // 타입 체크 추가: entry가 문자열인지 확인
    if (typeof entry !== 'string') {
      return false;
    }

    return entry.trim().length > 0;
  };

  // ✅ 서버에서 받은 status 값 그대로 사용
  const getStatusForDay = (day: number): StatusType => {
    const dateKey = `${currentYear}/${String(currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    const status = diaryStatuses[dateKey];

    if (!status) {
      console.log(`📍 ${dateKey}: status 없음`);
      return null;
    }

    const statusLower = status.toLowerCase();
    console.log(`📍 ${dateKey}: status = ${statusLower}`);

    // healthy, warning, danger 그대로 반환
    if (statusLower === 'healthy' || statusLower === 'warning' || statusLower === 'danger') {
      return statusLower as StatusType;
    }

    return null;
  };

  const renderCalendar = () => {
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <View key={`empty-${i}`} style={[healthStyles.calendarDay, { backgroundColor: 'transparent' }]}>
          <ScaledText fontSize={18} style={healthStyles.calendarDayText}></ScaledText>
        </View>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getStatusForDay(day);
      const future = isFutureDate(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            healthStyles.calendarDay,
            status === 'healthy' && (healthStyles as any).statusGood,
            status === 'warning' && (healthStyles as any).statusModerate,
            status === 'danger' && (healthStyles as any).statusConcerning,
            isToday(day) && healthStyles.todayBorder,
            future && healthStyles.disabledDay,
          ]}
          onPress={() => {
            if (!future) {
              navigation.navigate('HealthDiaryEntry', {
                date: day,
                month: currentMonth + 1,
                year: currentYear,
              });
            }
          }}
          disabled={future}
        >
          <ScaledText
            fontSize={18}
            style={[
              healthStyles.calendarDayText,
              status && { color: '#333' },
              future && { color: '#CCC' },
            ]}
          >
            {day}
          </ScaledText>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const handleBackPress = () => navigation.goBack();

  return (
    <View style={healthStyles.container}>
      <Image
        source={require('../../../assets/images/healthbackground.png')}
        style={healthStyles.backgroundImage}
        resizeMode="cover"
      />
      <View style={healthStyles.header}>
        <TouchableOpacity style={healthStyles.backButton} onPress={handleBackPress}>
          <Image
            source={require('../../../assets/images/leftarrow.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>
          건강
        </ScaledText>
      </View>

      <ScrollView contentContainerStyle={healthStyles.scrollContent}>
        <View style={healthStyles.heroSection}>
          <TouchableOpacity
            style={healthStyles.medicationButtonContainer}
            onPress={() => navigation.navigate('MedicationSettings')}
          >
            <Image
              source={require('../../../assets/images/healthcheck.png')}
              style={healthStyles.medicationButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Image
            source={require('../../../assets/images/sonjusmile.png')}
            style={healthStyles.characterImage}
            resizeMode="contain"
          />
        </View>

        {/* ✅ 동적 복약 알림 카드 */}
        <TouchableOpacity
          style={healthStyles.reminderCard}
          onPress={() => navigation.navigate('MedicationSettings')}
        >
          <View style={healthStyles.reminderContent}>
            <View style={healthStyles.reminderTextContainer}>
              <ScaledText fontSize={24} style={healthStyles.reminderTime}>
                {reminderTimeText}
              </ScaledText>
              <ScaledText fontSize={18} style={healthStyles.reminderDescription}>
                {reminderDescription}
              </ScaledText>
            </View>
          </View>
        </TouchableOpacity>

        <View style={healthStyles.calendarCard}>
          <View style={healthStyles.calendarHeader}>
            <View style={healthStyles.calendarMonthSelector}>
              <TouchableOpacity onPress={handlePrevMonth} style={healthStyles.monthArrowButton}>
                <Image
                  source={require('../../../assets/images/arrowleftnotail.png')}
                  style={healthStyles.arrowIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <ScaledText fontSize={20} style={healthStyles.calendarTitle}>
                {currentMonth + 1}월 건강 요약 달력
              </ScaledText>

              <TouchableOpacity onPress={handleNextMonth} style={healthStyles.monthArrowButton}>
                <Image
                  source={require('../../../assets/images/arrowrightnotail.png')}
                  style={healthStyles.arrowIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={healthStyles.calendarActions}>
              <TouchableOpacity
                style={healthStyles.iconButton}
                onPress={() => navigation.navigate('HealthDiaryEntry')}
              >
                <Image
                  source={require('../../../assets/images/plus.png')}
                  style={healthStyles.actionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={healthStyles.iconButton}
                onPress={() => navigation.navigate('HealthDiaryList')}
              >
                <Image
                  source={require('../../../assets/images/list.png')}
                  style={healthStyles.actionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={healthStyles.weekdayHeader}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <View key={index} style={healthStyles.weekdayCell}>
                <ScaledText
                  fontSize={20}
                  style={[
                    healthStyles.weekdayText,
                    index === 0 && { color: '#FF6B6B' },
                    index === 6 && { color: '#4A90E2' },
                  ]}
                >
                  {day}
                </ScaledText>
              </View>
            ))}
          </View>

          <View style={healthStyles.calendarGrid}>
            {renderCalendar()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}