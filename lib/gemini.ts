import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are VisionX AI, a premium fashion expert and style coach. 
Your goal is to help users find the perfect outfit, suggest accessories, and provide confidence-boosting style advice.
Keep your responses concise, professional, and trend-aware (mention aesthetics like "Old Money", "Streetwear", "Clean Girl", etc.).
Always be encouraging and helpful. If a user asks about a specific item, highlight its strengths.
`;

export async function sendToGemini(prompt: string, history: { role: string; content: string }[] = []): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history })
    });
    
    if (!res.ok) throw new Error('API request failed');
    
    const data = await res.json();
    return data.text;
  } catch (err) {
    console.error('Chat API Error:', err);
    return "I'm having a bit of trouble connecting to my fashion database. Try again in a second!";
  }
}