'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Download, RotateCcw, Pause, Play, Settings, Image as ImageIcon, 
  Heart, Share2, MessageCircle, ShoppingCart, ExternalLink, Bot, Send,
  Star, TrendingUp, Sparkles, X, Facebook, Twitter, Instagram, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const fashionCategories = {
  "Old Money": [
    { 
      id: 1, 
      name: "Classic Blazer", 
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg", 
      type: "jacket",
      price: "₹1999",
      originalPrice: "₹3000",
      brand: "Luxury Brands",
      rating: 4.8,
      reviews: 234,
      amazonLink: "https://amazon.com/classic-blazer",
      flipkartLink: "https://flipkart.com/classic-blazer",
      myntraLink: "https://myntra.com/classic-blazer"
    },
    { 
      id: 2, 
      name: "Pearl Necklace", 
      image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg", 
      type: "accessory",
      price: "₹250",
      originalPrice: "500",
      brand: "Elegant Jewelry",
      rating: 4.9,
      reviews: 156,
      amazonLink: "https://amazon.com/pearl-necklace",
      flipkartLink: "https://flipkart.com/pearl-necklace",
      myntraLink: "https://myntra.com/pearl-necklace"
    },
    { 
      id: 3, 
      name: "Silk Scarf", 
      image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg", 
      type: "accessory",
      price: "₹150",
      originalPrice: "₹300",
      brand: "Silk Couture",
      rating: 4.7,
      reviews: 89,
      amazonLink: "https://amazon.com/silk-scarf",
      flipkartLink: "https://flipkart.com/silk-scarf",
      myntraLink: "https://myntra.com/silk-scarf"
    }
  ],
  "Streetwear": [
    { 
      id: 4, 
      name: "Graphic Hoodie", 
      image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg", 
      type: "top",
      price: "₹550",
      originalPrice: "₹999",
      brand: "Urban Street",
      rating: 4.6,
      reviews: 298,
      amazonLink: "https://amazon.com/graphic-hoodie",
      flipkartLink: "https://flipkart.com/graphic-hoodie",
      myntraLink: "https://myntra.com/graphic-hoodie"
    },
    { 
      id: 5, 
      name: "Bucket Hat", 
      image: "https://images.pexels.com/photos/1687675/pexels-photo-1687675.jpeg", 
      type: "accessory",
      price: "₹199",
      originalPrice: "₹399",
      brand: "Street Style",
      rating: 4.4,
      reviews: 167,
      amazonLink: "https://amazon.com/bucket-hat",
      flipkartLink: "https://flipkart.com/bucket-hat",
      myntraLink: "https://myntra.com/bucket-hat"
    },
    { 
      id: 6, 
      name: "Chain Necklace", 
      image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg", 
      type: "accessory",
      price: "₹799",
      originalPrice: "₹999",
      brand: "Urban Jewelry",
      rating: 4.5,
      reviews: 203,
      amazonLink: "https://amazon.com/chain-necklace",
      flipkartLink: "https://flipkart.com/chain-necklace",
      myntraLink: "https://myntra.com/chain-necklace"
    }
  ],
  "Formal": [
    { 
      id: 7, 
      name: "Business Suit", 
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg", 
      type: "suit",
      price: "₹2999",
      originalPrice: "₹4999",
      brand: "Executive Style",
      rating: 4.9,
      reviews: 145,
      amazonLink: "https://amazon.com/business-suit",
      flipkartLink: "https://flipkart.com/business-suit",
      myntraLink: "https://myntra.com/business-suit"
    },
    { 
      id: 8, 
      name: "Dress Watch", 
      image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg", 
      type: "accessory",
      price: "₹549",
      originalPrice: "₹749",
      brand: "Timepiece Co",
      rating: 4.8,
      reviews: 189,
      amazonLink: "https://amazon.com/dress-watch",
      flipkartLink: "https://flipkart.com/dress-watch",
      myntraLink: "https://myntra.com/dress-watch"
    },
    { 
      id: 9, 
      name: "Silk Tie", 
      image: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg", 
      type: "accessory",
      price: "₹149",
      originalPrice: "₹249",
      brand: "Classic Ties",
      rating: 4.6,
      reviews: 234,
      amazonLink: "https://amazon.com/silk-tie",
      flipkartLink: "https://flipkart.com/silk-tie",
      myntraLink: "https://myntra.com/silk-tie"
    }
  ],
  "Techcore": [
    { 
      id: 10, 
      name: "Tech Jacket", 
      image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg", 
      type: "jacket",
      price: "₹1599",
      originalPrice: "₹1999",
      brand: "Future Wear",
      rating: 4.7,
      reviews: 178,
      amazonLink: "https://amazon.com/tech-jacket",
      flipkartLink: "https://flipkart.com/tech-jacket",
      myntraLink: "https://myntra.com/tech-jacket"
    },
    { 
      id: 11, 
      name: "Smart Glasses", 
      image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg", 
      type: "glasses",
      price: "₹299",
      originalPrice: "₹399",
      brand: "Tech Vision",
      rating: 4.5,
      reviews: 123,
      amazonLink: "https://amazon.com/smart-glasses",
      flipkartLink: "https://flipkart.com/smart-glasses",
      myntraLink: "https://myntra.com/smart-glasses"
    },
    { 
      id: 12, 
      name: "Utility Vest", 
      image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg", 
      type: "vest",
      price: "₹429",
      originalPrice: "₹549",
      brand: "Functional Fashion",
      rating: 4.4,
      reviews: 156,
      amazonLink: "https://amazon.com/utility-vest",
      flipkartLink: "https://flipkart.com/utility-vest",
      myntraLink: "https://myntra.com/utility-vest"
    }
  ]
};

