// src/screens/chat/ChatRoom.tsx
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import ScaledText from '../../components/ScaledText';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../../components/common/PageHeader';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { ChatStackParamList } from '../../types/navigation';

type ChatRoomNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatRoom'>;

const ChatRoom = () => {
  const navigation = useNavigation<ChatRoomNavigationProp>();
  const { currentChat, sendMessageToAI, currentTodoMeta, setCurrentTodoMeta } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [currentChat?.messages.length]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      await sendMessageToAI(
        message,
        currentChat?.chat_list_num,
        false
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert(
        '오류',
        '메시지를 전송하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Todo 완료 처리 (saved step일 때만)
  useEffect(() => {
    if (currentTodoMeta?.step === 'saved' && currentTodoMeta.has_todo && currentTodoMeta.todo_num) {
      Alert.alert(
        '할일 등록 완료',
        '할일이 성공적으로 등록되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              setCurrentTodoMeta(null);
              // TODO: 할일 컨텍스트가 있다면 새로고침
              // 예: todoContext.refreshTodos();
            },
          },
        ]
      );
    }
  }, [currentTodoMeta]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <PageHeader
          title="돌쇠"
          onBack={() => navigation.goBack()}
          safeArea={true}
          rightButton={
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => navigation.navigate('PromptSettings')} style={styles.iconButton}>
                <Icon name="star-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ChatList')} style={styles.iconButton}>
                <Icon name="menu" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.characterHeader}>
            <View style={styles.characterPlaceholder} />
          </View>

          {currentChat?.messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ScaledText fontSize={14} style={styles.loadingText}>
                답변을 생성하고 있습니다...
              </ScaledText>
            </View>
          )}
        </ScrollView>

        <ChatInput
          onSend={handleSendMessage}
          onVoiceClick={() => navigation.navigate('VoiceChat')}
          onAttachClick={() => {
            // TODO: 파일 첨부 기능
          }}
          disabled={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  characterHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  characterPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#A5BCC3',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: '#7A9CA5',
    fontStyle: 'italic',
  },
});

export default ChatRoom;