import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
// ✅ 변경: TrackPlayer 제거 -> SoundPlayer 추가
import SoundPlayer from 'react-native-sound-player';
import ScaledText from '../ScaledText';
import { Message } from '../../contexts/ChatContext';
import { ttsService } from '../../services/ttsService';

interface ChatBubbleProps {
  message: Message;
  chatListNum?: number;
}

const AVATAR_SIZE = 55;
const AVATAR_GAP = 10;

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, chatListNum }) => {
  const isUser = message.role === 'user';
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  /**
   * ✅ SoundPlayer 이벤트 리스너 설정 (재생 완료 감지용)
   */
  useEffect(() => {
    // 재생이 끝났을 때 실행됨
    const onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({ success }) => {
        console.log('✅ TTS 재생 완료 (success):', success);
        setIsPlayingTTS(false); // 로딩/재생 상태 해제
      }
    );

    // 오디오 로딩 중 에러가 났을 때 실행됨 (선택 사항)
    const onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({ success, url }) => {
        if (!success) {
          console.log('❌ URL 로딩 실패:', url);
          setIsPlayingTTS(false);
        }
      }
    );

    // 컴포넌트 언마운트 시 정리 (이벤트 리스너 해제)
    return () => {
      onFinishedPlayingSubscription.remove();
      onFinishedLoadingURLSubscription.remove();
      // 화면을 벗어나거나 버블이 사라지면 소리 끄기 (선택 사항)
      // SoundPlayer.stop();
    };
  }, []);

  /**
   * ✅ TTS 재생 핸들러 (SoundPlayer 사용)
   */
  const handleTTSPlay = async () => {
    if (!message.chat_num || !chatListNum) {
      Alert.alert('알림', 'TTS를 재생할 수 없습니다.');
      return;
    }

    try {
      // 이미 재생 중이면 멈추기 (토글 기능)
      if (isPlayingTTS) {
        SoundPlayer.stop();
        setIsPlayingTTS(false);
        return;
      }

      setIsPlayingTTS(true);

      // 1. TTS API 호출하여 URL 가져오기
      const response = await ttsService.getTTS(chatListNum, message.chat_num);
      const ttsUrl = ttsService.getFullTTSUrl(response.tts_path);

      console.log('🔊 TTS 재생 시작:', ttsUrl);

      // 2. SoundPlayer로 URL 재생 (매우 간단!)
      SoundPlayer.playUrl(ttsUrl);

    } catch (error: any) {
      console.error('❌ TTS 재생 실패:', error);
      Alert.alert('오류', error?.message || 'TTS 재생에 실패했습니다.');
      setIsPlayingTTS(false);
    }
  };

  // USER 메시지 (변경 없음)
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

  // AI 메시지 (변경 없음)
  return (
    <View style={styles.assistantContainer}>
      <View style={styles.assistantBubble}>
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={handleTTSPlay}
          // disabled={isPlayingTTS}  <-- 재생 중일 때 누르면 멈추게 하려면 disabled 제거
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            {isPlayingTTS ? (
              // 재생 중(또는 로딩 중)일 때 인디케이터 표시
              <ActivityIndicator size="small" color="#02BFDC" />
            ) : (
              <Image
                source={require('../../../assets/images/ElipseSonjuButton.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}
          </View>
        </TouchableOpacity>

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
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 12,
    paddingLeft: 20 + AVATAR_SIZE + AVATAR_GAP,
    maxWidth: '75%',
    position: 'relative',
    flexShrink: 1,
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

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E0F7FA',
    borderWidth: 2,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center', // 인디케이터 중앙 정렬
    alignItems: 'center',     // 인디케이터 중앙 정렬
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
    marginLeft: 12,
  },
});

export default ChatBubble;