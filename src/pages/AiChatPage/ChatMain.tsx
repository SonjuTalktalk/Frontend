// src/screens/chat/ChatMain.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ScaledText from '../../components/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../../components/common/PageHeader';
import SuggestedQuestion from '../../components/chat/SuggestedQuestion';
import ChatInput from '../../components/chat/ChatInput';
import { useChat } from '../../contexts/ChatContext';
import { ChatStackParamList } from '../../types/navigation';

type ChatMainNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatMain'>;

const ChatMain = () => {
  const navigation = useNavigation<ChatMainNavigationProp>();
  const { sendMessageToAI, clearChat } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = ['오늘 뉴스 요약', '오늘 날씨 어때?'];

  useFocusEffect(
    React.useCallback(() => {
      clearChat();
    }, [clearChat]) 
  );

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      // 새 채팅 시작: chat_list_num 없이 전송하여 새 채팅방 생성
      await sendMessageToAI(message, undefined, false);

      // AI 응답을 받으면 채팅방으로 이동
      navigation.navigate('ChatRoom');
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

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={styles.mainContent}>
        <View style={styles.characterContainer}>
          <View style={styles.glow} />
          <Image
            source={require('../../../assets/images/icons/SonjuHeadIcon.png')}
            style={[
              styles.character,
              { transform: [{ scale: 0.7 }] } // ← 여기 숫자만 조절
            ]}
            resizeMode="contain"
          />
        </View>

        <ScaledText style={styles.title} fontSize={24}>
          무엇이든 물어보세요.
        </ScaledText>

        <View style={styles.suggestionsContainer}>
          <ScaledText style={styles.suggestionsTitle} fontSize={18}>
            추천 질문
          </ScaledText>
          <View style={styles.suggestionsGrid}>
            {suggestedQuestions.map((question, index) => (
              <View key={index} style={styles.suggestionItem}>
                <SuggestedQuestion question={question} onClick={handleQuestionClick} />
              </View>
            ))}
          </View>
        </View>
      </View>

      <ChatInput
        onSend={handleSendMessage}
        onVoiceClick={() => navigation.navigate('VoiceChat')}
        disabled={isLoading}
      />
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 128,
  },
  characterContainer: {
    width: 256,
    height: 256,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(2, 191, 220, 0.2)',
    borderRadius: 128,
    opacity: 0.6,
  },
  character: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: '600',
    color: '#2D4550',
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  suggestionsTitle: {
    color: '#7A9CA5',
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionItem: {
    flexBasis: '48%',
  },
});

export default ChatMain;
