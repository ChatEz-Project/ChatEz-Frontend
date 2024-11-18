import React from 'react';
import { ChatProvider } from '../../contexts/chatContext';
import ChatFeed from './Components/ChatFeed/ChatFeed';

const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatFeed />
    </ChatProvider>
  );
};

export default ChatPage;
