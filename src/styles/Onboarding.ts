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

  /* 성격 정하기 - 개선된 스타일 */
  characterSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  sectionTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },

  optionsContainer: {
    gap: 12,
  },

  optionButton: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  optionButtonSelected: {
    backgroundColor: '#E8F9FC',
    borderColor: '#02BFDC',
    shadowColor: '#02BFDC',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  optionText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },

  optionTextSelected: {
    color: '#02BFDC',
    fontFamily: 'Pretendard-Bold',
  },

  optionDescription: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    color: '#868E96',
    lineHeight: 18,
  },

  optionDescriptionSelected: {
    color: '#4DB8D0',
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
});