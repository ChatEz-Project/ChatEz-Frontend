import { AddCircleOutline, Settings } from '@mui/icons-material';
import './ChatFeedFriendPanel.css';
import { IconButton } from '@mui/material';

interface ChatFeedFriendPanelProps {
  className?: string;
}

const ChatFeedFriendPanel: React.FC<ChatFeedFriendPanelProps> = ({
  className,
}) => {
  const openSettings = () => {
    console.log('Settings opened!');
  };

  const addFriend = () => {
    console.log('Add friend box opened!');
  };

  return (
    <div
      className={
        className ? `ChatFeedFriendPanel ${className}` : 'ChatFeedFriendPanel'
      }
    >
      <h3>
        {/* Insert actual display image/profile pic here by replacing the src */}
        <img
          id="Profile-icon"
          src="https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png"
          alt="Display icon"
        />
        {/* Insert actual Display name */}
        Abdul
      </h3>
      <hr />

      <div className="Top-section">
        <input id="SearchUser-input" placeholder="Search user..." />
        <IconButton onClick={addFriend}>
          <AddCircleOutline id="AddFriends-button" />
        </IconButton>
      </div>

      {/* Container for messages */}
      <div className="messages-container">
        <button id="message-button">
          <div className="profile-pic-container">
            <img
              id="ProfilePic-icon"
              src="https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png"
              alt="Display icon"
            />
          </div>
          <div className="message-content">
            <div className="message-header">
              <p id="username">Abdul</p>
              <span className="timestamp">9:23</span>
            </div>
            <p className="message-text">Hey, how are you doing?</p>
          </div>
        </button>

        <button id="message-button">
          <div className="profile-pic-container">
            <img
              id="ProfilePic-icon"
              src="https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg"
              alt="Display icon"
            />
          </div>
          <div className="message-content">
            <div className="message-header">
              <p id="username">Joel</p>
              <span className="timestamp">9:43</span>
            </div>
            <p className="message-text">Sup sup!</p>
          </div>
        </button>
      </div>

      <div>
        <hr />
        <div className="Bottom-section">
          <button id="Logout-button">Logout</button>
          <IconButton onClick={openSettings}>
            <Settings id="Settings-button" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatFeedFriendPanel;
