// src/components/chat/ChatBubble.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import ScaledText from '../ScaledText';
import { ChatMessage } from '@/contexts/ChatContext';

interface ChatBubbleProps {
  message: ChatMessage;
}

/**
 * ✅ 조절 포인트
 * - AVATAR_SIZE: 버튼(동그라미) 크기
 * - AVATAR_GAP: 버튼과 텍스트 사이 간격
 */
const AVATAR_SIZE = 55;
const AVATAR_GAP = 10;

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, chatListNum }) => {
  const isUser = message.role === 'user';

  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  /**
   * TTS 재생 핸들러
   */
  const handleTTSPlay = async () => {
    if (!message.chat_num || !chatListNum) {
      Alert.alert('알림', 'TTS를 재생할 수 없습니다.');
      return;
    }

    try {
      setIsPlayingTTS(true);

      // TTS API 호출
      const response = await ttsService.getTTS(chatListNum, message.chat_num);
      const ttsUrl = ttsService.getFullTTSUrl(response.tts_path);

      console.log('🔊 TTS 재생 시작:', ttsUrl);

      // URL에서 직접 재생
      SoundPlayer.playUrl(ttsUrl);

    } catch (error: any) {
      console.error('❌ TTS 재생 실패:', error);
      Alert.alert('오류', error?.message || 'TTS 재생에 실패했습니다.');
      setIsPlayingTTS(false);
    }
  };

  // 재생 완료 이벤트 리스너
  useEffect(() => {
    const finishedSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
      console.log('✅ TTS 재생 완료:', success);
      setIsPlayingTTS(false);
    });

    const errorSubscription = SoundPlayer.addEventListener('FinishedPlayingError', (error) => {
      console.error('❌ TTS 재생 에러:', error);
      setIsPlayingTTS(false);
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      finishedSubscription.remove();
      errorSubscription.remove();

      // 재생 중이던 사운드 정지
      try {
        SoundPlayer.stop();
      } catch (e) {
        // 정지 중 에러 무시
      }
    };
  }, []);

  // USER 메시지
  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userBubble}>
          <ScaledText style={styles.userText} fontSize={20}>
            {message.content}
          </ScaledText>
        </View>
        <ScaledText fontSize={12} style={styles.userTimestamp}>
          {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </ScaledText>
      </View>
    );
  }

  return (
    <View style={styles.assistantContainer}>
      <View style={styles.avatarPlaceholder} />
      <View style={styles.assistantBubble}>
        <ScaledText style={styles.assistantText} fontSize={20}>
          {message.content}
        </ScaledText>
      </View>
      <ScaledText fontSize={12} style={styles.assistantTimestamp}>
        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
      </ScaledText>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userBubble: {
    backgroundColor: '#02BFDC',
    borderRadius: 20,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    lineHeight: 28,
    color: '#FFFFFF',
  },
  userTimestamp: {
    color: '#7A9CA5',
    marginTop: 4,
  },
  assistantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A5BCC3',
    marginRight: 12,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  avatarButton: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 10,
  },

  // ✅ 버튼(동그라미) 자체
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E0F7FA',
    borderWidth: 2,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
    position: 'relative',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  assistantText: {
    lineHeight: 28,
    color: '#2D4550',
  },
  assistantTimestamp: {
    color: '#7A9CA5',
    marginTop: 4,
    marginLeft: 60,
  },
});

export default ChatBubble;