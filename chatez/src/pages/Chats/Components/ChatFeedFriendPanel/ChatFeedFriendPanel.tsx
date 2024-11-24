import { Settings } from '@mui/icons-material';
import './ChatFeedFriendPanel.css';
import { IconButton } from '@mui/material';
import { useAuth } from '../../../../contexts/authContext';
import { useEffect, useState, useCallback } from 'react';
import { addFriend, getFriends, getUser } from '../../../../backend/endpoints';
import { Message, User } from '../../../../backend/types';
import { useChat } from '../../../../contexts/chatContext';
import { doSignOut } from '../../../../firebase/auth';
import { useHistory } from 'react-router-dom';
import { getFriendLatestMessage } from '../../../../backend/endpoints.utils';
import { searchedFriends } from './ChatFeedFriendPanel.utils';
import SearchAndAddFriend from './SearchAndAddFriend/SearchAndAddFriend';

interface ChatFeedFriendPanelProps {
  className?: string;
}

const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

const getPhotoFromCache = (email: string): string | null => {
  const cached = localStorage.getItem(`profile-${email}`);
  if (!cached) return null;

  const data = JSON.parse(cached);
  if (Date.now() - data.timestamp > CACHE_MAX_AGE) {
    localStorage.removeItem(`profile-${email}`);
    return null;
  }

  return data.url;
};

const setPhotoInCache = (email: string, url: string) => {
  const cacheData = {
    url,
    timestamp: Date.now(),
  };
  localStorage.setItem(`profile-${email}`, JSON.stringify(cacheData));
};

const cleanupCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('profile-')) {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      if (Date.now() - data.timestamp > CACHE_MAX_AGE) {
        localStorage.removeItem(key);
      }
    }
  });
};

const ChatFeedFriendPanel: React.FC<ChatFeedFriendPanelProps> = ({
  className,
}) => {
  const history = useHistory();
  const { currentUserAccessToken, currentUser } = useAuth();
  const { setCurrentFriend, currentFriend, loadMessages, setLoadMessages } =
    useChat();

  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [originalFriendsList, setOriginalFriendsList] = useState<User[]>([]);
  const [displayedFriends, setDisplayedFriends] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [latestMessages, setLatestMessages] = useState<{
    [email: string]: Message | null;
  }>({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [friendPhotos, setFriendPhotos] = useState<{ [email: string]: string }>(
    {}
  );

  const loadUserPhoto = useCallback(
    async (email: string | undefined) => {
      if (!email) return;

      const cached = getPhotoFromCache(email);
      if (cached) {
        setFriendPhotos((prev) => ({ ...prev, [email]: cached }));
        return;
      }

      if (currentUserAccessToken) {
        try {
          const user = await getUser(currentUserAccessToken, email);
          if (user.photoUrl) {
            setPhotoInCache(email, user.photoUrl);
            setFriendPhotos((prev) => ({ ...prev, [email]: user.photoUrl }));
          }
        } catch (error) {
          console.error('Failed to load photo for:', email, error);
        }
      }
    },
    [currentUserAccessToken]
  );

  const fetchProfileAndFriends = useCallback(async () => {
    if (!currentUser?.email || !currentUserAccessToken) return;

    try {
      const user = await getUser(currentUserAccessToken, currentUser.email);
      setUserDisplayName(user.displayName);
      const friends = await getFriends(currentUserAccessToken);
      setOriginalFriendsList(friends);
      setDisplayedFriends(friends);

      friends.forEach((friend) => {
        loadUserPhoto(friend.email);
      });

      if (currentUser.email) {
        loadUserPhoto(currentUser.email);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [currentUser?.email, currentUserAccessToken, loadUserPhoto]);

  useEffect(() => {
    fetchProfileAndFriends();
    cleanupCache();
  }, [fetchProfileAndFriends]);

  const loadLatestMessages = useCallback(async () => {
    if (
      !originalFriendsList.length ||
      !currentUserAccessToken ||
      !currentUser ||
      isLoadingMessages
    )
      return;

    setIsLoadingMessages(true);
    try {
      const messages: { [email: string]: Message | null } = {};
      await Promise.all(
        originalFriendsList.map(async (friend) => {
          try {
            const message = await getFriendLatestMessage(
              currentUserAccessToken,
              friend.email,
              currentUser.email
            );
            messages[friend.email] = message;
          } catch (error) {
            console.error(`Error loading message for ${friend.email}:`, error);
            messages[friend.email] = null;
          }
        })
      );
      setLatestMessages(messages);
      latestMessages ?? console.log(latestMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
      setLoadMessages(false);
    }
  }, [
    originalFriendsList,
    currentUserAccessToken,
    currentUser,
    isLoadingMessages,
    latestMessages,
    setLoadMessages,
  ]);

  useEffect(() => {
    if (originalFriendsList.length && !currentFriend) {
      setCurrentFriend(originalFriendsList[0]);
    }
  }, [originalFriendsList, currentFriend, setCurrentFriend]);

  useEffect(() => {
    if (loadMessages) {
      loadLatestMessages();
    }
  }, [loadMessages, loadLatestMessages]);

  const handleSearch = useCallback(
    (newSearchValue: string) => {
      setSearchValue(newSearchValue);
      setDisplayedFriends(searchedFriends(newSearchValue, originalFriendsList));
    },
    [originalFriendsList]
  );

  const handleLogout = () => {
    doSignOut();
    history.push('/');
  };

  const getLastMessageTime = useCallback((messageDate: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const lastActive = new Date(messageDate);

    if (today.toDateString() === lastActive.toDateString()) {
      return lastActive.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    if (yesterday.toDateString() === lastActive.toDateString()) {
      return 'Yesterday';
    }

    return lastActive.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const handleAddFriendCallback = async (email: string) => {
    if (currentUserAccessToken) {
      await addFriend(currentUserAccessToken, email);
      await fetchProfileAndFriends();
    }
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
          src={friendPhotos[currentUser?.email || ''] || undefined}
          alt="Display icon"
        />
        {userDisplayName}
      </h3>
      <hr />

      <SearchAndAddFriend
        currentUserEmail={currentUser?.email}
        onSearch={handleSearch}
        onAddFriend={handleAddFriendCallback}
        searchValue={searchValue}
      />

      <div className="messages-container">
        {displayedFriends.map((friend) => (
          <button
            id="message-button"
            key={friend.email}
            className={
              currentFriend?.email === friend.email ? 'selected-friend' : ''
            }
            onClick={() => setCurrentFriend(friend)}
          >
            <div className="profile-pic-container">
              <img
                id="ProfilePic-icon"
                src={friendPhotos[friend.email] || friend.photoUrl}
                alt="Profile icon"
              />
            </div>
            <div className="message-content">
              <div className="message-header">
                <p id="username">{friend.displayName}</p>
                <span className="timestamp">
                  {getLastMessageTime(
                    latestMessages[friend.email]?.dateSent
                      ? new Date(latestMessages[friend.email]!.dateSent)
                      : new Date()
                  )}
                </span>
              </div>
              <p className="message-text">
                {isLoadingMessages
                  ? 'Loading...'
                  : latestMessages[friend.email]?.message || 'No messages'}
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
          <IconButton onClick={() => console.log('Settings opened!')}>
            <Settings id="Settings-button" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatFeedFriendPanel;
