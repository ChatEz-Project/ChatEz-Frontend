import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { doSignOut } from '../firebase/auth';
import TextToSpeechAPI from '../globalHooks/useTextToSpeech';
import ChatFeed from './Chats/Components/ChatFeed/ChatFeed';

const HomePage: React.FC = () => {
  const handleSignOut = () => {
    doSignOut();
  };

  const { handleSynthesize, audioSrc } = TextToSpeechAPI(); // Initialize the TextToSpeechAPI

  useEffect(() => {
    const synthesizeAudio = async () => {
      await handleSynthesize('Hello, welcome to my app!');
    };
    synthesizeAudio();
  }, []);

  console.log(audioSrc);

  return (
    <div>
      <ChatFeed />
  
    </div>
  );
};

export default HomePage;
