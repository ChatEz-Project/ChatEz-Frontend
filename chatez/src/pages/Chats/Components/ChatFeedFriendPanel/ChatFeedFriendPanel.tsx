import { AddCircleOutline, Settings } from '@mui/icons-material';
import './ChatFeedFriendPanel.css';
import { IconButton } from '@mui/material';
import { useAuth } from '../../../../contexts/authContext';
import { useEffect, useState, useCallback } from 'react';
import { getFriends, getUser } from '../../../../backend/endpoints';
import { User } from '../../../../backend/types';
import { useChat } from '../../../../contexts/chatContext';
import { doSignOut } from '../../../../firebase/auth';
import { useHistory } from 'react-router-dom';
import { getFriendLatestMessage } from '../../../../backend/endpoints.utils';
import { searchedFriends } from './ChatFeedFriendPanel.utils';

interface ChatFeedFriendPanelProps {
  className?: string;
}

/**
 * ChatFeedFriendPanel component displays a list of friends with their latest messages
 * and provides search, messaging, and profile management functionality.
 */
const ChatFeedFriendPanel: React.FC<ChatFeedFriendPanelProps> = ({
  className,
}) => {
  const history = useHistory();
  const { currentUserAccessToken, currentUser } = useAuth();
  const { setCurrentFriend, currentFriend, loadMessages, setLoadMessages } =
    useChat();

  // User and friends state
  const [userProfileUrl, setUserProfileUrl] = useState<string>('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [originalFriendsList, setOriginalFriendsList] = useState<User[]>([]);
  const [displayedFriends, setDisplayedFriends] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [latestMessages, setLatestMessages] = useState<{
    [email: string]: string;
  }>({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  /**
   * Fetches user profile and friends list from the backend
   * Updates local state with user information and friends list
   */
  const fetchProfileAndFriends = useCallback(async () => {
    if (!currentUser || !currentUserAccessToken) return;

    try {
      const user = await getUser(currentUserAccessToken, currentUser.email);
      setUserProfileUrl(user.photoUrl);
      setUserDisplayName(user.displayName);
      const friends = await getFriends(currentUserAccessToken);
      setOriginalFriendsList(friends);
      setDisplayedFriends(friends);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [currentUser, currentUserAccessToken]);

  /**
   * Retrieves the latest message for each friend in the friends list
   * Updates latestMessages state with the retrieved messages
   */
  const loadLatestMessages = useCallback(async () => {
    if (
      !originalFriendsList.length ||
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
        originalFriendsList.map(async (friend) => {
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
  }, [
    currentUser,
    currentUserAccessToken,
    originalFriendsList,
    isLoadingMessages,
    setLoadMessages,
  ]);

  // Initialize profile and friends data
  useEffect(() => {
    fetchProfileAndFriends();
  }, [fetchProfileAndFriends]);

  // Set default friend when list is loaded
  useEffect(() => {
    if (originalFriendsList.length && !currentFriend) {
      setCurrentFriend(originalFriendsList[0]);
    }
  }, [originalFriendsList, currentFriend, setCurrentFriend]);

  // Load messages when triggered
  useEffect(() => {
    if (loadMessages) {
      loadLatestMessages();
    }
  }, [loadMessages, loadLatestMessages]);

  /**
   * Updates search results as user types
   */
  const handleSearch = useCallback(
    (newSearchValue: string) => {
      setSearchValue(newSearchValue);
      setDisplayedFriends(searchedFriends(newSearchValue, originalFriendsList));
    },
    [originalFriendsList]
  );

  /**
   * Handles user logout and redirects to home page
   */
  const handleLogout = () => {
    doSignOut();
    history.push('/');
  };

  /**
   * Formats the last active time/date for a friend
   * Returns time for today's activity, date for previous days
   */
  const getLastActive = useCallback((friend: User) => {
    const today = new Date();
    const lastActive = new Date(friend.lastActive);

    if (today.toDateString() === lastActive.toDateString()) {
      return lastActive.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
    return lastActive.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <div
      className={
        className ? `ChatFeedFriendPanel ${className}` : 'ChatFeedFriendPanel'
      }
    >
      {/* User Profile Header */}
      <h3>
        <img
          id="Profile-icon"
          src={userProfileUrl || undefined}
          alt="Display icon"
        />
        {userDisplayName}
      </h3>
      <hr />

      {/* Search and Add Friend Section */}
      <div className="Top-section">
        <input
          id="SearchUser-input"
          placeholder="Search user..."
          onChange={(e) => handleSearch(e.target.value)}
          value={searchValue}
        />
        <IconButton onClick={() => console.log('Add friend box opened!')}>
          <AddCircleOutline id="AddFriends-button" />
        </IconButton>
      </div>

      {/* Friends List */}
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
                src={friend.photoUrl}
                alt="Profile icon"
              />
            </div>
            <div className="message-content">
              <div className="message-header">
                <p id="username">{friend.displayName}</p>
                <span className="timestamp">{getLastActive(friend)}</span>
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

      {/* Footer Controls */}
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
