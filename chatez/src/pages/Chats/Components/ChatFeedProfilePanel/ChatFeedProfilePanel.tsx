import './ChatFeedProfilePanel.css';
import { useEffect, useState } from 'react';
import { useChat } from '../../../../contexts/chatContext';

interface ChatFeedProfilePanelProps {
  className?: string;
}

const ChatFeedProfilePanel: React.FC<ChatFeedProfilePanelProps> = ({
  className,
}) => {
  const [sharedImages, setSharedImages] = useState<string[]>([]);
  const [sharedFiles, setSharedFiles] = useState<string[]>([]);
  const { currentFriend } = useChat();

  const deleteConversation = () => {
    console.log('Conversation has been deleted');
  };

  const removeFriend = () => {
    console.log('Friend has been removed');
  };

  useEffect(() => {
    setSharedImages([
      'https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg',
      'https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png',
    ]);
    setSharedFiles(['DocumentExample1.docx', 'DocumentExample2.docx']);
  }, []);

  return (
    <div
      className={
        className ? `ChatFeedProfilePanel ${className}` : 'ChatFeedProfilePanel'
      }
    >
      <img
        id="Profile-picture"
        src={currentFriend && currentFriend.photoUrl}
        alt="Display icon"
      />

      <h1 id="Display-name">{currentFriend?.displayName}</h1>
      <hr />

      <h2>Shared Images</h2>

      {sharedImages.map((image, index) => (
        <img
          key={index}
          className="SharedImage"
          src={image}
          alt="Shared Media"
        />
      ))}

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

        <button id="RemoveFriend-button" onClick={removeFriend}>
          Remove Friend
        </button>
      </div>
    </div>
  );
};

export default ChatFeedProfilePanel;
