import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { doSignOut } from '../../firebase/auth';
import TextToSpeechAPI from '../../globalHooks/useTextToSpeech';

const HomePage: React.FC = () => {
  const handleSignOut = () => {
    doSignOut();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      
      <TextToSpeechAPI />
    </Box>
  );
};

export default HomePage;
