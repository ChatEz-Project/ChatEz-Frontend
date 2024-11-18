import { imageListClasses } from '@mui/material';
import { Message, User } from '../../../../backend/types';

/**
 * Groups messages by date and formats them with date headers
 * @param messages Array of messages
 * @param currentUser Current friend for determining message direction
 * @returns JSX elements with grouped messages and date headers
 */
export const renderMessagesByDate = (
  messages: Message[],
  currentUser: User | undefined
) => {
  // Group messages by date
  const messagesByDate: { [date: string]: Message[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.dateSent);
    const dateString = date.toDateString();

    if (!messagesByDate[dateString]) {
      messagesByDate[dateString] = [];
    }
    messagesByDate[dateString].push(message);
  });

  // Render messages grouped by date
  return Object.entries(messagesByDate).map(([dateString, messages]) => (
    <div key={dateString}>
      {/* Date Header */}
      <div>
        {(() => {
          const messageDate = new Date(dateString);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (messageDate.toDateString() === today.toDateString()) {
            return 'Today';
          } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
          } else {
            return messageDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            });
          }
        })()}
      </div>

      {/* Messages for this date */}
      {messages.map((message, index) =>
        message.sender === currentUser?.email ? (
          // Received Message
          <div className="Message-box-recipient-container" key={index}>
            <div className="Message-box-recipient">
              <p id="Message">{message.message}</p>
            </div>
            {message.fileUrl && (
              <div className="message-image-container">
                <img
                  src={message.fileUrl}
                  alt="Message attachment"
                  className="message-image"
                />
              </div>
            )}

            <div className="Metadata-section-recipient">
              <p>
                {new Date(message.dateSent).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                {message.read ? ' 🙉' : ' 🙈'}
              </p>
            </div>
          </div>
        ) : (
          // Sent Message
          <div className="Message-box-you-container" key={index}>
            <div className="Message-box-you">
              <p id="Message">{message.message}</p>
            </div>
            <div className="Metadata-section-you">
              <p>
                {message.read ? '🙉 ' : '🙈 '}
                {new Date(message.dateSent).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  ));
};
