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
