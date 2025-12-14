// src/pages/HealthPage/HealthDiaryEntry.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';
import { saveHealthMemo, getHealthMemo } from '../../api/healthApi';

const STORAGE_KEY = '@health_diary_entries';
const STATUS_STORAGE_KEY = '@health_diary_status';

export default function HealthDiaryEntry() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // route params에서 날짜 정보 가져오기
  const dateParam = route.params?.date;
  const monthParam = route.params?.month;
  const yearParam = route.params?.year;

  // 현재 날짜를 기본값으로 사용
  const today = new Date();
  const year = yearParam || today.getFullYear();
  const month = monthParam || (today.getMonth() + 1);
  const day = dateParam || today.getDate();

  // YYYY/MM/DD 형식 (화면 표시용)
  const displayDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;

  // YYYY-MM-DD 형식 (API용)
  const apiDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  useEffect(() => {
    loadEntry();
  }, [apiDate]);

  const loadEntry = async () => {
    try {
      setIsLoading(true);
      // API에서 일지 불러오기
      const memoText = await getHealthMemo(apiDate);
      if (memoText) {
        setEntry(memoText);
      }
    } catch (error) {
      console.error('일지 불러오기 실패:', error);
      // API 실패 시 로컬 스토리지에서 시도
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const entries = JSON.parse(stored);
          if (entries[displayDate]) {
            setEntry(entries[displayDate]);
          }
        }
      } catch (localError) {
        console.error('로컬 일지 불러오기 실패:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 실제 저장 로직 (API + 로컬 스토리지)
  const saveEntry = async () => {
    try {
      // API로 저장
      const response = await saveHealthMemo(apiDate, entry.trim());

      // 로컬 스토리지에도 저장 (오프라인 지원)
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const entries = stored ? JSON.parse(stored) : {};
      entries[displayDate] = entry.trim();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

      // status 정보도 로컬에 저장
      const statusStored = await AsyncStorage.getItem(STATUS_STORAGE_KEY);
      const statuses = statusStored ? JSON.parse(statusStored) : {};
      statuses[displayDate] = response.status;
      await AsyncStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses));

      return response.response_message;
    } catch (error) {
      console.error('일지 저장 실패:', error);
      throw error;
    }
  };

  // 저장 버튼: 알림 표시
  const handleSaveWithAlert = async () => {
    if (!entry.trim()) {
      Alert.alert('알림', '일지 내용을 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);
      const message = await saveEntry();
      Alert.alert('성공', message, [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('일지 저장 실패:', error);
      Alert.alert('오류', '일지 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 뒤로가기 버튼: 알림 없이 조용히 처리
  const handleBack = async () => {
    try {
      if (entry.trim()) {
        await saveEntry(); // 알림 없이 저장
      }
      navigation.goBack();
    } catch (error) {
      console.error('뒤로가기 중 저장 실패:', error);
      navigation.goBack();
    }
  };

  return (
    <View style={healthStyles.container}>
      {/* 헤더 */}
      <View style={healthStyles.header}>
        <TouchableOpacity
          style={healthStyles.backButton}
          onPress={handleBack}
          disabled={isLoading}
        >
          <Image
            source={require('../../../assets/images/leftarrow.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <ScaledText fontSize={24} style={healthStyles.headerTitleCenter}>
          건강 요약 일지
        </ScaledText>

        <TouchableOpacity
          onPress={handleSaveWithAlert}
          style={healthStyles.saveButton}
          disabled={isLoading}
        >
          <ScaledText fontSize={24} style={healthStyles.saveButtonText}>
            {isLoading ? '저장 중...' : '저장하기'}
          </ScaledText>
        </TouchableOpacity>
      </View>

      <View style={healthStyles.content}>
        <View style={healthStyles.entryCard}>
          <ScaledText fontSize={24} style={healthStyles.dateTitle}>
            {displayDate}
          </ScaledText>

          <TextInput
            style={healthStyles.textInput}
            value={entry}
            onChangeText={setEntry}
            placeholder="ex) 어제 콧물이 나고 머리가 아팠어."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>
      </View>
    </View>
  );
}