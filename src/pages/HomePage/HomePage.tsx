// src/pages/HomePage/HomePage.tsx (업데이트)
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScaledText from '../../components/ScaledText';
import { styles } from '../../styles/Home';
import { useMission } from '../../contexts/MissionContext';
import { getMyAIProfile } from '../../api/profileApi';

export default function HomePage({ navigation }: any) {
  const { totalPoints } = useMission();
  const [sonjuName, setSonjuName] = useState('돌쇠');

  useEffect(() => {
    loadSonjuName();

    // 화면이 포커스될 때마다 손주 이름 새로고침
    const unsubscribe = navigation.addListener('focus', () => {
      loadSonjuName();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSonjuName = async () => {
    try {
      // 로컬 스토리지에서 빠르게 로드
      const localSonju = await AsyncStorage.getItem('sonjuName');
      if (localSonju) setSonjuName(localSonju);

      // API에서 최신 정보 가져오기
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
    },
    {
      id: 3,
      title: '활동',
      image: require('../../../assets/images/activityicon.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* 배경 이미지 */}
      <Image
        source={require('../../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Image
        source={require('../../../assets/images/background2.png')}
        style={styles.backgroundImage2}
        resizeMode="cover"
      />
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
              source={require('../../../assets/images/sonjusmile.png')}
              style={styles.characterImage}
              resizeMode="contain"
            />

            {/* 메시지 아이콘 */}
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => navigation.navigate('ChatMain')}
            >
              <Image
                source={require('../../../assets/images/bubble.png')}
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
                  {totalPoints} 포인트
                </ScaledText>
                <Image
                  source={require('../../../assets/images/coin.png')}
                  style={styles.Icons}
                />
            </View>
            <TouchableOpacity style={styles.pointSection}>
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
            source={require('../../../assets/images/setting.png')}
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