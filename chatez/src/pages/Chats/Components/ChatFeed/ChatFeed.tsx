import { IconButton } from '@mui/material';
import './ChatFeed.css';
import MenuIcon from '@mui/icons-material/Menu';
import { AttachFile, Image, Send } from '@mui/icons-material';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Message, User } from '../../../../backend/types';
import { sendMessage } from '../../../../backend/endpoints';
import { getFriendMessages } from '../../../../backend/endpoints.utils';
import { useAuth } from '../../../../contexts/authContext';

import { useChat } from '../../../../contexts/chatContext/index';
import ChatFeedFriendPanel from '../ChatFeedFriendPanel/ChatFeedFriendPanel';
import ChatFeedProfilePanel from '../ChatFeedProfilePanel/ChatFeedProfilePanel';
import { renderMessagesByDate } from './ChatFeed.utils';

/**
 * ChatFeed Component
 */
const ChatFeed: React.FC = () => {
  // Authentication and user context
  const { currentUserAccessToken, userLoggedIn, currentUser } = useAuth();
  currentUserAccessToken ?? console.log(currentUserAccessToken);
  const { currentFriend, loadMessages, setLoadMessages } = useChat();

  // Component state
  const [allMessages, setAllMessages] = useState<Message[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // UI state for collapsible panels
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(true);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (error) {
    console.log(error);
  }

  // get last active
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

  /**
   * Fetches messages between the current user and their friend
   * Handles loading states and error scenarios
   */
  const fetchMessages = useCallback(async () => {
    if (
      !userLoggedIn ||
      !currentUserAccessToken ||
      !currentUser ||
      !currentFriend
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const messages = await getFriendMessages(
        currentUserAccessToken,
        currentFriend.email,
        currentUser.email
      );
      setAllMessages(messages);
      setLoadMessages(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [
    currentUserAccessToken,
    currentUser,
    currentFriend,
    userLoggedIn,
    setLoadMessages,
  ]);

  // Load messages when component mounts or current friend changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, currentFriend]);

  // Refresh messages when loadMessages flag is set
  useEffect(() => {
    if (loadMessages) {
      fetchMessages();
    }
  }, [loadMessages, fetchMessages]);

  // Scroll to bottom auto when messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  /**
   * UI Event Handlers
   */
  const collapseRightPanel = () =>
    setIsRightPanelCollapsed(!isRightPanelCollapsed);
  const collapseLeftPanel = () =>
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  const insertImage = () => console.log('Image has been inserted');
  const attachFile = () => console.log('File has been attached');

  /**
   * Handles message submission
   * Validates input and triggers message refresh after successful send
   */
  const handleSubmit = async () => {
    if (!currentUserAccessToken || !currentFriend || !message.trim()) {
      return;
    }

    try {
      await sendMessage(currentUserAccessToken, currentFriend.email, message);
      setMessage('');
      fetchMessages();
      setLoadMessages(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  /**
   * Handles Enter key press for message submission
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="Chat-feed-container">
      {/* Friend List Panel */}
      <ChatFeedFriendPanel
        className={
          isLeftPanelCollapsed
            ? 'ChatFeedFriendPanel'
            : 'ChatFeedFriendPanel-Collapsed'
        }
      />

      <div className="Chat-feed">
        {/* Chat Header */}
        <div className="Top-panel">
          <IconButton id="CollapseLeftPanel-button" onClick={collapseLeftPanel}>
            <MenuIcon id="Collapse-icon" />
          </IconButton>

          <h3>
            <img
              id="Profile-icon"
              src={currentFriend?.photoUrl}
              alt="Display icon"
            />
            <div>
              {currentFriend?.displayName}
              {currentFriend && (
                <p className="lastSeen">
                  last seen: {getLastActive(currentFriend)}
                </p>
              )}
            </div>
          </h3>

          <IconButton
            id="CollapseRightPanel-button"
            onClick={collapseRightPanel}
          >
            <MenuIcon id="Collapse-icon" />
          </IconButton>
        </div>
        {/* Messages Display Area */}
        <div className="Messages-container">
          <div className="Messages-area">
            {isLoading ? (
              <div className="loading-message">Loading messages...</div>
            ) : (
              allMessages && renderMessagesByDate(allMessages, currentFriend)
            )}
            <div className="scroll-spacer" ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Area */}
        <div className="Bottom-panel">
          <IconButton id="Image-button" onClick={insertImage}>
            <Image id="Image-icon" />
          </IconButton>
          <IconButton id="AttachFile-button" onClick={attachFile}>
            <AttachFile id="AttachFile-icon" />
          </IconButton>
          <input
            type="text"
            id="Chat-input"
            placeholder="Enter Chat..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            value={message}
          />
          <IconButton
            id="Send-button"
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
          >
            <Send id="Send-icon" />
          </IconButton>
        </div>
      </div>

      {/* Profile Panel */}
      <ChatFeedProfilePanel
        className={
          isRightPanelCollapsed
            ? 'ChatFeedProfilePanel'
            : 'ChatFeedProfilePanel-Collapsed'
        }
      />
    </div>
  );
};

export default ChatFeed;
