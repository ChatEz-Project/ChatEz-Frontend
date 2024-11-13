import axios from 'axios';
import { Friend, Message } from './types';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getMessages = async (authToken: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/getMessages`,
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    // extract only necessary data
    const messages: Message[] = response.data.map((message: Message) => ({
      sender: message.sender,
      recipient: message.recipient,
      read: message.read,
      fileUrl: message.fileUrl,
      message: message.message,
      dateSent: message.dateSent,
    }));

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getFriends = async (authToken: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/getFriends`,
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    // extract only necessary data
    const friends: Friend[] = response.data.map((friend: Friend) => ({
      email: friend.email,
      displayName: friend.displayName,
      photoUrl: friend.photoUrl,
      lastActive: friend.lastActive,
    }));

    return friends;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const addFriend = async (authToken: string, friendEmail: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/addFriend/${friendEmail}`,
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const removeFriend = async (authToken: string, friendEmail: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/removeFriend/${friendEmail}`,
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const getUser = async (authToken: string) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/getUser`,
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (
  authToken: string,
  recipientEmail: string,
  message: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sendMessage/${recipientEmail}`,
      {
        message: message,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
