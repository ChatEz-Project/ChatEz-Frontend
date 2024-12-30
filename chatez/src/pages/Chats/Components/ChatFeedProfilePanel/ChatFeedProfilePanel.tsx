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
import { FileDownloadSharp } from '@mui/icons-material';
import { Message, User } from '../../../../backend/types';

interface ChatFeedProfilePanelProps {
  className?: string;
  allMessages: Message[] | undefined;
}

const ChatFeedProfilePanel: React.FC<ChatFeedProfilePanelProps> = ({
  className,
  allMessages,
}) => {
  const [sharedMedia, setSharedMedia] = useState<string[]>([]);
  const [sharedImages, setSharedImages] = useState<string[]>([]);
  const [sharedFiles, setSharedFiles] = useState<string[]>([]);

  const { selectedUser: currentFriend, setFriendActionStatus } = useChat();
  const { currentUserAccessToken } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);

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
    if (allMessages) {
      const mediaUrls = allMessages
        .filter((message) => message.fileUrl)
        .map((message) => message.fileUrl)
        .filter((url): url is string => url !== null);

      // Separate into image and other files
      const images = mediaUrls.filter((fileUrl) =>
        fileUrl.match(/\.(jpeg|jpg|gif|png)$/i)
      );
      const files = mediaUrls.filter(
        (fileUrl) => !fileUrl.match(/\.(jpeg|jpg|gif|png)$/i)
      );

      setSharedImages(images);
      setSharedFiles(files);
      setSharedMedia(mediaUrls);
    }
  }, [allMessages]);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const expandImage = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  useEffect(() => {
    console.log('Shared Images:', sharedImages);
  }, [sharedImages]);

  const downloadFile = (fileUrl: string) => {
    const fileName = fileUrl.split('/').pop() || 'file';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = fileName;
    link.click();
  };

  const downloadImage = () => {
    if (expandedImage) {
      const fileUrl = expandedImage;
      const fileName = fileUrl.split('/').pop();
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = fileName || 'image';
      link.click();
    }
  };

  const extractFileName = (fileUrl: string) => {
    const decodedUrl = decodeURIComponent(fileUrl);
    const parts = decodedUrl.split('/');
    const fileNameWithPath = parts[parts.length - 1];
    const fileName = fileNameWithPath.split('-').slice(-1).join('-');
    return fileName;
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
        {sharedImages && sharedImages.length > 0 ? (
          sharedImages.map((fileUrl, index) => (
            <img
              key={index}
              className="SharedImage"
              src={fileUrl}
              alt={`Shared Media ${index + 1}`}
              onClick={() => expandImage(fileUrl)}
            />
          ))
        ) : (
          <p>No images shared.</p>
        )}
      </div>

      <h2>Shared Files</h2>

      <div className="SharedFiles">
        {sharedFiles && sharedFiles.length > 0 ? (
          sharedFiles.map((fileUrl, index) => (
            <p key={index} className="SharedFile">
              <span>{extractFileName(fileUrl)}</span>
              <IconButton
                id="DownloadFile-button"
                onClick={() => downloadFile(fileUrl)}
              >
                <FileDownloadSharp />
              </IconButton>
            </p>
          ))
        ) : (
          <p>No files shared.</p>
        )}
      </div>

      <div className="Bottom-buttons">
        <button id="DeleteConversation-button" onClick={deleteConversation}>
          Delete Convo
        </button>

        <button id="RemoveFriend-button" onClick={removeFriendHandler}>
          Remove Friend
        </button>
      </div>

      {expandedImage && (
        <div className="ImageModal" onClick={closeExpandedImage}>
          <div
            className="ImageModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={expandedImage} alt="Expanded Media" />
            <IconButton id="DownloadImage-button" onClick={downloadImage}>
              <FileDownloadSharp id="DownloadIcon" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatFeedProfilePanel;
