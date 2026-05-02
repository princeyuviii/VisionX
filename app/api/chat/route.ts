import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
[SYSTEM_RECOGNITION: VISIONX_NEURAL_STYLE_ENGINE_V1.4]
You are VisionX AI, an industry-grade fashion synthesis expert.
Your mission is to provide technical style consultations.

PROTOCOL_GUIDELINES:
1. RESPONSE_LENGTH: Extremely concise (2-3 sentences max).
2. TONE: Professional, data-driven, and technical.
3. INTERACTIVE_MAPPING: Use syntax [TRY_ON: Item Name] for all recommendations.
   Example: "Deploy the [TRY_ON: Oversized Tech Parka] for optimal silhouette balance."
`;

export async function POST(req: Request) {
  let prompt, history;
  try {
    const body = await req.json();
    prompt = body.prompt;
    history = body.history;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const chat = model.startChat({
      history: history.map((h: any) => ({
        role: h.role === 'ai' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${prompt}`;
    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error('Gemini API Error, falling back to Groq:', err);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...(history || []).map((h: any) => ({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.content })),
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "I'm having a bit of trouble connecting to my fashion database. Try again in a second!";
      return NextResponse.json({ text });
    } catch (groqErr) {
      console.error('Groq API Error:', groqErr);
      return NextResponse.json({ text: "I'm having a bit of trouble connecting to my fashion database. Try again in a second!" }, { status: 500 });
    }
  }
}
