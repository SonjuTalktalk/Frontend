// src/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { chatAPI, ChatListItem, SendMessageResponse, TodoMeta, BulkDeleteResponse } from '../services/chatService';
import { Personality } from '../types/ai';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chat_num?: number;
}

export interface Chat {
  chat_list_num: number;
  messages: Message[];
}

interface ChatContextType {
  currentChat: Chat | null;
  chatLists: ChatListItem[];
  currentPrompt: Personality;
  currentTodoMeta: TodoMeta | null;
  sendMessageToAI: (message: string, chatListNum?: number, enableTTS?: boolean) => Promise<SendMessageResponse>;
  loadChatLists: () => Promise<void>;
  loadChatMessages: (chatListNum: number) => Promise<void>;
  deleteChatLists: (listNos: number[]) => Promise<BulkDeleteResponse>;
  clearChat: () => void;
  setCurrentPrompt: (prompt: Personality) => void;
  setCurrentTodoMeta: (meta: TodoMeta | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chatLists, setChatLists] = useState<ChatListItem[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<Personality>(Personality.FRIENDLY);
  const [currentTodoMeta, setCurrentTodoMeta] = useState<TodoMeta | null>(null);

  /**
   * 메시지 전송 및 AI 응답 받기
   */
  const sendMessageToAI = async (
    message: string,
    chatListNum?: number,
    enableTTS: boolean = false
  ): Promise<SendMessageResponse> => {
    try {
      console.log('🚀 [sendMessageToAI] 메시지 전송 시작');
      console.log('  📝 message:', message);
      console.log('  🔢 chatListNum:', chatListNum);
      
      // 사용자 메시지를 즉시 UI에 추가
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      // 현재 채팅이 있으면 메시지 추가, 없으면 새 채팅 생성
      if (currentChat) {
        setCurrentChat({
          ...currentChat,
          messages: [...currentChat.messages, userMessage],
        });
      } else {
        setCurrentChat({
          chat_list_num: chatListNum || 0,
          messages: [userMessage],
        });
      }

      // API 호출
      const response = await chatAPI.sendMessage({
        message,
        chat_list_num: chatListNum,
      });

      console.log('✅ [sendMessageToAI] API 응답 받음');
      console.log('  📨 전체 응답:', JSON.stringify(response, null, 2));
      console.log('  🤖 AI 메시지:', response.ai.message);
      console.log('  📋 Todo 정보:');
      console.log('    - has_todo:', response.todo.has_todo);
      console.log('    - step:', response.todo.step);
      console.log('    - task:', response.todo.task);
      console.log('    - date:', response.todo.date);
      console.log('    - time:', response.todo.time);
      console.log('    - todo_num:', response.todo.todo_num);

      // AI 응답을 UI에 추가
      const aiMessage: Message = {
        id: `ai-${response.ai.chat_num}`,
        role: 'assistant',
        content: response.ai.message,
        timestamp: new Date(`${response.ai.chat_date}T${response.ai.chat_time}`),
        chat_num: response.ai.chat_num,
      };

      setCurrentChat((prev) => ({
        chat_list_num: response.ai.chat_list_num,
        messages: prev ? [...prev.messages, aiMessage] : [userMessage, aiMessage],
      }));

      // Todo 메타 정보 업데이트 (완전히 새로운 객체로 교체)
      console.log('💾 [sendMessageToAI] Todo 메타 정보 업데이트');
      
      // step이 'none', 'cancelled', 또는 'saved'이면 null로 설정
      if (response.todo.step === 'none' || response.todo.step === 'cancelled') {
        console.log('  ⚠️ Todo step이 none/cancelled - 메타 정보 초기화');
        setCurrentTodoMeta(null);
      } else if (response.todo.step === 'saved') {
        console.log('  ✅ Todo 저장 완료 - 메타 정보 설정 후 초기화 예약');
        // saved step일 때는 일단 설정 (알림을 위해)
        setCurrentTodoMeta({
          has_todo: response.todo.has_todo,
          step: response.todo.step,
          task: response.todo.task,
          date: response.todo.date,
          time: response.todo.time,
          todo_num: response.todo.todo_num,
        });
        // 3초 후 자동으로 초기화하여 다음 Todo를 받을 준비
        setTimeout(() => {
          console.log('  🔄 Todo 메타 자동 초기화 (saved 완료 후)');
          setCurrentTodoMeta(null);
        }, 3000);
      } else {
        console.log('  ✅ 새로운 Todo 메타 정보 설정:', response.todo);
        setCurrentTodoMeta({
          has_todo: response.todo.has_todo,
          step: response.todo.step,
          task: response.todo.task,
          date: response.todo.date,
          time: response.todo.time,
          todo_num: response.todo.todo_num,
        });
      }

      return response;
    } catch (error) {
      console.error('❌ [sendMessageToAI] 실패:', error);
      throw error;
    }
  };

  /**
   * 채팅방 목록 불러오기
   */
  const loadChatLists = async () => {
    try {
      const lists = await chatAPI.getChatLists();
      setChatLists(lists);
    } catch (error) {
      console.error('Failed to load chat lists:', error);
      throw error;
    }
  };

  /**
   * 특정 채팅방의 모든 메시지 불러오기
   */
  const loadChatMessages = async (chatListNum: number) => {
    try {
      const messages = await chatAPI.getChatMessages(chatListNum);
      
      // API 응답을 Message 형식으로 변환
      const formattedMessages: Message[] = messages.map((msg) => ({
        id: `msg-${msg.chat_num}`,
        role: msg.chat_num % 2 === 0 ? 'assistant' : 'user', // 임시: 실제로는 role 필드 필요
        content: msg.message,
        timestamp: new Date(), // 임시: 실제로는 chat_date, chat_time 필요
        chat_num: msg.chat_num,
      }));

      setCurrentChat({
        chat_list_num: chatListNum,
        messages: formattedMessages,
      });
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      throw error;
    }
  };

  /**
   * 여러 채팅방 삭제
   */
  const deleteChatLists = async (listNos: number[]): Promise<BulkDeleteResponse> => {
    try {
      const response = await chatAPI.bulkDeleteChats({ list_no: listNos });
      
      // 삭제된 채팅방을 목록에서 제거
      setChatLists((prev) =>
        prev.filter((chat) => !response.deleted_lists.includes(chat.chat_list_num))
      );

      return response;
    } catch (error) {
      console.error('Failed to delete chat lists:', error);
      throw error;
    }
  };

  /**
   * 현재 채팅 초기화 (새 채팅 시작)
   */
  const clearChat = () => {
    setCurrentChat(null);
    setCurrentTodoMeta(null);
  };

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        chatLists,
        currentPrompt,
        currentTodoMeta,
        sendMessageToAI,
        loadChatLists,
        loadChatMessages,
        deleteChatLists,
        clearChat,
        setCurrentPrompt,
        setCurrentTodoMeta,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used with빨in ChatProvider');
  }
  return context;
};

