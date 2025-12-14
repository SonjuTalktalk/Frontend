import {StyleSheet, Dimensions} from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      gap: 64,
  },

  section:{
    flexDirection: 'row',
    gap:10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
      fontFamily: 'Pretendard-Medium',
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 40,
      textAlign: 'center',
  },

  sonju: {
      width: 180,
      height: 281,
  },

  /* 글씨 크기 선택 */
  selectorContainer: {
      width: width - 100,
      height: 120,
      justifyContent: 'flex-start',
      alignItems: 'center',
  },

  labelsRow: {
      width: '100%',
      height: 40,
      position: 'relative',
      marginBottom: 20,
  },

  labelWrapper: {
      position: 'absolute',
      width: 40,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 40,
  },

  label: {
      fontFamily: 'Pretendard-Medium',
      fontWeight: '600',
      color: '#000',
  },

  circlesRow: {
      width: '100%',
      height: 40,
      position: 'relative',
      justifyContent: 'center',
  },

  line: {
      position: 'absolute',
      width: '100%',
      height: 4,
      backgroundColor: '#E0E0E0',
      borderRadius: 2,
      top: '50%',
      marginTop: -2,
  },

  circleWrapper: {
      position: 'absolute',
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
  },

  circle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#D0D0D0',
      justifyContent: 'center',
      alignItems: 'center',
  },

  circleSelected: {
      backgroundColor: '#02BFDC',
  },

  innerCircle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
  },

// 성격 선택 섹션
characterSection: {
  marginTop: 10,
  paddingHorizontal: 20,
},

sectionTitle: {
  fontFamily: 'Pretendard-Bold',
  fontSize: 18,
  color: '#222',
  marginBottom: 12,
},

optionsContainer: {
  gap: 12, // RN 0.71+ 지원. 안 되면 아래 참고(대체)
},

optionButton: {
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '#E9ECEF',
  backgroundColor: '#FFFFFF',
},

optionButtonSelected: {
  borderColor: '#02BFDC',
  backgroundColor: 'rgba(2, 191, 220, 0.08)', // 살짝만
},

optionText: {
  fontFamily: 'Pretendard-Bold',
  fontSize: 16,
  color: '#222',
},

optionTextSelected: {
  color: '#02BFDC',
},

optionDescription: {
  marginTop: 6,
  fontFamily: 'Pretendard-Regular',
  fontSize: 16,
  color: '#6B7280',
  lineHeight: 18,
},

optionDescriptionSelected: {
  color: '#0891B2', // 선택 시 조금 진하게
},

premiumBadge: {
  marginLeft: 8,
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 999,
  backgroundColor: '#FFE3E3',
},
premiumBadgeText: {
  fontSize: 16,
  fontFamily: 'Pretendard-Bold',
  color: '#FF4D4F',
},

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: 20,
    },

    optionDescription: {
      fontSize: 16,
      color: '#6C757D',
      marginTop: 4,
      textAlign: 'center',
    },

    optionDescriptionSelected: {
      color: '#02BFDC',
    },
});