'use client';

import { useState } from 'react';
import { sendToGemini } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Send, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const FloatingAIHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "SYSTEM_ACTIVE: VisionX Intelligence online. Requesting input parameters for style synchronization.",
      isAI: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: message.toUpperCase(),
      isAI: false
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = message;
    setMessage('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.isAI ? 'ai' : 'user',
        content: m.text
      }));

      const response = await sendToGemini(currentInput, history);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.toUpperCase(),
        isAI: true
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'SIGNAL_ERROR: SYSTEM_FAILED_TO_PROCESS_INPUT.',
        isAI: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-black hover:scale-110 transition-all rounded-none h-16 w-16 shadow-2xl shadow-primary/20 group relative overflow-hidden border border-primary/50"
        >
          <Cpu className="h-8 w-8 relative z-10" />
        </Button>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="absolute right-20 top-1/2 -translate-y-1/2 bg-black border border-primary/30 text-primary text-[10px] font-mono font-black uppercase tracking-[0.2em] px-4 py-2 rounded-none whitespace-nowrap shadow-xl"
        >
          AI_SYNC_ACTIVE
        </motion.div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-end justify-end p-8"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-[600px]"
            >
              <Card className="h-full flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.8)] border-white/5 bg-zinc-950 rounded-none overflow-hidden">
                <CardHeader className="bg-black text-white p-8 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-none border border-primary/20">
                        <Cpu className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black tracking-[0.1em] uppercase italic">AI_INTERFACE</CardTitle>
                        <div className="flex items-center space-x-2">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                           <p className="text-[9px] uppercase font-mono font-black text-zinc-500 tracking-[0.2em]">PROTOCOL: ONLINE</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-none"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0 bg-black">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[85%] px-6 py-4 rounded-none text-[11px] font-mono tracking-widest leading-relaxed uppercase italic ${
                            msg.isAI
                              ? 'bg-zinc-900/50 text-zinc-400 border border-white/5'
                              : 'bg-primary text-black font-black shadow-xl shadow-primary/10'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-900 px-6 py-4 rounded-none border border-white/5 flex gap-2">
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Input */}
                  <div className="p-8 border-t border-white/5 bg-zinc-950">
                    <div className="flex gap-3 bg-black p-2 rounded-none border border-white/10 items-center group focus-within:border-primary/50 transition-all">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="INPUT_COMMAND_..."
                        className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-[10px] font-mono h-10 tracking-widest"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="h-10 w-10 bg-primary text-black hover:bg-white transition-all rounded-none"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIHelper;
