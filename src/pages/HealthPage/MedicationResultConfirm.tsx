// src/pages/HealthPage/MedicationResultConfirm.tsx 최종본
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { healthStyles } from '../../styles/Health';
import { createMedicine, convertDateToAPIFormat, MedicineItem } from '../../api/medicineApi';
// ✅ Todo 페이지의 DateTimePicker 재사용
import { DateTimePicker } from '../TodoPage/DateTimePicker';

const MEDICATION_STORAGE_KEY = '@medication_data';

interface MedicationResult {
  id: string;
  name: string;
  frequency: string;
  days: string;
  startDate: string;
}

interface TimeSlot {
  time: string;
  label: string;
  medications: { id: string; name: string; checked: boolean; frequency?: string; days?: string; startDate?: string }[];
}

export default function MedicationResultConfirm() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const ocrResults = route.params?.ocrResults || [];
  const isFromOCR = route.params?.isFromOCR || false;

  const [medications, setMedications] = useState<MedicationResult[]>(ocrResults);
  const [isLoading, setIsLoading] = useState(false);

  const [editingField, setEditingField] = useState<{
    medId: string;
    field: 'name' | 'frequency' | 'days' | 'startDate';
    value: string;
  } | null>(null);

  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDaysPicker, setShowDaysPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const frequencyOptions = ['1', '2', '3', '4'];
  const daysOptions = Array.from({ length: 31 }, (_, i) => String(i + 1));

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`; // YYYY/MM/DD
  };

  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleFieldPress = (medId: string, field: 'name' | 'frequency' | 'days' | 'startDate', currentValue: string) => {
    if (field === 'name') {
      setEditingField({ medId, field, value: currentValue });
    } else if (field === 'frequency') {
      setEditingField({ medId, field, value: currentValue });
      setShowFrequencyPicker(true);
    } else if (field === 'days') {
      setEditingField({ medId, field, value: currentValue });
      setShowDaysPicker(true);
    } else if (field === 'startDate') {
      setEditingField({ medId, field, value: currentValue });
      setShowDatePicker(true); // ✅ DateTimePicker 열기
    }
  };

  const handleNameSave = () => {
    if (editingField) {
      setMedications(prev =>
        prev.map(med =>
          med.id === editingField.medId ? { ...med, name: editingField.value } : med
        )
      );
      setEditingField(null);
    }
  };

  const handleFrequencySelect = (freq: string) => {
    if (editingField) {
      setMedications(prev =>
        prev.map(med =>
          med.id === editingField.medId ? { ...med, frequency: freq } : med
        )
      );
    }
    setShowFrequencyPicker(false);
    setEditingField(null);
  };

  const handleDaysSelect = (days: string) => {
    if (editingField) {
      setMedications(prev =>
        prev.map(med =>
          med.id === editingField.medId ? { ...med, days } : med
        )
      );
    }
    setShowDaysPicker(false);
    setEditingField(null);
  };

  // ⛔ 예전 좌우 화살표 날짜 변경/저장은 더 이상 사용하지 않으므로 삭제해도 됨
  // handleDateChange, handleDateSave 제거

  const getTimeSlots = (frequency: string): { time: string; label: string }[] => {
    const freq = parseInt(frequency);
    if (freq === 1) return [{ time: '오전 8시', label: '아침' }];
    if (freq === 2) return [
      { time: '오전 8시', label: '아침' },
      { time: '오후 6시', label: '저녁' }
    ];
    if (freq === 3) return [
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

  const handleComplete = async () => {
    console.log('=== 복약 일괄 등록 시작 ===');

    const invalidMed = medications.find(
      med => !med.name || !med.frequency || !med.days || !med.startDate
    );

    if (invalidMed) {
      Alert.alert('입력 오류', '모든 약의 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const medicineItems: MedicineItem[] = medications.map(med => ({
        medicine_name: med.name,
        medicine_daily: parseInt(med.frequency),
        medicine_period: parseInt(med.days),
        medicine_start_date: convertDateToAPIFormat(med.startDate),
      }));

      const response = await createMedicine(medicineItems);

      const successfulMeds = medications.filter((med, index) => {
        return response.response[index].registered;
      });

      const failedMeds = medications.filter((med, index) => {
        return !response.response[index].registered;
      });

      if (failedMeds.length > 0) {
        const failedNames = failedMeds.map(m => m.name).join(', ');
        if (successfulMeds.length > 0) {
          Alert.alert(
            '일부 등록 실패',
            `${successfulMeds.length}개 등록 완료\n실패: ${failedNames}`
          );
        } else {
          Alert.alert('등록 실패', '복약 등록에 실패했습니다.');
          setIsLoading(false);
          return;
        }
      }

      const stored = await AsyncStorage.getItem(MEDICATION_STORAGE_KEY);
      const existingData = stored ? JSON.parse(stored) : {};

      successfulMeds.forEach((med) => {
        const startDate = parseDate(med.startDate);
        const daysCount = parseInt(med.days);
        const timeSlots = getTimeSlots(med.frequency);

        for (let i = 0; i < daysCount; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          if (!existingData[dateKey]) {
            existingData[dateKey] = [];
          }

          timeSlots.forEach((newSlot: TimeSlot) => {
            let targetSlot = existingData[dateKey].find((slot: TimeSlot) => slot.time === newSlot.time);

            if (!targetSlot) {
              targetSlot = {
                time: newSlot.time,
                label: newSlot.label,
                medications: []
              };
              existingData[dateKey].push(targetSlot);
            }

            const medId = `${dateKey}-${newSlot.time}-${med.name}-${Date.now()}-${Math.random()}`;
            const exists = targetSlot.medications.some(m =>
              m.name === med.name &&
              m.startDate === med.startDate
            );

            if (!exists) {
              targetSlot.medications.push({
                id: medId,
                name: med.name,
                checked: false,
                frequency: med.frequency,
                days: med.days,
                startDate: med.startDate,
              });
            }
          });

          existingData[dateKey].sort((a: TimeSlot, b: TimeSlot) => {
            const timeOrder = ['오전 8시', '오후 12시', '오후 6시', '오후 10시'];
            return timeOrder.indexOf(a.time) - timeOrder.indexOf(b.time);
          });
        }
      });

      await AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(existingData));

      Alert.alert(
        '성공',
        `${successfulMeds.length}개의 약이 등록되었습니다.`,
        [{ text: '확인', onPress: () => navigation.pop(2) }]
      );
    } catch (error: any) {
      console.error('❌ 복약 저장 실패:', error);
      Alert.alert('오류', '복약 등록에 실패했습니다.');
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
        <View style={healthStyles.resultConfirmContainer}>
          <ScaledText fontSize={24} style={healthStyles.sectionTitle}>
            이미지 인식 확인
          </ScaledText>

          {medications.map((med) => (
            <View key={med.id} style={healthStyles.medicationResultCard}>
              <TouchableOpacity
                style={healthStyles.medicationNameHeader}
                onPress={() => handleFieldPress(med.id, 'name', med.name)}
              >
                <ScaledText fontSize={24} style={healthStyles.medicationResultName}>
                  {med.name}
                </ScaledText>
              </TouchableOpacity>

              <TouchableOpacity
                style={healthStyles.medicationDetailRow}
                onPress={() => handleFieldPress(med.id, 'frequency', med.frequency)}
              >
                <ScaledText fontSize={18} style={healthStyles.detailLabel}>
                  • 투약 횟수 (1일)
                </ScaledText>
                <View style={healthStyles.detailValue}>
                  <ScaledText fontSize={18} style={healthStyles.detailValueText}>
                    {med.frequency}회
                  </ScaledText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={healthStyles.medicationDetailRow}
                onPress={() => handleFieldPress(med.id, 'days', med.days)}
              >
                <ScaledText fontSize={18} style={healthStyles.detailLabel}>
                  • 투약 일수
                </ScaledText>
                <View style={healthStyles.detailValue}>
                  <ScaledText fontSize={18} style={healthStyles.detailValueText}>
                    {med.days}일
                  </ScaledText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={healthStyles.medicationDetailRow}
                onPress={() => handleFieldPress(med.id, 'startDate', med.startDate)}
              >
                <ScaledText fontSize={18} style={healthStyles.detailLabel}>
                  • 투약 시작일
                </ScaledText>
                <View style={healthStyles.detailValue}>
                  <ScaledText fontSize={18} style={healthStyles.detailValueText}>
                    {med.startDate}
                  </ScaledText>
                </View>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={[healthStyles.completeButton, isLoading && { opacity: 0.5 }]}
            onPress={handleComplete}
            disabled={isLoading}
          >
            <ScaledText fontSize={24} style={healthStyles.completeButtonText}>
              {isLoading ? '등록 중...' : '생성하기'}
            </ScaledText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 약 이름 수정 모달 (기존 그대로) */}
      <Modal
        visible={editingField?.field === 'name'}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingField(null)}
      >
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEditingField(null)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.modalContent}>
              <ScaledText fontSize={24} style={healthStyles.modalTitle}>
                약 이름 수정
              </ScaledText>
              <TextInput
                style={healthStyles.modalInput}
                value={editingField?.value || ''}
                onChangeText={(text) => setEditingField(prev => (prev ? { ...prev, value: text } : null))}
                autoFocus
              />
              <View style={healthStyles.modalButtons}>
                <TouchableOpacity
                  style={healthStyles.modalCancelButton}
                  onPress={() => setEditingField(null)}
                >
                  <ScaledText fontSize={18} style={healthStyles.modalCancelText}>
                    취소
                  </ScaledText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={healthStyles.modalConfirmButton}
                  onPress={handleNameSave}
                >
                  <ScaledText fontSize={18} style={healthStyles.modalConfirmText}>
                    확인
                  </ScaledText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 투약 횟수 선택 모달 (기존) */}
      <Modal
        visible={showFrequencyPicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowFrequencyPicker(false);
          setEditingField(null);
        }}
      >
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowFrequencyPicker(false);
            setEditingField(null);
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.pickerModalContent}>
              <ScaledText fontSize={20} style={healthStyles.modalTitle}>
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
                onPress={() => {
                  setShowFrequencyPicker(false);
                  setEditingField(null);
                }}
              >
                <ScaledText fontSize={18} style={healthStyles.pickerCancelText}>
                  취소
                </ScaledText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 투약 일수 선택 모달 (기존) */}
      <Modal
        visible={showDaysPicker}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowDaysPicker(false);
          setEditingField(null);
        }}
      >
        <TouchableOpacity
          style={healthStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowDaysPicker(false);
            setEditingField(null);
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={healthStyles.pickerModalContent}>
              <ScaledText fontSize={20} style={healthStyles.modalTitle}>
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
                onPress={() => {
                  setShowDaysPicker(false);
                  setEditingField(null);
                }}
              >
                <ScaledText fontSize={18} style={healthStyles.pickerCancelText}>
                  취소
                </ScaledText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ✅ 날짜 선택 – Todo DateTimePicker 사용 */}
      {showDatePicker && editingField?.field === 'startDate' && (
        <DateTimePicker
          visible={showDatePicker}
          mode="date"
          value={parseDate(editingField.value || formatDate(new Date()))}
          onClose={() => {
            setShowDatePicker(false);
            setEditingField(null);
          }}
          onConfirm={(selectedDate) => {
            const newDateStr = formatDate(selectedDate);
            setMedications(prev =>
              prev.map(med =>
                med.id === editingField.medId ? { ...med, startDate: newDateStr } : med
              )
            );
            setShowDatePicker(false);
            setEditingField(null);
          }}
        />
      )}
    </View>
  );
}
