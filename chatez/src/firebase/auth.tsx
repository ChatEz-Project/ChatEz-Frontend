import { create } from 'domain';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from 'firebase/auth';

// creating user with email and password
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// signing in with email and password
export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  console.log('doSignInWithEmailAndPassword');
  return signInWithEmailAndPassword(auth, email, password);
};

// signing in with google
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // TODO - sent the result to the fire store
  return result;
};

// signing out
export const doSignOut = () => {
  return auth.signOut();
};

// resetting password
export const doPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// updating password
export const doPasswordChange = (password: string) => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, password);
  } else {
    throw new Error('No user is currently signed in.');
  }
};

// email verification
export const doSendEmailVerification = () => {
  if (auth.currentUser) {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  } else {
    throw new Error('No user is currently signed in.');
  }
};
