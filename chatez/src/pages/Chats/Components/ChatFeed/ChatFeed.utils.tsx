import { Message, User } from '../../../../backend/types';
import './ChatFeed.css';
import MessageBox from './MessageBox';

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
      {messages.map((message, index) => (
        <MessageBox
          key={index}
          message={message}
          isRecipient={message.sender === currentUser?.email}
        />
      ))}
    </div>
  ));
};
