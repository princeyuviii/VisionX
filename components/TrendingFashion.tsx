'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const fashionItems = [
  {
    id: 1,
    title: "MODERN_CLASSIC",
    category: "SARTORIAL",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    description: "TIMELESS SOPHISTICATION WITH NEUTRAL TONES. PERFECT FOR PROFESSIONAL ENVIRONMENTS.",
    likes: 1240,
    views: 5670
  },
  {
    id: 2,
    title: "URBAN_STRIKE",
    category: "STREETWEAR",
    image: "https://i.pinimg.com/736x/1e/6f/ae/1e6faee67a38cccd464e3bcd6a073513.jpg",
    description: "BOLD GRAPHICS AND CONTEMPORARY CUTS FOR THE MODERN CITYSCAPE.",
    likes: 890,
    views: 3420
  },
  {
    id: 3,
    title: "TECH_UTILITY",
    category: "FUNCTIONAL",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    description: "INNOVATIVE FABRICS MEETS FUNCTIONAL DESIGN. BUILT FOR PERFORMANCE.",
    likes: 2150,
    views: 8990
  }
];

const TrendingFashion = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % fashionItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + fashionItems.length) % fashionItems.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-6">
      <div className="relative h-[600px] overflow-hidden bg-zinc-950 border border-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center relative grayscale group-hover:grayscale-0 transition-all duration-1000"
              style={{ backgroundImage: `url(${fashionItems[currentIndex].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-12 md:p-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="inline-block px-4 py-1 border border-primary/30 text-[10px] font-mono tracking-[0.4em] text-primary uppercase">
                    {fashionItems[currentIndex].category}
                  </div>
                  
                  <h3 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-glow-premium">
                    {fashionItems[currentIndex].title}
                  </h3>
                  
                  <p className="text-sm text-zinc-500 max-w-xl font-mono tracking-widest leading-relaxed uppercase italic">
                    {fashionItems[currentIndex].description}
                  </p>
                  
                  <div className="flex gap-6 pt-6">
                    <Link href="/try-on">
                      <Button className="bg-primary text-black hover:bg-white transition-all font-black px-12 py-8 rounded-none text-xs uppercase tracking-[0.4em]">
                        INITIALIZE_TRY_ON <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute top-10 right-10 flex space-x-2">
          <button onClick={prevSlide} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-primary transition-colors bg-black/50 backdrop-blur-xl">
            <ChevronLeft className="h-5 w-5 text-zinc-500" />
          </button>
          <button onClick={nextSlide} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-primary transition-colors bg-black/50 backdrop-blur-xl">
            <ChevronRight className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-10 right-10 flex flex-col space-y-2">
          {fashionItems.map((_, index) => (
            <div 
              key={index} 
              className={`w-1 h-8 transition-all duration-500 ${index === currentIndex ? 'bg-primary shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-white/10'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingFashion;