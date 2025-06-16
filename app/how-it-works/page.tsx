'use client';

import { motion } from 'framer-motion';
import { Camera, Brain, Sparkles, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const pipelineSteps = [
  {
    id: 1,
    icon: Camera,
    title: "Camera Detection",
    description: "Our advanced computer vision captures your facial features, body proportions, and positioning in real-time using your device camera.",
    details: [
      "Real-time face detection and tracking",
      "Body pose estimation",
      "Depth mapping for accurate placement",
      "Multi-angle recognition"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    icon: Brain,
    title: "AI Analysis",
    description: "Machine learning algorithms analyze your features to determine the best fashion matches based on face shape, skin tone, and body type.",
    details: [
      "Facial feature analysis",
      "Skin tone detection",
      "Body type classification",
      "Style preference learning"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Style Recommendation",
    description: "Our AI suggests personalized fashion items from our curated collection that complement your unique features and current trends.",
    details: [
      "Personalized style matching",
      "Trend-based recommendations",
      "Color palette optimization",
      "Fit prediction algorithms"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    icon: Users,
    title: "Virtual Overlay",
    description: "Fashion items are precisely overlaid on your live video feed using AR technology, creating a realistic try-on experience.",
    details: [
      "Precise 3D positioning",
      "Real-time tracking",
      "Natural lighting simulation",
      "Seamless integration"
    ],
    color: "from-green-500 to-teal-500"
  }
];

const features = [
  "Real-time virtual try-on technology",
  "AI-powered personalized recommendations",
  "Support for multiple fashion categories",
  "High-accuracy face and body tracking",
  "Instant snapshot and sharing capabilities",
  "Mobile-optimized responsive design"
];

const stats = [
  { number: "99.9%", label: "Accuracy Rate", description: "Industry-leading precision in fashion overlay" },
  { number: "<100ms", label: "Response Time", description: "Lightning-fast real-time processing" },
  { number: "500+", label: "Fashion Items", description: "Curated collection across all categories" },
  { number: "50K+", label: "Happy Users", description: "Growing community of fashion enthusiasts" }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            How VisionX Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the cutting-edge technology behind our virtual try-on platform. 
            From camera capture to AI analysis, here's how we make fashion magic happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/try-on">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full">
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/recommend">
              <Button variant="outline" size="lg" className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-8 py-3 rounded-full">
                Get Recommendations
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Pipeline Steps */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The Technology Pipeline
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four advanced steps that power your virtual fashion experience
            </p>
          </motion.div>

          <div className="space-y-12">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
                      {/* Visual Section */}
                      <div className={`bg-gradient-to-br ${step.color} p-8 flex items-center justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="text-center text-white"
                        >
                          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <step.icon className="h-12 w-12" />
                          </div>
                          <div className="text-6xl font-bold mb-2">
                            {step.id.toString().padStart(2, '0')}
                          </div>
                          <div className="text-xl font-semibold opacity-90">
                            Step {step.id}
                          </div>
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <div className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="space-y-3">
                          {step.details.map((detail, detailIndex) => (
                            <motion.div
                              key={detailIndex}
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: detailIndex * 0.1 }}
                              className="flex items-center space-x-3"
                            >
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for the ultimate virtual fashion experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="font-medium text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Performance Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry-leading performance that powers your fashion experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "backOut" }}
              >
                <Card className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="font-semibold text-gray-900 mb-2">{stat.label}</div>
                    <div className="text-sm text-gray-600">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Experience the Future of Fashion?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already discovered their perfect style with VisionX's revolutionary technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/try-on">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full">
                <Camera className="mr-2 h-5 w-5" />
                Start Virtual Try-On
              </Button>
            </Link>
            <Link href="/recommend">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-3 rounded-full">
                <Sparkles className="mr-2 h-5 w-5" />
                Get AI Recommendations
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}