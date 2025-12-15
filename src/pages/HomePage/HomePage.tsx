// src/pages/HomePage/HomePage.tsx
import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { styles } from '../../styles/Home';
import { getMyAIProfile } from '../../api/profileApi';
import { usePoints } from '../../contexts/PointContext';
import { getCurrentBackgrounds } from '../../utils/backgroundConfig';

type EquippedItemsMap = { [key: string]: string };

export default function HomePage({ navigation }: any) {
  const { points, refreshPoints } = usePoints();

  const [sonjuName, setSonjuName] = useState('손주');
  const [equippedItems, setEquippedItems] = useState<EquippedItemsMap>({});
  const [backgrounds, setBackgrounds] = useState<{
      bg1: any;
      bg2: any | null;
    }>({
      bg1: require('../../../assets/images/background.png'),
      bg2: require('../../../assets/images/background2.png'),
    });

  const loadEquippedItems = async () => {
    try {
      const raw = await AsyncStorage.getItem('equippedItems');
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setEquippedItems(parsed);
      }
    } catch (e) {
      console.log('장착 아이템 로드 실패:', e);
    }
  };

  const loadBackground = async () => {
    try {
      const equippedBg = await AsyncStorage.getItem('equippedBackground');
      const bgs = getCurrentBackgrounds(equippedBg, 'main');
      setBackgrounds(bgs);
      console.log('✅ 홈 배경 로드:', equippedBg || '기본 배경');
    } catch (error) {
      console.error('배경 로드 실패:', error);
    }
  };

  const loadSonjuName = async () => {
    try {
      const localSonju = await AsyncStorage.getItem('sonjuName');
      if (localSonju) setSonjuName(localSonju);

      try {
        const aiProfile = await getMyAIProfile();
        if (aiProfile?.nickname) {
          setSonjuName(aiProfile.nickname);
          await AsyncStorage.setItem('sonjuName', aiProfile.nickname);
        }
      } catch (apiError) {
        console.log('AI 프로필 로드 실패 (로컬 데이터 사용):', apiError);
      }
    } catch (error) {
      console.error('손주 이름 로드 실패:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSonjuName();
      loadEquippedItems();
      loadBackground();
      refreshPoints();
    }, [])
  );

  const getCharacterImage = () => {
    const equippedItemIds = Object.values(equippedItems);

    if (equippedItemIds.includes('ribbon')) {
      return require('../../../assets/images/RibbonSonju.png');
    }
    if (equippedItemIds.includes('hiking-hat')) {
      return require('../../../assets/images/HikinghatSonju.png');
    }
    if (equippedItemIds.includes('bunny-band')) {
      return require('../../../assets/images/RabbitSonju.png');
    }
    if (equippedItemIds.includes('wizard-hat')) {
      return require('../../../assets/images/MagicSonju.png');
    }
    if (equippedItemIds.includes('crown')) {
      return require('../../../assets/images/KingSonju.png');
    }
    if (equippedItemIds.includes('glasses')) {
      return require('../../../assets/images/UniformSonju.png');
    }

    return require('../../../assets/images/sonjusmile.png');
  };

  const quickMenus = [
    {
      id: 1,
      title: '건강',
      image: require('../../../assets/images/healthicon.png'),
      onPress: () => navigation.navigate('Health'),
    },
    {
      id: 2,
      title: '경제',
      image: require('../../../assets/images/economyicon.png'),
      onPress: () => console.log('경제 눌림'),
    },
    {
      id: 3,
      title: '활동',
      image: require('../../../assets/images/activityicon.png'),
      onPress: () => console.log('활동 눌림'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 배경 이미지 */}
      <Image
        source={backgrounds.bg1}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {backgrounds.bg2 && (
        <Image
          source={backgrounds.bg2}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      {/* 퀵 메뉴 - 상단 고정 */}
      <View style={styles.quickMenuContainer}>
        {quickMenus.map((menu) => (
          <TouchableOpacity
            key={menu.id}
            style={styles.quickMenu}
            onPress={menu.onPress}
            activeOpacity={0.8}
          >
            <Image source={menu.image} style={styles.menuIcon} resizeMode="contain" />
            <ScaledText fontSize={18} style={styles.menuTitle}>
              {menu.title}
            </ScaledText>
          </TouchableOpacity>
        ))}
      </View>

      {/* 캐릭터 영역 - 중앙 */}
      <View style={styles.characterSection}>
        <ScaledText fontSize={28} style={styles.characterName}>
          {sonjuName}
        </ScaledText>

        <View style={styles.characterContainer}>
          <Image
            source={getCharacterImage()}
            style={styles.characterImage}
            resizeMode="contain"
          />

          {/* 메시지 버튼 */}
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => navigation.navigate('ChatMain')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/images/bubble.png')}
              style={styles.messageIcon}
              resizeMode="contain"
            />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 포인트 영역 - 하단 고정 */}
      <View style={styles.pointContainer}>
        <View style={styles.pointSection}>
          <ScaledText fontSize={24} style={styles.pointText}>
            {points} 포인트
          </ScaledText>
          <Image source={require('../../../assets/images/coin.png')} style={styles.Icons} />
        </View>

        <TouchableOpacity
          style={styles.pointSection}
          onPress={() => navigation.navigate('Shop')}
          activeOpacity={0.8}
        >
          <ScaledText fontSize={18} style={styles.pointButton}>
            꾸미기
          </ScaledText>
          <Image
            source={require('../../../assets/images/arrowright.png')}
            style={styles.Icons}
          />
        </TouchableOpacity>
      </View>

      {/* 좌측 버튼들 */}
      <View style={styles.leftButtonsContainer}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../../assets/images/setting.png')}
            style={styles.buttonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => navigation.navigate('Notification')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../../assets/images/alarm.png')}
            style={styles.buttonIcon}
            resizeMode="contain"
          />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
