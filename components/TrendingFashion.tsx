'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const fashionItems = [
  {
    id: 1,
    title: "Old Money Elegance",
    category: "Classic",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    description: "Timeless sophistication with neutral tones",
    likes: 1240,
    views: 5670
  },
  {
    id: 2,
    title: "Streetwear Vibes",
    category: "Urban",
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
    description: "Bold graphics and contemporary cuts",
    likes: 890,
    views: 3420
  },
  {
    id: 3,
    title: "Techcore Future",
    category: "Modern",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    description: "Innovative fabrics meets functional design",
    likes: 2150,
    views: 8990
  },
  {
    id: 4,
    title: "Boho Chic",
    category: "Artistic",
    image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg",
    description: "Free-spirited patterns and flowing silhouettes",
    likes: 1680,
    views: 6230
  },
  {
    id: 5,
    title: "Minimalist Clean",
    category: "Simple",
    image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
    description: "Less is more with perfect tailoring",
    likes: 950,
    views: 4100
  }
];

const TrendingFashion = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fashionItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % fashionItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + fashionItems.length) % fashionItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Carousel */}
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${fashionItems[currentIndex].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-4"
                >
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {fashionItems[currentIndex].category}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold">
                    {fashionItems[currentIndex].title}
                  </h3>
                  
                  <p className="text-lg text-gray-200 max-w-lg">
                    {fashionItems[currentIndex].description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>{fashionItems[currentIndex].likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>{fashionItems[currentIndex].views}</span>
                    </div>
                  </div>
                  
                  <Link href="/try-on">
                    <Button className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 rounded-full mt-4">
                      Try This Style
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0 rounded-full h-12 w-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0 rounded-full h-12 w-12"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {fashionItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-purple-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail Preview */}
      <div className="grid grid-cols-5 gap-4 mt-8">
        {fashionItems.map((item, index) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex 
                ? 'ring-4 ring-purple-500 shadow-lg' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-20 object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingFashion;