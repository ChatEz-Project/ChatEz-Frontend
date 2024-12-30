import Logo from '../../media/logo.svg';
import { useHistory } from 'react-router-dom';
import {
  doSignInWithGoogle,
  doCreateUserWithEmailAndPassword,
} from '../../firebase/auth';
import './SignUp.css';
import { useEffect, useRef, useState } from 'react';
import { CameraAlt, Google } from '@mui/icons-material';
import { Alert, IconButton } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { useAuth } from '../../contexts/authContext';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { setDisplayProfilePhoto, setUsername } = useAuth();

  // displayPhoto stores the chosenDisplayPhoto
  const [displayPhoto, setDisplayPhoto] = useState<File>();
  const [photo, setPhoto] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [wrongFileType, setWrongFileType] = useState(false);

  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the displayPhoto
    if (displayPhoto) {
      const allowedExtensions = ['jpg', 'png', 'gif'];
      const fileExtension = displayPhoto.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        setWrongFileType(true);
        return;
      }
    }

    // Reset error states before trying to create a user
    setEmailAlreadyInUse(false);
    setWeakPassword(false);

    try {
      // Create new user
      await doCreateUserWithEmailAndPassword(email, password);
      setDisplayPhoto(displayPhoto);
      setUsername(userDisplayName);
      if (displayPhoto) {
        setDisplayProfilePhoto(displayPhoto);
      }
      setIsSignedUp(true);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          alreadyExists();
        } else if (error.code === 'auth/weak-password') {
          passwordIsWeak();
        } else {
          console.error('Sign up error:', error.message);
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (isSignedUp) {
      history.push('/');
    }
  }, [isSignedUp]);

  useEffect(() => {
    setPhoto(
      'https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg'
    );
  }, []);

  const alreadyExists = () => {
    setEmailAlreadyInUse(true);
    setTimeout(() => setEmailAlreadyInUse(false), 3000);
  };

  const passwordIsWeak = () => {
    setWeakPassword(true);
    setTimeout(() => setWeakPassword(false), 3000);
  };

  const GotoSignInPage = () => {
    history.push('/');
  };

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

  const updateDisplayPhoto = () => {
    // Trigger the file input click event programmatically
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a preview URL
      setDisplayPhoto(file); // Update the display photo
      setPhoto(fileURL);
    }
  };

  return (
    <div className="SignUpPage">
      <div className="SignUpPage-form">
        <div className="signUp-header">
          <img id="Logo" src={Logo} alt="Logo" />
        </div>
        <form className="SignUp-form" onSubmit={handleSubmit}>
          <div className="photo-container">
            <img id="displayPhoto" src={photo} alt="Display url" />
            <span className="camera-icon">
              <IconButton onClick={updateDisplayPhoto}>
                <CameraAlt id="camera-button" />
              </IconButton>
            </span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={userDisplayName}
            onChange={(e) => setUserDisplayName(e.target.value)}
          />
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
            Sign Up
          </button>
        </form>
        {emailAlreadyInUse && (
          <Alert sx={{ marginTop: '15px' }} severity="error">
            Email already in use, Sign In or please try a different one.
          </Alert>
        )}
        {!emailAlreadyInUse && weakPassword && (
          <Alert sx={{ marginTop: '15px' }} severity="error">
            Password is too weak (minimum 6 characters), please try again
          </Alert>
        )}
        {!emailAlreadyInUse && !weakPassword && wrongFileType && (
          <Alert sx={{ marginTop: '15px' }} severity="error">
            Invalid profile image file type. Please upload a .jpg, .png, or .gif
            file.
          </Alert>
        )}
      </div>
      <div className="SignInWithGoogle-container">
        <h2>
          Already have an account?{' '}
          <span>
            <button id="Login-button" onClick={GotoSignInPage}>
              <u>Sign In</u>
            </button>
          </span>
        </h2>
        <form className="google-signin-form" onSubmit={onGoogleSignIn}>
          <button type="submit" className="google-button">
            <Google id="Google-icon" />
            Sign In With Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
