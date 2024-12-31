import { GTranslate, Summarize } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useEffect, useState } from 'react';
import { Message } from '../../../../backend/types';
import { useGoogleTranslate } from '../../../../globalHooks/useGoogleTranslations';
import useGptTextSummary from '../../../../globalHooks/useGptTextSummary';
import TextToSpeechAPI from '../../../../globalHooks/useTextToSpeech';

const MessageBox = ({
  message,
  isRecipient,
  language,
}: {
  message: Message;
  isRecipient: boolean;
  language: string;
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [image, setImage] = useState<any>();
  const [file, setFile] = useState<any>();

  const { translate, translations } = useGoogleTranslate();
  const { gptTextSummary, loading: summarizing } = useGptTextSummary();
  const { handleSynthesize } = TextToSpeechAPI();

  useEffect(() => {
    if (message.fileUrl) {
      const image = /\.(jpeg|jpg|gif|png)$/i.test(message.fileUrl)
        ? message.fileUrl
        : null;
      const file = !image ? message.fileUrl : null;

      setImage(image);
      setFile(file);
    }
  }, [message.fileUrl]);

  const handleTranslate = async () => {
    if (!translatedText) {
      console.log(`Language: ${language}`);
      await translate(message.message, language);
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
        {image && (
          <img src={image} alt="sharedImage" width={200} height={200} />
        )}
        {file && (
          <div className="file-container">
            <span className="file-name">
              {decodeURIComponent(
                file.split('/').pop()?.split('-').pop() || 'File'
              )}
            </span>
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="file-link"
            >
              Open File
            </a>
          </div>
        )}
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
        </p>
      </div>
    </div>
  );
};

export default MessageBox;
