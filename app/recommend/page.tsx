'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Camera, TrendingUp, ArrowRight, RefreshCw, Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const latestFashionTrends = [
  {
    id: 1,
    title: "Autumn Elegance Collection",
    brand: "Luxury Brands",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    price: "$299",
    originalPrice: "$399",
    discount: "25% OFF",
    rating: 4.8,
    reviews: 234,
    likes: 1240,
    category: "Old Money",
    trending: true,
    description: "Timeless cashmere blend with sophisticated tailoring"
  },
  {
    id: 2,
    title: "Urban Street Collection",
    brand: "StreetWear Co",
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
    price: "$89",
    originalPrice: "$129",
    discount: "31% OFF",
    rating: 4.6,
    reviews: 189,
    likes: 890,
    category: "Streetwear",
    trending: true,
    description: "Bold graphics meet contemporary urban aesthetics"
  },
  {
    id: 3,
    title: "Tech Future Wear",
    brand: "TechCore",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    price: "$199",
    originalPrice: "$249",
    discount: "20% OFF",
    rating: 4.9,
    reviews: 156,
    likes: 2150,
    category: "Techcore",
    trending: true,
    description: "Innovative fabrics with functional design elements"
  },
  {
    id: 4,
    title: "Bohemian Dreams",
    brand: "Free Spirit",
    image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg",
    price: "$159",
    originalPrice: "$199",
    discount: "20% OFF",
    rating: 4.7,
    reviews: 298,
    likes: 1680,
    category: "Bohemian",
    trending: false,
    description: "Flowing fabrics with artistic patterns and textures"
  },
  {
    id: 5,
    title: "Minimalist Essentials",
    brand: "Clean Lines",
    image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
    price: "$129",
    originalPrice: "$169",
    discount: "24% OFF",
    rating: 4.5,
    reviews: 167,
    likes: 950,
    category: "Minimalist",
    trending: false,
    description: "Clean cuts with perfect tailoring and premium materials"
  },
  {
    id: 6,
    title: "Vintage Revival",
    brand: "Retro Chic",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg",
    price: "$179",
    originalPrice: "$229",
    discount: "22% OFF",
    rating: 4.6,
    reviews: 203,
    likes: 1340,
    category: "Vintage",
    trending: true,
    description: "Classic vintage pieces with modern comfort"
  }
];

