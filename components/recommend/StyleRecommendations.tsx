'use client';

import { motion } from 'framer-motion';
import { 
  Heart, Eye, ShoppingCart, Zap, Star, ExternalLink, Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyleRecommendation, RecommendationItem } from '@/types/fashion';

interface StyleRecommendationsProps {
  recommendations: StyleRecommendation[];
  onAddToCart: (item: any) => void;
  onToggleLike: (id: number) => void;
  likedItems: number[];
}

export function StyleRecommendations({ 
  recommendations, 
  onAddToCart, 
  onToggleLike, 
  likedItems 
}: StyleRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16"
    >
      <div className="flex items-center gap-6">
        <div className="h-px flex-1 bg-white/5" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">SYNTHESIS_RESULTS_LOADED</h3>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {recommendations.map((rec, idx) => (
          <Card key={idx} className="bg-zinc-950 border-white/10 rounded-none overflow-hidden relative group shadow-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${rec.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-700`} />
            
            <CardContent className="p-12 space-y-10 relative">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <Badge className="bg-primary text-black font-black text-[8px] uppercase tracking-widest rounded-none">Recommended_Protocol</Badge>
                     <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Match: {rec.match}%</span>
                  </div>
                  <h4 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
                    {rec.style.replace(' ', '_')}
                  </h4>
                </div>
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center border border-white/10">
                   <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed max-w-lg italic">
                "{rec.description}"
              </p>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Recommended_Palette</p>
                   <div className="flex gap-2">
                     {rec.colors.map((color, i) => (
                       <div key={i} className="w-8 h-8 rounded-none border border-white/10" style={{ backgroundColor: color }} />
                     ))}
                   </div>
                </div>
                <div className="space-y-4">
                   <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Biometric_Sync</p>
                   <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-white uppercase">{rec.skinTone} Tone</span>
                      <span className="text-[10px] font-mono text-white uppercase">{rec.bodyType} Build</span>
                   </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <p className="text-[9px] font-black text-white uppercase tracking-widest">Essential_Synthesis_Items</p>
                <div className="grid grid-cols-2 gap-6">
                  {rec.items.map((item, i) => (
                    <div key={i} className="bg-zinc-900/50 p-6 border border-white/5 space-y-4 group/item hover:border-primary/30 transition-all">
                       <div className="aspect-square bg-black overflow-hidden relative">
                          <img src={item.image} className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700" alt={item.name} />
                          <div className="absolute top-2 right-2">
                             <Badge className="bg-black/80 text-primary text-[7px] uppercase tracking-widest rounded-none border-primary/20">{item.confidence}% Match</Badge>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{item.name}</p>
                          <p className="text-sm font-mono text-primary font-black">{item.price}</p>
                       </div>
                       <Button 
                         onClick={() => onAddToCart(item)}
                         className="w-full bg-white text-black hover:bg-primary font-black text-[9px] uppercase tracking-widest py-4 h-auto rounded-none"
                       >
                         <ShoppingCart className="h-3 w-3 mr-2" /> Add_To_Cart
                       </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
