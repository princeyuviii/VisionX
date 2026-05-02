'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Camera, Sparkles, TrendingUp, Globe, Users, ArrowRight, MessageCircle, ShieldCheck, Heart, Zap, Play, Star, Scan, ShoppingBag, Eye, Layers, Box, Cpu, HardDrive, Activity, Target, Shield } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TrendingFashion from '@/components/TrendingFashion';
import FloatingAIHelper from '@/components/FloatingAIHelper';
import TryOnGallery from '@/components/TryOnGallery';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SocialLinks from '@/components/SocialLinks';
import { LANDING_CONTENT } from '@/config/landing-data';

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};


const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Background Layers */}
      <div className="fixed inset-0 cyber-grid opacity-10 -z-10" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/60 to-black -z-10" />

      <FloatingAIHelper />
      
      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[auto_1fr_1.2fr] gap-12 lg:gap-24 items-start">
            
            {/* Integrated Left Metadata Column */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden xl:flex flex-col items-center space-y-10 pt-4"
            >
              <div className="text-[9px] font-mono text-zinc-800 rotate-180 [writing-mode:vertical-lr] tracking-[0.5em] uppercase">SYSTEM_PROTOCOL_V2.1</div>
              <div className="w-[1px] h-32 bg-primary/20" />
              <div className="flex flex-col space-y-6">
                 {[Zap, Shield, Globe].map((Icon, i) => (
                   <Icon key={i} className="h-4 w-4 text-zinc-900 hover:text-primary transition-all cursor-crosshair" />
                 ))}
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-12 pt-4"
            >
              <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-none text-[10px] font-mono tracking-[0.4em] text-primary uppercase backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-primary animate-ping" />
                  <span>{LANDING_CONTENT.hero.badge}</span>
                </div>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic"
              >
                {LANDING_CONTENT.hero.headingMain} <br />
                <span className="text-primary text-glow-amber">{LANDING_CONTENT.hero.headingAccent}</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-base text-zinc-500 max-w-lg font-mono tracking-widest leading-relaxed uppercase italic"
              >
                {LANDING_CONTENT.hero.description}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
                <Link href="/try-on">
                  <Button 
                    size="lg" 
                    className="bg-primary text-black hover:bg-white transition-all font-black px-16 py-10 rounded-none text-xs uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 relative group overflow-hidden"
                  >
                    <span className="relative z-10">{LANDING_CONTENT.hero.ctaPrimary}</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </Button>
                </Link>
                
                <Link href="/recommend">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/10 hover:border-primary/50 text-white font-black px-16 py-10 rounded-none transition-all text-xs uppercase tracking-[0.4em] bg-white/5 backdrop-blur-xl group"
                  >
                    <span className="group-hover:text-primary transition-colors">{LANDING_CONTENT.hero.ctaSecondary}</span>
                  </Button>
                </Link>
              </motion.div>
              
              {/* Quick Stats */}
              <motion.div variants={fadeInUp} className="pt-12 flex gap-12 border-t border-white/5">
                 <div className="space-y-1">
                    <div className="text-xl font-black italic tracking-tighter uppercase">{LANDING_CONTENT.stats.community}</div>
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Active_Nodes</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-xl font-black italic tracking-tighter uppercase">{LANDING_CONTENT.stats.rating}</div>
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Sync_Precision</div>
                 </div>
              </motion.div>
            </motion.div>

            {/* Image Box */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/5] border border-white/5 rounded-none p-1 overflow-hidden relative group bg-zinc-950">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125 opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-[3000ms]" />
                
                <div className="absolute inset-8 border border-white/5 pointer-events-none" />
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/50" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/50" />
                
                <div className="scanline" />
                
                <div className="absolute top-12 left-12 space-y-2 z-20">
                  <div className="text-primary font-mono text-[10px] tracking-[0.5em] flex items-center gap-2 uppercase">
                    <Activity className="h-3 w-3 animate-pulse" /> NEURAL_ID_VERIFIED
                  </div>
                  <div className="text-zinc-600 font-mono text-[8px] tracking-[0.4em] uppercase">MAPPING_COORDINATES: STABLE</div>
                </div>

                <div className="absolute bottom-12 left-12 z-20 space-y-1">
                   <div className="text-zinc-500 font-mono text-[8px] tracking-[0.6em] uppercase italic">ENCRYPTION_PASS</div>
                   <div className="text-[8px] font-mono text-primary/40 tracking-[0.2em]">0.024MS // 12-LAYER_SYNC</div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700">
                   <div className="w-24 h-24 bg-primary/10 backdrop-blur-3xl border border-primary/30 flex items-center justify-center">
                      <Scan className="h-10 w-10 text-primary" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid: Simplified & approachable */}
      <section className="py-40 px-4 relative bg-zinc-950/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-start">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-20"
          >
            <div className="space-y-8">
              <div className="h-[3px] w-20 bg-primary shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
              <h2 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none uppercase">
                {LANDING_CONTENT.mission.heading} <br />
                <span className="text-zinc-900 text-glow-premium">{LANDING_CONTENT.mission.accent}</span>
              </h2>
              <p className="text-zinc-500 text-lg font-mono tracking-widest leading-loose max-w-lg uppercase italic">
                {LANDING_CONTENT.mission.description}
              </p>
            </div>
            
            <div className="space-y-16">
              {LANDING_CONTENT.mission.points.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-10 group">
                  <div className="text-primary font-mono text-sm pt-1 border-b border-primary/20 pb-2">0{idx + 1}</div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-black tracking-[0.3em] text-white uppercase group-hover:text-primary transition-colors">{point.title}</h4>
                    <p className="text-[11px] text-zinc-600 tracking-widest leading-relaxed uppercase max-w-sm">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {LANDING_CONTENT.features.map((feature, idx) => (
              <div key={idx} className="bg-black p-12 space-y-10 hover:bg-zinc-900/50 transition-all group flex flex-col justify-between aspect-square">
                <feature.icon className="h-10 w-10 text-zinc-800 group-hover:text-primary transition-all" />
                <div className="space-y-6">
                  <h3 className="text-xs font-black tracking-[0.4em] text-white uppercase">{feature.title}</h3>
                  <p className="text-[10px] text-zinc-600 leading-relaxed tracking-[0.2em] uppercase font-mono">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Fashion Carousel: Restored & Simplified */}
      <section className="py-40 bg-black relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
           <div>
              <span className="text-[11px] font-mono tracking-[0.6em] text-primary mb-6 block uppercase underline underline-offset-8 decoration-primary/30">TRENDING_COLLECTIONS</span>
              <h2 className="text-6xl font-black tracking-tighter uppercase italic text-glow-premium">Seasonal_Styles</h2>
           </div>
           <Link href="/try-on">
              <Button variant="outline" className="border-white/10 hover:border-primary/50 text-white font-black px-12 py-8 rounded-none transition-all text-[10px] uppercase tracking-[0.5em] glass">
                View_Full_Collection <ArrowRight className="ml-4 h-4 w-4" />
              </Button>
           </Link>
        </div>
        <TrendingFashion />
      </section>

      {/* Gallery Section */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6 mb-24 text-center md:text-left">
           <span className="text-[11px] font-mono tracking-[0.6em] text-zinc-700 mb-6 block uppercase">COLLECTION_NODES</span>
           <h2 className="text-6xl font-black tracking-tighter uppercase italic">Style_Archive</h2>
        </div>
        <TryOnGallery />
      </section>

      <TestimonialsCarousel />

      {/* Technical Workflow Section */}
      <section className="py-40 px-4 relative bg-black overflow-hidden">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-16">
               <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-[0.5em] text-primary uppercase">Execution_Workflow</span>
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic">Neural_Synthesis_Logic</h2>
               </div>
               <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest max-w-sm">
                  How the VisionX core engine processes visual data into high-fidelity style simulations.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { step: "01", title: "Anatomical_Scan", desc: "System initializes hardware and maps 128 unique skeletal landmarks for perfect garment alignment.", icon: Target },
                 { step: "02", title: "Fabric_Synthesis", desc: "ML models calculate cloth physics, texture response, and lighting interaction in real-time.", icon: Cpu },
                 { step: "03", title: "Final_Rendering", desc: "Neural rendering engines output a 4K resolution style preview with zero latency.", icon: HardDrive }
               ].map((item, idx) => (
                 <div key={idx} className="group p-10 border border-white/5 bg-zinc-950 hover:border-primary/30 transition-all relative">
                    <div className="absolute top-6 right-8 text-4xl font-black italic text-zinc-900 group-hover:text-primary/10 transition-colors">{item.step}</div>
                    <item.icon className="h-8 w-8 text-zinc-800 group-hover:text-primary transition-all mb-10" />
                    <div className="space-y-4">
                       <h3 className="text-sm font-black uppercase italic tracking-tighter">{item.title}</h3>
                       <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] leading-relaxed group-hover:text-zinc-400 transition-colors">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final Action CTA: Uplink Override */}
      <section className="py-64 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10 animate-pulse opacity-20" />
        <div className="max-w-7xl mx-auto relative">
           <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             viewport={{ once: true }}
             className="relative border border-white/10 p-20 md:p-40 text-center overflow-hidden bg-zinc-950"
           >
              {/* Decorative Corner Brackets */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-primary/40 p-1">
                 <div className="w-2 h-2 bg-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-primary/40 flex items-end justify-end p-1">
                 <div className="w-2 h-2 bg-primary" />
              </div>

              {/* Background Data Streams */}
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)]" />

              <div className="space-y-16 relative z-10">
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-4 bg-primary text-black px-4 py-1 text-[8px] font-black uppercase tracking-[0.5em] italic">
                      Warning: System_Override_Initialized
                   </div>
                   <h2 className="text-7xl sm:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic">
                     UPLINK_YOUR <br />
                     <span className="text-primary text-glow-amber">STYLE_CORE.</span>
                   </h2>
                </div>

                <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.5em] italic max-w-2xl mx-auto">
                   Commit your visual identity to the neural network and redefine your digital presence.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-12">
                   <Link href="/try-on">
                      <Button className="bg-primary text-black hover:bg-white transition-all font-black px-24 py-12 rounded-none text-xs uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(251,191,36,0.3)] group relative">
                        <span className="relative z-10">ESTABLISH_CONNECTION</span>
                        <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
                       <div className="w-8 h-px bg-white/10" />
                       <span>Protocol_v4.0_Stable</span>
                       <div className="w-8 h-px bg-white/10" />
                    </div>
                </div>
              </div>

              {/* Technical Metadata Footer */}
              <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-[8px] font-mono text-zinc-800 uppercase tracking-[0.6em] opacity-40">
                 <span>Lat: 34.0522° N</span>
                 <span>Lon: 118.2437° W</span>
                 <span>Buffer: 1024_P_SYNC</span>
              </div>
           </motion.div>
        </div>
      </section>

      <SocialLinks />
      <Footer />
    </div>
  );
}
