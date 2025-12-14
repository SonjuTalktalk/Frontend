// src/pages/HomePage/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { styles } from '../../styles/Home';
import { usePoints } from '../../contexts/PointContext';
import { getCurrentBackgrounds } from '../../utils/backgroundConfig';

export default function HomePage({ navigation }: any) {
  const { points } = usePoints();
  const [equippedItems, setEquippedItems] = useState<{
    [key: string]: string;
  }>({});
  const [sonjuName, setSonjuName] = useState('손주');
  const [backgrounds, setBackgrounds] = useState<{
    bg1: any;
    bg2: any | null;
  }>({
    bg1: require('../../../assets/images/MainBg.png'),
    bg2: require('../../../assets/images/MainBg2.png'),
  });

  // 화면이 포커스될 때마다 착용한 아이템, AI 프로필, 배경 로드
  useFocusEffect(
    React.useCallback(() => {
      loadEquippedItems();
      loadAiProfile();
      loadBackground();
    }, [])
  );

  const loadEquippedItems = async () => {
    try {
      const equipped = await AsyncStorage.getItem('equippedItems');
      if (equipped) {
        setEquippedItems(JSON.parse(equipped));
      }
    } catch (error) {
      console.error('착용 아이템 로드 실패:', error);
    }
  };

  const loadAiProfile = async () => {
    try {
      const aiProfileStr = await AsyncStorage.getItem('aiProfile');
      if (aiProfileStr) {
        const aiProfile = JSON.parse(aiProfileStr);
        console.log('✅ AI 프로필 로드:', aiProfile);
        setSonjuName(aiProfile.nickname || '손주');
      } else {
        console.log('⚠️ AI 프로필 없음, 기본 이름 사용');
        setSonjuName('손주');
      }
    } catch (error) {
      console.error('AI 프로필 로드 실패:', error);
      setSonjuName('손주');
    }
  };

  const loadBackground = async () => {
    try {
      const equippedBg = await AsyncStorage.getItem('equippedBackground');
      const bgs = getCurrentBackgrounds(equippedBg, 'main');
      setBackgrounds(bgs);
      console.log('✅ 메인 배경 로드:', equippedBg || '기본 배경');
    } catch (error) {
      console.error('배경 로드 실패:', error);
    }
  };

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
    if(equippedItemIds.includes('glasses')){
      return require('../../../assets/images/UniformSonju.png');
    }

    return require('../../../assets/images/sonjusmile.png');
  };

  const quickMenus = [
    {
      id: 1,
      title: '건강',
      image: require('../../../assets/images/건강아이콘.png'),
      onPress: () => navigation.navigate('Health'),
    },
    {
      id: 2,
      title: '경제',
      image: require('../../../assets/images/경제아이콘.png'),
    },
    {
      id: 3,
      title: '활동',
      image: require('../../../assets/images/배움아이콘.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 배경 이미지 - 동적으로 변경 */}
      <Image
        source={backgrounds.bg1}
        style={[styles.backgroundImage,
          { transform: [{ scale: 1.0 }] }]}
        resizeMode="cover"
      />
      {backgrounds.bg2 && (
        <Image
          source={backgrounds.bg2}
          style={styles.backgroundImage2}
          resizeMode="cover"
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 퀵 메뉴 */}
        <View style={styles.quickMenuContainer}>
          {quickMenus.map((menu) => (
            <TouchableOpacity
              key={menu.id}
              style={[styles.quickMenu]}
              onPress={menu.onPress}
            >
              <Image
                source={menu.image}
                style={styles.menuIcon}
                resizeMode="contain"
              />
              <ScaledText fontSize={18} style={styles.menuTitle}>
                {menu.title}
              </ScaledText>
            </TouchableOpacity>
          ))}
        </View>

        {/* 캐릭터 영역 */}
        <View style={styles.characterSection}>
          <ScaledText fontSize={28} style={styles.characterName}>
            {sonjuName}
          </ScaledText>

          {/* 캐릭터 이미지 */}
          <View style={styles.characterContainer}>
            <Image
              source={getCharacterImage()}
              style={styles.characterImage}
              resizeMode="contain"
            />

            {/* 메시지 아이콘 */}
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => navigation.navigate('ChatMain')}
            >
              <Image
                source={require('../../../assets/images/말풍선아이콘.png')}
                style={styles.messageIcon}
                resizeMode="contain"
              />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>

          {/* 포인트 영역 */}
          <View style={styles.pointContainer}>
            <View style={styles.pointSection}>
                <ScaledText fontSize={24} style={styles.pointText}>
                  {points} 포인트
                </ScaledText>
                <Image
                  source={require('../../../assets/images/코인.png')}
                  style={styles.Icons}
                />
            </View>
            <TouchableOpacity 
              style={styles.pointSection}
              onPress={() => navigation.navigate('Shop')}
            >
              <ScaledText fontSize={18} style={styles.pointButton}>
                꾸미기
              </ScaledText>
              <Image
                source={require('../../../assets/images/오른쪽화살표.png')}
                style={styles.Icons}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.leftButtonsContainer}>
        {/* 설정 버튼 */}
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => {
            console.log('설정 버튼 클릭');
            navigation.navigate('Settings');
          }}
        >
          <Image
            source={require('../../../assets/images/설정아이콘.png')}
            style={styles.buttonIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 알림 버튼 */}
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => {
            console.log('알림 버튼 클릭');
            navigation.navigate('Notification');
          }}
        >
          <Image
            source={require('../../../assets/images/알림아이콘.png')}
            style={styles.buttonIcon}
            resizeMode="contain"
          />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}