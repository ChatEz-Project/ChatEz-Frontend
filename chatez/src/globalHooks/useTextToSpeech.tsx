import React, { useState } from 'react';
import axios from 'axios';

const TextToSpeechAPI: React.FC = () => {
  const [text, setText] = useState<string>('');  // State to hold the user-inputted text
  const [audioSrc, setAudioSrc] = useState<string | null>(null);  // State to store the generated audio source (MP3)

  const handleSynthesize = async () => {
    const apiKey = process.env.REACT_APP_TEXTTOSPEECH_API_KEY;  // Your Google Cloud API Key

    // Google Text-to-Speech API endpoint
    const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;

    // Request payload for Google Text-to-Speech API
    const payload = {
      "audioConfig": {
        "audioEncoding": "MP3",
        "effectsProfileId": [
          "small-bluetooth-speaker-class-device"
        ],
        "pitch": 0,
        "speakingRate": 1
      },
      "input": {
        "text": text
      },
      "voice": {
        "languageCode": "en-GB",
        "name": "en-GB-Standard-A"
      }
    };

    try {
      // Make a POST request to the Google Text-to-Speech API
      const response = await axios.post(endpoint, payload);

      // Construct the audio source URL from the base64 audio content returned
      const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
      
      // Update the audio source state
      setAudioSrc(audioSrc);
    } catch (error) {
      console.error('Error synthesizing audio:', error);  // Log any errors that occur
    }
  };

  return (
    <div style={{ marginLeft: '100px' }}>
      <h1>Text to Speech</h1>
      <textarea
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text" 
      ></textarea>
      <br />
      {/* Button to trigger the synthesis */}
      <button onClick={handleSynthesize}>Synthesize</button>

      {/* Render the audio controls if audioSrc is set */}
      {audioSrc && <audio controls src={audioSrc} />}
    </div>
  );
}

export default TextToSpeechAPI


