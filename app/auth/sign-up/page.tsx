'use client';

import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2.5 rounded-2xl shadow-lg shadow-purple-500/20">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-foreground">
            Vision<span className="text-gradient">X</span>
          </span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur opacity-20" />
        <div className="relative glass p-2 rounded-[2rem] shadow-2xl">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none border-0",
                headerTitle: "text-foreground font-black text-2xl",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "glass border-white/5 hover:bg-white/5 text-foreground font-bold",
                formButtonPrimary: "bg-foreground text-background hover:scale-105 transition-transform font-bold",
                formFieldLabel: "text-foreground font-bold",
                formFieldInput: "glass border-white/5 focus:border-purple-500 transition-all",
                footerActionText: "text-muted-foreground",
                footerActionLink: "text-purple-500 hover:text-purple-400 font-bold"
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}