import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ScaledText from '../ScaledText';

interface SuggestedQuestionProps {
  question: string;
  onClick: (question: string) => void;
}

const SuggestedQuestion: React.FC<SuggestedQuestionProps> = ({ question, onClick }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => onClick(question)}
      activeOpacity={0.7}
    >
      {/* 라벨: 중간 20 */}
      <ScaledText style={styles.text} fontSize={20}>
        {question}
      </ScaledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E8F7FA',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 20, // ScaledText가 20 기준으로 스케일 적용
    color: '#2D4550',
    textAlign: 'left',
  },
});

export default SuggestedQuestion;
