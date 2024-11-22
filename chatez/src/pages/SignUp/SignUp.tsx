import Logo from '../../media/logo.svg';
import { useHistory } from 'react-router-dom';
import { doSignInWithGoogle } from '../../firebase/auth';
import './SignUp.css';
import { useEffect, useRef, useState } from 'react';
import { CameraAlt } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayPhoto, setDisplayPhoto] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setDisplayPhoto(
      'https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg'
    );
  }, []);

  const GotoSignUpPage = () => {
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
      setDisplayPhoto(fileURL); // Update the display photo
    }
  };

  return (
    <div className="SignUpPage">
      <div className="SignUpPage-form">
        <div className="signUp-header">
          <img id="Logo" src={Logo} alt="Logo" />
        </div>
        <form className="SignUp-form">
          <div className="photo-container">
            <img id="displayPhoto" src={displayPhoto} alt="Display url" />
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
      </div>
      <div className="SignInWithGoogle-container">
        <h2>
          Already have an account?{' '}
          <span>
            <button id="Login-button" onClick={GotoSignUpPage}>
              <u>Log In</u>
            </button>
          </span>
        </h2>
        <form className="google-signin-form" onSubmit={onGoogleSignIn}>
          <button type="submit" className="google-button">
            Sign Up With Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
