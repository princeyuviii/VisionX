'use client';

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

type GalleryItem = {
  src: string;
  title: string;
  category: string;
};

const galleryItems: GalleryItem[] = [
  { src: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1000&auto=format&fit=crop', title: 'CASUAL_STREET', category: 'EVERYDAY_WEAR' },
  { src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', title: 'CLASSIC_SUIT', category: 'FORMAL_STYLE' },
  { src: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop', title: 'MODERN_LOOK', category: 'NEW_ARRIVAL' },
  { src: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1000&auto=format&fit=crop', title: 'URBAN_VIBE', category: 'POPULAR' },
  { src: 'https://images.unsplash.com/photo-1519144412341-3d3863a14b1e?q=80&w=1000&auto=format&fit=crop', title: 'SIMPLE_STYLE', category: 'MINIMALIST' },
  { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop', title: 'BEST_FIT', category: 'TOP_RATED' },
];

export default function Gallery() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {galleryItems.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden group bg-black"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-10 left-10 right-10 flex flex-col space-y-2">
              <span className="text-[8px] font-mono tracking-[0.4em] text-primary uppercase">{item.category}</span>
              <h3 className="text-xl font-black text-white tracking-tighter uppercase">{item.title}</h3>
              <div className="h-[1px] w-0 group-hover:w-full bg-primary transition-all duration-500" />
            </div>

            {/* Corner Badge */}
            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}