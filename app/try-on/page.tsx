'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Download, RotateCcw, Pause, Play, Settings, Image as ImageIcon, 
  Heart, Share2, MessageCircle, ShoppingCart, ExternalLink, Bot, Send,
  Star, TrendingUp, Sparkles, X, Facebook, Twitter, Instagram, Copy, Shirt, 
  Glasses, Watch, Crown, Zap
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
  "Tops": [
    { 
      id: 1, 
      name: "Classic White Shirt", 
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg", 
      type: "shirt",
      price: "₹1999",
      originalPrice: "₹3000",
      brand: "Luxury Brands",
      rating: 4.8,
      reviews: 234,
      category: "Formal"
    },
    { 
      id: 2, 
      name: "Casual T-Shirt", 
      image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg", 
      type: "tshirt",
      price: "₹799",
      originalPrice: "₹1200",
      brand: "Street Style",
      rating: 4.6,
      reviews: 189,
      category: "Casual"
    },
    { 
      id: 3, 
      name: "Designer Hoodie", 
      image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg", 
      type: "hoodie",
      price: "₹2499",
      originalPrice: "₹3500",
      brand: "Urban Wear",
      rating: 4.7,
      reviews: 156,
      category: "Streetwear"
    }
  ],
  "Accessories": [
    { 
      id: 4, 
      name: "Designer Sunglasses", 
      image: "https://images.pexels.com/photos/1687675/pexels-photo-1687675.jpeg", 
      type: "glasses",
      price: "₹3999",
      originalPrice: "₹5999",
      brand: "Luxury Eyewear",
      rating: 4.9,
      reviews: 298,
      category: "Accessories"
    },
    { 
      id: 5, 
      name: "Smart Watch", 
      image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg", 
      type: "watch",
      price: "₹15999",
      originalPrice: "₹19999",
      brand: "Tech Wear",
      rating: 4.8,
      reviews: 167,
      category: "Tech"
    },
    { 
      id: 6, 
      name: "Gold Chain", 
      image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg", 
      type: "jewelry",
      price: "₹8999",
      originalPrice: "₹12999",
      brand: "Luxury Jewelry",
      rating: 4.7,
      reviews: 203,
      category: "Jewelry"
    }
  ],
  "Outerwear": [
    { 
      id: 7, 
      name: "Leather Jacket", 
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg", 
      type: "jacket",
      price: "₹12999",
      originalPrice: "₹18999",
      brand: "Premium Leather",
      rating: 4.9,
      reviews: 145,
      category: "Outerwear"
    },
    { 
      id: 8, 
      name: "Denim Jacket", 
      image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg", 
      type: "jacket",
      price: "₹3999",
      originalPrice: "₹5999",
      brand: "Denim Co",
      rating: 4.6,
      reviews: 189,
      category: "Casual"
    }
  ]
};

const quickTryItems = [
  {
    id: 101,
    name: "Trending Oversized Hoodie",
    image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg",
    type: "hoodie",
    trending: true,
    icon: Shirt
  },
  {
    id: 102,
    name: "Classic Aviators",
    image: "https://images.pexels.com/photos/1687675/pexels-photo-1687675.jpeg",
    type: "glasses",
    trending: true,
    icon: Glasses
  },
  {
    id: 103,
    name: "Luxury Watch",
    image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg",
    type: "watch",
    trending: false,
    icon: Watch
  },
  {
    id: 104,
    name: "Statement Necklace",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg",
    type: "jewelry",
    trending: true,
    icon: Crown
  }
];

