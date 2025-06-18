// lib/gemini.ts
const dotenv = require('dotenv');
dotenv.config();

// lib/gemini.ts

export const sendToGemini = async (userPrompt: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
      }),
    });

    const data = await res.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      '⚠️ Sorry, Gemini could not generate a response.';

    return aiText;
  } catch (error) {
    console.error('Gemini API error:', error);
    return '⚠️ Failed to contact Gemini API. Please try again.';
  }
};

