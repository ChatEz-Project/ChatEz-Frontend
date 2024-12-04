import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../../backend/types';

type FriendAction = 'added' | 'removed' | '';
type MessageStatus = 'sent' | 'received' | 'none';

interface ChatContextType {
  selectedUser: User | undefined;
  setSelectedUser: (user: User | undefined) => void;
  isLoadingMessages: boolean;
  setIsLoadingMessages: (isLoading: boolean) => void;
  friendActionStatus: {
    isVisible: boolean;
    action: FriendAction;
    username: string;
  };
  setFriendActionStatus: (status: {
    isVisible: boolean;
    action: FriendAction;
    username: string;
  }) => void;
  messageStatus: MessageStatus;
  setMessageStatus: (status: MessageStatus) => void;
  hasNewMessage: boolean;
  setHasNewMessage: (hasNew: boolean) => void;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: ChatProviderProps): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [friendActionStatus, setFriendActionStatus] = useState({
    isVisible: false,
    action: '' as FriendAction,
    username: '',
  });
  const [messageStatus, setMessageStatus] = useState<MessageStatus>('none');
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const value: ChatContextType = {
    selectedUser,
    setSelectedUser,
    isLoadingMessages,
    setIsLoadingMessages,
    friendActionStatus,
    setFriendActionStatus,
    messageStatus,
    setMessageStatus,
    hasNewMessage,
    setHasNewMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
