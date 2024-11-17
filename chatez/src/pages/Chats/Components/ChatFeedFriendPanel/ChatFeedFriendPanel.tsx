import { AddCircleOutline, Settings } from '@mui/icons-material';
import './ChatFeedFriendPanel.css';
import { IconButton } from '@mui/material';
import { useAuth } from '../../../../contexts/authContext';
import { useEffect, useState } from 'react';
import userEvent from '@testing-library/user-event';
import { getFriends, getUser } from '../../../../backend/endpoints';
import { User } from '../../../../backend/types';
import { useChat } from '../../../../contexts/chatContext';
import { doSignOut } from '../../../../firebase/auth';
import { Redirect } from 'react-router-dom';
import { getFriendLatestMessage } from '../../../../backend/endpoints.utils';

interface ChatFeedFriendPanelProps {
  className?: string;
}

const ChatFeedFriendPanel: React.FC<ChatFeedFriendPanelProps> = ({
  className,
}) => {
  const { currentUserAccessToken, currentUser } = useAuth();
  const [userProfileUrl, setUserProfileUrl] = useState<string | null>();
  const [userDisplayName, setUserDisplayName] = useState<string | null>();
  const [friendsList, setFriendsList] = useState<User[]>();
  const { setCurrentFriend, currentFriend, loadMessages, setLoadMessages } =
    useChat();
  const [latestMessages, setLatestMessages] = useState<{
    [email: string]: string;
  }>({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch user profile and friends list
  useEffect(() => {
    const fetchProfileUrl = async () => {
      if (currentUser && currentUserAccessToken) {
        try {
          const user = await getUser(currentUserAccessToken, currentUser.email);
          setUserProfileUrl(user.photoUrl);
          setUserDisplayName(user.displayName);
          const friends = await getFriends(currentUserAccessToken);
          setFriendsList(friends);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchProfileUrl();
  }, [currentUser, currentUserAccessToken]);

  // Set default current friend if none selected
  useEffect(() => {
    if (friendsList?.length && !currentFriend) {
      setCurrentFriend(friendsList[0]);
    }
  }, [friendsList, currentFriend, setCurrentFriend]);

  // Handle message loading
  useEffect(() => {
    const loadLatestMessages = async () => {
      if (
        !friendsList ||
        !currentUserAccessToken ||
        !currentUser ||
        isLoadingMessages
      ) {
        return;
      }

      setIsLoadingMessages(true);
      try {
        const messages: { [email: string]: string } = {};
        await Promise.all(
          friendsList.map(async (friend) => {
            const message = await getFriendLatestMessage(
              currentUserAccessToken,
              friend.email,
              currentUser.email
            );
            messages[friend.email] = message || '';
          })
        );
        setLatestMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoadingMessages(false);
        setLoadMessages(false);
      }
    };

    if (loadMessages) {
      loadLatestMessages();
    }
  }, [
    loadMessages,
    friendsList,
    currentUserAccessToken,
    currentUser,
    setLoadMessages,
    isLoadingMessages,
  ]);

  const openSettings = () => {
    console.log('Settings opened!');
  };

  const addFriend = () => {
    console.log('Add friend box opened!');
  };

  const handleLogout = () => {
    doSignOut();
    return <Redirect to="/" />;
  };

  return (
    <div
      className={
        className ? `ChatFeedFriendPanel ${className}` : 'ChatFeedFriendPanel'
      }
    >
      <h3>
        <img
          id="Profile-icon"
          src={userProfileUrl ? userProfileUrl : undefined}
          alt="Display icon"
        />
        {userDisplayName}
      </h3>
      <hr />

      <div className="Top-section">
        <input id="SearchUser-input" placeholder="Search user..." />
        <IconButton onClick={addFriend}>
          <AddCircleOutline id="AddFriends-button" />
        </IconButton>
      </div>

      <div className="messages-container">
        {friendsList &&
          friendsList.map((friend, index) => (
            <button
              id="message-button"
              key={index}
              className={
                currentFriend?.email === friend.email ? 'selected-friend' : ''
              }
              onClick={() => {
                setCurrentFriend(friend);
              }}
            >
              <div className="profile-pic-container">
                <img
                  id="ProfilePic-icon"
                  src={friend.photoUrl}
                  alt="Profile icon"
                />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <p id="username">{friend.displayName}</p>
                  <span className="timestamp">
                    {(() => {
                      const today = new Date();
                      const lastActive = new Date(friend.lastActive);

                      // Compare if the dates are the same (ignoring time)
                      if (today.toDateString() === lastActive.toDateString()) {
                        // If same date, show time
                        return lastActive.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        });
                      } else {
                        // If different date, show date
                        return lastActive.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });
                      }
                    })()}
                  </span>
                </div>
                <p className="message-text">
                  {isLoadingMessages
                    ? 'Loading...'
                    : latestMessages[friend.email] || 'No messages'}
                </p>
              </div>
            </button>
          ))}
      </div>

      <div>
        <hr />
        <div className="Bottom-section">
          <button id="Logout-button" onClick={handleLogout}>
            Logout
          </button>
          <IconButton onClick={openSettings}>
            <Settings id="Settings-button" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatFeedFriendPanel;
