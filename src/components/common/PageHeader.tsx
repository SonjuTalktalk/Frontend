import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ScaledText from '../ScaledText';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightButton?: React.ReactNode;
  titleAlign?: 'left' | 'center';
  safeArea?: boolean; // SafeAreaView 내부에서 사용되는지 여부
}

export default function PageHeader({
  title,
  onBack,
  rightButton,
  titleAlign = 'center',
  safeArea = false,
}: PageHeaderProps) {
  return (
    <View style={[styles.header, safeArea && styles.headerSafeArea]}>
      {/* 왼쪽: 뒤로가기 버튼 */}
      <View style={styles.leftSection}>
        {onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Image
              source={require('../../../assets/images/왼쪽화살표.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* 가운데: 타이틀 (absolute positioning으로 화면 중앙 고정) */}
      {titleAlign === 'center' && (
        <View style={styles.centerSection} pointerEvents="none">
          <ScaledText fontSize={24} style={styles.headerTitle}>
            {title}
          </ScaledText>
        </View>
      )}

      {titleAlign === 'left' && (
        <View style={styles.leftTitleSection}>
          <ScaledText fontSize={24} style={styles.headerTitle}>
            {title}
          </ScaledText>
        </View>
      )}

      {/* 오른쪽: 커스텀 버튼 */}
      <View style={styles.rightSection}>
        {rightButton || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerSafeArea: {
    paddingTop: 50, // SafeAreaView 내부에서도 충분한 상단 패딩 확보
  },
  leftSection: {
    minWidth: 40,
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  centerSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftTitleSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    minWidth: 40,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontFamily: 'Pretendard-Bold',
    color: '#1F2937',
  },
});