const recommendedForYou = [
  {
    id: 101,
    name: "Autumn Cashmere Coat",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    price: "₹1149",
    originalPrice: "₹1999",
    brand: "Seasonal Style",
    rating: 4.9,
    match: "95% Match",
    reason: "Perfect for your face shape and style preference"
  },
  {
    id: 102,
    name: "Vintage Gold Watch",
    image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
    price: "₹5499",
    originalPrice: "₹5999",
    brand: "Vintage Time",
    rating: 4.8,
    match: "92% Match",
    reason: "Complements your skin tone beautifully"
  },
  {
    id: 103,
    name: "Designer Sunglasses",
    image: "https://images.pexels.com/photos/1687675/pexels-photo-1687675.jpeg",
    price: "₹1159",
    originalPrice: "₹1229",
    brand: "Luxury Eyewear",
    rating: 4.7,
    match: "89% Match",
    reason: "Ideal for your face structure"
  }
];

const trendingNow = [
  {
    id: 201,
    name: "Oversized Blazer Trend",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    price: "₹1229",
    brand: "Trend Setters",
    trending: "+45%",
    likes: 2340
  },
  {
    id: 202,
    name: "Chunky Gold Chains",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg",
    price: "₹1189",
    brand: "Street Gold",
    trending: "+67%",
    likes: 1890
  },
  {
    id: 203,
    name: "Tech Wear Aesthetic",
    image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
    price: "₹1299",
    brand: "Future Fashion",
    trending: "+89%",
    likes: 3456
  }
];

