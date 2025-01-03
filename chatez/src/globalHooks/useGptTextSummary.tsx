import { useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const GPT_SYSTEM_DESCRIPTION = process.env.REACT_APP_GPT_SYSTEM_DESCRIPTION
const GPT_PROMPT_PREFIX = process.env.REACT_APP_GPT_PROMPT_PREFIX

const useGptTextSummary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gptTextSummary = async (text: string): Promise<string> => {
    setLoading(true);
    setError(null); // Reset error state before the request

    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access to it
          messages: [
            {
              role: 'system',
              content: GPT_SYSTEM_DESCRIPTION,
            },
            {
              role: 'user',
              content: `${GPT_PROMPT_PREFIX}\n\n${text}`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error summarizing text:', error);
      setError('Failed to summarize text.');
      throw error; // Re-throw error for further handling if needed
    } finally {
      setLoading(false);
    }
  };

  return { gptTextSummary, loading, error };
};

export default useGptTextSummary;