const fashionRecommendations = [
  {
    id: 1,
    style: "Old Money Elegance",
    match: 92,
    description: "Your classic features and sophisticated aura perfectly match timeless elegance",
    items: [
      { name: "Cashmere Blazer", price: "$299", image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg" },
      { name: "Pearl Necklace", price: "$149", image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg" },
      { name: "Silk Scarf", price: "$89", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg" }
    ],
    colors: ["Cream", "Navy", "Beige", "White"],
    gradient: "from-amber-100 to-amber-200"
  },
  {
    id: 2,
    style: "Modern Minimalist",
    match: 87,
    description: "Clean lines and subtle sophistication complement your aesthetic",
    items: [
      { name: "Structured Coat", price: "$199", image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg" },
      { name: "Minimal Watch", price: "$249", image: "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg" },
      { name: "Clean Sneakers", price: "$129", image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg" }
    ],
    colors: ["Black", "White", "Gray", "Charcoal"],
    gradient: "from-gray-100 to-gray-200"
  },
  {
    id: 3,
    style: "Bohemian Chic",
    match: 78,
    description: "Your creative spirit aligns with free-flowing, artistic fashion",
    items: [
      { name: "Flowy Maxi Dress", price: "$159", image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg" },
      { name: "Statement Jewelry", price: "$79", image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg" },
      { name: "Leather Boots", price: "$189", image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg" }
    ],
    colors: ["Terracotta", "Sage", "Burgundy", "Mustard"],
    gradient: "from-orange-100 to-red-200"
  }
];

const analysisSteps = [
  { step: 1, title: "Face Analysis", description: "Analyzing facial features and skin tone" },
  { step: 2, title: "Style Mapping", description: "Matching features to fashion styles" },
  { step: 3, title: "Trend Analysis", description: "Incorporating current fashion trends" },
  { step: 4, title: "Personalization", description: "Creating your unique style profile" }
];

export default function RecommendPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("trending");
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setCurrentStep(0);
    setProgress(0);

    // Simulate analysis process
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
          }, 500);
          return 100;
        }
        return newProgress;
      });

      setCurrentStep(prev => Math.min(prev + 1, analysisSteps.length - 1));
    }, 1500);
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setIsAnalyzing(false);
    setProgress(0);
    setCurrentStep(0);
  };

  const toggleLike = (itemId: number) => {
    setLikedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const trendingItems = latestFashionTrends.filter(item => item.trending);
  const allItems = latestFashionTrends;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AI Fashion Recommender
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your perfect style with our advanced AI analysis and explore the latest fashion trends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analysis Section */}
            {!isAnalyzing && !showResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="space-y-4"
                    >
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                        <User className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-bold">Analyze My Style</h3>
                      <p className="text-purple-100">
                        Our AI will analyze your features and recommend the perfect fashion styles for you
                      </p>
                      <Button
                        onClick={startAnalysis}
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full w-full"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Start Analysis
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Analysis Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl">Analyzing Your Style...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                        />
                        <p className="text-lg font-medium text-gray-700">
                          {analysisSteps[currentStep]?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {analysisSteps[currentStep]?.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {analysisSteps.map((step, index) => (
                          <div
                            key={step.step}
                            className={`text-center p-3 rounded-lg transition-colors ${
                              index <= currentStep
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <div className="text-xs font-medium">{step.title}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                      className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analysis Complete!
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Your Personalized Style Recommendations
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Based on our AI analysis, here are the styles that suit you best
                    </p>
                    
                    <div className="flex justify-center space-x-4">
                      <Button onClick={resetAnalysis} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyze
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {fashionRecommendations.map((recommendation, index) => (
                      <motion.div
                        key={recommendation.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`shadow-lg border-0 bg-gradient-to-r ${recommendation.gradient} overflow-hidden`}>
                          <CardContent className="p-0">
                            <div className="grid md:grid-cols-3 gap-6 p-6">
                              {/* Style Info */}
                              <div className="md:col-span-1 space-y-4">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-white/20 text-gray-700 font-medium">
                                    {recommendation.match}% Match
                                  </Badge>
                                  <TrendingUp className="h-5 w-5 text-gray-600" />
                                </div>
                                
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {recommendation.style}
                                  </h3>
                                  <p className="text-gray-700 text-sm">
                                    {recommendation.description}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Perfect Colors:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {recommendation.colors.map((color) => (
                                      <Badge key={color} variant="secondary" className="text-xs">
                                        {color}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Link href="/try-on">
                                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                                    Try This Style
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>

                              {/* Recommended Items */}
                              <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-900 mb-4">Recommended Items:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {recommendation.items.map((item) => (
                                    <motion.div
                                      key={item.name}
                                      whileHover={{ scale: 1.05 }}
                                      className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center space-y-2"
                                    >
                                      <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                        <img 
                                          src={item.image} 
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <h5 className="font-medium text-sm text-gray-900">{item.name}</h5>
                                      <p className="text-purple-600 font-semibold text-sm">{item.price}</p>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Latest Fashion Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Latest Fashion</h3>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="all">All Items</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trending" className="space-y-4">
                    {trendingItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.brand}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">{item.rating}</span>
                                  <span className="text-xs text-gray-400">({item.reviews})</span>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleLike(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-gray-900">{item.price}</span>
                                <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {item.discount}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Eye className="h-3 w-3" />
                                <span>{item.likes}</span>
                              </div>
                              <Link href="/try-on">
                                <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white">
                                  Try On
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="all" className="space-y-4">
                    {allItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.brand}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">{item.rating}</span>
                                  <span className="text-xs text-gray-400">({item.reviews})</span>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleLike(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart className={`h-4 w-4 ${likedItems.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-gray-900">{item.price}</span>
                                <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {item.discount}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Eye className="h-3 w-3" />
                                <span>{item.likes}</span>
                              </div>
                              <Link href="/try-on">
                                <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white">
                                  Try On
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}