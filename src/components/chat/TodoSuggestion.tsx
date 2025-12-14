import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  SafeAreaView,
  Switch,
  Animated,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScaledText from '../../components/ScaledText';
import { useFontSize } from '../../contexts/FontSizeContext';
import { TodoItem, ApiTodo } from './types';
import { DateTimePicker } from './DateTimePicker';
import { TodoSection } from './TodoSection';
import { styles } from '../../styles/Todo';
import { apiClient } from '../../api/config';

const TodoListApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showButtons, setShowButtons] = useState(false);

  // 할 일 추가 모달
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [buttonAnimation] = useState(new Animated.Value(0));

  const { fontScale } = useFontSize();

  useEffect(() => {
    loadTodos();
  }, []);

  // 화면 포커스 시 할일 목록 새로고침
  useFocusEffect(
    React.useCallback(() => {
      loadTodos();
    }, [])
  );

  useEffect(() => {
    Animated.spring(buttonAnimation, {
      toValue: showButtons ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [showButtons]);

  const loadTodos = async () => {
    try {
      // 과거, 오늘, 미래, 완료된 할일들을 각각 가져옴
      const [pastRes, todayRes, futureRes, completedRes] = await Promise.all([
        apiClient.get<ApiTodo[]>('/todos/past'),
        apiClient.get<ApiTodo[]>('/todos/today'),
        apiClient.get<ApiTodo[]>('/todos/future'),
        apiClient.get<ApiTodo[]>('/todos/completed'),
      ]);

      const allTodos = [
        ...pastRes.data,
        ...todayRes.data,
        ...futureRes.data,
        ...completedRes.data
      ].map(apiTodoToTodoItem);

      setTodos(allTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
      Alert.alert('오류', '할일을 불러오는데 실패했습니다.');
    }
  };

  const apiTodoToTodoItem = (apiTodo: ApiTodo): TodoItem => {
    const dueDate = new Date(apiTodo.due_date);
    if (apiTodo.due_time) {
      const [hours, minutes] = apiTodo.due_time.split(':');
      dueDate.setHours(parseInt(hours), parseInt(minutes));
    }

    return {
      id: apiTodo.todo_num.toString(),
      title: apiTodo.task,
      dueDate,
      isAllDay: !apiTodo.due_time,
      completed: apiTodo.is_completed,
    };
  };

  const getSectionTitle = (todo: TodoItem): string => {
    // 1) 완료된 할 일
    if (todo.completed) return '완료';

    // 2) 날짜 기준 비교 (오늘 0시 기준)
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const todoDate = new Date(todo.dueDate);
    todoDate.setHours(0, 0, 0, 0);

    const diff = todoDate.getTime() - now.getTime();

    if (diff < 0) {
      // 오늘보다 과거
      return '지난 할일';
    } else if (diff === 0) {
      // 오늘
      return '오늘';
    } else {
      // 미래
      return '미래 할일';
    }
  };

  const groupTodosBySection = () => {
    const sections: { [key: string]: TodoItem[] } = {
      '지난 할일': [],
      '오늘': [],
      '미래 할일': [],
      '완료': [],
    };

    todos.forEach((todo) => {
      const section = getSectionTitle(todo);
      if (sections[section]) {
        sections[section].push(todo);
      }
    });

    // 날짜순 정렬 (각 섹션 내에서)
    Object.keys(sections).forEach((key) => {
      sections[key].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    });

    return sections;
  };

  const handleAddOrUpdateTodo = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요');
      return;
    }

    try {
      const dueDate = selectedDate.toISOString().split('T')[0];
      const dueTime = isAllDay ? undefined : selectedDate.toTimeString().split(' ')[0];

      if (editingTodo) {
        // 수정
        await apiClient.patch(`/todos/${editingTodo.id}`, {
          task: title.trim(),
          due_date: dueDate,
          due_time: dueTime,
        });
      } else {
        // 추가
        await apiClient.post('/todos', {
          task: title.trim(),
          due_date: dueDate,
          due_time: dueTime,
        });
      }

      await loadTodos();
      resetModal();
    } catch (error) {
      console.error('Failed to save todo:', error);
      Alert.alert('오류', '할일 저장에 실패했습니다.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiClient.delete(`/todos/${id}`);
      await loadTodos();
      resetModal();
    } catch (error) {
      console.error('Failed to delete todo:', error);
      Alert.alert('오류', '할일 삭제에 실패했습니다.');
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await apiClient.patch('/todos/complete', {
        todo_nums: [parseInt(id)],
      });
      await loadTodos();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      Alert.alert('오류', '할일 상태 변경에 실패했습니다.');
    }
  };

  const openEditModal = (todo: TodoItem) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setSelectedDate(todo.dueDate);
    setIsAllDay(todo.isAllDay);
    setHasDeadline(true);
    setShowAddModal(true);
  };

  const resetModal = () => {
    setShowAddModal(false);
    setEditingTodo(null);
    setTitle('');
    setSelectedDate(new Date());
    setIsAllDay(true);
    setHasDeadline(false);
  };

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}. ${day}. ${weekday}`;
  };

  const formatTime = (date: Date): string => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${period} ${displayHour}:${minute.toString().padStart(2, '0')}`;
  };

  const sections = groupTodosBySection();
  const writeButtonTranslate = buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] });
  const voiceButtonTranslate = buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] });

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <ScaledText fontSize={24} style={styles.title}>할 일</ScaledText>
      </View>

      <ScaledText fontSize={20} style={styles.subtitle}>목록을 적어 실천해요.</ScaledText>

      {/* 할 일 목록 */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => showButtons && setShowButtons(false)}
      >
        {/* 섹션 순서 지정 */}
        {['지난 할일', '오늘', '미래 할일', '완료'].map((sectionKey) => {
          const items = sections[sectionKey];
          if (items.length === 0) return null; // 항목이 없으면 섹션 표시 안함

          return (
            <TodoSection
              key={sectionKey}
              section={sectionKey}
              items={items}
              onToggle={toggleTodo}
              onEdit={openEditModal}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          );
        })}

        {todos.length === 0 && (
          <View style={styles.emptyState}>
            <ScaledText fontSize={18} style={styles.emptyText}>
              할 일이 없습니다
            </ScaledText>
          </View>
        )}
      </ScrollView>

      {/* Overlay when buttons shown */}
      {showButtons && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowButtons(false)}
        />
      )}

      {/* FAB Buttons */}
      <View style={styles.fabContainer}>
        {showButtons && (
          <>
            <Animated.View
              style={[
                styles.secondaryFab,
                { transform: [{ translateY: writeButtonTranslate }], opacity: buttonAnimation }
              ]}
            >
              <TouchableOpacity
                style={[styles.fabButton, styles.secondaryFabButton]}
                onPress={() => {
                  setShowAddModal(true);
                  setShowButtons(false);
                }}
              >
                <Image
                  source={require('../../../assets/images/직접쓰기.png')}
                  resizeMode="contain"
                />
                <ScaledText fontSize={20} style={styles.fabButtonText}>직접 쓰기</ScaledText>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.secondaryFab,
                { transform: [{ translateY: voiceButtonTranslate }], opacity: buttonAnimation }
              ]}
            >
              <TouchableOpacity
                style={[styles.fabButton, styles.secondaryFabButton]}
                onPress={() => {
                  setShowAddModal(true);
                  setShowButtons(false);
                }}
              >
                <Image
                  source={require('../../../assets/images/받아쓰기.png')}
                  resizeMode="contain"
                />
                <ScaledText fontSize={20} style={styles.fabButtonText}>받아쓰기</ScaledText>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}

        <TouchableOpacity
          style={[styles.fabButton, styles.mainFabButton]}
          onPress={() => setShowButtons(!showButtons)}
        >
          <Image
            source={require('../../../assets/images/플러스아이콘.png')}
            style={styles.plusIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 할 일 추가/수정 모달 */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={resetModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={resetModal}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={resetModal}>
                <ScaledText fontSize={20} style={styles.modalCloseButton}>✕</ScaledText>
              </TouchableOpacity>

              <ScaledText fontSize={20} style={styles.modalTitle}>
                {editingTodo ? '할일 편집' : '할일 추가'}
              </ScaledText>

              <TouchableOpacity onPress={handleAddOrUpdateTodo}>
                <ScaledText fontSize={18} style={styles.modalSaveButton}>완료</ScaledText>
              </TouchableOpacity>
            </View>

            {/* 제목 입력 */}
            <View style={styles.inputSection}>
              <TextInput
                style={[styles.titleInput, { fontSize: 20 * fontScale }]}
                value={title}
                onChangeText={setTitle}
                placeholder="빨래 돌리기"
                placeholderTextColor="#999"
                autoFocus
              />
            </View>

            {/* 기한 설정 */}
            <View style={styles.settingSection}>
              <ScaledText fontSize={18} style={styles.settingLabel}>기한 설정</ScaledText>
              <Switch
                value={hasDeadline}
                onValueChange={setHasDeadline}
                trackColor={{ false: '#E0E0E0', true: '#02BFDC' }}
                thumbColor="#fff"
              />
            </View>

            {hasDeadline && (
              <>
                {/* 날짜 선택 */}
                <TouchableOpacity
                  style={styles.settingSection}
                  onPress={() => setShowDatePicker(true)}
                >
                  <ScaledText fontSize={18} style={styles.settingLabel}>날짜 선택</ScaledText>
                  <ScaledText fontSize={18} style={styles.settingValue}>
                    {formatDate(selectedDate)}
                  </ScaledText>
                </TouchableOpacity>

                {/* 하루종일 토글 */}
                <View style={styles.settingSection}>
                  <ScaledText fontSize={18} style={styles.settingLabel}>하루종일</ScaledText>
                  <Switch
                    value={isAllDay}
                    onValueChange={setIsAllDay}
                    trackColor={{ false: '#E0E0E0', true: '#02BFDC' }}
                    thumbColor="#fff"
                  />
                </View>

                {/* 시간 선택 (하루종일이 꺼져있을 때만) */}
                {!isAllDay && (
                  <TouchableOpacity
                    style={styles.settingSection}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <ScaledText fontSize={18} style={styles.settingLabel}>시간 선택</ScaledText>
                    <ScaledText fontSize={18} style={styles.settingValue}>
                      {formatTime(selectedDate)}
                    </ScaledText>
                  </TouchableOpacity>
                )}
              </>
            )}

            {/* 할일 삭제 버튼 (수정 모드일 때만) */}
            {editingTodo && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    '할일 삭제',
                    '이 할일을 삭제하시겠습니까?',
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '삭제',
                        style: 'destructive',
                        onPress: () => handleDeleteTodo(editingTodo.id),
                      },
                    ]
                  );
                }}
              >
                <ScaledText fontSize={18} style={styles.deleteButtonText}>할일 삭제</ScaledText>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* 커스텀 날짜 피커 */}
      <DateTimePicker
        visible={showDatePicker}
        mode="date"
        value={selectedDate}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
      />

      {/* 커스텀 시간 피커 */}
      <DateTimePicker
        visible={showTimePicker}
        mode="time"
        value={selectedDate}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(date) => {
          setSelectedDate(date);
          setShowTimePicker(false);
        }}
      />
    </SafeAreaView>
  );
};

export default TodoListApp;