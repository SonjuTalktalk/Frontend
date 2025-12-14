// src/pages/TodoPage/DateTimePicker.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import ScaledText from '../../components/ScaledText';
import { styles, ITEM_HEIGHT } from '../../styles/Todo';

type DateTimeMode = 'date' | 'time';

interface DateTimePickerProps {
  visible: boolean;
  mode: DateTimeMode;   // 'date' | 'time'
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  visible,
  mode,
  value,
  onClose,
  onConfirm,
}) => {
  const [tempYear, setTempYear] = useState(value.getFullYear());
  const [tempMonth, setTempMonth] = useState(value.getMonth());
  const [tempDay, setTempDay] = useState(value.getDate());
  const [tempHour, setTempHour] = useState(value.getHours());
  const [tempMinute, setTempMinute] = useState(value.getMinutes());

  // ScrollView ref들
  const yearScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // 모달 열릴 때마다 현재 value 기준으로 초기화
  useEffect(() => {
    if (visible) {
      setTempYear(value.getFullYear());
      setTempMonth(value.getMonth());
      setTempDay(value.getDate());
      setTempHour(value.getHours());
      setTempMinute(value.getMinutes());

      // 스크롤 위치 초기화 (약간의 딜레이를 줘서 렌더링 후 실행)
      setTimeout(() => {
        scrollToInitialPosition();
      }, 100);
    }
  }, [visible, value]);

  // 초기 스크롤 위치로 이동
  const scrollToInitialPosition = () => {
    if (mode === 'date') {
      const currentYear = new Date().getFullYear();
      const yearIndex = tempYear - (currentYear - 5);
      const monthIndex = tempMonth;
      const dayIndex = tempDay - 1;

      yearScrollRef.current?.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      monthScrollRef.current?.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: false });
      dayScrollRef.current?.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
    } else {
      const hourIndex = tempHour;
      const minuteIndex = tempMinute;

      hourScrollRef.current?.scrollTo({ y: hourIndex * ITEM_HEIGHT, animated: false });
      minuteScrollRef.current?.scrollTo({ y: minuteIndex * ITEM_HEIGHT, animated: false });
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    setter: (v: number) => void,
    offsetBase: number = 0
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setter(offsetBase + index);
  };

  const handleConfirm = () => {
    const newDate = new Date(value);

    if (mode === 'date') {
      newDate.setFullYear(tempYear);
      newDate.setMonth(tempMonth);
      newDate.setDate(tempDay);
    } else {
      newDate.setHours(tempHour);
      newDate.setMinutes(tempMinute);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }

    onConfirm(newDate);
  };

  const renderDateColumns = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from(
      { length: getDaysInMonth(tempYear, tempMonth) },
      (_, i) => i + 1
    );

    return (
      <>
        {/* 년 */}
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={yearScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) =>
              handleDateScrollEnd(
                e,
                (yearIndex) => setTempYear(currentYear - 5 + yearIndex),
                0
              )
            }
            contentContainerStyle={styles.pickerScrollContent}
          >
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={styles.pickerItem}
                onPress={() => setTempYear(year)}
              >
                <ScaledText
                  fontSize={20}
                  style={[
                    styles.pickerItemText,
                    tempYear === year && styles.pickerItemTextSelected,
                  ]}
                >
                  {year}
                </ScaledText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScaledText fontSize={16} style={styles.pickerUnit}>
            년
          </ScaledText>
        </View>

        {/* 월 */}
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={monthScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) =>
              handleDateScrollEnd(e, (index) => setTempMonth(index))
            }
            contentContainerStyle={styles.pickerScrollContent}
          >
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={styles.pickerItem}
                onPress={() => setTempMonth(month - 1)}
              >
                <ScaledText
                  fontSize={20}
                  style={[
                    styles.pickerItemText,
                    tempMonth === month - 1 &&
                      styles.pickerItemTextSelected,
                  ]}
                >
                  {month}
                </ScaledText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScaledText fontSize={16} style={styles.pickerUnit}>
            월
          </ScaledText>
        </View>

        {/* 일 */}
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={dayScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) =>
              handleDateScrollEnd(e, (index) => setTempDay(index + 1))
            }
            contentContainerStyle={styles.pickerScrollContent}
          >
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={styles.pickerItem}
                onPress={() => setTempDay(day)}
              >
                <ScaledText
                  fontSize={20}
                  style={[
                    styles.pickerItemText,
                    tempDay === day && styles.pickerItemTextSelected,
                  ]}
                >
                  {day}
                </ScaledText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScaledText fontSize={16} style={styles.pickerUnit}>
            일
          </ScaledText>
        </View>
      </>
    );
  };

  const renderTimeColumns = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
      <>
        {/* 시 */}
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={hourScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) =>
              handleDateScrollEnd(e, (index) => setTempHour(index))
            }
            contentContainerStyle={styles.pickerScrollContent}
          >
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={styles.pickerItem}
                onPress={() => setTempHour(hour)}
              >
                <ScaledText
                  fontSize={20}
                  style={[
                    styles.pickerItemText,
                    tempHour === hour && styles.pickerItemTextSelected,
                  ]}
                >
                  {hour}
                </ScaledText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScaledText fontSize={16} style={styles.pickerUnit}>
            시
          </ScaledText>
        </View>

        {/* 분 */}
        <View style={styles.pickerColumn}>
          <ScrollView
            ref={minuteScrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) =>
              handleDateScrollEnd(e, (index) => setTempMinute(index))
            }
            contentContainerStyle={styles.pickerScrollContent}
          >
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute}
                style={styles.pickerItem}
                onPress={() => setTempMinute(minute)}
              >
                <ScaledText
                  fontSize={20}
                  style={[
                    styles.pickerItemText,
                    tempMinute === minute &&
                      styles.pickerItemTextSelected,
                  ]}
                >
                  {minute.toString().padStart(2, '0')}
                </ScaledText>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScaledText fontSize={16} style={styles.pickerUnit}>
            분
          </ScaledText>
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.pickerModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.pickerContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={onClose}>
              <ScaledText fontSize={18} style={styles.pickerCancelButton}>
                취소
              </ScaledText>
            </TouchableOpacity>

            <ScaledText fontSize={18} style={styles.pickerTitle}>
              {mode === 'date' ? '날짜 선택' : '시간 선택'}
            </ScaledText>

            <TouchableOpacity onPress={handleConfirm}>
              <ScaledText fontSize={18} style={styles.pickerDoneButton}>
                완료
              </ScaledText>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContent}>
            <View style={styles.pickerColumns}>
              {mode === 'date' ? renderDateColumns() : renderTimeColumns()}
            </View>
            <View style={styles.pickerSelectionIndicator} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};