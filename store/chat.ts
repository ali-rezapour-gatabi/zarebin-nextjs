import { create } from 'zustand';

export type Conversation = {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  message?: string;
  analysis?: string;
  createdAt: string;
};

type ChatState = {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversation: string | null;
  setCurrentConversation: (id: string | null) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  message: string;
  setMessage: (message: string) => void;
  exprtsList: [];
  setExprtsList: (exprtsList: []) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
};

export type ChatStore = ChatState;

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  message: '',
  exprtsList: [],
  isLoading: false,
  setConversations: (conversations: Conversation[]) => set({ conversations }),
  setCurrentConversation: (id: string | null) => set({ currentConversation: id }),
  setMessages: (messages: ChatMessage[]) => set({ messages }),
  addMessage: (message: ChatMessage) => set((state) => ({ messages: [...state.messages, message] })),
  setExprtsList: (exprtsList: []) => set({ exprtsList }),
  setMessage: (message: string) => set({ message }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
