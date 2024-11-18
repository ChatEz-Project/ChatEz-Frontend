import React, { useEffect, useState } from 'react';
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from '../../firebase/auth';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { useGoogleTranslate } from '../../globalHooks/useGoogleTranslations';
import Logo from '../../media/logo.svg';
import Divider from '../../media/OrDivider.svg';
import { useHistory } from 'react-router-dom'; // Import useHistory for React Router v5

import './Login.css';

const LoginPage: React.FC = () => {
  const { userLoggedIn } = useAuth();
  const history = useHistory(); // Initialize useHistory hook

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { translate, translations } = useGoogleTranslate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    translate('Sign In', 'es');

    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        console.error('Sign in error:', error);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  useEffect(() => {
    if (translations) {
      console.log('Translation:', translations);
    }
  }, [translations]);

  const onGoogleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((error) => {
        setIsSigningIn(false);
        console.error('Error signing in with Google:', error);
      });
    }
  };

  if (userLoggedIn) {
    return <Redirect to="/chats" />;
  }

  const GotoSignUpPage = () => {
    history.push('/SignUp'); // Use history.push() to navigate to the /SignUp route
  };

  return (
    <div className="LoginPage">
      <div className="LoginPage-form">
        <div className="login-header">
          <img id="Logo" src={Logo} alt="Logo" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </div>
      <div className="SignInWithGoogle-container">
        <h2>
          Don't have an account?{' '}
          <span>
            <button id="SignUp-button" onClick={GotoSignUpPage}>
              <u>Sign Up</u>
            </button>
          </span>
        </h2>
        <img id="Divider" src={Divider} alt="Divider" />
        <form className="google-signin-form" onSubmit={onGoogleSignIn}>
          <button type="submit" className="google-button">
            Sign In With Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
