'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Quote, User, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: "01",
    name: 'ALEX_JOHNSON',
    role: 'FASHION_DESIGNER',
    quote: 'THE AI TRY-ON IS INCREDIBLE. IT LOOKS SO REALISTIC AND MAKES SHOPPING FOR CLOTHES ONLINE MUCH EASIER.',
  },
  {
    id: "02",
    name: 'SARAH_MILLER',
    role: 'MODEL',
    quote: 'I LOVE HOW I CAN SEE DIFFERENT OUTFITS ON ME WITHOUT LEAVING MY ROOM. IT SAVES SO MUCH TIME.',
  },
  {
    id: "03",
    name: 'MARCUS_WILSON',
    role: 'STYLIST',
    quote: 'THE MEASUREMENTS ARE VERY ACCURATE. IT HELPS MY CLIENTS CHOOSE THE RIGHT SIZES EVERY TIME.',
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 px-4 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-primary uppercase">TESTIMONIALS</span>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">User_Reviews</h2>
          </div>
          <div className="flex space-x-4">
             <button onClick={prev} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-primary transition-colors">
               <ChevronLeft className="h-5 w-5 text-zinc-500" />
             </button>
             <button onClick={next} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-primary transition-colors">
               <ChevronRight className="h-5 w-5 text-zinc-500" />
             </button>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col md:flex-row gap-12 items-start"
            >
              <div className="flex-shrink-0">
                 <div className="w-24 h-24 bg-zinc-900 border border-primary/20 flex items-center justify-center relative">
                    <User className="h-10 w-10 text-zinc-700" />
                    <div className="absolute -top-2 -right-2 bg-primary text-black text-[8px] font-mono font-black px-2 py-0.5">
                       {testimonials[index].id}
                    </div>
                 </div>
              </div>
              
              <div className="space-y-8 max-w-4xl">
                 <Quote className="h-10 w-10 text-primary/20" />
                 <p className="text-2xl md:text-4xl font-black tracking-tight leading-tight uppercase italic text-zinc-300">
                   {testimonials[index].quote}
                 </p>
                 <div className="space-y-1">
                   <div className="text-sm font-black tracking-widest text-white uppercase">{testimonials[index].name}</div>
                   <div className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">{testimonials[index].role}</div>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 h-px w-full bg-white/5 relative">
           <motion.div 
             initial={{ width: "0%" }}
             animate={{ width: `${((index + 1) / testimonials.length) * 100}%` }}
             className="absolute inset-0 bg-primary h-px"
           />
        </div>
      </div>
    </section>
  );
}