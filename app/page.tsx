'use client';

import { motion } from 'framer-motion';
import { Camera, Sparkles, TrendingUp, Globe, Users, ArrowRight, MessageCircle, ShieldCheck, Heart} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TrendingFashion from '@/components/TrendingFashion';
import FloatingAIHelper from '@/components/FloatingAIHelper';
import OutfitShowroom from '@/components/OutfitShowroom';
import TryOnGallery from '@/components/TryOnGallery';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import SocialLinks from '@/components/SocialLinks';

const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 60,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } }
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

      <TryOnGallery />

      {/*Features + Use Case Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/40 to-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              What Makes VisionX Unique?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A fashion-tech platform that combines AI, AR, and community to redefine how you shop, style, and express.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16"
          >
            {[
              {
                icon: Camera,
                title: "Virtual Try-On",
                description: "See how clothes look on you in real-time using AR. Try before you buy, instantly.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: Sparkles,
                title: "AI Style Coach",
                description: "Smart recommendations based on skin tone, body type & your previous choices.",
                gradient: "from-pink-500 to-purple-500"
              },
              {
                icon: TrendingUp,
                title: "Personalized Trends",
                description: "Get trend alerts tailored to your taste — from Y2K to Clean Girl to Old Money.",
                gradient: "from-yellow-400 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition duration-300 bg-white/70 backdrop-blur-lg">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Section - Platform Values / Purpose */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              {
                icon: Globe,
                title: "Global Accessibility",
                description: "Designed for everyone. Works seamlessly across devices and regions.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: ShieldCheck,
                title: "Data Privacy First",
                description: "Your photos, preferences, and data are encrypted and never sold.",
                gradient: "from-gray-500 to-gray-900"
              },
              {
                icon: Heart,
                title: "Fashion for All",
                description: "Built on inclusivity — regardless of size, gender, or budget.",
                gradient: "from-red-400 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition duration-300 bg-white/70 backdrop-blur-lg">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      <TestimonialsCarousel />

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
              Join thousands of fashion enthusiasts who&apos;ve already discovered their perfect style with VisionX.
            </p>
            
          </motion.div>
        </div>
      </section>
      <SocialLinks />
    </div>
  );
}
