import { IconButton } from '@mui/material';
import './ChatFeed.css';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, AttachFile, Image, Send } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Message } from '../../../../backend/types';
import ChatFeedProfilePanel from '../ChatFeedProfilePanel/ChatFeedProfilePanel';
import ChatFeedFriendPanel from '../ChatFeedFriendPanel/ChatFeedFriendPanel';
import { getFriendMessages } from '../../../../backend/endpoints.utils';
import { useAuth } from '../../../../contexts/authContext';
import { sendMessage } from '../../../../backend/endpoints';

const ChatFeed: React.FC = () => {
  // eslint-disable-next-line no-lone-blocks
  {
    /* NOTE:
        - all messages both from you and recipient, all merge in the same list
        - the new list will order them by date sent, so its all in order when rendered
        - the new list will also determine who sent what message using sender and recipient 
    */
  }
  const { currentUserAccessToken, userLoggedIn, currentUser } = useAuth();
  const [allMessages, setAllMessages] = useState<Message[]>();

  const fetchMessages = async () => {
    try {
      if (userLoggedIn && currentUserAccessToken && currentUser) {
        console.log(currentUserAccessToken);
        const messages = await getFriendMessages(
          currentUserAccessToken,
          'bobacri79@gmail.com',
          currentUser.email
        );
        setAllMessages(messages);
        console.log(messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userLoggedIn, currentUserAccessToken]);

  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(true);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(true);

  const [message, setMessage] = useState<string>('');

  const collapseRightPanel = () => {
    setIsRightPanelCollapsed(!isRightPanelCollapsed);
  };

  const collapseLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
  };

  const insertImage = () => {
    console.log('Image has been inserted');
  };

  const attachFile = () => {
    console.log('File has been attached');
  };

  const handleSubmit = async (
    accessToken: string | null,
    recipientEmail: string,
    message: string
  ) => {
    await sendMessage(accessToken, recipientEmail, message);
    setMessage('');
    fetchMessages();
  };

  return (
    <div className="Chat-feed-container">
      <ChatFeedFriendPanel
        className={
          isLeftPanelCollapsed
            ? 'ChatFeedFriendPanel'
            : 'ChatFeedFriendPanel-Collapsed'
        }
      />

      <div className="Chat-feed">
        <div className="Top-panel">
          <IconButton id="CollapseLeftPanel-button" onClick={collapseLeftPanel}>
            <MenuIcon id="Collapse-icon" />
          </IconButton>
          <h3>
            <AccountCircle id="Profile-icon" />
            Abdul
          </h3>
          <IconButton
            id="CollapseRightPanel-button"
            onClick={collapseRightPanel}
          >
            <MenuIcon id="Collapse-icon" />
          </IconButton>
        </div>

        <div className="Messages-container">
          <div className="Messages-area">
            {/* NOTE:
                            - all messages both from you and recipient, all merge in the same list
                            - the new list will order them by date sent, so its all in order when rendered
                            - the new list will also determine who sent what message
                        */}
            {allMessages &&
              allMessages.map((message, index) =>
                message.recipient === currentUser?.email ? (
                  <div className="Message-box-recipient-container" key={index}>
                    <div className="Message-box-recipient">
                      <p id="Message">{message.message}</p>
                    </div>
                    <div className="Metadata-section-recipient">
                      <p>
                        {new Date(message.dateSent).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="Message-box-you-container" key={index}>
                    <div className="Message-box-you">
                      <p id="Message">{message.message}</p>
                    </div>
                    <div className="Metadata-section-you">
                      <p>
                        {new Date(message.dateSent).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        <div className="Bottom-panel">
          <IconButton id="Image-button" onClick={insertImage}>
            <Image id="Image-icon" />
          </IconButton>
          <IconButton id="AttachFile-button" onClick={attachFile}>
            <AttachFile id="AttachFile-icon" />
          </IconButton>
          <input
            id="Chat-input"
            placeholder="Enter Chat..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></input>

          <IconButton
            id="Send-button"
            onClick={() =>
              handleSubmit(
                currentUserAccessToken,
                'bobacri79@gmail.com',
                message
              )
            }
          >
            <Send id="Send-icon" />
          </IconButton>
        </div>
      </div>

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
