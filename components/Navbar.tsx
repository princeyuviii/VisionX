'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Camera, Sparkles, Info, Users, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/nextjs';

const Navbar = () => {
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
    { href: '/try-on', label: 'Try-On', icon: Camera },
    { href: '/recommend', label: 'Recommend', icon: Sparkles },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/how-it-works', label: 'How it Works', icon: Info },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-lg border-b border-gray-200/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl"
            >
              <Camera className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VisionX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <SignedOut>
                  <SignInButton>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-purple-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-5 w-5 mr-3" />
                      <span>Sign In</span>
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center px-4">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;