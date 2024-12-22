import { GTranslate, Summarize } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useState } from 'react';
import { Message } from '../../../../backend/types';
import { useGoogleTranslate } from '../../../../globalHooks/useGoogleTranslations';
import useGptTextSummary from '../../../../globalHooks/useGptTextSummary';
import TextToSpeechAPI from '../../../../globalHooks/useTextToSpeech';

const MessageBox = ({
  message,
  isRecipient,
}: {
  message: Message;
  isRecipient: boolean;
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const { translate, translations } = useGoogleTranslate();
  const { gptTextSummary, loading: summarizing } = useGptTextSummary();
  const { handleSynthesize } = TextToSpeechAPI();

  const handleTranslate = async () => {
    if (!translatedText) {
      await translate(message.message, 'es');
      if (translations) {
        setTranslatedText(translations);
      }
    }
    setShowTranslation(!showTranslation);
  };

  const handleSummarize = async () => {
    if (!summaryText) {
      const summary = await gptTextSummary(message.message);
      setSummaryText(summary);
    }
    setShowSummary(!showSummary);
  };

  const handleTextToSpeech = async () => {
    if (!audioSrc) {
      const audio = await handleSynthesize(message.message);
      if (audio) {
        setAudioSrc(audio); // Set the audio source here
      }
    }
    setShowSpeech(!showSpeech);
  };

  const containerClass = isRecipient
    ? 'Message-box-recipient-container'
    : 'Message-box-you-container';

  return (
    <div className={containerClass}>
      <div className="message-actions">
        <IconButton className="action-icon" onClick={handleTranslate}>
          <GTranslate fontSize="small" />
        </IconButton>
        <IconButton className="action-icon" onClick={handleSummarize}>
          <Summarize fontSize="small" />
        </IconButton>
        <IconButton className="action-icon" onClick={handleTextToSpeech}>
          <MicIcon fontSize="small" />
        </IconButton>
      </div>

      <div
        className={isRecipient ? 'Message-box-recipient' : 'Message-box-you'}
      >
        <p id="Message">{message.message}</p>
      </div>

      {showTranslation && (
        <div className="action-bubble">
          <div className="action-bubble-header">
            <p className="action-bubble-title">Translation</p>
            <button
              className="close-button"
              onClick={() => setShowTranslation(false)}
            >
              ×
            </button>
          </div>
          <div className="action-bubble-content">
            {translations ? translations : 'Translating...'}
          </div>
        </div>
      )}

      {showSummary && (
        <div className="action-bubble">
          <div className="action-bubble-header">
            <p className="action-bubble-title">Summary</p>
            <button
              className="close-button"
              onClick={() => setShowSummary(false)}
            >
              ×
            </button>
          </div>
          <div className="action-bubble-content">
            {summarizing ? 'Summarizing...' : summaryText}
          </div>
        </div>
      )}

      {showSpeech && audioSrc && (
        <div className="action-bubble">
          <div className="action-bubble-header">
            <p className="action-bubble-title">Text-to-Speech</p>
            <button
              className="close-button"
              onClick={() => setShowSpeech(false)}
            >
              ×
            </button>
          </div>
          <div className="action-bubble-content">
            <audio className="speechControls" controls src={audioSrc}>
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}

      <div
        className={
          isRecipient ? 'Metadata-section-recipient' : 'Metadata-section-you'
        }
      >
        <p>
          {!isRecipient && (message.read ? '🙉 ' : '🙈 ')}
          {new Date(message.dateSent).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
          {isRecipient && (message.read ? ' 🙉' : ' 🙈')}
        </p>
      </div>
    </div>
  );
};

export default MessageBox;
