'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Camera, Filter, Search, TrendingUp, Users, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

const communityPosts = [
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
  },
  {
    id: 4,
    user: {
      name: "Marcus Tech",
      username: "@marcustech",
      avatar: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
      verified: false
    },
    image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
    caption: "Future is now. Techcore aesthetic with functional design meets style 🚀",
    style: "Techcore",
    likes: 1567,
    comments: 89,
    shares: 234,
    timeAgo: "8h",
    tags: ["#Techcore", "#Future", "#Functional"],
    isLiked: true,
    isBookmarked: false
  },
  {
    id: 5,
    user: {
      name: "Isabella Grace",
      username: "@bellagrace",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      verified: true
    },
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    caption: "Minimalist Monday mood 🤍 Less is always more when it comes to timeless elegance",
    style: "Minimalist",
    likes: 2234,
    comments: 167,
    shares: 78,
    timeAgo: "12h",
    tags: ["#Minimalist", "#Clean", "#Timeless"],
    isLiked: false,
    isBookmarked: true
  }
];

const trendingStyles = [
  { name: "Old Money", count: "12.5K", growth: "+15%" },
  { name: "Streetwear", count: "8.9K", growth: "+23%" },
  { name: "Techcore", count: "6.2K", growth: "+45%" },
  { name: "Bohemian", count: "5.8K", growth: "+12%" },
  { name: "Minimalist", count: "4.3K", growth: "+8%" }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(communityPosts);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ caption: "", style: "", image: null });

  const handleLike = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => 
    post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.style.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Fashion Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Share your style, discover trends, and connect with fashion enthusiasts worldwide
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full">
                  <Plus className="mr-2 h-5 w-5" />
                  Share Your Style
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Fashion Style</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style Category
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select Style</option>
                      <option>Old Money</option>
                      <option>Streetwear</option>
                      <option>Bohemian</option>
                      <option>Techcore</option>
                      <option>Minimalist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caption
                    </label>
                    <Textarea 
                      placeholder="Share your style story..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Share Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Link href="/try-on">
              <Button variant="outline" className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-6 py-3 rounded-full">
                <Camera className="mr-2 h-5 w-5" />
                Try Virtual Styling
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search styles, users, or hashtags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full border-gray-200 focus:border-purple-300"
                    />
                  </div>
                  <Button variant="outline" className="rounded-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                      {/* Post Header */}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={post.user.avatar} />
                              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                                {post.user.verified && (
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{post.user.username} • {post.timeAgo}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="p-0">
                        {/* Post Image */}
                        <div className="relative aspect-square bg-gray-100">
                          <img 
                            src={post.image} 
                            alt={post.caption}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">
                              {post.style}
                            </Badge>
                          </div>
                        </div>

                        {/* Post Actions */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleLike(post.id)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                              >
                                <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="font-medium">{post.likes.toLocaleString()}</span>
                              </motion.button>
                              
                              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                                <MessageCircle className="h-6 w-6" />
                                <span className="font-medium">{post.comments}</span>
                              </button>
                              
                              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                                <Share2 className="h-6 w-6" />
                                <span className="font-medium">{post.shares}</span>
                              </button>
                            </div>
                            
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleBookmark(post.id)}
                              className="text-gray-600 hover:text-purple-500 transition-colors"
                            >
                              <Bookmark className={`h-6 w-6 ${post.isBookmarked ? 'fill-purple-500 text-purple-500' : ''}`} />
                            </motion.button>
                          </div>

                          {/* Post Caption */}
                          <div className="space-y-2">
                            <p className="text-gray-800">{post.caption}</p>
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="text-purple-600 text-sm hover:underline cursor-pointer">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Try This Style Button */}
                          <Link href="/try-on">
                            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full">
                              Try This Style
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Styles */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Trending Styles</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingStyles.map((style, index) => (
                  <motion.div
                    key={style.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{style.name}</h4>
                      <p className="text-sm text-gray-500">{style.count} posts</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {style.growth}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Community Stats</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">125K+</div>
                  <div className="text-sm text-gray-500">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">2.3M+</div>
                  <div className="text-sm text-gray-500">Styles Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">45K+</div>
                  <div className="text-sm text-gray-500">Daily Try-Ons</div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Users */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Suggested for You</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Fashion Forward", username: "@fashionforward", followers: "12.5K" },
                  { name: "Style Maven", username: "@stylemaven", followers: "8.9K" },
                  { name: "Trend Setter", username: "@trendsetter", followers: "15.2K" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                        <p className="text-xs text-gray-500">{user.followers} followers</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}