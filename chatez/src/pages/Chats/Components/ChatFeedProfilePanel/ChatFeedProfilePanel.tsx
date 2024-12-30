import './ChatFeedProfilePanel.css';
import { useEffect, useState } from 'react';
import { useChat } from '../../../../contexts/chatContext';
import { useAuth } from '../../../../contexts/authContext';
import {
  deleteFriendMessages,
  removeFriend,
} from '../../../../backend/endpoints';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, IconButton } from '@mui/material';

interface ChatFeedProfilePanelProps {
  className?: string;
}

const ChatFeedProfilePanel: React.FC<ChatFeedProfilePanelProps> = ({
  className,
}) => {
  const [sharedImages, setSharedImages] = useState<string[]>([]);
  const [sharedFiles, setSharedFiles] = useState<string[]>([]);
  const { selectedUser: currentFriend, setFriendActionStatus } = useChat();
  const { currentUserAccessToken } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const deleteConversation = async () => {
    try {
      if (currentUserAccessToken && currentFriend) {
        await deleteFriendMessages(currentUserAccessToken, currentFriend.email);
        window.location.reload();
      }
    } catch (err) {
      console.error('Error delete convo: ', err);
    }
  };

  const removeFriendHandler = async () => {
    if (currentUserAccessToken && currentFriend) {
      try {
        await removeFriend(currentUserAccessToken, currentFriend.email);
        setFriendActionStatus({
          isVisible: true,
          action: 'removed',
          username: currentFriend.displayName,
        });
        window.location.reload();
      } catch (error) {
        // Handle failure case
        setFriendActionStatus({
          isVisible: true,
          action: '',
          username: currentFriend.displayName,
        });
      }
    }
  };

  useEffect(() => {
    setSharedImages([
      'https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg',
      'https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png',
    ]);
    setSharedFiles(['DocumentExample1.docx', 'DocumentExample2.docx']);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <div
      className={`${
        className ? `ChatFeedProfilePanel ${className}` : 'ChatFeedProfilePanel'
      } 
      ${
        isCollapsed ? 'ChatFeedProfilePanel-Collapsed' : 'ChatFeedProfilePanel'
      }`}
    >
      <div>
        <IconButton id="CollapseProfilePanel-button" onClick={toggleCollapse}>
          <MenuIcon id="CollapseProfilePanel-icon" />
        </IconButton>
      </div>

      <img
        id="Profile-picture"
        src={currentFriend && currentFriend.photoUrl}
        alt="Display icon"
      />

      <h1 id="Display-name">{currentFriend?.displayName}</h1>
      <hr />

      <h2>Shared Images</h2>
      <div className="SharedImages">
        {sharedImages.map((image, index) => (
          <img
            key={index}
            className="SharedImage"
            src={image}
            alt="Shared Media"
          />
        ))}
      </div>

      <h2>Shared Files</h2>

      {sharedFiles.map((file, index) => (
        <p key={index} className="Document">
          {file}
        </p>
      ))}

      <div className="Bottom-buttons">
        <button id="DeleteConversation-button" onClick={deleteConversation}>
          Delete Convo
        </button>

        <button id="RemoveFriend-button" onClick={removeFriendHandler}>
          Remove Friend
        </button>
      </div>
    </div>
  );
};

export default ChatFeedProfilePanel;
