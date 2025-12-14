// src/components/chat/ChatBubble.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScaledText from '../ScaledText';
import { ChatMessage } from '@/contexts/ChatContext';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userBubble}>
          <ScaledText style={styles.userText} fontSize={20}>
            {message.content}
          </ScaledText>
        </View>
        <ScaledText fontSize={12} style={styles.userTimestamp}>
          {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </ScaledText>
      </View>
    );
  }

  return (
    <View style={styles.assistantContainer}>
      <View style={styles.avatarPlaceholder} />
      <View style={styles.assistantBubble}>
        <ScaledText style={styles.assistantText} fontSize={20}>
          {message.content}
        </ScaledText>
      </View>
      <ScaledText fontSize={12} style={styles.assistantTimestamp}>
        {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
      </ScaledText>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userBubble: {
    backgroundColor: '#02BFDC',
    borderRadius: 20,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    lineHeight: 28,
    color: '#FFFFFF',
  },
  userTimestamp: {
    color: '#7A9CA5',
    marginTop: 4,
  },
  assistantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A5BCC3',
    marginRight: 12,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  assistantText: {
    lineHeight: 28,
    color: '#2D4550',
  },
  assistantTimestamp: {
    color: '#7A9CA5',
    marginTop: 4,
    marginLeft: 60,
  },
});

export default ChatBubble;