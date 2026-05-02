'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github, Mail, Send, Box, ArrowRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 pt-32 pb-16 px-6 overflow-hidden">
      {/* Structural Background Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-primary/10 p-2 border border-primary/30 rounded-none">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic group-hover:text-primary transition-colors">
                  Vision<span className="text-primary">X</span>
                </span>
                <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-700 uppercase">NEXT-GEN_FASHION</span>
              </div>
            </Link>
            <p className="text-[10px] text-zinc-600 font-mono tracking-[0.2em] uppercase leading-relaxed max-w-xs">
              The world's most advanced AI for virtual try-on and personal styling. See the future of fashion today.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Github, Mail].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 border border-white/5 bg-zinc-900/50 flex items-center justify-center text-zinc-700 hover:text-primary hover:border-primary/50 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-mono font-black tracking-[0.4em] text-white uppercase border-l-2 border-primary pl-4">EXPLORE</h4>
            <nav className="flex flex-col space-y-5">
              {[
                { label: 'Try_On', href: '/try-on' },
                { label: 'AI_Styling', href: '/recommend' },
                { label: 'Community', href: '/community' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="text-[10px] font-mono text-zinc-500 hover:text-primary transition-colors uppercase tracking-[0.3em] flex items-center group">
                  {item.label} <ArrowRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-mono font-black tracking-[0.4em] text-white uppercase border-l-2 border-primary pl-4">SUPPORT</h4>
            <nav className="flex flex-col space-y-5">
              {['Privacy_Policy', 'Terms_of_Use', 'Help_Center', 'Contact_Us'].map((item) => (
                <Link key={item} href="#" className="text-[10px] font-mono text-zinc-500 hover:text-primary transition-colors uppercase tracking-[0.3em]">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-mono font-black tracking-[0.4em] text-white uppercase border-l-2 border-primary pl-4">NEWSLETTER</h4>
            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-white/5 p-2 flex items-center group focus-within:border-primary/50 transition-all">
                <input 
                  type="email" 
                  placeholder="YOUR@EMAIL.COM" 
                  className="bg-transparent w-full text-[10px] font-mono tracking-widest text-white focus:outline-none placeholder:text-zinc-800 px-4"
                />
                <button className="bg-primary text-black p-2 hover:bg-white transition-colors">
                  <Send className="h-3 w-3" />
                </button>
              </div>
              <p className="text-[8px] text-zinc-700 font-mono tracking-[0.2em] uppercase">
                Subscribe to get the latest updates and fashion drops.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[9px] font-mono text-zinc-800 tracking-[0.4em] uppercase">
            © 2026 VisionX // All Rights Reserved
          </span>
          
          <div className="flex items-center space-x-10">
            {['VISA', 'MASTERCARD', 'PAYPAL', 'STRIPE'].map((partner) => (
              <span key={partner} className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
