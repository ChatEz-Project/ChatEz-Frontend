import { useState, useCallback } from 'react';
import axios from 'axios';

interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

// Create an axios instance with base configuration
const translationApi = axios.create({
  baseURL: 'https://translation.googleapis.com/language/translate/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useGoogleTranslate = () => {
  const [translations, setTranslations] = useState('');
  const apiKey = process.env.REACT_APP_GOOGLE_TRANSLATIONS_API_KEY;

  const translate = async (text: string, targetLang: string) => {
    try {
      const { data } = await translationApi.post<TranslationResponse>(
        '',
        {
          q: text,
          target: targetLang,
        },
        {
          params: {
            key: apiKey,
          },
        }
      );
      setTranslations(await data.data.translations[0].translatedText);
    } catch (err) {
      let errorMessage = 'Translation failed: ';
      if (err) {
        console.log(errorMessage, err);
      }
    }
  };

  const clearTranslations = useCallback(() => {
    setTranslations('');
  }, []);

  return {
    translate,
    translations,
    clearTranslations,
  };
};
