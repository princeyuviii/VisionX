import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../models/Product';
import connectToDatabase from '../lib/mongodb';

const SEED_DATA = [
  // --- Tops ---
  {
    name: "Onyx Technical Overshirt",
    image: "https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=2000&auto=format&fit=crop",
    type: "top",
    category: "Tops",
    price: "₹4,999",
    originalPrice: "₹7,999",
    trending: true,
    tags: ["#Stealth", "#Techwear"],
    colors: ["#0a0a0a", "#1a1a1a"],
    description: "Industrial-grade technical overshirt with water-resistant finish and modular pockets.",
    rating: 4.9,
    reviews: 128,
    likes: 450
  },
  {
    name: "Carbon Fiber Knit Sweater",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop",
    type: "top",
    category: "Tops",
    price: "₹3,499",
    originalPrice: "₹5,200",
    trending: false,
    tags: ["#Minimalist", "#Winter"],
    colors: ["#262626", "#404040"],
    description: "Heavyweight knit sweater with carbon-patterned weave for thermal regulation.",
    rating: 4.7,
    reviews: 85,
    likes: 210
  },
  {
    name: "Amber Glow Silk Shirt",
    image: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=2000&auto=format&fit=crop",
    type: "top",
    category: "Tops",
    price: "₹5,800",
    originalPrice: "₹8,500",
    trending: true,
    tags: ["#Luxury", "#Silk"],
    colors: ["#fbbf24", "#d97706"],
    description: "Premium silk shirt in our signature amber hue. High-contrast elegance.",
    rating: 4.8,
    reviews: 64,
    likes: 890
  },

  // --- Bottoms ---
  {
    name: "Modular Cargo Systems",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2000&auto=format&fit=crop",
    type: "bottom",
    category: "Bottoms",
    price: "₹6,200",
    originalPrice: "₹9,000",
    trending: true,
    tags: ["#Utility", "#Cargo"],
    colors: ["#000000", "#171717"],
    description: "Multi-pocket cargo pants with reinforced knee panels and adjustable cuffs.",
    rating: 4.9,
    reviews: 312,
    likes: 1200
  },
  {
    name: "Void Denim Slacks",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2000&auto=format&fit=crop",
    type: "bottom",
    category: "Bottoms",
    price: "₹3,999",
    originalPrice: "₹5,500",
    trending: false,
    tags: ["#Denim", "#Casual"],
    colors: ["#0a0a0a"],
    description: "Deep black denim with a slim-tapered fit and oxidized hardware.",
    rating: 4.6,
    reviews: 145,
    likes: 340
  },

  // --- Outerwear ---
  {
    name: "Sentinel Alpha Parka",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=2000&auto=format&fit=crop",
    type: "outerwear",
    category: "Outerwear",
    price: "₹12,500",
    originalPrice: "₹18,000",
    trending: true,
    tags: ["#Extreme", "#Parka"],
    colors: ["#0a0a0a", "#fbbf24"],
    description: "Heavy-duty parka designed for extreme conditions with Amber-line visibility accents.",
    rating: 5.0,
    reviews: 42,
    likes: 670
  },
  {
    name: "Stealth Bomber V2",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop",
    type: "outerwear",
    category: "Outerwear",
    price: "₹7,800",
    originalPrice: "₹11,000",
    trending: true,
    tags: ["#Bomber", "#Classic"],
    colors: ["#171717"],
    description: "Matte finish bomber jacket with quilted lining and hidden tech pockets.",
    rating: 4.8,
    reviews: 215,
    likes: 950
  },

  // --- Accessories ---
  {
    name: "Cyber-Visor Sunglasses",
    image: "https://images.unsplash.com/photo-1511499767390-903390e6fbc4?q=80&w=2000&auto=format&fit=crop",
    type: "accessories",
    category: "Accessories",
    price: "₹2,499",
    originalPrice: "₹4,000",
    trending: true,
    tags: ["#Cyber", "#Eyewear"],
    colors: ["#000000", "#fbbf24"],
    description: "One-piece lens construction with polarized UV protection and amber tint.",
    rating: 4.7,
    reviews: 530,
    likes: 2100
  },
  {
    name: "Tactical Utility Belt",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2000&auto=format&fit=crop",
    type: "accessories",
    category: "Accessories",
    price: "₹1,800",
    originalPrice: "₹2,500",
    trending: false,
    tags: ["#Tactical", "#Belt"],
    colors: ["#0a0a0a"],
    description: "Quick-release cobra buckle with heavy-duty nylon webbing.",
    rating: 4.5,
    reviews: 89,
    likes: 120
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log(`Seeding ${SEED_DATA.length} products...`);
    await Product.insertMany(SEED_DATA);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
