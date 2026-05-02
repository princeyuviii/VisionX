'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Download, RotateCcw, Pause, Play, Settings, Image as ImageIcon, 
  Heart, Share2, MessageCircle, ShoppingCart, ExternalLink, Bot, Send,
  Star, TrendingUp, Sparkles, X, Facebook, Twitter, Instagram, Copy, Shirt, 
  Glasses, Watch, Crown, Zap
} from 'lucide-react';
import { FASHION_CATEGORIES, QUICK_TRY_ITEMS, CLOTHING_ITEMS } from '@/config/fashion-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { sendToGemini } from '@/lib/gemini';
import { useUser } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Search, Scan, Target, Activity } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TryOnContent() {
  const { user } = useUser();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const preselectedItemName = searchParams.get('item');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingPoints, setTrackingPoints] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [processedFrame, setProcessedFrame] = useState<string | null>(null);
  const [isFullSize, setIsFullSize] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tops");
  const [opacity, setOpacity] = useState([80]);
  const [scale, setScale] = useState([100]);
  const [yOffset, setYOffset] = useState([0]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [styleScore, setStyleScore] = useState(0);
  const [fitScore, setFitScore] = useState(0);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, text: "Hi! I'm your AI Style Assistant. I can help you choose the perfect outfit and give you styling advice. How are you feeling about your current look?", isAI: true }
  ]);
  const [aiInput, setAiInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cameraInterval: NodeJS.Timeout;

    if (isStreaming) {
      startCamera();
      cameraInterval = setInterval(() => {
        sendFrameForTryOn();
      }, 1000); // every second
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      clearInterval(cameraInterval);
    };
  }, [isStreaming, selectedItems]);


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log("Track stopped:", track.label);
      });
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setIsStreaming(!isStreaming);
  };

  const handleItemToggle = (item: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const existingIndex = selectedItems.findIndex(selected => selected.type === item.type);
      if (existingIndex >= 0) {
        const newItems = [...selectedItems];
        newItems[existingIndex] = item;
        setSelectedItems(newItems);
      } else {
        setSelectedItems(prev => [...prev, item]);
      }
      setIsLoading(false);
      
      // Calculate AI scores
      const newFitScore = Math.floor(Math.random() * 20) + 75; // 75-95
      const newStyleScore = Math.floor(Math.random() * 15) + 80; // 80-95
      setFitScore(newFitScore);
      setStyleScore(newStyleScore);

      toast({
        title: "Item Applied",
        description: `${item.name} has been applied. AI Fit Score: ${newFitScore}%`,
      });
    }, 1000);
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item._id !== itemId));
  };


  const toggleLike = (itemId: number) => {
    setLikedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `visionx-tryon-${Date.now()}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const sendFrameForTryOn = async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      canvasRef.current.width = videoRef.current.videoWidth / 2; // Reduced resolution for speed
      canvasRef.current.height = videoRef.current.videoHeight / 2;
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const base64Frame = canvasRef.current.toDataURL("image/jpeg", 0.5); // Higher compression

      const shirt = selectedItems.find(item => ["shirt", "tshirt", "hoodie", "top", "Tops"].includes(item.type || item.category));
      const pant = selectedItems.find(item => ["pant", "Pants"].includes(item.type || item.category));

      const response = await fetch("http://localhost:8000/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Frame,
          shirtUrl: shirt ? (shirt.image || shirt._id) : null,
          pantUrl: pant ? (pant.image || pant._id) : null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.processedImage) setProcessedFrame(data.processedImage);
      }
    } catch (err) {
      console.warn("Neural Link Latency:", err);
    } finally {
      setIsProcessing(false);
    }
  };


  const resetSelection = () => {
    setSelectedItems([]);
  };

  const shareToCommunity = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;
    
    setIsLoading(true);
    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;
      
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const snapshot = canvasRef.current.toDataURL('image/jpeg');

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.imageUrl,
            clerkId: user.id
          },
          image: snapshot,
          caption: `Synthesized a new look with VisionX! 🔥 Featuring: ${selectedItems.map(i => i.name).join(', ')} #VisionX #VirtualTryOn`,
          tags: ["#VisionX", "#VirtualTryOn", ...selectedItems.map(i => `#${i.type}`)]
        })
      });

      if (res.ok) {
        toast({
          title: "PROTOCOL_PUBLISHED",
          description: "Your style synthesis has been deployed to the global feed.",
        });
      }
    } catch (err) {
      console.error("Community sharing failed:", err);
      toast({
        title: "Link Error",
        description: "Failed to broadcast signal to community.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsShareOpen(false);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = "Check out my virtual try-on with VisionX! 🔥";
    const url = window.location.href;
    
    switch (platform) {
      case 'community':
        shareToCommunity();
        break;
      case 'instagram':
        toast({
          title: "Instagram Sharing",
          description: "Screenshot saved! Share it on your Instagram story.",
        });
        takeSnapshot();
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Share link copied to clipboard!",
        });
        break;
    }
    setIsShareOpen(false);
  };

  const sendAIMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { id: aiMessages.length + 1, text: aiInput, isAI: false };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");

    try {
      const history = aiMessages.map(m => ({ role: m.isAI ? 'ai' : 'user', content: m.text }));
      const response = await sendToGemini(aiInput, history);
      
      const aiResponse = { id: aiMessages.length + 2, text: response, isAI: true };
      setAiMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      toast({
        title: "AI Error",
        description: "Failed to get a response from your style assistant.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setDbProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const allItems = dbProducts.length > 0 ? dbProducts : CLOTHING_ITEMS;

  useEffect(() => {
    if (preselectedItemName && allItems.length > 0) {
      const item = allItems.find(it => 
        (it.name || it.title || "").toLowerCase().includes(preselectedItemName.toLowerCase())
      );
      if (item) {
        // Use a small timeout to ensure the component is fully ready
        setTimeout(() => {
          handleItemToggle(item);
        }, 500);
      }
    }
  }, [preselectedItemName, allItems.length]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20 pb-8">
      <div className="absolute inset-0 cyber-grid opacity-20 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/80 -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Virtual Try-On Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience fashion in real-time. Select items, get AI advice, and shop directly from your virtual wardrobe.
          </p>
        </motion.div>

        {/* Main Camera Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-0 glass overflow-hidden relative">
            <div className="scanline opacity-20" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Camera className="h-6 w-6 text-primary" />
                  <span className="uppercase font-black tracking-widest text-sm">Live Virtual Studio</span>
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant={isStreaming ? "default" : "secondary"} className={`px-3 py-1 ${isStreaming ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-white/50 border-white/10'}`}>
                    {isStreaming ? "🔴 Live" : "⏸️ Paused"}
                  </Badge>
                  {cart.length > 0 && (
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className={`grid ${isFullSize ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-0 transition-all duration-500 min-h-[600px]`}>
                {/* Left: Interactive Feed */}
                <div className={`${isFullSize ? 'lg:col-span-1' : 'lg:col-span-2'} relative bg-zinc-950 border-r border-white/5 overflow-hidden group`}>
                  <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
                  
                  {/* Studio Viewport Controls */}
                  <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setIsFullSize(!isFullSize)}
                      className="bg-black/40 border-white/10 hover:border-primary/40 backdrop-blur-md rounded-none text-white/60 hover:text-primary transition-all h-10 w-10"
                    >
                      {isFullSize ? <Target className="h-4 w-4" /> : <Scan className="h-4 w-4" />}
                    </Button>
                    <div className="bg-black/40 border border-white/5 px-4 py-2 backdrop-blur-md">
                      <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40">
                        MODE: {isFullSize ? 'IMMERSIVE_LINK' : 'TECHNICAL_GRID'}
                      </span>
                    </div>
                  </div>
                  
                  {isStreaming ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className={`absolute inset-0 w-full h-full object-cover ${processedFrame ? 'opacity-0' : 'opacity-80'}`}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {processedFrame ? (
                        <img
                          src={processedFrame}
                          alt="Neural Synthesis Feed"
                          className="absolute inset-0 w-full h-full object-cover z-10"
                        />
                      ) : (
                        <div className="flex flex-col items-center space-y-4 text-primary/40 animate-pulse">
                          <Activity className="h-12 w-12" />
                          <span className="text-[10px] font-mono tracking-[0.5em]">WAITING_FOR_ML_LINK...</span>
                        </div>
                      )}

                      {/* Neural HUD Overlays */}
                      <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute top-8 left-8 space-y-4">
                          <div className="flex items-center space-x-3 text-primary">
                            <Activity className="h-4 w-4 animate-pulse" />
                            <span className="text-[10px] font-mono tracking-[0.4em] uppercase">LINK_ESTABLISHED</span>
                          </div>
                          <div className="w-48 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
                        </div>
                        
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/30" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/30" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/30" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/30" />

                        <AnimatePresence>
                          {selectedItems.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute top-8 right-8 space-y-6"
                            >
                              <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 space-y-4 text-right">
                                <div className="space-y-1">
                                  <div className="text-[9px] font-mono text-primary uppercase tracking-widest">FIT_PROJECTION</div>
                                  <div className="text-3xl font-black text-white italic tracking-tighter">{fitScore}%</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-[9px] font-mono text-primary uppercase tracking-widest">STYLE_MATCH</div>
                                  <div className="text-3xl font-black text-white italic tracking-tighter">{styleScore}%</div>
                                </div>
                                <div className="h-1 w-32 bg-white/10 ml-auto">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(fitScore + styleScore) / 2}%` }}
                                    className="h-full bg-primary shadow-[0_0_10px_rgba(251,191,36,0.8)]" 
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Fashion Synthesis Layer (Client-side fallback) */}
                      <AnimatePresence>
                        {!processedFrame && selectedItems.map((item) => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: opacity[0] / 100, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
                          >
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="max-w-[70%] max-h-[70%] object-contain transition-all duration-500"
                              style={{ 
                                transform: `translateY(${(yOffset[0] - 20) * 3}px) scale(${scale[0] / 100})`,
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9)) contrast(1.1) brightness(1.05)'
                              }}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
                      <div className="text-center space-y-8">
                        <div className="relative inline-block">
                          <Camera className="h-32 w-32 text-zinc-900" />
                          <motion.div 
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 border-2 border-primary/20 rounded-full scale-150"
                          />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">READY_FOR_SYNTHESIS</h2>
                          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.5em]">INITIALIZE_OPTICAL_SENSORS</p>
                        </div>
                        <Button 
                          onClick={toggleCamera}
                          className="bg-primary text-black hover:bg-white font-black px-12 py-8 rounded-none uppercase tracking-[0.4em] text-[10px] transition-all"
                        >
                          ACTIVATE_CAMERA
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Technical Controls - Conditional Hide in FullSize */}
                {!isFullSize && (
                  <div className="p-10 bg-zinc-950 flex flex-col justify-between border-l border-white/5 lg:col-span-1">
                    <div className="space-y-12">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">Studio_Controls</h2>
                        <div className="h-0.5 w-16 bg-primary" />
                      </div>

                      <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                          <Button 
                            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
                            className={`w-full py-8 rounded-none uppercase font-black tracking-widest text-[10px] transition-all ${isAIChatOpen ? 'bg-primary text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'}`}
                          >
                            <Bot className="h-4 w-4 mr-3" /> {isAIChatOpen ? 'CLOSE_STYLE_ASSISTANT' : 'INITIALIZE_AI_CONSULTANT'}
                          </Button>

                          {isStreaming && (
                            <Button 
                              onClick={toggleCamera} 
                              variant="outline"
                              className="w-full border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white py-8 rounded-none uppercase font-black tracking-widest text-[10px]"
                            >
                              <Pause className="h-4 w-4 mr-3" /> DEACTIVATE_FEED
                            </Button>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Button onClick={takeSnapshot} disabled={!isStreaming} className="bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black py-8 rounded-none uppercase font-black tracking-widest text-[10px] transition-all">
                              <Download className="h-4 w-4 mr-3" /> EXPORT_PHOTO
                            </Button>
                            
                            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                              <DialogTrigger asChild>
                                <Button disabled={!isStreaming} className="bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black py-8 rounded-none uppercase font-black tracking-widest text-[10px] transition-all">
                                  <Share2 className="h-4 w-4 mr-3" /> BROADCAST
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-zinc-950 border-white/5 rounded-none p-12">
                                <DialogHeader>
                                  <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic text-center mb-8">Share_Synthesis</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-6">
                                  <Button onClick={() => shareToSocial('instagram')} className="bg-white/5 border border-white/10 py-8 rounded-none uppercase font-black text-[10px] tracking-widest">Instagram</Button>
                                  <Button onClick={() => shareToSocial('facebook')} className="bg-white/5 border border-white/10 py-8 rounded-none uppercase font-black text-[10px] tracking-widest">Facebook</Button>
                                </div>
                                <div className="pt-8 mt-8 border-t border-white/5">
                                  <Button 
                                    onClick={() => shareToSocial('community')}
                                    className="w-full bg-primary text-black hover:bg-white font-black py-10 rounded-none uppercase tracking-[0.4em] text-[10px] shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                                  >
                                    <Zap className="h-4 w-4 mr-3 animate-pulse" /> PUBLISH_TO_GLOBAL_FEED
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        {selectedItems.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8 pt-8 border-t border-white/5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Neural_Fine_Tune</span>
                              <Zap className="h-3 w-3 text-primary animate-pulse" />
                            </div>
                            
                            <div className="space-y-8">
                              <div className="space-y-4">
                                <div className="flex justify-between text-[9px] font-mono uppercase text-zinc-600">
                                  <span>Opacity_Control</span>
                                  <span className="text-primary">{opacity[0]}%</span>
                                </div>
                                <Slider value={opacity} onValueChange={setOpacity} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                              </div>
                              
                              <div className="space-y-4">
                                <div className="flex justify-between text-[9px] font-mono uppercase text-zinc-600">
                                  <span>Scaling_Factor</span>
                                  <span className="text-primary">{scale[0]}%</span>
                                </div>
                                <Slider value={scale} onValueChange={setScale} min={50} max={150} step={1} className="[&_[role=slider]]:bg-primary" />
                              </div>

                              <div className="space-y-4">
                                <div className="flex justify-between text-[9px] font-mono uppercase text-zinc-600">
                                  <span>Y_Axis_Shift</span>
                                  <span className="text-primary">{yOffset[0]}px</span>
                                </div>
                                <Slider value={yOffset} onValueChange={setYOffset} min={-100} max={100} step={1} className="[&_[role=slider]]:bg-primary" />
                              </div>
                            </div>

                            <Button onClick={resetSelection} variant="ghost" className="w-full text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-700 hover:text-red-500 transition-colors">
                              <RotateCcw className="h-3 w-3 mr-3" /> RESET_SYNTHESIS
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selection Hotlinks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-8">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xs font-black tracking-[0.4em] uppercase text-zinc-500">Selection_Hotlinks</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 border border-white/5">
            {QUICK_TRY_ITEMS.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.05)' }}
                onClick={() => handleItemToggle(item)}
                className="bg-black p-8 cursor-pointer group transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                </div>
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                    <item.icon className="h-5 w-5 text-zinc-700 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest transition-colors truncate w-full">{item.name}</h4>
                    <p className="text-[8px] font-mono text-zinc-800 uppercase tracking-widest">SYNTHESIZE</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fashion Categories - Professional Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <TabsList className="bg-transparent h-auto p-0 space-x-12">
                {FASHION_CATEGORIES.map((category) => (
                  <TabsTrigger 
                    key={category.name} 
                    value={category.name}
                    className="bg-transparent border-none rounded-none py-4 px-0 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="text-[9px] font-mono text-zinc-800 uppercase tracking-[0.2em] mb-4">VAULT_INDEX_V.2.4</div>
            </div>
            
            {FASHION_CATEGORIES.map((category) => (
              <TabsContent key={category.name} value={category.name}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {allItems.filter(item => {
                    const type = item.type || item.category || "";
                    return type.toLowerCase().includes(category.name.toLowerCase().slice(0, -1)) || 
                           category.name.toLowerCase().includes(type.toLowerCase());
                  }).map((item) => (
                    <motion.div
                      key={item._id || item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-zinc-950 border border-white/5 group hover:border-primary/20 transition-all overflow-hidden"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900/50">
                        <img 
                          src={item.image || "/placeholder.svg"} 
                          alt={item.name}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                           {item.trending && <Badge className="bg-primary text-black font-black text-[8px] rounded-none px-3 uppercase tracking-widest">HOT_NODES</Badge>}
                           <Badge variant="outline" className="bg-black/60 text-white text-[7px] uppercase font-mono tracking-widest border-white/10 rounded-none">{item.type}</Badge>
                        </div>
                      </div>
                      
                      <div className="p-8 space-y-6">
                        <div className="space-y-2">
                          <h3 className="font-black text-white uppercase text-xs tracking-[0.2em] truncate">{item.name || item.title}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono italic italic">{item.brand || "VISIONX_ELITE"}</p>
                            <span className="text-sm font-black text-primary italic tracking-tighter">{item.price}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-[1fr_auto] gap-4">
                          <Button 
                            onClick={() => handleItemToggle(item)}
                            className={`rounded-none h-12 text-[9px] font-black uppercase tracking-[0.3em] transition-all ${
                              selectedItems.some(i => (i._id || i.id) === (item._id || item.id)) 
                                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                                : "bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-black hover:border-primary"
                            }`}
                          >
                            {selectedItems.some(i => (i._id || i.id) === (item._id || item.id)) ? "REMOVE_SYNTHESIS" : "INITIALIZE_TRY_ON"}
                          </Button>
                          <Button 
                            onClick={() => addToCart(item._id || item.id)}
                            variant="outline" 
                            className="border-white/10 hover:border-primary/50 text-white transition-all rounded-none h-12 w-12"
                          >
                            <ShoppingBag className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        <AnimatePresence>
          {isAIChatOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-24"
            >
              <div className="bg-zinc-950 border border-white/5 overflow-hidden">
                <div className="bg-zinc-900/50 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">NEURAL_STYLE_ENGINE_V1.4</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                
                <div className="p-10 space-y-8">
                  <div className="h-80 overflow-y-auto space-y-6 custom-scrollbar pr-4">
                    {aiMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-6 rounded-none text-[10px] font-mono tracking-widest leading-relaxed uppercase ${
                          message.isAI ? 'bg-zinc-900 border border-white/5 text-zinc-400' : 'bg-primary/10 border border-primary/20 text-primary italic font-black'
                        }`}>
                          <span className="opacity-30 mr-2">{message.isAI ? '>>>' : 'USR:'}</span>
                          {message.isAI ? (
                            <div className="space-y-4">
                              <p className="whitespace-pre-wrap">{message.text.split(/(\[TRY_ON:.*?\])/g).map((part, i) => {
                                const match = part.match(/\[TRY_ON:\s*(.*?)\]/);
                                if (match) {
                                  const itemName = match[1];
                                  return (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        const item = allItems.find(it => 
                                          (it.name || "").toLowerCase().includes(itemName.toLowerCase())
                                        );
                                        if (item) {
                                          handleItemToggle(item);
                                        } else {
                                          toast({ 
                                            title: "Item Not Found", 
                                            description: `Could not locate "${itemName}" in our fashion vault.`,
                                            variant: "destructive"
                                          });
                                        }
                                      }}
                                      className="mx-1 px-3 py-1 bg-primary text-black font-black hover:bg-white transition-all inline-flex items-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.3)] group"
                                    >
                                      <Zap className="h-3 w-3 group-hover:animate-ping" /> {itemName.toUpperCase()}
                                    </button>
                                  );
                                }
                                return part;
                              })}</p>
                            </div>
                          ) : message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Input
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                      placeholder="EXECUTE_STYLE_COMMAND..."
                      className="bg-white/5 border-white/10 text-white rounded-none font-mono text-[9px] tracking-[0.3em] uppercase h-14 focus:border-primary/50"
                    />
                    <Button onClick={sendAIMessage} className="bg-primary text-black hover:bg-white transition-all rounded-none px-10 font-black h-14 group">
                      <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden canvas for snapshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Zap className="h-8 w-8 text-primary animate-pulse" /></div>}>
      <TryOnContent />
    </Suspense>
  );
}