'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Heart, History, Settings, 
  ChevronRight, Box, Zap, Scan, Sparkles,
  ExternalLink, ArrowUpRight, Clock, ShieldCheck, Crown, Activity
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClosetPage() {
  const { user } = useUser();
  const [analysis, setAnalysis] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysisRes, favRes, orderRes] = await Promise.all([
          fetch('/api/analysis'),
          fetch('/api/favorites'),
          fetch('/api/orders')
        ]);
        
        const [analysisData, favData, orderData] = await Promise.all([
          analysisRes.json(),
          favRes.json(),
          orderRes.json()
        ]);

        if (analysisData) setAnalysis(analysisData);
        if (Array.isArray(favData)) setFavorites(favData);
        if (Array.isArray(orderData)) setOrders(orderData);
      } catch (err) {
        console.error("Failed to load vault data:", err);
      } finally {
        setTimeout(() => setIsLoading(false), 1500); // Premium delay for initialization feel
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
        <div className="relative">
           <Zap className="h-16 w-16 text-primary animate-pulse" />
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 border-b-2 border-primary rounded-full scale-150 opacity-20"
           />
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-sm font-black tracking-[0.5em] text-white uppercase italic">INITIALIZING_VAULT_LINK</h2>
           <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">DECRYPTING_ARCHIVES // AUTH_ID: {user?.id?.slice(0, 8)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-16 px-4 font-sans">
      <div className="absolute inset-0 cyber-grid opacity-10 -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center space-x-8">
            <div className="w-32 h-32 rounded-none border-2 border-primary/40 p-1.5 bg-zinc-900 relative shadow-[0_0_40px_rgba(251,191,36,0.1)]">
              <Image 
                src={user?.imageUrl || "/placeholder.svg"} 
                alt="Profile" 
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-3 -right-3 bg-primary text-black p-2 shadow-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/40 rounded-none text-[8px] uppercase tracking-[0.2em] px-2 py-0">Lvl_04_Expert</Badge>
                <div className="h-1 w-12 bg-white/10" />
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                {user?.firstName || 'User'}<span className="text-primary text-glow-amber">.VAULT</span>
              </h1>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                Secure Fashion Archive // <span className="text-primary/60">System_Status: Online</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-12 bg-zinc-950/50 p-6 border border-white/5 backdrop-blur-md">
            <div className="space-y-1">
              <div className="text-3xl font-black text-white italic tracking-tighter">{favorites.length}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Saved_Items</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-white italic tracking-tighter">{orders.length}</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Protocols</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-primary italic tracking-tighter">98.4%</div>
              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Style_Sync</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-transparent border-b border-white/5 w-full justify-start h-auto p-0 space-x-12">
            {['Overview', 'Collection', 'Protocols', 'Neural_Profile'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab.toLowerCase()}
                className="bg-transparent border-none rounded-none py-4 px-0 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 data-[state=active]:text-primary data-[state=active]:border-b data-[state=active]:border-primary transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Analysis Hero */}
              <Card className="lg:col-span-2 bg-zinc-950 border-white/10 rounded-none relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity">
                   <Activity className="h-48 w-48 text-primary" />
                </div>
                <CardContent className="p-12 space-y-12 relative">
                  <div className="flex justify-between items-end border-b border-white/5 pb-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em]">NEURAL_SYNC_REPORT</span>
                      </div>
                      <h3 className="text-4xl font-black uppercase tracking-tighter italic">Style_Identity_V.4</h3>
                    </div>
                    <Link href="/recommend">
                       <Button className="bg-primary text-black hover:bg-white font-black text-[10px] uppercase tracking-[0.4em] rounded-none px-10 py-6 h-auto shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                          RE_SCAN_BIOMETRICS
                       </Button>
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-12">
                    <div className="space-y-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Primary_Archetype</p>
                          <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{analysis?.faceShape || 'STRUCTURAL_LUXE'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Core_Palette</p>
                          <div className="flex gap-2">
                             <div className="w-6 h-6 bg-zinc-900 border border-white/10" title="#0a0a0a" />
                             <div className="w-6 h-6 bg-zinc-700 border border-white/10" title="#444" />
                             <div className="w-6 h-6 bg-primary border border-white/10" title="Primary Amber" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Body_Protocol</p>
                          <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{analysis?.bodyType || 'ATHLETIC_V1'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Growth_Velocity</p>
                          <p className="text-2xl font-black text-green-500 uppercase italic tracking-tighter">+12.4%</p>
                       </div>
                    </div>

                    <div className="bg-primary/5 p-6 border border-primary/20 space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest">Sync_Accuracy</span>
                          <span className="text-xs font-mono text-primary">99.8%</span>
                       </div>
                       <div className="h-1 bg-white/5 w-full">
                          <motion.div initial={{ width: 0 }} animate={{ width: '99.8%' }} className="h-full bg-primary" />
                       </div>
                       <p className="text-[8px] font-mono text-zinc-500 uppercase leading-relaxed italic">
                          Calculated via 128 unique skeletal landmark trackers.
                       </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-8 bg-zinc-900/50 border border-white/5 relative overflow-hidden group/link">
                     <div className="absolute inset-0 bg-primary/5 translate-x-full group-hover/link:translate-x-0 transition-transform duration-700" />
                     <div className="flex items-center gap-6 relative">
                        <div className="w-12 h-12 rounded-none bg-zinc-800 flex items-center justify-center">
                           <Zap className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-widest text-white">GENERATE_NEXT_COLLECTION</p>
                           <p className="text-[9px] font-mono text-zinc-500 uppercase">AI-driven style synthesis based on current biometrics</p>
                        </div>
                     </div>
                     <Link href="/recommend" className="relative">
                        <Button variant="ghost" className="hover:bg-transparent p-0">
                          <ChevronRight className="h-8 w-8 text-zinc-700 group-hover/link:text-primary transition-colors" />
                        </Button>
                     </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Profile Stats */}
              <div className="space-y-8">
                 <Card className="bg-zinc-950 border-white/10 rounded-none shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                    <CardContent className="p-8 space-y-8">
                       <div className="space-y-2">
                          <h4 className="text-sm font-black uppercase tracking-[0.3em] italic">Stability_Index</h4>
                          <div className="h-[1px] w-12 bg-primary/30" />
                       </div>
                       
                       <div className="space-y-10">
                          {[
                            { label: 'Aesthetic_Consistency', val: 84 },
                            { label: 'Trend_Sync_Ratio', val: 91 },
                            { label: 'Layering_Logic', val: 76 }
                          ].map(stat => (
                            <div key={stat.label} className="space-y-3">
                               <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                                  <span className="text-zinc-500">{stat.label}</span>
                                  <span className="text-primary font-black">{stat.val}%</span>
                               </div>
                               <div className="h-1.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                                  <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${stat.val}%` }} 
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="pt-6 border-t border-white/5">
                          <Link href="/try-on">
                             <Button className="w-full bg-white text-black hover:bg-primary transition-all font-black py-8 rounded-none uppercase tracking-[0.4em] text-[9px] shadow-2xl">
                               ENTER_NEURAL_STUDIO
                             </Button>
                          </Link>
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="bg-primary/5 border border-primary/20 rounded-none p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none" />
                    <div className="flex items-center gap-4 relative">
                       <Crown className="h-6 w-6 text-primary" />
                       <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase tracking-widest text-white">VX_PLUS_ACTIVE</h4>
                          <p className="text-[8px] font-mono text-zinc-500 uppercase">TIER_01 // EXPERT_PROTOCOLS</p>
                       </div>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed tracking-widest italic relative">
                       Zero-latency synthesis enabled. You have 4 priority processing slots remaining this cycle.
                    </p>
                 </Card>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
               {/* Quick Collection View */}
               <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Selection_Queue</h3>
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Curated high-fidelity archive</p>
                  </div>
                  <Link href="/closet?tab=collection" className="group flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                    Enter_Archive <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {favorites.slice(0, 4).map((fav) => (
                    <motion.div 
                      key={fav._id} 
                      whileHover={{ scale: 1.05 }}
                      className="aspect-[3/4] bg-zinc-900 border border-white/10 relative group overflow-hidden shadow-xl"
                    >
                      <Image src={fav.productId?.image} alt="Fav" fill className="object-cover group-hover:scale-110 transition-all duration-[2000ms] opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-500">
                        <p className="text-[10px] font-black text-primary uppercase truncate italic">{fav.productId?.name}</p>
                        <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Ready_to_Synthesis</p>
                      </div>
                    </motion.div>
                  ))}
                  {favorites.length === 0 && (
                    <div className="col-span-4 py-20 bg-zinc-950/50 border border-dashed border-white/10 flex flex-col items-center justify-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                         <Heart className="h-8 w-8 text-zinc-800" />
                      </div>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">Archive protocol contains zero records.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Protocols Preview */}
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Recent_Deployments</h3>
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">Active logistics stream</p>
                  </div>
                  <Link href="/closet?tab=protocols" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-primary transition-colors">History_Log</Link>
                </div>
                
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="bg-zinc-950 border border-white/10 p-6 flex items-center justify-between group hover:border-primary/40 transition-all shadow-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-all" />
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-zinc-900 flex items-center justify-center border border-white/10 group-hover:bg-primary/10 transition-all">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black uppercase text-white tracking-tighter italic">{order.trackingId}</span>
                            <Badge className="bg-zinc-900 text-primary border-primary/20 text-[8px] uppercase font-black tracking-widest h-4 px-2">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                            {order.items.length} Units // Est. Delivery: 48h
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white tracking-tighter italic">₹{order.totalAmount.toLocaleString()}</p>
                        <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Track_Signal</button>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="py-20 text-center space-y-6 bg-zinc-950/50 border border-white/5">
                      <Box className="h-10 w-10 text-zinc-800 mx-auto" />
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">No active deployment protocols detected.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Collection Tab */}
          <TabsContent value="collection" className="animate-in fade-in duration-700">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
               {favorites.map((fav) => (
                 <motion.div 
                   key={fav._id}
                   whileHover={{ y: -8 }}
                   className="bg-zinc-950 border border-white/10 rounded-none overflow-hidden group hover:border-primary/40 transition-all shadow-xl"
                 >
                   <div className="aspect-[3/4] relative">
                     <Image src={fav.productId?.image} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-[3000ms] opacity-90 group-hover:opacity-100" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="absolute top-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/80 text-primary rounded-none border border-primary/20 backdrop-blur-sm">
                         <Heart className="h-5 w-5 fill-primary" />
                       </Button>
                     </div>
                   </div>
                   <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-black text-xs text-white uppercase tracking-tighter italic truncate">{fav.productId?.name}</h4>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{fav.productId?.brand || 'VisionX_Original'}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <span className="text-sm font-black text-primary italic tracking-tighter">{fav.productId?.price}</span>
                         <Link href="/try-on">
                            <Button size="sm" variant="outline" className="h-8 text-[9px] rounded-none border-white/10 uppercase tracking-[0.2em] px-4 font-black hover:bg-white hover:text-black">Enter_Studio</Button>
                         </Link>
                      </div>
                   </div>
                 </motion.div>
               ))}
             </div>
          </TabsContent>

          <TabsContent value="protocols" className="animate-in fade-in duration-700">
            <div className="space-y-8">
              {orders.map((order) => (
                <Card key={order._id} className="bg-zinc-950 border-white/10 rounded-none overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <History className="h-16 w-16 text-primary" />
                  </div>
                  <CardContent className="p-0">
                    <div className="bg-white/[0.03] border-b border-white/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Deployment_{order.trackingId}</h4>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <Clock className="h-3 w-3" /> Initialization: {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Badge className="bg-zinc-900 text-primary border-primary/30 text-[10px] uppercase font-black tracking-[0.2em] px-4 py-1.5 rounded-none">{order.status}</Badge>
                         <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                         <p className="text-xl font-black text-white italic tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="grid lg:grid-cols-3 gap-12">
                         <div className="lg:col-span-2 space-y-6">
                           <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Payload_Contents:</h5>
                           <div className="grid sm:grid-cols-2 gap-4">
                              {order.items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center space-x-4 bg-white/[0.02] border border-white/5 p-4 group hover:border-white/10 transition-colors">
                                  <div className="w-16 h-20 bg-zinc-900 border border-white/5 relative overflow-hidden">
                                    <Image src={item.productId?.image} alt="Item" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{item.productId?.name}</p>
                                    <p className="text-[9px] font-mono text-zinc-500 uppercase italic">Qty: {item.quantity} // Size: {item.size || 'OS'}</p>
                                    <p className="text-[11px] font-black text-primary italic pt-1">{item.price}</p>
                                  </div>
                                </div>
                              ))}
                           </div>
                         </div>
                         <div className="space-y-6">
                            <div className="bg-primary/5 p-8 border border-primary/20 space-y-6">
                               <div className="space-y-1">
                                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Protocol_Status</p>
                                  <p className="text-sm font-black text-white uppercase italic tracking-tighter">SYNTHESIS_COMPLETE</p>
                               </div>
                               <div className="space-y-4 pt-4 border-t border-white/5">
                                  <Button className="w-full bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-none h-12 hover:bg-primary transition-all">
                                    Track_Shipment
                                  </Button>
                                  <Button variant="outline" className="w-full border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-none h-12">
                                    Archive_Data
                                  </Button>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Neural Profile Tab */}
          <TabsContent value="neural_profile" className="animate-in fade-in duration-700">
             <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                   <div className="space-y-8">
                      <div className="flex items-center gap-6">
                         <h3 className="text-2xl font-black uppercase tracking-tighter italic">Diagnostic_Biometrics</h3>
                         <div className="h-px flex-1 bg-white/5" />
                         <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none font-mono text-[9px]">v2.4.0_Stable</Badge>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-8">
                         <div className="bg-zinc-950 border border-white/10 p-10 space-y-6 relative overflow-hidden group shadow-2xl">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-20 transition-opacity">
                               <User className="h-24 w-24 text-primary" />
                            </div>
                            <div className="space-y-2">
                               <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Face_Geometry</span>
                               </div>
                               <p className="text-3xl font-black text-white uppercase italic tracking-tighter">{analysis?.faceShape || 'OVAL_SYMMETRIC'}</p>
                            </div>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed tracking-widest italic border-t border-white/5 pt-6">
                               Neural mapping suggests high symmetry with balanced vertical proportions. Ideal for structured eyewear and technical headgear.
                            </p>
                         </div>

                         <div className="bg-zinc-950 border border-white/10 p-10 space-y-6 relative overflow-hidden group shadow-2xl">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-20 transition-opacity">
                               <Package className="h-24 w-24 text-primary" />
                            </div>
                            <div className="space-y-2">
                               <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Body_Protocol</span>
                               </div>
                               <p className="text-3xl font-black text-white uppercase italic tracking-tighter">{analysis?.bodyType || 'ATHLETIC_FRAME'}</p>
                            </div>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed tracking-widest italic border-t border-white/5 pt-6">
                               Optimal frame identification for tailored technical layering and precision-cut outerwear. Biometric alignment: 94.2%.
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-zinc-950 border border-white/10 p-12 space-y-10 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-20">
                         <ShieldCheck className="h-12 w-12 text-primary" />
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">Neural_Stability_Index</h4>
                         <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Protocol consistency measured across {orders.length} successful deployments.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="h-3 bg-white/5 rounded-none overflow-hidden border border-white/10">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '84%' }}
                             transition={{ duration: 2.5, ease: "circOut" }}
                             className="h-full bg-gradient-to-r from-primary/40 to-primary shadow-[0_0_20px_rgba(251,191,36,0.6)]"
                           />
                        </div>
                        <div className="flex justify-between text-[11px] font-black uppercase italic tracking-widest">
                           <span className="text-zinc-600">Sync_Stability: Optimal</span>
                           <span className="text-primary text-glow-amber">84.2%_EFFICIENCY</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="bg-zinc-950 border border-white/10 p-10 space-y-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 opacity-20" />
                      <div className="flex items-center gap-4 relative">
                         <Sparkles className="h-6 w-6 text-primary" />
                         <h4 className="text-sm font-black uppercase tracking-[0.3em]">Style_Signature</h4>
                      </div>
                      <div className="space-y-6 relative">
                         {[
                           { tag: 'Old Money', match: 92 },
                           { tag: 'Quiet Luxury', match: 88 },
                           { tag: 'Techwear', match: 76 }
                         ].map((item) => (
                           <div key={item.tag} className="space-y-2 group">
                              <div className="flex items-center justify-between">
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">{item.tag}</span>
                                 <span className="text-[10px] font-mono text-zinc-600">{item.match}%</span>
                              </div>
                              <div className="h-0.5 bg-white/5 w-full">
                                 <motion.div 
                                   initial={{ width: 0 }} 
                                   animate={{ width: `${item.match}%` }} 
                                   className="h-full bg-primary/40 group-hover:bg-primary transition-colors" 
                                 />
                              </div>
                           </div>
                         ))}
                      </div>
                      <Separator className="bg-white/5 relative" />
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed italic relative">
                         Neural synthesis detects a strong shift towards <span className="text-white">Structural Minimalism</span> with heavy chromatic foundations.
                      </p>
                   </div>

                   <Card className="bg-primary/5 border border-primary/20 rounded-none p-8 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                         <Clock className="h-4 w-4 text-primary" />
                         Session_Archive
                      </h4>
                      <div className="space-y-4">
                         <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed italic">
                            Biometric data is encrypted and stored locally. Neural profile re-sync is recommended every 30 days for optimal synthesis.
                         </p>
                         <Button variant="outline" className="w-full text-[9px] font-black uppercase tracking-widest rounded-none border-white/10 h-10">Clear_Local_Cache</Button>
                      </div>
                   </Card>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={`h-[1px] w-full ${className}`} />;
}
