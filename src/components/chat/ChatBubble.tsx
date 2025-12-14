// src/components/chat/ChatBubble.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Sound from 'react-native-sound';
import ScaledText from '../ScaledText';
import { Message } from '../../contexts/ChatContext';
import { ttsService } from '../../services/ttsService';

interface ChatBubbleProps {
  message: Message;
  chatListNum?: number;
}

/**
 * ✅ 조절 포인트
 * - AVATAR_SIZE: 버튼(동그라미) 크기
 * - IMAGE_SCALE: 버튼 안 이미지가 얼마나 꽉 차게 보일지(확대/축소)
 */
const AVATAR_SIZE = 55;
const AVATAR_GAP = 10;
const IMAGE_SCALE = 1;

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, chatListNum }) => {
  const isUser = message.role === 'user';

  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  const stopAndRelease = (s: Sound | null) => {
    if (!s) return;
    try {
      s.stop(() => {
        s.release();
      });
    } catch (e) {
      // stop/release 중 예외가 나도 앱이 죽으면 안 됨
    }
  };

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

      // 기존 사운드 정리
      if (sound) {
        stopAndRelease(sound);
        setSound(null);
      }

      // TTS API 호출
      const response = await ttsService.getTTS(chatListNum, message.chat_num);
      const ttsUrl = ttsService.getFullTTSUrl(response.tts_path);

      console.log('🔊 TTS 재생 시작:', ttsUrl);

      // Sound 라이브러리 초기화
      Sound.setCategory('Playback');

      const newSound = new Sound(ttsUrl, '', (error) => {
        if (error) {
          console.error('❌ 사운드 로드 실패:', error);
          Alert.alert('오류', 'TTS 재생에 실패했습니다.');
          setIsPlayingTTS(false);
          return;
        }

        newSound.play((success) => {
          if (success) {
            console.log('✅ TTS 재생 완료');
          } else {
            console.error('❌ TTS 재생 실패');
          }

          setIsPlayingTTS(false);
          newSound.release();
          setSound(null);
        });
      });

      setSound(newSound);
    } catch (error: any) {
      console.error('❌ TTS 재생 실패:', error);
      Alert.alert('오류', error?.message || 'TTS 재생에 실패했습니다.');
      setIsPlayingTTS(false);
    }
  };

  // 컴포넌트 언마운트 시 사운드 정리
  useEffect(() => {
    return () => {
      stopAndRelease(sound);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

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

  // AI 메시지
  return (
    <View style={styles.assistantContainer}>
      <View style={styles.assistantBubble}>
        {/* ✅ 버블 내부 좌상단 아이콘 버튼 */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={handleTTSPlay}
          disabled={isPlayingTTS}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            {isPlayingTTS ? (
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

        {/* ✅ 텍스트는 아이콘 영역만큼 오른쪽에서 시작 */}
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

  /**
   * ✅ 핵심: 버블 내부에 아이콘을 absolute로 박아두고
   * 텍스트는 paddingLeft로 아이콘 영역만큼 오른쪽에서 시작하게 함
   */
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,

    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 12,

    // 아이콘 자리 확보
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

  // ✅ 버튼(동그라미) 자체
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#E0F7FA',
    borderWidth: 2,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
    position: 'relative', // 기준점
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
