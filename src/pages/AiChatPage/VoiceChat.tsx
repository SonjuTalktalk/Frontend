import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../../components/common/PageHeader';
import { ChatStackParamList } from '../../types/navigation';
import ScaledText from '../../components/ScaledText';

type VoiceChatNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'VoiceChat'>;

const VoiceChat = () => {
  const navigation = useNavigation<VoiceChatNavigationProp>();
  const [isListening, setIsListening] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          {/* 큰 글씨 24 */}
          <ScaledText style={styles.headerTitle} fontSize={24}>
            돌쇠
          </ScaledText>

          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="star-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="menu" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.mainContent}>
          {/* TODO: 캐릭터 이미지 에셋 추가 (듣고 있는 모습) */}
          <View style={styles.characterContainer}>
            <View style={[styles.glow, isListening && styles.glowActive]} />
          </View>

          {/* 중간 글씨 20 */}
          <ScaledText style={styles.statusText} fontSize={20}>
            {isListening ? '손주가 듣고 있어요.' : '무엇이든 물어보세요.'}
          </ScaledText>

          {/* 음성 파형 표시 */}
          {isListening && (
            <View style={styles.waveformContainer}>
              <View style={[styles.waveBar, { height: 20 }]} />
              <View style={[styles.waveBar, { height: 40 }]} />
              <View style={[styles.waveBar, { height: 30 }]} />
              <View style={[styles.waveBar, { height: 50 }]} />
              <View style={[styles.waveBar, { height: 35 }]} />
            </View>
          )}
        </View>

        {/* 하단 컨트롤 */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Icon name="videocam-outline" size={32} color="#7A9CA5" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsListening(!isListening)}
          >
            <Icon name={isListening ? 'mic' : 'mic-off'} size={32} color="#7A9CA5" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={32} color="#7A9CA5" />
          </TouchableOpacity>
        </View>
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
  backButton: {
    padding: 8,
    width: 80,
  },
  headerTitle: {
    fontSize: 18, // ScaledText가 24 기준으로 스케일 적용
    fontWeight: '600',
    color: '#2D4550',
  },
  rightSection: {
    width: 80,
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
  },
  characterContainer: {
    width: 256,
    height: 256,
    marginBottom: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(2, 191, 220, 0.2)',
    borderRadius: 128,
    opacity: 0.3,
  },
  glowActive: {
    opacity: 0.6,
  },
  statusText: {
    fontSize: 20, // ScaledText가 20 기준으로 스케일 적용
    fontWeight: '500',
    color: '#2D4550',
    marginBottom: 24,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 60,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#7A9CA5',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 44,
    marginBottom: -24,
    paddingHorizontal: 48,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default VoiceChat;
