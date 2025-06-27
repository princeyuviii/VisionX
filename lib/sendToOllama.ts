export async function sendToOllama(prompt: string): Promise<string> {
  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: `You are VisionX AI Assistant. Be helpful, stylish, and friendly. Answer concisely with relevant outfit suggestions, fashion trends, or virtual try-on tips.\n\nUser: ${prompt}\n\nAI:`,
        stream: false
      })
    });

    const data = await res.json();
    return data.response || "⚠️ Sorry, I couldn't find a suitable response.";
  } catch (error) {
    console.error("Error from Ollama:", error);
    return "⚠️ Couldn't connect to Ollama. Please ensure it's running.";
  }
}