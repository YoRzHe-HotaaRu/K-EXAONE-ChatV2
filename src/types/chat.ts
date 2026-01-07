// Chat message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning_content?: string;
  createdAt: Date;
  isStreaming?: boolean;
}

// Conversation type
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Chat API request
export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  conversationId?: string;
}

// Chat API response chunk (for streaming)
export interface ChatResponseChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    finish_reason: string | null;
  }>;
}

// Chat store state
export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  error: string | null;
}

// Chat store actions
export interface ChatActions {
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => string;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  setStreaming: (isStreaming: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

// Theme type
export type Theme = 'light' | 'dark';

// Theme store
export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
