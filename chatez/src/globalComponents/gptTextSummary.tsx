import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const gptTextSummary = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access to it
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes text.',
          },
          {
            role: 'user',
            content: `Please summarize the following text:\n\n${text}`,
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
    throw new Error('Failed to summarize text.');
  }
};
