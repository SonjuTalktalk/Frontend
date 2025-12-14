// src/pages/HealthPage/HealthDiaryList.tsx
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';
import { getHealthMemosForMonth } from '../../api/healthApi';

interface DiaryEntry {
  date: string; // YYYY/MM/DD
  preview: string;
}

export default function HealthDiaryList() {
  const navigation = useNavigation<any>();

  // 현재 날짜를 기준으로 초기화
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 실제 오늘 날짜
  const realToday = new Date();
  const realYear = realToday.getFullYear();
  const realMonth = realToday.getMonth() + 1;

  // 앱 시작 날짜 (예: 2025년 1월부터)
  const firstRecordDate = new Date(2025, 0, 1);
  const firstRecordYear = firstRecordDate.getFullYear();
  const firstRecordMonth = firstRecordDate.getMonth() + 1;

  // 화살표 활성화 상태
  const canGoLeft = !(currentYear === firstRecordYear && currentMonth === firstRecordMonth);
  const canGoRight = !(currentYear === realYear && currentMonth === realMonth);

  // 화면 포커스 시 데이터 로드
  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [currentYear, currentMonth])
  );

  const loadEntries = async () => {
    try {
      setIsLoading(true);

      // API에서 해당 월의 일지 가져오기
      const memos = await getHealthMemosForMonth(currentYear, currentMonth);

      // 배열로 변환 및 정렬
      const filtered = Object.entries(memos)
        .map(([date, content]) => ({
          date,
          preview: typeof content === 'string'
            ? (content.length > 20 ? content.substring(0, 20) + '...' : content)
            : '내용 없음'
        }))
        .sort((a, b) => b.date.localeCompare(a.date)); // 최신순 정렬

      setEntries(filtered);
    } catch (error) {
      console.error('일지 목록 불러오기 실패:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (!canGoLeft) return;
    const newDate = new Date(currentYear, currentMonth - 2, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    if (!canGoRight) return;
    const newDate = new Date(currentYear, currentMonth, 1);
    setCurrentDate(newDate);
  };

  return (
    <View style={healthStyles.container}>
      {/* 헤더 */}
      <View style={healthStyles.header}>
        <TouchableOpacity
          style={healthStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../../assets/images/leftarrow.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>
          건강 요약 달력
        </ScaledText>
      </View>

      <ScrollView contentContainerStyle={healthStyles.scrollContent}>
        {/* 일지 메인 컨테이너 */}
        <View style={healthStyles.diaryListContainer}>
          {/* 월 선택 카드 */}
          <View style={healthStyles.monthCard}>
            <View style={healthStyles.monthSelector}>
              <TouchableOpacity
                style={healthStyles.monthArrow}
                onPress={handlePrevMonth}
                disabled={!canGoLeft}
              >
                <Image
                  source={require('../../../assets/images/arrowleftnotail.png')}
                  style={[
                    healthStyles.arrowIcon,
                    !canGoLeft && { tintColor: '#D0D0D0' }
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <ScaledText fontSize={24} style={healthStyles.monthText}>
                {currentYear}년 {currentMonth}월
              </ScaledText>
              <TouchableOpacity
                style={healthStyles.monthArrow}
                onPress={handleNextMonth}
                disabled={!canGoRight}
              >
                <Image
                  source={require('../../../assets/images/arrowrightnotail.png')}
                  style={[
                    healthStyles.arrowIcon,
                    !canGoRight && { tintColor: '#D0D0D0' }
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 일지 목록 */}
          <View style={healthStyles.entriesList}>
            {isLoading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#02BFDC" />
                <ScaledText fontSize={18} style={{ marginTop: 10, color: '#666' }}>
                  일지를 불러오는 중...
                </ScaledText>
              </View>
            ) : entries.length > 0 ? (
              entries.map((entry, index) => {
                // 날짜 파싱 (YYYY/MM/DD)
                const dateParts = entry.date.split('/');
                const entryYear = parseInt(dateParts[0]);
                const entryMonth = parseInt(dateParts[1]);
                const entryDay = parseInt(dateParts[2]);

                return (
                  <TouchableOpacity
                    key={index}
                    style={healthStyles.entryListCard}
                    onPress={() => navigation.navigate('HealthDiaryEntry', {
                      date: entryDay,
                      month: entryMonth,
                      year: entryYear
                    })}
                  >
                    <ScaledText fontSize={24} style={healthStyles.entryDate}>
                      {entry.date}
                    </ScaledText>
                    <ScaledText fontSize={24} style={healthStyles.entryPreview}>
                      {entry.preview}
                    </ScaledText>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ScaledText fontSize={18} style={{ color: '#999' }}>
                  {currentYear}년 {currentMonth}월에 작성된 일지가 없습니다
                </ScaledText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 추가 버튼 */}
      <TouchableOpacity
        style={healthStyles.addButton}
        onPress={() => navigation.navigate('HealthDiaryEntry')}
      >
        <Image
          source={require('../../../assets/images/plus.png')}
          style={healthStyles.addIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}