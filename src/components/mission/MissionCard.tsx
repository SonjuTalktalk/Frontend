// src/components/mission/MissionCard.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Mission } from '../../types/mission';
import { MissionStyles } from '../../styles/MissionStyles';
import ScaledText from '../../components/ScaledText';

interface MissionCardProps {
  mission: Mission;
  onStart: (mission: Mission) => void;
}

const MissionCard = ({ mission, onStart }: MissionCardProps) => {
  return (
    <View style={MissionStyles.missionCard}>
      <View style={MissionStyles.cardHeader}>
        <View style={MissionStyles.titleContainer}>
          {/* 제목: 크게 24 */}
          <ScaledText style={MissionStyles.cardTitle} fontSize={24}>
            {mission.title}
          </ScaledText>

          <View style={MissionStyles.tagContainer}>
            {/* 태그: 작게 18 */}
            <ScaledText style={MissionStyles.tag} fontSize={18}>
              {mission.tag}
            </ScaledText>
          </View>
        </View>

        <View style={MissionStyles.pointsContainer}>
          {/* 포인트 숫자: 중간 20 */}
          <ScaledText style={MissionStyles.points} fontSize={20}>
            {mission.points}
          </ScaledText>
          {/* 포인트 라벨: 작게 18 */}
          <ScaledText style={MissionStyles.pointsLabel} fontSize={18}>
            포인트
          </ScaledText>
          {/* 이모지 아이콘은 사이즈 고정 텍스트이므로 18로 맞춤 */}
          <ScaledText style={MissionStyles.coinIcon} fontSize={18}>
            💰
          </ScaledText>
        </View>
      </View>

      <TouchableOpacity
        style={[
          MissionStyles.missionButton,
          mission.completed && MissionStyles.missionButtonCompleted,
        ]}
        onPress={() => onStart(mission)}
        disabled={mission.completed}
        activeOpacity={0.7}
      >
        {/* 버튼 텍스트: 중간 20 */}
        <ScaledText
          style={[
            MissionStyles.missionButtonText,
            mission.completed && MissionStyles.missionButtonTextCompleted,
          ]}
          fontSize={20}
        >
          {mission.completed ? '미션 완료' : '미션 시작'}
        </ScaledText>
      </TouchableOpacity>
    </View>
  );
};

export default MissionCard;
