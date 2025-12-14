// src/types/chat.ts
import { Personality } from './ai';

export type PromptType = Personality;

/**
 * 채팅방 타입
 */
export interface Chat {
  id: string;
  title: string;
  date: Date;
  lastMessage: string;
}

/**
 * 메시지 발신자 타입
 */
export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

/**
 * 채팅 메시지 타입
 */
export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}