import React, { useEffect } from 'react';
import ChatFeed from './Components/ChatFeed/ChatFeed';
import { useAuth } from '../../contexts/authContext';
import { getFriendMessages } from '../../backend/endpoints.utils';

const HomePage: React.FC = () => {
  return (
    <div>
      <ChatFeed />
    </div>
  );
};

export default HomePage;
