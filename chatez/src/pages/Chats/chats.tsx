import React, { useEffect } from 'react';
import ChatFeed from './Components/ChatFeed/ChatFeed';
import { useAuth } from '../../contexts/authContext';
import { getUser } from '../../api/endpoints';

const HomePage: React.FC = () => {
  const { currentUserAccessToken, userLoggedIn } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (userLoggedIn && currentUserAccessToken) {
          console.log(currentUserAccessToken);
          const messages = await getUser(
            currentUserAccessToken,
            'arehman000935@gmail.com'
          );
          console.log(messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [userLoggedIn, currentUserAccessToken]);

  return (
    <div>
      <ChatFeed />
    </div>
  );
};

export default HomePage;
