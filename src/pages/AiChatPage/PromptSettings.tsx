// src/screens/chat/PromptSettings.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import ScaledText from '../../components/ScaledText';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import PageHeader from '../../components/common/PageHeader';
import { useChat } from '../../contexts/ChatContext';
import { Personality } from '../../types/ai';
import { promptConfigs } from '../../utils/promptHelper';
import { ChatStackParamList } from '../../types/navigation';
import { aiProfileAPI } from '../../services/AiProfile';

type PromptSettingsNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'PromptSettings'>;

const PromptSettings = () => {
  const navigation = useNavigation<PromptSettingsNavigationProp>();
  const { currentPrompt, setCurrentPrompt } = useChat();

  const [selectedPrompt, setSelectedPrompt] = useState<Personality>(Personality.FRIENDLY);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [aiNickname, setAiNickname] = useState<string>('손주');

  /**
   * AI 프로필 로드
   */
  const fetchAiProfile = async () => {
    try {
      setInitialLoading(true);
      const profile = await aiProfileAPI.getAiProfile();

      console.log('✅ 로드된 AI 프로필:', profile);

      setAiNickname(profile.nickname);
      setSelectedPrompt(profile.personality as Personality);
      setCurrentPrompt(profile.personality as Personality);
    } catch (error) {
      console.error('❌ AI 프로필 로드 실패:', error);
      Alert.alert('오류', 'AI 프로필을 불러오는데 실패했습니다.');
    } finally {
      setInitialLoading(false);
    }
  };

  // 화면 포커스될 때마다 AI 프로필 로드
  useFocusEffect(
    React.useCallback(() => {
      fetchAiProfile();
    }, [])
  );

  const handleSelectPrompt = (promptType: Personality) => {
    setSelectedPrompt(promptType);
  };

  const handleSave = async () => {
    // 변경사항이 없으면 그냥 돌아가기
    if (selectedPrompt === currentPrompt) {
      navigation.goBack();
      return;
    }

    try {
      setLoading(true);

      // PUT /ai/preferences 호출
      const updatedProfile = await aiProfileAPI.updatePreferences(selectedPrompt);

      console.log('✅ 성격 변경 완료:', updatedProfile);

      // ChatContext 업데이트
      setCurrentPrompt(updatedProfile.personality);

      Alert.alert('저장 완료', `${aiNickname}의 성격이 변경되었습니다.`, [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('❌ 프롬프트 저장 실패:', error);
      Alert.alert('오류', error.message || '성격 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const promptTypes: Personality[] = [
    Personality.FRIENDLY,
    Personality.ACTIVE,
    Personality.PLEASANT,
    Personality.RELIABLE,
  ];

  // 초기 로딩 중
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#02BFDC" />
          <ScaledText fontSize={16} style={styles.loadingText}>
            프로필을 불러오는 중...
          </ScaledText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <ScaledText style={styles.headerTitle} fontSize={24}>
            프롬프트 설정
          </ScaledText>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#02BFDC" />
            ) : (
              <ScaledText style={styles.saveButtonText} fontSize={20}>
                저장
              </ScaledText>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.characterContainer}>
            <View style={styles.characterPlaceholder}>
              <Image
                source={require('../../../assets/images/icons/SonjuHeadIcon.png')}
                style={styles.character}
                resizeMode="contain"
              />
            </View>
            <ScaledText fontSize={20} style={styles.characterName}>{aiNickname}</ScaledText>
          </View>

          <ScaledText fontSize={18} style={styles.description}>
            프롬프트를 고르면{'\n'}
            {aiNickname}의 목소리를 들을 수 있어요.
          </ScaledText>

          <View style={styles.promptList}>
            {promptTypes.map((type) => {
              const config = promptConfigs[type];
              const isSelected = selectedPrompt === type;

              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.promptItem, isSelected && styles.promptItemSelected]}
                  onPress={() => handleSelectPrompt(type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.promptItemContent}>
                    <ScaledText
                      style={[styles.promptLabel, isSelected && styles.promptLabelSelected]}
                      fontSize={18}
                    >
                      {config.label}
                    </ScaledText>

                    <ScaledText
                      style={[
                        styles.promptDescription,
                        isSelected && styles.promptDescriptionSelected,
                      ]}
                      fontSize={14}
                    >
                      {config.description}
                    </ScaledText>
                  </View>

                  {isSelected && (
                    <Icon name="checkmark-circle" size={24} color="#02BFDC" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E9F5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#2D4550',
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
    fontWeight: '600',
    color: '#2D4550',
  },
  saveButton: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  saveButtonText: {
    color: '#02BFDC',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  characterContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  characterPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#9fd8e9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    width: '100%',
    height: '100%',
  },
  characterName: {
    marginTop: 16,
    fontWeight: '600',
    color: '#2D4550',
  },
  description: {
    fontWeight: '500',
    color: '#2D4550',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  promptList: {
    paddingHorizontal: 32,
    gap: 16,
    paddingBottom: 32,
  },
  promptItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#B8E6EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptItemSelected: {
    backgroundColor: '#E8F7FA',
    borderColor: '#02BFDC',
  },
  promptItemContent: {
    flex: 1,
  },
  promptLabel: {
    fontWeight: '500',
    color: '#2D4550',
    marginBottom: 4,
  },
  promptLabelSelected: {
    color: '#02BFDC',
    fontWeight: '600',
  },
  promptDescription: {
    color: '#6C757D',
  },
  promptDescriptionSelected: {
    color: '#02BFDC',
  },
});

export default PromptSettings;