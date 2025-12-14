// src/services/chatService.ts
import { apiClient } from '../api/config';
import { Personality } from '../types/ai';

export interface ChatListItem {
  chat_list_num: number;
  last_date: string;
  last_message: string;
}

export interface ChatMessage {
  chat_list_num: number;
  chat_num: number;
  message: string;
}

export interface SendMessageRequest {
  message: string;
  chat_list_num?: number;
}

export interface TodoMeta {
  has_todo: boolean;
  step: 'suggest' | 'ask_confirm' | 'ask_date' | 'saved' | 'cancelled' | 'none';
  task?: string;
  date?: string;
  time?: string;
  todo_num?: number;
}

export interface SendMessageResponse {
  ai: {
    chat_list_num: number;
    chat_num: number;
    message: string;
    tts_path: string;
    chat_date: string;
    chat_time: string;
  };
  todo: TodoMeta;
}

export interface BulkDeleteRequest {
  list_no: number[];
}

export interface BulkDeleteResponse {
  deleted_count: number;
  deleted_lists: number[];
  not_found: number[];
}

export const chatAPI = {
  /**
   * 채팅방 목록 조회
   */
  getChatLists: async (): Promise<ChatListItem[]> => {
    const response = await apiClient.get<ChatListItem[]>('/chats/lists');
    return response.data;
  },

  /**
   * 특정 채팅방의 모든 메시지 조회
   */
  getChatMessages: async (listNo: number): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(`/chats/messages/${listNo}`);
    return response.data;
  },

  /**
   * 메시지 전송 및 AI 응답 받기
   */
  sendMessage: async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>('/chats/messages', request);
    return response.data;
  },

  /**
   * 여러 채팅방 일괄 삭제
   */
  bulkDeleteChats: async (request: BulkDeleteRequest): Promise<BulkDeleteResponse> => {
    const response = await apiClient.post<BulkDeleteResponse>('/chats/bulk-delete', request);
    return response.data;
  },
};