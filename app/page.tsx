'use client';

import { motion } from 'framer-motion';
import { Camera, Sparkles, TrendingUp, Users, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TrendingFashion from '@/components/TrendingFashion';
import FloatingAIHelper from '@/components/FloatingAIHelper';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, 
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <FloatingAIHelper />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="text-center space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-700 mb-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Revolutionary AR Fashion Technology
              </motion.div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Try Fashion.
                </span>
                <br />
                <span className="text-gray-900">Live. Instantly.</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of fashion with our AI-powered virtual try-on platform. 
                Try trending styles using just your camera — like Snapchat filters, but for fashion.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/try-on">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all group"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Start Try-On
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/recommend">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-8 py-4 rounded-full transition-all group"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Recommendations
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trending Fashion Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trending Fashion Styles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the latest fashion trends and try them on instantly
            </p>
          </motion.div>
          <TrendingFashion />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VisionX?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary technology meets fashion-forward thinking
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Camera,
                title: "Real-Time Try-On",
                description: "Experience fashion instantly with our advanced AR technology. No waiting, no guessing.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Recommendations",
                description: "Get personalized style suggestions based on your face tone, body shape, and preferences.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Latest Trends",
                description: "Stay ahead with curated fashion trends from Old Money to Streetwear to Techcore.",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "50K+", label: "Happy Users" },
              { number: "1M+", label: "Try-Ons" },
              { number: "500+", label: "Fashion Items" },
              { number: "95%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: "backOut" }}
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white">
              Ready to Transform Your Fashion Experience?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of fashion enthusiasts who've already discovered their perfect style with VisionX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/try-on">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Try Now - It's Free
                </Button>
              </Link>
              
              <Link href="/how-it-works">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4 rounded-full transition-all"
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}