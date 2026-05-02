'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Camera, Sparkles, Info, Users, Cpu, Globe, Zap, ShoppingBag, Box, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/try-on', label: 'TRY_ON' },
    { href: '/recommend', label: 'AI_STYLING' },
    { href: '/community', label: 'COMMUNITY' },
    { href: '/closet', label: 'CLOSET' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-white/5 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo: Simple & Clear */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-primary/10 p-2 border border-primary/30 rounded-none group-hover:border-primary transition-all">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white uppercase italic group-hover:text-primary transition-colors">
                Vision<span className="text-primary">X</span>
              </span>
              <span className="text-[8px] font-mono tracking-[0.4em] text-zinc-600 uppercase">AI_FASHION_APP</span>
            </div>
          </Link>

          {/* Desktop Navigation: Simple */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ color: '#fbbf24' }}
                  className="text-[10px] font-mono font-black tracking-[0.3em] text-zinc-500 hover:text-white transition-all uppercase cursor-pointer"
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Desktop Auth & Cart */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/checkout" className="relative group p-2">
              <ShoppingCart className="h-5 w-5 text-zinc-500 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 hover:text-white transition-colors uppercase">
                  LOGIN
                </button>
              </SignInButton>
              <Link href="/auth/sign-up">
                <Button className="bg-primary text-black hover:bg-white transition-all rounded-none font-black px-8 py-2 h-9 text-[10px] uppercase tracking-widest">
                  SIGN_UP
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9 border border-primary/30 rounded-none p-0.5 bg-zinc-900"
                  }
                }}
                afterSignOutUrl="/" 
              />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed inset-0 bg-black z-50 flex flex-col p-8 space-y-8"
          >
            <div className="flex justify-between items-center mb-12">
               <Camera className="h-8 w-8 text-primary" />
               <button onClick={() => setIsOpen(false)} className="text-white">
                 <X className="h-8 w-8" />
               </button>
            </div>
            
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <span className="text-4xl font-black italic text-white hover:text-primary transition-colors tracking-tighter uppercase">
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="pt-12 flex flex-col space-y-6">
              <SignedOut>
                <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-16 rounded-none bg-primary text-black font-black text-xl uppercase tracking-widest shadow-2xl">
                    GET_STARTED
                  </Button>
                </Link>
                <SignInButton mode="modal">
                  <button className="text-sm font-mono tracking-[0.5em] text-zinc-500 py-4 uppercase">LOGIN</button>
                </SignInButton>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;