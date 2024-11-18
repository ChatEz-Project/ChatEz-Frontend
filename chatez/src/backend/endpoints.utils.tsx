import { getMessages } from './endpoints';

export const getFriendMessages = async (
  accesstoken: string,
  friendEmail: string,
  email: string | null
) => {
  try {
    const messages = await getMessages(accesstoken);
    return messages.filter(
      (msg) =>
        (msg.sender === email && msg.recipient === friendEmail) ||
        (msg.sender === friendEmail && msg.recipient === email)
    );
  } catch (error) {
    console.log('Failed to retrieve message: ', error);
  }
};

export const getFriendLatestMessage = async (
  accesstoken: string,
  friendEmail: string,
  email: string | null
) => {
  try {
    const messages = await getMessages(accesstoken);
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.sender === email && msg.recipient === friendEmail) ||
        (msg.sender === friendEmail && msg.recipient === email)
    );

    return filteredMessages.length > 0
      ? filteredMessages[filteredMessages.length - 1].message
      : '';
  } catch (error) {
    console.log('Failed to retrieve message: ', error);
    return '';
  }
};
