import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  isStreaming?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type ChatState = {
  conversations: Conversation[];
  messages: ChatMessage[];
  currentConversationId: string | null;
  isLoading: boolean;
};

type ChatActions = {
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
};

export type ChatStore = ChatState & ChatActions;

const getNow = () => new Date().toISOString();

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  messages: [],
  currentConversationId: null,
  isLoading: false,
  isSidebarOpen: false,
  theme: 'light',

  startNewConversation: () => {
    const id = nanoid();
    const now = getNow();

    const conversation: Conversation = {
      id,
      title: 'New chat',
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      conversations: [conversation, ...state.conversations],
      currentConversationId: id,
      messages: [],
    }));
  },

  selectConversation: (id) => {
    const found = get().conversations.find((c) => c.id === id);
    if (!found) return;

    set({ currentConversationId: id });
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return;

    let conversationId = get().currentConversationId;
    const now = getNow();

    if (!conversationId) {
      const id = nanoid();
      conversationId = id;

      set((state) => ({
        conversations: [
          {
            id,
            title: content.slice(0, 40) || 'New chat',
            createdAt: now,
            updatedAt: now,
          },
          ...state.conversations,
        ],
        currentConversationId: id,
      }));
    }

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content,
      createdAt: now,
    };

    const assistantPlaceholder: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      createdAt: now,
      isStreaming: true,
    };

    set((state) => ({
      isLoading: true,
      messages: [...state.messages, userMessage, assistantPlaceholder],
    }));

    try {
      const { default: axios } = await import('axios');

      const response = await axios.post('/api/chat', {
        message: content,
        conversationId,
      });

      const text = typeof response.data?.reply === 'string' ? response.data.reply : 'I generated a mock response for your message.';

      set((state) => ({
        messages: state.messages.map((m) => (m.id === assistantPlaceholder.id ? { ...m, content: text, isStreaming: false } : m)),
        conversations: state.conversations.map((c) => (c.id === conversationId ? { ...c, updatedAt: getNow(), title: state.messages[0]?.content || c.title } : c)),
        isLoading: false,
      }));
    } catch {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantPlaceholder.id
            ? {
                ...m,
                content: 'Sorry, something went wrong while generating a response.',
                isStreaming: false,
              }
            : m,
        ),
        isLoading: false,
      }));
    }
  },
}));
