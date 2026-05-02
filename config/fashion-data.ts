export interface ClothingItem {
  id: number;
  name: string;
  image: string;
  type: 'top' | 'bottom' | 'outerwear' | 'accessories' | 'jewelry';
  price: string;
  trending: boolean;
  icon: any; // Lucide icon
  tags?: string[];
  colors?: string[];
  originalPrice?: string;
}

import { 
  Shirt, 
  Watch, 
  Crown, 
  Layers, 
  Box, 
  Zap, 
  Smile, 
  User, 
  Camera,
  Cpu,
  Sparkles,
  Target
} from 'lucide-react';

export const FASHION_CATEGORIES = [
  { name: "Tops", icon: Shirt },
  { name: "Bottoms", icon: Box },
  { name: "Outerwear", icon: Layers },
  { name: "Accessories", icon: Watch },
  { name: "Jewelry", icon: Crown },
];

export const CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: 1,
    name: "Onyx Silk Blazer",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    type: "top",
    price: "$299.00",
    trending: true,
    icon: Shirt,
    tags: ["#OldMoney", "#Evening"]
  },
  {
    id: 2,
    name: "Cyber-Tech Bomber",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    type: "outerwear",
    price: "$450.00",
    trending: true,
    icon: Zap,
    tags: ["#Techcore", "#Cyberpunk"]
  },
  {
    id: 3,
    name: "Classic Linen Trousers",
    image: "https://images.unsplash.com/photo-1624371414361-e6e8ea01f116?q=80&w=1000&auto=format&fit=crop",
    type: "bottom",
    price: "$180.00",
    trending: false,
    icon: Box,
    tags: ["#Minimalist", "#Clean"]
  },
  {
    id: 4,
    name: "Amber Chrono Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop",
    type: "accessories",
    price: "$1,200.00",
    trending: true,
    icon: Watch,
    tags: ["#Luxury", "#Executive"]
  },
  {
    id: 5,
    name: "Royal Heritage Pendant",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    type: "jewelry",
    price: "$850.00",
    trending: true,
    icon: Crown,
    tags: ["#Elegance", "#Royal"]
  },
  {
    id: 6,
    name: "Graphite Cargo Pants",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
    type: "bottom",
    price: "$165.00",
    trending: true,
    icon: Box,
    tags: ["#Streetwear", "#Urban"]
  }
];

export const AI_ANALYSIS_STEPS = [
  { step: 1, title: "Neural Scanning", icon: Camera, description: "Mapping body proportions and posture" },
  { step: 2, title: "Texture Analysis", icon: Layers, description: "Extracting skin tone and fabric compatibility" },
  { step: 3, title: "Sizing Logic", icon: Target, description: "Calculating optimal garment dimensions" },
  { step: 4, title: "Style Synthesis", icon: Sparkles, description: "Generating aesthetic recommendations" },
  { step: 5, title: "Final Rendering", icon: Cpu, description: "Synthesizing the virtual try-on overlay" }
];

export const QUICK_TRY_ITEMS = CLOTHING_ITEMS.filter(item => item.trending);
