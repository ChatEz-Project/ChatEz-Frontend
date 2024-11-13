import React, { useEffect } from 'react';
import TextToSpeechAPI from '../../globalHooks/useTextToSpeech';
import ChatFeed from './Components/ChatFeed/ChatFeed';

const HomePage: React.FC = () => {
  const { handleSynthesize, audioSrc } = TextToSpeechAPI(); // Initialize the TextToSpeechAPI

  useEffect(() => {
    const synthesizeAudio = async () => {
      await handleSynthesize('Hello, welcome to my app!');
    };
    synthesizeAudio();
  });

  console.log(audioSrc);

  return (
    <div>
      <ChatFeed />
    </div>
  );
};

export default HomePage;
