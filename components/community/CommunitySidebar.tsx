'use client';

import { motion } from 'framer-motion';
import { 
  Zap, TrendingUp, Activity, User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingStyle } from '@/types/fashion';

interface CommunitySidebarProps {
  trendingStyles: TrendingStyle[];
  timeLeft: string;
}

export function CommunitySidebar({ trendingStyles, timeLeft }: CommunitySidebarProps) {
  return (
    <div className="space-y-10">
      {/* Active Style Challenge */}
      <Card className="bg-primary/10 border-primary/30 rounded-none shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
         <div className="absolute top-0 right-0 p-4">
            <Zap className="h-10 w-10 text-primary opacity-20" />
         </div>
         <CardContent className="p-8 space-y-6 relative">
            <div className="space-y-1">
               <Badge className="bg-primary text-black text-[7px] font-black uppercase tracking-[0.3em] rounded-none">Weekly_Event</Badge>
               <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">Neon_Minimalism_Challenge</h3>
            </div>
            <p className="text-[9px] font-mono text-zinc-400 uppercase leading-relaxed tracking-widest">
               Incorporate one high-visibility element into a structural minimalist look. Winner receives VX-PRO status.
            </p>
            <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
               <span>Time_Left: {timeLeft}</span>
               <span>Entries: 1.2K</span>
            </div>
            <Button className="w-full bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-none h-12 hover:bg-primary transition-all">
              Enter_Challenge
            </Button>
         </CardContent>
      </Card>

      {/* Global Activity Sidebar */}
      <Card className="bg-zinc-950 border-white/10 rounded-none shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20" />
         <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3">
               <Activity className="h-4 w-4 text-primary" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Global_Sync_Feed</h3>
            </div>
         </CardHeader>
         <CardContent className="p-8 pt-0 space-y-8">
            {[
              { user: "User_482", action: "SYNTHESIZED", item: "TECH_PARKA", time: "2m" },
              { user: "User_901", action: "ARCHIVED", item: "SILK_SHIRT", time: "5m" },
              { user: "User_125", action: "UPLOADED", item: "OUTFIT_SCAN", time: "12m" }
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-4 border-l border-white/5 pl-4 relative">
                 <div className="absolute -left-[1.5px] top-0 w-[3px] h-3 bg-primary/40" />
                 <div className="space-y-1">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                       <span className="text-white font-black">{act.user}</span> {act.action}
                    </p>
                    <p className="text-[8px] font-mono text-primary uppercase">{act.item}</p>
                    <p className="text-[7px] font-mono text-zinc-700 uppercase">{act.time} AGO</p>
                 </div>
              </div>
            ))}
         </CardContent>
      </Card>

      {/* Trending Styles Diagnostic */}
      <Card className="bg-zinc-950 border-white/10 rounded-none shadow-2xl">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Style_Velocity</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
          {trendingStyles.map((style) => (
            <div
              key={style.name}
              className="space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">{style.name}</h4>
                <div className="flex items-center gap-3">
                   <span className="text-[8px] font-mono text-zinc-600 uppercase italic">{style.count} SYNCED</span>
                   <span className="text-[8px] font-black text-green-500">{style.growth}</span>
                </div>
              </div>
              <div className="h-1 bg-white/5 w-full relative">
                 <motion.div 
                   initial={{ width: 0 }} 
                   whileInView={{ width: style.count.replace('K', '') + '%' }} 
                   className="h-full bg-primary/30 group-hover:bg-primary transition-colors" 
                 />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Creators */}
      <Card className="bg-zinc-950 border-white/10 rounded-none shadow-2xl">
        <CardHeader className="p-8 pb-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Node_Suggestions</h3>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
          {[
            { name: "Fashion Forward", username: "@fashionforward", followers: "12.5K" },
            { name: "Style Maven", username: "@stylemaven", followers: "8.9K" }
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 border border-white/10 rounded-none p-0.5 group-hover:border-primary transition-colors">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarFallback className="bg-zinc-900 text-primary font-black text-[10px]">{user.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{user.name}</h4>
                  <p className="text-[8px] font-mono text-zinc-600 uppercase">{user.followers} NODES</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-[8px] h-8 rounded-none border border-white/5 hover:border-primary/50 text-zinc-500 hover:text-primary uppercase tracking-widest font-black transition-all">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
