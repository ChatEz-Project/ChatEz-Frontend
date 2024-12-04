import React, { useEffect, useState } from 'react';
import ChatFeed from './Components/ChatFeed/ChatFeed';
import { useAuth } from '../../contexts/authContext';
import { useChat } from '../../contexts/chatContext';
import { getUser } from '../../backend/endpoints';
import io from 'socket.io-client';

interface UserStatusEvent {
  userId: string;
}

const ChatPage: React.FC = () => {
  const { currentUser, currentUserAccessToken } = useAuth();
  const { selectedUser, setMessageStatus, setHasNewMessage, messageStatus } =
    useChat();
  const [userId, setUserId] = useState<string>();
  const [selectedFriendId, setSelectedFriendId] = useState<string>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const getIds = async () => {
      try {
        if (currentUser && currentUserAccessToken) {
          // Get user ID
          const user = await getUser(currentUserAccessToken, currentUser.email);
          setUserId(user._id);
          //console.log('User ID set:', user._id);

          // Get friend ID if selectedUser exists
          if (selectedUser) {
            const selectedFriend = await getUser(
              currentUserAccessToken,
              selectedUser.email
            );
            setSelectedFriendId(selectedFriend._id);
            //console.log('Friend ID set:', selectedFriend._id);
          }
        }
      } catch (error) {
        console.error('Error getting IDs:', error);
      }
    };
    getIds();
  }, [currentUser, currentUserAccessToken, selectedUser]);

  // Separate useEffect to log state changes
  // useEffect(() => {
  //   console.log('User ID: ', userId, ' SelectedUserId: ', selectedFriendId);
  // }, [userId, selectedFriendId]);

  // Socket connection
  useEffect(() => {
    if (!userId || !selectedFriendId) return;

    console.log('Attempting socket connection...');
    const socket = io('http://localhost:8080', {
      transportOptions: {
        polling: {
          extraHeaders: {
            user: userId,
            friend: selectedFriendId,
          },
        },
      },
    });

    setSocket(socket);

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to socket server');
      console.log('Current user email:', currentUser?.email);
      console.log('Friend email:', selectedUser?.email);
    });

    socket.on('connect_error', (error: { message: any }) => {
      console.log('Socket connection error:', error.message);
    });

    // Chat room events
    socket.on('user_online', ({ userId: onlineUserId }: UserStatusEvent) => {
      const userEmail =
        onlineUserId === userId ? currentUser?.email : selectedUser?.email;
      console.log(`${userEmail} is online`);
    });

    socket.on('user_offline', ({ userId: offlineUserId }: UserStatusEvent) => {
      const userEmail =
        offlineUserId === userId ? currentUser?.email : selectedUser?.email;
      console.log(`${userEmail} is offline`);
    });

    socket.on('message_received', () => {
      console.log('New message in chat');
      setMessageStatus('received');
      setHasNewMessage(true);
    });

    // Cleanup on unmount or when users change
    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
      setMessageStatus('none');
      setHasNewMessage(false);
    };
  }, [
    userId,
    selectedFriendId,
    currentUser?.email,
    selectedUser?.email,
    setMessageStatus,
    setHasNewMessage,
  ]);

  useEffect(() => {
    if (messageStatus === 'sent' && socket) {
      socket.emit('message_sent');
      setMessageStatus('none');
    }
  }, [messageStatus, setMessageStatus, socket]);

  return <ChatFeed />;
};

export default ChatPage;
