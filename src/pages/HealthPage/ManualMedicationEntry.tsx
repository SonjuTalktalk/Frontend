// src/pages/HealthPage/ManualMedicationEntry.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { DateTimePicker } from '../TodoPage/DateTimePicker';
import { healthStyles } from '../../styles/Health';
import { createMedicine, convertDateToAPIFormat, MedicineItem } from '../../api/medicineApi';

const MEDICATION_STORAGE_KEY = '@medication_data';

interface TimeSlot {
  time: string;
  label: string;
  medications: { id: string; name: string; checked: boolean; frequency?: string; days?: string; startDate?: string }[];
}

export default function ManualMedicationEntry() {
  const navigation = useNavigation<any>();

  const [medicationName, setMedicationName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [days, setDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const frequencyOptions = ['1', '2', '3', '4'];
  const daysOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    setStartDate(formatDate(new Date()));
  }, []);

  const handleFrequencySelect = (freq: string) => {
    setFrequency(freq);
    setShowFrequencyPicker(false);
  };

  const handleDaysSelect = (selectedDays: string) => {
    setDays(selectedDays);
    setShowDaysPicker(false);
  };

  const getTimeSlots = (freq: string): { time: string; label: string }[] => {
    const frequency = parseInt(freq);
    if (frequency === 1) return [{ time: '오전 8시', label: '아침' }];
    if (frequency === 2) return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 6시', label: '저녁' }
    ];
    if (frequency === 3) return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 12시', label: '점심' },
      { time: '오후 6시', label: '저녁' }
    ];
    return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 12시', label: '점심' },
      { time: '오후 6시', label: '저녁' },
      { time: '오후 10시', label: '취침' }
    ];
  };

  const handleSave = async () => {
    console.log('=== 복약 저장 시작 ===');

    if (!medicationName || !frequency || !days || !startDate) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const apiDate = convertDateToAPIFormat(startDate);
      const medicineItem: MedicineItem = {
        medicine_name: medicationName,
        medicine_daily: parseInt(frequency),
        medicine_period: parseInt(days),
        medicine_date: apiDate,
      };

      const response = await createMedicine([medicineItem]);

      if (!response.response[0].registered) {
        const errorMsg = response.response[0].response_message;
        Alert.alert('등록 실패', errorMsg);
        setIsLoading(false);
        return;
      }

      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      const existingData = stored ? JSON.parse(stored) : {};

      const start = parseDate(startDate);
      const daysCount = parseInt(days);
      const timeSlots = getTimeSlots(frequency);

      for (let i = 0; i < daysCount; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(currentDate.getDate() + i);
        const dateKey = formatDate(currentDate).replace(/\//g, '-');

        if (!existingData[dateKey]) {
          existingData[dateKey] = [];
        }

        timeSlots.forEach(newSlot => {
          let targetSlot = existingData[dateKey].find((slot: TimeSlot) => slot.time === newSlot.time);

          if (!targetSlot) {
            targetSlot = {
              time: newSlot.time,
              label: newSlot.label,
              medications: []
            };
            existingData[dateKey].push(targetSlot);
          }

          const medId = `${dateKey}-${newSlot.time}-${medicationName}-${Date.now()}-${Math.random()}`;
          const exists = targetSlot.medications.some(m =>
            m.name === medicationName &&
            m.startDate === startDate &&
            m.frequency === frequency &&
            m.days === days
          );

          if (!exists) {
            targetSlot.medications.push({
              id: medId,
              name: medicationName,
              checked: false,
              frequency: frequency,
              days: days,
              startDate: startDate,
            });
          }
        });

        existingData[dateKey].sort((a: TimeSlot, b: TimeSlot) => {
          const timeOrder = ['오전 8시', '오후 12시', '오후 6시', '오후 10시'];
          return timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time);
        });
      }

      await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(existingData));

      Alert.alert('성공', '복약 알림이 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('❌ 복약 저장 실패:', error);

      let errorMessage = '복약 등록에 실패했습니다.';
      if (error.response?.data?.detail) {
        errorMessage = Array.isArray(error.response.data.detail)
          ? error.response.data.detail[0]?.msg || errorMessage
          : error.response.data.detail;
      } else if (error.response?.data?.response?.length > 0) {
        errorMessage = error.response.data.response[0].response_message;
      }

      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={healthStyles.container}>
      <View style={healthStyles.header}>
        <TouchableOpacity style={healthStyles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/images/leftarrow.png')}
            style={healthStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <ScaledText fontSize={24} style={healthStyles.headerTitle}>
          복약 알림 설정
        </ScaledText>
      </View>

      <ScrollView contentContainerStyle={healthStyles.scrollContent}>
        <View style={healthStyles.manualEntryContainer}>
          <ScaledText fontSize={24} style={healthStyles.sectionTitle}>
            직접 입력
          </ScaledText>

          <View style={healthStyles.inputCard}>
            <ScaledText fontSize={18} style={healthStyles.inputLabel}>
              약 이름
            </ScaledText>
            <TextInput
              style={healthStyles.input}
              placeholder="약 이름을 입력하세요"
              placeholderTextColor="#999"
              value={medicationName}
              onChangeText={setMedicationName}
            />
          </View>

          <TouchableOpacity
            style={healthStyles.inputCard}
            onPress={() => setShowFrequencyPicker(true)}
          >
            <ScaledText fontSize={18} style={healthStyles.inputLabel}>
              투약 횟수 (1일)
            </ScaledText>
            <View style={healthStyles.input}>
              <ScaledText fontSize={18} style={frequency ? healthStyles.inputText : healthStyles.inputPlaceholder}>
                {frequency ? `${frequency}회` : '선택하세요'}
              </ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={healthStyles.inputCard}
            onPress={() => setShowDaysPicker(true)}
          >
            <ScaledText fontSize={18} style={healthStyles.inputLabel}>
              투약 일수
            </ScaledText>
            <View style={healthStyles.input}>
              <ScaledText fontSize={18} style={days ? healthStyles.inputText : healthStyles.inputPlaceholder}>
                {days ? `${days}일` : '선택하세요'}
              </ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={healthStyles.inputCard}
            onPress={() => {
              if (!startDate) setStartDate(formatDate(new Date()));
              setShowDatePicker(true);
            }}
          >
            <ScaledText fontSize={18} style={healthStyles.inputLabel}>
              투약 시작일
            </ScaledText>
            <View style={healthStyles.input}>
              <ScaledText fontSize={18} style={startDate ? healthStyles.inputText : healthStyles.inputPlaceholder}>
                {startDate || '선택하세요'}
              </ScaledText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[healthStyles.completeButton, isLoading && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <ScaledText fontSize={20} style={healthStyles.completeButtonText}>
              {isLoading ? '등록 중...' : '저장하기'}
            </ScaledText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 투약 횟수 선택 모달 */}
      <Modal visible={showFrequencyPicker} transparent animationType="fade" onRequestClose={() => setShowFrequencyPicker(false)}>
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFrequencyPicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.pickerModalContent}>
              <ScaledText fontSize={24} style={healthStyles.modalTitle}>
                투약 횟수 선택
              </ScaledText>
              <ScrollView style={healthStyles.pickerList}>
                {frequencyOptions.map(freq => (
                  <TouchableOpacity
                    key={freq}
                    style={healthStyles.pickerItem}
                    onPress={() => handleFrequencySelect(freq)}
                  >
                    <ScaledText fontSize={20} style={healthStyles.pickerItemText}>
                      {freq}회
                    </ScaledText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={healthStyles.pickerCancelButton}
                onPress={() => setShowFrequencyPicker(false)}
              >
                <ScaledText fontSize={18} style={healthStyles.pickerCancelText}>
                  취소
                </ScaledText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 투약 일수 선택 모달 */}
      <Modal visible={showDaysPicker} transparent animationType="fade" onRequestClose={() => setShowDaysPicker(false)}>
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDaysPicker(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.pickerModalContent}>
              <ScaledText fontSize={24} style={healthStyles.modalTitle}>
                투약 일수 선택
              </ScaledText>
              <ScrollView style={healthStyles.pickerList}>
                {daysOptions.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={healthStyles.pickerItem}
                    onPress={() => handleDaysSelect(day)}
                  >
                    <ScaledText fontSize={20} style={healthStyles.pickerItemText}>
                      {day}일
                    </ScaledText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={healthStyles.pickerCancelButton}
                onPress={() => setShowDaysPicker(false)}
              >
                <ScaledText fontSize={18} style={healthStyles.pickerCancelText}>
                  취소
                </ScaledText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 날짜 선택 – Todo용 DateTimePicker 재사용 */}
      <DateTimePicker
        visible={showDatePicker}
        mode="date"
        value={parseDate(startDate || formatDate(new Date()))}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(selectedDate) => {
          // Date -> "YYYY/MM/DD" 문자열로 다시 변환해서 저장
          setStartDate(formatDate(selectedDate));
          setShowDatePicker(false);
        }}
      />
    </View>
  );
}