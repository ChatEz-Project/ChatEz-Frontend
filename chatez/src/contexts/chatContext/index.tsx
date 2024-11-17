import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../../backend/types';

interface ChatContextType {
  currentFriend: User | undefined;
  setCurrentFriend: (user: User | undefined) => void;
  loadMessages: boolean;
  setLoadMessages: (user: boolean) => void;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: ChatProviderProps): JSX.Element {
  const [currentFriend, setCurrentFriend] = useState<User | undefined>();
  const [loadMessages, setLoadMessages] = useState<boolean>(true);

  const value: ChatContextType = {
    currentFriend,
    setCurrentFriend,
    loadMessages,
    setLoadMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
