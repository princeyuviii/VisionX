'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Search, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

import { PostCard } from '@/components/community/PostCard';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { CommunityPost, TrendingStyle } from '@/types/fashion';

const staticPosts: CommunityPost[] = [
  {
    id: 1,
    user: {
      name: "Emma Chen",
      username: "@emmastyle",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      verified: true
    },
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    caption: "Loving this Old Money aesthetic! Perfect for autumn vibes 🍂 #OldMoney #FashionInspo",
    style: "Old Money",
    likes: 2847,
    comments: 156,
    shares: 89,
    timeAgo: "2h",
    tags: ["#OldMoney", "#Autumn", "#Elegant"],
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    user: {
      name: "Alex Rivera",
      username: "@alexstreet",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
      verified: false
    },
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
    caption: "Street vibes hitting different today 🔥 Who else is feeling the urban energy?",
    style: "Streetwear",
    likes: 1923,
    comments: 234,
    shares: 67,
    timeAgo: "4h",
    tags: ["#Streetwear", "#Urban", "#Fresh"],
    isLiked: true,
    isBookmarked: false
  },
  {
    id: 3,
    user: {
      name: "Sofia Martinez",
      username: "@sofiaboho",
      avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
      verified: true
    },
    image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg",
    caption: "Bohemian dreams and flowing fabrics ✨ Sometimes you just need to embrace your free spirit",
    style: "Bohemian",
    likes: 3156,
    comments: 298,
    shares: 145,
    timeAgo: "6h",
    tags: ["#Boho", "#FreeSpirit", "#Dreamy"],
    isLiked: false,
    isBookmarked: true
  }
];

const trendingStyles: TrendingStyle[] = [
  { name: "Old Money", count: "12.5K", growth: "+15%" },
  { name: "Streetwear", count: "8.9K", growth: "+23%" },
  { name: "Techcore", count: "6.2K", growth: "+45%" },
  { name: "Bohemian", count: "5.8K", growth: "+12%" },
  { name: "Minimalist", count: "4.3K", growth: "+8%" }
];

