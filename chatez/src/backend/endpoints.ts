import axios from 'axios';
import { User, Message } from './types';

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
    const friends: User[] = response.data.map((friend: User) => ({
      _id: friend._id,
      email: friend.email,
      displayName: friend.displayName,
      photoUrl: friend.photoUrl,
      lastActive: friend.lastActive,
    }));

    return friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
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
    console.error('Error adding friend:', error);
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
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const getUser = async (authToken: string, userEmail: string | null) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/getUser/${userEmail}`,
      {},
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    // extract only necessary data
    const user: User = {
      _id: response.data._id,
      email: response.data.email,
      displayName: response.data.displayName,
      photoUrl: response.data.photoUrl,
      lastActive: response.data.lastActive,
    };

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const sendMessage = async (
  authToken: string | null,
  recipientEmail: string,
  message: string,
  file?: File
) => {
  try {
    const formData = new FormData();
    formData.append('message', message);

    if (file) {
      formData.append('file', file);
      console.log(`attached file: ${file.name}`)
    }

    const response = await axios.post(
      `${BASE_URL}/sendMessage/${recipientEmail}`,
      formData,
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessagesForSidebar = async (authToken: string | null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/getMessagesForSidebar`,
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
    console.error('Error sending message:', error);
    throw error;
  }
};
