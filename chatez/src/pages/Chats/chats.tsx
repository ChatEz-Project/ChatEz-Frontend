import React from 'react';
import { ChatProvider } from '../../contexts/chatContext';
import ChatFeed from './components/ChatFeed/ChatFeed';

const HomePage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatFeed />
    </ChatProvider>
  );
};

export default HomePage;