export default function TryOnPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Old Money");
  const [opacity, setOpacity] = useState([80]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, text: "Hi! I'm your AI Style Assistant. I can help you choose the perfect outfit and give you styling advice. How are you feeling about your current look?", isAI: true }
  ]);
  const [aiInput, setAiInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isStreaming) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isStreaming]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleCamera = () => {
    setIsStreaming(!isStreaming);
  };

  const selectItem = (item: any) => {
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
    }, 1000);
  };

  const removeItem = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to Cart",
      description: `₹{item.name} has been added to your cart.`,
    });
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
            a.download = `visionx-tryon-₹{Date.now()}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }
  };

  const resetSelection = () => {
    setSelectedItems([]);
  };

  const shareToSocial = (platform: string) => {
    const text = "Check out my virtual try-on with VisionX! 🔥";
    const url = window.location.href;
    
    switch (platform) {
      case 'instagram':
        toast({
          title: "Instagram Sharing",
          description: "Screenshot saved! Share it on your Instagram story.",
        });
        takeSnapshot();
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=₹{encodeURIComponent(url)}&quote=₹{encodeURIComponent(text)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=₹{encodeURIComponent(text)}&url=₹{encodeURIComponent(url)}`);
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

  const sendAIMessage = () => {
    if (!aiInput.trim()) return;

    const userMessage = { id: aiMessages.length + 1, text: aiInput, isAI: false };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That outfit looks fantastic on you! The colors really complement your skin tone. Have you considered adding a statement accessory?",
        "I love this combination! The style suits your face shape perfectly. You might want to try a different color variation - maybe something in navy or burgundy?",
        "Great choice! This look is very trendy right now. To complete the outfit, I'd suggest adding some minimalist jewelry or a classic watch.",
        "You're rocking this style! The fit looks perfect. This would be great for both casual and semi-formal occasions.",
        "Excellent taste! This outfit shows great style awareness. You could experiment with layering - maybe add a light cardigan or jacket?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiResponse = { id: aiMessages.length + 2, text: randomResponse, isAI: true };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const allItems = Object.values(fashionCategories).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Virtual Try-On Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience fashion in real-time. Select items, get AI advice, and shop directly from your virtual wardrobe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Live Camera</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isStreaming ? "default" : "secondary"}>
                      {isStreaming ? "Live" : "Paused"}
                    </Badge>
                    {cart.length > 0 && (
                      <Badge className="bg-purple-600 text-white">
                        Cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera/Video Area */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {isStreaming ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Fashion Overlays */}
                      <AnimatePresence>
                        {selectedItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: opacity[0] / 100, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            <div className="relative w-full h-full">
                              {item.type === 'glasses' && (
                                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-12 bg-black/20 backdrop-blur-sm rounded-lg border-2 border-white/30" />
                              )}
                              {item.type === 'accessory' && (
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-80" />
                              )}
                              {item.type === 'jacket' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg opacity-70" />
                              )}
                              {item.type === 'top' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-40 h-48 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg opacity-70" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {isLoading && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center space-y-4">
                        <Camera className="h-16 w-16 mx-auto opacity-50" />
                        <p className="text-lg">Camera is paused</p>
                        <p className="text-sm opacity-75">Click start to begin try-on</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button onClick={toggleCamera} variant="outline" size="sm">
                      {isStreaming ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isStreaming ? 'Pause' : 'Start'} Camera
                    </Button>
                    
                    {selectedItems.length > 0 && (
                      <Button onClick={resetSelection} variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button onClick={takeSnapshot} variant="default" size="sm" disabled={!isStreaming}>
                      <Download className="h-4 w-4 mr-2" />
                      Snapshot
                    </Button>
                    
                    <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!isStreaming}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Share Your Look</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <Button onClick={() => shareToSocial('instagram')} className="flex items-center space-x-2">
                            <Instagram className="h-4 w-4" />
                            <span>Instagram</span>
                          </Button>
                          <Button onClick={() => shareToSocial('facebook')} className="flex items-center space-x-2">
                            <Facebook className="h-4 w-4" />
                            <span>Facebook</span>
                          </Button>
                          <Button onClick={() => shareToSocial('twitter')} className="flex items-center space-x-2">
                            <Twitter className="h-4 w-4" />
                            <span>Twitter</span>
                          </Button>
                          <Button onClick={() => shareToSocial('copy')} className="flex items-center space-x-2">
                            <Copy className="h-4 w-4" />
                            <span>Copy Link</span>
                          </Button>
                        </div>
                        <Link href="/community">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                            Share to VisionX Community
                          </Button>
                        </Link>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Opacity Control */}
                {selectedItems.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Overlay Opacity: {opacity[0]}%
                    </label>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Style Assistant */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <span>AI Style Assistant</span>
                  </CardTitle>
                  <Button 
                    onClick={() => setIsAIChatOpen(!isAIChatOpen)} 
                    variant="outline" 
                    size="sm"
                  >
                    {isAIChatOpen ? 'Hide' : 'Chat'}
                  </Button>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {isAIChatOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent className="space-y-4">
                      <div className="h-64 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
                        {aiMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ₹{message.isAI ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ₹{
                                message.isAI
                                  ? 'bg-white text-gray-800 shadow-sm'
                                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              }`}
                            >
                              {message.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Input
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                          placeholder="Ask for styling advice..."
                          className="flex-1"
                        />
                        <Button onClick={sendAIMessage} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Fashion Selection Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Current Outfit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-sm">{item.name}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-purple-600 font-semibold text-sm">{item.price}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            onClick={() => addToCart(item)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          >
                            ×
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Shopping Links */}
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">Shop this look:</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Amazon
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Flipkart
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Myntra
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended For You */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>Recommended For You</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedForYou.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 cursor-pointer"
                  >
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.brand}</p>
                            <Badge className="text-xs bg-green-100 text-green-700 mt-1">
                              {item.match}
                            </Badge>
                          </div>
                          <button
                            onClick={() => toggleLike(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className={`h-4 w-4 ₹{likedItems.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{item.reason}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-gray-900">{item.price}</span>
                            <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              onClick={() => addToCart(item)}
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-6 px-2"
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                            <Button 
                              onClick={() => selectItem(item)}
                              size="sm" 
                              className="text-xs h-6 px-2 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Try
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Now */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span>Trending Now</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingNow.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 cursor-pointer"
                  >
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.brand}</p>
                            <Badge className="text-xs bg-orange-100 text-orange-700 mt-1">
                              {item.trending}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Heart className="h-3 w-3" />
                            <span>{item.likes}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-sm text-gray-900">{item.price}</span>
                          <Button 
                            onClick={() => selectItem(item)}
                            size="sm" 
                            className="text-xs h-6 px-2 bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Try Trend
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Fashion Categories */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Fashion Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    {Object.keys(fashionCategories).map((category) => (
                      <TabsTrigger 
                        key={category} 
                        value={category}
                        className="text-xs"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {Object.entries(fashionCategories).map(([category, items]) => (
                    <TabsContent key={category} value={category} className="space-y-3">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                            <ImageIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500 capitalize">{item.brand}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-purple-600 font-semibold text-sm">{item.price}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{item.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Button 
                              onClick={() => selectItem(item)}
                              variant="outline" 
                              size="sm"
                              className="text-xs h-6 px-2"
                            >
                              Try
                            </Button>
                            <Button 
                              onClick={() => addToCart(item)}
                              variant="outline" 
                              size="sm"
                              className="text-xs h-6 px-2"
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Hidden canvas for snapshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}