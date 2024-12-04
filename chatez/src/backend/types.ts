import { Types } from 'mongoose';

// getMessage()
export interface Message {
  sender: string;
  recipient: string;
  message: string;
  dateSent: Date;
  read: boolean;
  fileUrl: string | null;
}

// getFriends()
export interface User {
  _id: string;
  email: string;
  displayName: string;
  photoUrl: string;
  lastActive: Date;
}
