import './ChatFeedProfilePanel.css';
import { useEffect, useState } from 'react';
import { useChat } from '../../../../contexts/chatContext';
import { useAuth } from '../../../../contexts/authContext';
import { removeFriend } from '../../../../backend/endpoints';
import MenuIcon from '@mui/icons-material/Menu';
import { Alert, IconButton } from '@mui/material';
import { FileDownloadSharp } from '@mui/icons-material';

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

  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const deleteConversation = () => {
    console.log('Conversation has been deleted');
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
    // Map through all messages between the users and check for files being shared,
    // which are not other files i.e ending in .pdf, .docx  etc ....
    // set sharedImages to store all images exchanged between the 2 users, insted of the test images
    setSharedImages([
      'https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg',
      'https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png',
    ]);

    // Map through all messages between the users and check for files being shared,
    // which are not images i.e ending in .png, .jpeg .gif etc ....
    // set sharedFiles to store all files exchanged between the 2 users, insted of testFile.pdf
    setSharedFiles(['testFile.pdf']);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const expandImage = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  // in parameters, pass through the fileUrl and fileName, fileName might be same as fileUrl
  const downloadFile = () => {
    const fileName = 'Test';
    const fileUrl = `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`; // Replace with actual file path
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank'; // Open in a new tab
    link.download = fileName; // Set the file name for the download
    link.click();
  };

  // we don't need the downloadImage function, we will reuse downloadfile for images
  // this function is just here for test purposes, remove it when adding backend
  const downloadImage = () => {
    const fileName = 'Test';
    const fileUrl = `https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png`; // Replace with actual file path
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank'; // Open in a new tab
    link.download = fileName; // Set the file name for the download
    link.click();
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
            onClick={() => expandImage(image)}
          />
        ))}
      </div>

      <h2>Shared Files</h2>

      {sharedFiles.map((file, index) => (
        <p key={index} className="Document">
          {file}
          <IconButton id="DownloadFile-button" onClick={downloadFile}>
            <FileDownloadSharp />
          </IconButton>
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
