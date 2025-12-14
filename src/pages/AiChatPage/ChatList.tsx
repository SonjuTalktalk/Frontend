// src/screens/chat/ChatList.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScaledText from '../../components/ScaledText';
import PageHeader from '../../components/common/PageHeader';
import { useChat } from '../../contexts/ChatContext';
import { ChatStackParamList } from '../../types/navigation';
import { ChatListItem } from '../../services/chatService';
import { ChatStyles } from '@/styles/ChatStyles';

type ChatListNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatList'>;

const ChatList = () => {
  const navigation = useNavigation<ChatListNavigationProp>();
  const { chatLists, loadChatLists, loadChatMessages, deleteChatLists, clearChat } = useChat();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchChatLists();
  }, []);

  const fetchChatLists = async () => {
    setIsLoading(true);
    try {
      await loadChatLists();
    } catch (error) {
      console.error('Failed to load chat lists:', error);
      Alert.alert('오류', '채팅방 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadChatLists();
    } catch (error) {
      console.error('Failed to refresh chat lists:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleChatPress = async (chatListNum: number) => {
    if (isSelectionMode) {
      toggleSelection(chatListNum);
    } else {
      setIsLoading(true);
      try {
        await loadChatMessages(chatListNum);
        navigation.navigate('ChatRoom');
      } catch (error) {
        console.error('Failed to load chat messages:', error);
        Alert.alert(
          '오류',
          '채팅 내역을 불러오는데 실패했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleSelection = (chatListNum: number) => {
    setSelectedItems((prev) =>
      prev.includes(chatListNum) 
        ? prev.filter((num) => num !== chatListNum) 
        : [...prev, chatListNum]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('알림', '삭제할 항목을 선택해주세요');
      return;
    }

    Alert.alert(
      '삭제 확인', 
      `${selectedItems.length}개의 대화를 삭제하시겠습니까?`, 
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await deleteChatLists(selectedItems);
              
              if (response.not_found.length > 0) {
                Alert.alert(
                  '삭제 완료',
                  `${response.deleted_lists.length}개의 채팅방이 삭제되었습니다.\n${response.not_found.length}개는 이미 삭제되었습니다.`,
                  [{ text: '확인' }]
                );
              } else {
                Alert.alert(
                  '삭제 완료',
                  `${response.deleted_lists.length}개의 채팅방이 삭제되었습니다.`,
                  [{ text: '확인' }]
                );
              }
              
              setSelectedItems([]);
              setIsSelectionMode(false);
            } catch (error) {
              console.error('Failed to delete chats:', error);
              Alert.alert('오류', '채팅방 삭제에 실패했습니다.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleNewChat = () => {
    clearChat();
    navigation.navigate('ChatMain');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = nowOnly.getTime() - dateOnly.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const renderChatItem = ({ item }: { item: ChatListItem }) => {
    const isSelected = selectedItems.includes(item.chat_list_num);

    return (
      <TouchableOpacity
        style={[styles.chatListItem, isSelected && styles.chatListItemSelected]}
        onPress={() => handleChatPress(item.chat_list_num)}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleSelection(item.chat_list_num);
        }}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <View style={styles.chatContent}>
          {/* last_message를 title로 사용 */}
          <ScaledText style={styles.chatTitle} numberOfLines={1} fontSize={20}>
            {item.last_message.length > 30 
              ? `${item.last_message.substring(0, 30)}...` 
              : item.last_message}
          </ScaledText>
          <ScaledText style={styles.chatDate} fontSize={18}>
            {formatDate(item.last_date)}
          </ScaledText>
        </View>

        {isSelectionMode && (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Icon name="checkmark" size={16} color="#FFFFFF" />}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Icon name="chevron-back" size={24} color="#2D4550" />
          </TouchableOpacity>

          <ScaledText style={styles.headerTitle} fontSize={24}>
            채팅 목록
          </ScaledText>

          {isSelectionMode ? (
            <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
              <ScaledText style={styles.deleteButtonText} fontSize={20}>
                삭제
              </ScaledText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.headerButton} onPress={() => setIsSelectionMode(true)}>
              <ScaledText style={styles.selectButtonText} fontSize={20}>
                선택
              </ScaledText>
            </TouchableOpacity>
          )}
        </View>

        {chatLists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="chatbubbles-outline" size={64} color="#B8E6EA" />
            <ScaledText style={styles.emptyTitle} fontSize={20}>
              채팅 내역이 없습니다
            </ScaledText>
            <ScaledText style={styles.emptySubtitle} fontSize={18}>
              손주와 새로운 대화를 시작해보세요
            </ScaledText>
          </View>
        ) : (
          <FlatList
            data={chatLists}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.chat_list_num.toString()}
            contentContainerStyle={styles.listContent}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        )}

        {isSelectionMode && (
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedItems([]);
              }}
            >
              <ScaledText style={styles.cancelButtonText} fontSize={20}>
                취소
              </ScaledText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#B8E9F5',
    borderBottomWidth: 1,
    borderBottomColor: '#B8E6EA',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerTitle: {
    fontWeight: '600',
    color: '#2D4550',
  },
  selectButtonText: {
    color: '#02BFDC',
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FF5252',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#2D4550',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#7A9CA5',
    marginBottom: 24,
  },
  listContent: {
    padding: 16,
  },
  chatListItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatListItemSelected: {
    backgroundColor: '#E8F8FA',
    borderWidth: 2,
    borderColor: '#02BFDC',
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    color: '#2D4550',
    fontWeight: '600',
    marginBottom: 4,
  },
  chatDate: {
    color: '#7A9CA5',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B8E6EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkboxSelected: {
    backgroundColor: '#02BFDC',
    borderColor: '#02BFDC',
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B8E6EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#5B8A95',
    fontWeight: '600',
  },
});

export default ChatList;
