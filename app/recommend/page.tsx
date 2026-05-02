'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, TrendingUp, Bot, Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { analyzeFashion } from '@/lib/ml_model';
import { CLOTHING_ITEMS, AI_ANALYSIS_STEPS } from '@/config/fashion-data';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

import { PhotoInput } from '@/components/recommend/PhotoInput';
import { AnalysisWorkflow } from '@/components/recommend/AnalysisWorkflow';
import { StyleRecommendations } from '@/components/recommend/StyleRecommendations';
import { StyleRecommendation } from '@/types/fashion';

const getFashionTrends = (products: any[]) => {
  const source = products.length > 0 ? products : CLOTHING_ITEMS;
  return source.map(item => ({
    ...item,
    title: item.name,
    brand: item.brand || "VisionX Elite",
    discount: item.discount || "20% OFF",
    rating: item.rating || 4.8,
    reviews: item.reviews || 120,
    likes: item.likes || 850,
    category: item.type,
    originalPrice: item.originalPrice || ("₹" + (parseInt(item.price.replace(/[^0-9]/g, '')) * 1.2).toFixed(0)),
    description: item.description || `Premium ${item.name} for your unique style.`
  }));
};

export default function RecommendPage() {
  const { addToCart } = useCart();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("trending");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [consultationText, setConsultationText] = useState("");
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultationResult, setConsultationResult] = useState("");
  const [outfitScore, setOutfitScore] = useState<number | null>(null);
  const [outfitFeedback, setOutfitFeedback] = useState("");
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchAnalysis();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setDbProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const res = await fetch('/api/analysis');
      const data = await res.json();
      if (data && data.results) {
        setAnalysisData(data.results);
        setCapturedImage(data.image);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Failed to fetch saved analysis:", err);
    }
  };

  const handleStartAnalysis = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);

    try {
      // Step simulation
      for (let i = 0; i < AI_ANALYSIS_STEPS.length; i++) {
        setCurrentStep(i);
        for (let j = 0; j < 25; j++) {
          setProgress((prev) => Math.min(prev + 1, (i + 1) * 25));
          await new Promise((r) => setTimeout(r, 40));
        }
      }

      const results = await analyzeFashion(capturedImage);
      setRecommendations(results.recommendations);
      setAnalysisData(results);
      setShowResults(true);

      await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage, results })
      });

      toast.success("Synthesis complete. Results loaded.");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Neural synthesis failed. Check connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConsultation = async () => {
    if (!consultationText.trim()) return;
    setIsConsulting(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Based on this description: "${consultationText}", recommend fashion styles and items. Use [TRY_ON: Item Name] format.`,
          history: []
        })
      });
      const data = await res.json();
      setConsultationResult(data.text);
    } catch (err) {
      console.error("Consultation failed:", err);
    } finally {
      setIsConsulting(false);
    }
  };

  const toggleLike = async (itemId: number) => {
    const isLiked = likedItems.includes(itemId);
    setLikedItems((prev: number[]) => isLiked ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    try {
      await fetch('/api/products/engagement', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, action: isLiked ? 'unlike' : 'like' })
      });
    } catch (err) {
      console.error("Failed to update engagement:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-16 px-4 font-sans">
      <div className="absolute inset-0 cyber-grid opacity-10 -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <Badge className="bg-primary text-black font-black text-[8px] uppercase tracking-[0.3em] rounded-none px-3 py-1">Neural_Synthesis_V4.2</Badge>
              <div className="h-px w-24 bg-white/10" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">ML_Status: Online</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
              Style<span className="text-primary text-glow-amber">_Synthesis</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.4em] max-w-xl">
              Advanced generative fashion protocols // Deploy your biometrics for automated wardrobe synchronization.
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!isAnalyzing && !showResults ? (
            <PhotoInput 
              onImageCapture={setCapturedImage}
              isAnalyzing={isAnalyzing}
              onStartAnalysis={handleStartAnalysis}
              consultationText={consultationText}
              setConsultationText={setConsultationText}
              onConsultation={handleConsultation}
              isConsulting={isConsulting}
            />
          ) : isAnalyzing ? (
            <AnalysisWorkflow 
              isAnalyzing={isAnalyzing}
              currentStep={currentStep}
              progress={progress}
              steps={AI_ANALYSIS_STEPS}
              capturedImage={capturedImage}
            />
          ) : (
            <StyleRecommendations 
              recommendations={recommendations}
              onAddToCart={addToCart}
              onToggleLike={toggleLike}
              likedItems={likedItems}
            />
          )}
        </AnimatePresence>

        {/* Global Feed Access */}
        <div className="pt-24 border-t border-white/5 flex flex-col items-center space-y-10">
           <div className="flex items-center gap-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white">Latest_Global_Synthesis</h3>
              <Sparkles className="h-5 w-5 text-primary" />
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full opacity-40 hover:opacity-100 transition-opacity duration-700">
              {getFashionTrends(dbProducts).slice(0, 4).map((item, idx) => (
                <div key={idx} className="aspect-[3/4] bg-zinc-900/50 border border-white/5 relative overflow-hidden group/item">
                   <img src={item.image} className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700" alt="Trend" />
                   <div className="absolute bottom-4 left-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white">{item.name}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
