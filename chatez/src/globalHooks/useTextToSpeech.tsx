import React, { useState } from 'react';
import axios from 'axios';

const TextToSpeechAPI = () => {
  const handleSynthesize = async (text: string) => {
    const apiKey = process.env.REACT_APP_TEXTTOSPEECH_API_KEY; // Your Google Cloud API Key

    // Google Text-to-Speech API endpoint
    const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

    // Request payload for Google Text-to-Speech API
    const payload = {
      audioConfig: {
        audioEncoding: 'MP3',
        effectsProfileId: ['small-bluetooth-speaker-class-device'],
        pitch: 0,
        speakingRate: 1,
      },
      input: {
        text: text,
      },
      voice: {
        languageCode: 'en-GB',
        name: 'en-GB-Standard-A',
      },
    };

    try {
      const response = await axios.post(endpoint, payload);
      const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
      return audioSrc;
    } catch (error) {
      console.error('Error synthesizing audio:', error);
      return null;
    }
  };

  return { handleSynthesize };
};

export default TextToSpeechAPI;
