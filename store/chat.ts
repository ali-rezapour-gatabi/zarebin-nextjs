import { create } from 'zustand';

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
};

type ChatState = {
  conversations: Conversation[];
  isLoading: boolean;
};

export type ChatStore = ChatState;

export const useChatStore = create<ChatStore>(() => ({
  conversations: [],
  messages: [],
  isLoading: false,
}));