export default function CommunityPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ caption: "", style: "Old Money", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("02d 14h 52m 10s");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const s = 60 - now.getSeconds();
      const m = 60 - now.getMinutes();
      const h = 24 - now.getHours();
      setTimeLeft(`02d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data.length > 0 ? data : staticPosts);
      } else {
        setPosts(staticPosts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts(staticPosts);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Please sign in to share your style");
      return;
    }

    if (!newPost.caption || !newPost.image) {
      toast.error("Please provide a caption and image URL");
      return;
    }

    try {
      setIsSubmitting(true);
      const postData = {
        user: {
          name: user.fullName || user.username || "Anonymous",
          avatar: user.imageUrl,
          clerkId: user.id
        },
        image: newPost.image,
        caption: newPost.caption,
        style: newPost.style,
        tags: [newPost.style.startsWith('#') ? newPost.style : `#${newPost.style.replace(/\s+/g, '')}`]
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        toast.success("Style shared with the community!");
        setIsCreatePostOpen(false);
        setNewPost({ caption: "", style: "Old Money", image: "" });
        fetchPosts();
      }
    } catch (error) {
      toast.error("Failed to share style");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string | number) => {
    setPosts(prev => prev.map(post => {
      if (post._id === postId || post.id === postId) {
        const isLiked = post.isLiked;
        return { 
          ...post, 
          likes: isLiked ? post.likes - 1 : post.likes + 1, 
          isLiked: !isLiked 
        };
      }
      return post;
    }));

    try {
      const post = posts.find(p => p._id === postId || p.id === postId);
      await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          action: post?.isLiked ? 'unlike' : 'like'
        })
      });
    } catch (error) {
      console.error("Failed to update post like:", error);
    }
  };

  const handleBookmark = (postId: string | number) => {
    setPosts(prev => prev.map(post =>
      (post._id === postId || post.id === postId)
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const filteredPosts = posts.filter(post =>
    (post.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.style || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-16 px-4 font-sans">
      <div className="absolute inset-0 cyber-grid opacity-10 -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <Badge className="bg-primary text-black font-black text-[8px] uppercase tracking-[0.3em] rounded-none px-3 py-1">Global_Sync</Badge>
              <div className="h-px w-24 bg-white/10" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Active_Nodes: 125,482</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
              Style<span className="text-primary text-glow-amber">_Community</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.4em] max-w-xl">
              Cross-referenced fashion archives // Synchronize your aesthetic with the global neural network.
            </p>
          </motion.div>

          <div className="flex items-center gap-6">
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-primary hover:text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-none px-10 py-8 h-auto shadow-[0_0_50px_rgba(251,191,36,0.1)] transition-all">
                  <Plus className="mr-3 h-5 w-5" />
                  Upload_Archive
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950 border-white/10 rounded-none max-w-xl p-0 overflow-hidden">
                <div className="bg-primary/10 border-b border-primary/20 p-6 flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em]">Neural_Archive_Submission</h3>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-[8px] font-mono uppercase text-primary">Status: Ready</span>
                   </div>
                </div>
                <div className="p-10 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Image_Source_URL</label>
                    <Input
                      placeholder="HTTPS://SOURCE.IMG/DATA..."
                      className="bg-white/5 border-white/10 text-white rounded-none font-mono text-[11px] h-12 focus:border-primary/50"
                      value={newPost.image}
                      onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Style_Protocol</label>
                        <select
                          className="w-full p-4 bg-white/5 border border-white/10 text-white rounded-none font-mono text-[11px] uppercase tracking-widest appearance-none focus:border-primary/50"
                          value={newPost.style}
                          onChange={(e) => setNewPost({ ...newPost, style: e.target.value })}
                        >
                          {trendingStyles.map(s => <option key={s.name}>{s.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Security_Token</label>
                        <Input disabled placeholder="V-AUTH-0482" className="bg-white/5 border-white/10 text-zinc-600 rounded-none font-mono text-[11px] h-12" />
                     </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Archive_Caption</label>
                    <Textarea
                      placeholder="INPUT_DESCRIPTION_DATA..."
                      className="bg-white/5 border-white/10 text-white rounded-none font-mono text-[11px] min-h-[120px] focus:border-primary/50"
                      value={newPost.caption}
                      onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                    />
                  </div>
                  <Button
                    className="w-full bg-primary text-black hover:bg-white transition-all font-black py-8 rounded-none uppercase tracking-[0.4em] text-[10px] shadow-2xl"
                    onClick={handleCreatePost}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "UPLOADING_DATA..." : "DEPLOY_TO_COMMUNITY"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Search and Filters HUD */}
            <div className="bg-zinc-950 border border-white/10 p-6 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors" />
                  <Input
                    placeholder="SEARCH_STYLE_DNA / USER_NODE / HASHTAG..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border-white/5 rounded-none pl-12 h-14 font-mono text-[10px] tracking-widest uppercase focus:border-primary/40 focus:ring-0 transition-all"
                  />
                </div>
                <Button variant="outline" className="h-14 px-8 border-white/5 rounded-none text-[10px] font-black uppercase tracking-widest hover:border-primary/40 transition-all">
                  <Filter className="mr-3 h-4 w-4" />
                  Protocol_Filters
                </Button>
              </div>

              <div className="flex items-center gap-12 overflow-x-auto no-scrollbar border-t border-white/5 pt-6">
                {['Trending', 'Following', 'Recent', 'Saved'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 ${activeTab === tab.toLowerCase() ? 'text-primary border-b-2 border-primary' : 'text-zinc-600 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                  />
                  <p className="text-muted-foreground animate-pulse">Loading fashion feed...</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredPosts.map((post, index) => (
                    <PostCard 
                      key={post._id || post.id} 
                      post={post} 
                      index={index} 
                      onLike={handleLike} 
                      onBookmark={handleBookmark} 
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CommunitySidebar trendingStyles={trendingStyles} timeLeft={timeLeft} />
          </div>
        </div>
      </div>
    </div>
  );
}