export default function TryOnPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tops");
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
      toast({
        title: "Item Applied",
        description: `${item.name} has been applied to your virtual try-on.`,
      });
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
      description: `${item.name} has been added to your cart.`,
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
            a.download = `visionx-tryon-${Date.now()}.jpg`;
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

  const sendAIMessage = () => {
    if (!aiInput.trim()) return;

    const userMessage = { id: aiMessages.length + 1, text: aiInput, isAI: false };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");

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

        {/* Main Camera Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-6 w-6 text-purple-600" />
                  <span>Live Virtual Try-On</span>
                </CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant={isStreaming ? "default" : "secondary"} className="px-3 py-1">
                    {isStreaming ? "🔴 Live" : "⏸️ Paused"}
                  </Badge>
                  {cart.length > 0 && (
                    <Badge className="bg-purple-600 text-white px-3 py-1">
                      🛒 {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Camera/Video Area - Larger */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video mb-6 shadow-2xl">
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
                              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-16 bg-black/30 backdrop-blur-sm rounded-2xl border-2 border-white/40 shadow-lg" />
                            )}
                            {item.type === 'jewelry' && (
                              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full opacity-80 shadow-lg" />
                            )}
                            {item.type === 'jacket' && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-72 bg-gradient-to-b from-gray-700 to-gray-900 rounded-2xl opacity-75 shadow-2xl" />
                            )}
                            {(item.type === 'shirt' || item.type === 'tshirt' || item.type === 'hoodie') && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-48 h-56 bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl opacity-75 shadow-xl" />
                            )}
                            {item.type === 'watch' && (
                              <div className="absolute top-1/2 right-1/3 w-12 h-16 bg-gradient-to-b from-gray-800 to-black rounded-lg opacity-80 shadow-lg" />
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
                          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
                        />
                      </div>
                    )}

                    {/* Item Info Overlay */}
                    {selectedItems.length > 0 && (
                      <div className="absolute top-4 left-4 space-y-2">
                        {selectedItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm"
                          >
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-80">{item.price}</div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center space-y-6">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Camera className="h-24 w-24 mx-auto opacity-60" />
                      </motion.div>
                      <div>
                        <p className="text-2xl font-semibold mb-2">Ready to Try On?</p>
                        <p className="text-lg opacity-75">Click start to begin your virtual fashion experience</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={toggleCamera} 
                    size="lg"
                    className={`px-6 py-3 rounded-full font-semibold ${
                      isStreaming 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isStreaming ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isStreaming ? 'Stop Camera' : 'Start Camera'}
                  </Button>
                  
                  {selectedItems.length > 0 && (
                    <Button onClick={resetSelection} variant="outline" size="lg" className="px-6 py-3 rounded-full">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset All
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Button onClick={takeSnapshot} variant="default" size="lg" disabled={!isStreaming} className="px-6 py-3 rounded-full">
                    <Download className="h-5 w-5 mr-2" />
                    Save Photo
                  </Button>
                  
                  <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg" disabled={!isStreaming} className="px-6 py-3 rounded-full">
                        <Share2 className="h-5 w-5 mr-2" />
                        Share Look
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share Your Virtual Look</DialogTitle>
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
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Overlay Opacity: {opacity[0]}%
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpacity([opacity[0] === 100 ? 50 : 100])}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
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
        </motion.div>

        {/* Quick Try Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span>Quick Try</span>
                <Badge className="bg-orange-100 text-orange-700 text-xs">Trending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickTryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectItem(item)}
                    className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all group"
                  >
                    {item.trending && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        🔥 Hot
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
                        <item.icon className="h-8 w-8 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">{item.name}</h4>
                      <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs">
                        Try Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fashion Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Fashion Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {Object.keys(fashionCategories).map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-sm font-medium"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(fashionCategories).map(([category, items]) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                        >
                          <div className="relative">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => toggleLike(item.id)}
                              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                            >
                              <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </button>
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-black/60 text-white text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                            
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{item.rating}</span>
                                <span className="text-xs text-gray-400">({item.reviews})</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg text-gray-900">{item.price}</span>
                                <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                {Math.round((1 - parseInt(item.price.replace('₹', '').replace(',', '')) / parseInt(item.originalPrice.replace('₹', '').replace(',', ''))) * 100)}% OFF
                              </Badge>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => selectItem(item)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                Try On
                              </Button>
                              <Button 
                                onClick={() => addToCart(item)}
                                variant="outline" 
                                size="icon"
                                className="border-purple-200 hover:border-purple-300 text-purple-600"
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Style Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
                  {isAIChatOpen ? 'Hide Chat' : 'Open Chat'}
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
                          className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
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
                      <Button onClick={sendAIMessage} size="icon" className="bg-purple-600 hover:bg-purple-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>

      {/* Hidden canvas for snapshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}