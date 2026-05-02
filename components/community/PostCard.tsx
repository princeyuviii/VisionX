'use client';

import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, 
  Zap, ArrowUpRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CommunityPost } from '@/types/fashion';

interface PostCardProps {
  post: CommunityPost;
  index: number;
  onLike: (id: string | number) => void;
  onBookmark: (id: string | number) => void;
}

export function PostCard({ post, index, onLike, onBookmark }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-zinc-950 border-white/10 rounded-none overflow-hidden shadow-2xl relative group">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
           <div className="h-full bg-primary/20 w-1/3 group-hover:w-full transition-all duration-[2000ms]" />
        </div>

        {/* Post Header */}
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 rounded-none border border-primary/20 p-0.5 bg-zinc-900 overflow-hidden">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={post.user?.avatar} className="grayscale hover:grayscale-0 transition-all" />
                  <AvatarFallback className="bg-zinc-800 text-primary font-black">{post.user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">{post.user?.name}</h3>
                  {post.user?.verified && (
                    <Badge className="bg-primary/20 text-primary text-[7px] border-primary/30 uppercase rounded-none px-1.5 py-0">Verified_Node</Badge>
                  )}
                </div>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                  {post.user?.username || `@${post.user?.name?.toLowerCase().replace(/\s+/g, '')}`} // {post.timeAgo || '02h'} ago
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Main Media HUD */}
          <div className="relative aspect-[4/5] bg-zinc-900 group/image">
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover opacity-90 group-hover/image:opacity-100 transition-opacity duration-700"
            />
            
            {/* Technical Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
               <Badge className="bg-black/80 text-white border-white/20 rounded-none text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md px-3 py-1.5">
                 {post.style || 'SYNTHETIC_STYLE'}
               </Badge>
               <div className="flex items-center gap-1">
                  {[1, 2, 3].map(i => <div key={i} className={`w-1 h-1 rounded-full ${i === 1 ? 'bg-primary' : 'bg-white/20'}`} />)}
                  <span className="text-[7px] font-mono text-white/40 uppercase tracking-[0.2em] ml-2">Neural_Confidence: 94.2%</span>
               </div>
            </div>

            {/* Color DNA HUD */}
            <div className="absolute bottom-6 left-6 space-y-4">
               <div className="flex gap-2">
                  <div className="w-8 h-8 bg-zinc-900 border border-white/20 rounded-none" />
                  <div className="w-8 h-8 bg-primary border border-white/20 rounded-none" />
                  <div className="w-8 h-8 bg-zinc-500 border border-white/20 rounded-none" />
               </div>
               <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-[0.3em]">DETECTED_COLOR_PALETTE // DNA_REF: VX-90</p>
            </div>

            {/* Like Hype Meter */}
            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
               <div className="text-[9px] font-black text-primary italic uppercase tracking-tighter">Hype_Status: Optimal</div>
               <div className="w-24 h-1 bg-white/10 rounded-none overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '78%' }} className="h-full bg-primary" />
               </div>
            </div>
          </div>

          {/* Interactive Area */}
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex items-center space-x-8">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => onLike(post._id || post.id!)}
                  className="flex flex-col items-center gap-1 group/btn"
                >
                  <Heart className={`h-6 w-6 transition-all ${post.isLiked ? 'fill-primary text-primary' : 'text-zinc-600 group-hover/btn:text-white'}`} />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-500">{(post.likes || 0).toLocaleString()}</span>
                </motion.button>

                <button className="flex flex-col items-center gap-1 group/btn">
                  <MessageCircle className="h-6 w-6 text-zinc-600 group-hover/btn:text-white transition-all" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-500">{post.comments || 0}</span>
                </button>

                <button className="flex flex-col items-center gap-1 group/btn">
                  <Share2 className="h-6 w-6 text-zinc-600 group-hover/btn:text-white transition-all" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-500">RELAY</span>
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => onBookmark(post._id || post.id!)}
                className="group/btn"
              >
                <Bookmark className={`h-6 w-6 transition-all ${post.isBookmarked ? 'fill-white text-white' : 'text-zinc-600 group-hover/btn:text-white'}`} />
              </motion.button>
            </div>

            {/* Caption Diagnostic */}
            <div className="space-y-4">
              <p className="text-xs text-zinc-300 font-medium leading-relaxed tracking-wide italic">
                "{post.caption}"
              </p>
              <div className="flex flex-wrap gap-3">
                {(post.tags || []).map((tag: string, tagIndex: number) => (
                  <Badge key={tagIndex} variant="outline" className="border-white/5 text-primary text-[8px] uppercase tracking-widest px-3 py-1 bg-white/[0.02] hover:border-primary/30 transition-all cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Style Synthesis CTA */}
            <div className="pt-2">
               <Link href="/try-on">
                 <Button className="w-full bg-white text-black hover:bg-primary font-black text-[10px] uppercase tracking-[0.4em] rounded-none py-6 h-auto shadow-xl group/cta">
                   SYNTHESIZE_THIS_PROTOCOL
                   <ArrowUpRight className="ml-3 h-4 w-4 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform" />
                 </Button>
               </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
