"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Camera,
  Upload,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Heart,
  Eye,
  Star,
  X,
  Check,
  Wifi,
  WifiOff,
  ShoppingCart,
  ExternalLink,
  Zap,
  Crown,
  Palette,
  User,
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { analyzeFashion, checkMLServerHealth } from "@/lib/ml_model"
import Link from "next/link"
import Image from "next/image"

const latestFashionTrends = [
  {
    id: 1,
    title: "Autumn Elegance Collection",
    brand: "Luxury Brands",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    price: "₹2999",
    originalPrice: "₹3999",
    discount: "25% OFF",
    rating: 4.8,
    reviews: 234,
    likes: 1240,
    category: "Old Money",
    trending: true,
    description: "Timeless cashmere blend with sophisticated tailoring",
  },
  {
    id: 2,
    title: "Urban Street Collection",
    brand: "StreetWear Co",
    image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
    price: "₹899",
    originalPrice: "₹1299",
    discount: "31% OFF",
    rating: 4.6,
    reviews: 189,
    likes: 890,
    category: "Streetwear",
    trending: true,
    description: "Bold graphics meet contemporary urban aesthetics",
  },
  {
    id: 3,
    title: "Tech Future Wear",
    brand: "TechCore",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    price: "₹1999",
    originalPrice: "₹2499",
    discount: "20% OFF",
    rating: 4.9,
    reviews: 156,
    likes: 2150,
    category: "Techcore",
    trending: true,
    description: "Innovative fabrics with functional design elements",
  },
  {
    id: 4,
    title: "Bohemian Dreams",
    brand: "Free Spirit",
    image: "https://images.pexels.com/photos/1587976/pexels-photo-1587976.jpeg",
    price: "₹1599",
    originalPrice: "₹1999",
    discount: "20% OFF",
    rating: 4.7,
    reviews: 298,
    likes: 1680,
    category: "Bohemian",
    trending: false,
    description: "Flowing fabrics with artistic patterns and textures",
  },
  {
    id: 5,
    title: "Minimalist Essentials",
    brand: "Clean Lines",
    image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
    price: "₹1299",
    originalPrice: "₹1699",
    discount: "24% OFF",
    rating: 4.5,
    reviews: 167,
    likes: 950,
    category: "Minimalist",
    trending: false,
    description: "Clean cuts with perfect tailoring and premium materials",
  },
  {
    id: 6,
    title: "Vintage Revival",
    brand: "Retro Chic",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg",
    price: "₹1799",
    originalPrice: "₹2299",
    discount: "22% OFF",
    rating: 4.6,
    reviews: 203,
    likes: 1340,
    category: "Vintage",
    trending: true,
    description: "Classic vintage pieces with modern comfort",
  },
]

const analysisSteps = [
  { step: 1, title: "Photo Processing", description: "Processing and enhancing your image", icon: Camera },
  { step: 2, title: "Face Shape Analysis", description: "Analyzing facial features using AI", icon: User },
  { step: 3, title: "Body Measurements", description: "Detecting pose and body proportions", icon: Target },
  { step: 4, title: "Skin Tone Detection", description: "Analyzing skin tone and undertones", icon: Palette },
  { step: 5, title: "Style Matching", description: "Generating personalized recommendations", icon: Crown },
]

const personalizedInsights = [
  {
    title: "Color Psychology",
    description: "Colors that enhance your natural features",
    icon: Palette,
    gradient: "from-pink-100 to-rose-200"
  },
  {
    title: "Body Type Analysis",
    description: "Silhouettes that flatter your proportions",
    icon: User,
    gradient: "from-blue-100 to-indigo-200"
  },
  {
    title: "Style Personality",
    description: "Fashion styles that match your vibe",
    icon: Crown,
    gradient: "from-purple-100 to-violet-200"
  },
  {
    title: "Trend Compatibility",
    description: "Current trends that work for you",
    icon: TrendingUp,
    gradient: "from-green-100 to-emerald-200"
  }
]

interface RecommendationItem {
  name: string
  price: string
  image: string
  confidence: number
  category: string
}

interface StyleRecommendation {
  id: number
  style: string
  match: number
  description: string
  items: RecommendationItem[]
  colors: string[]
  gradient: string
  skinTone: string
  bodyType: string
}

export default function RecommendPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("trending")
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [showPhotoDialog, setShowPhotoDialog] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isUsingCamera, setIsUsingCamera] = useState(false)
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([])
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [mlServerStatus, setMlServerStatus] = useState<"unknown" | "online" | "offline">("unknown")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.",
        )
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsUsingCamera(true)
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error)

      let errorMessage = "Unable to access camera. "

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage +=
          "Please allow camera access in your browser settings and try again.\n\n" +
          "To enable camera:\n" +
          "• Click the camera icon in your browser's address bar\n" +
          "• Select 'Allow' for camera access\n" +
          "• Refresh the page and try again"
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "No camera found on this device. Please connect a camera or use the upload option instead."
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage +=
          "Camera is already in use by another application. Please close other apps using the camera and try again."
      } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
        errorMessage += "Camera doesn't support the required settings. Trying with basic settings..."

        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })

          if (videoRef.current) {
            videoRef.current.srcObject = basicStream
            streamRef.current = basicStream
            setIsUsingCamera(true)
            return
          }
        } catch (basicError) {
          errorMessage += "\n\nBasic camera access also failed. Please use the upload option instead."
        }
      } else if (error.name === "NotSupportedError") {
        errorMessage +=
          "Camera access is not supported in this browser or context. Please use HTTPS or try a different browser."
      } else {
        errorMessage += "Please check your camera permissions and try again, or use the upload option instead."
      }

      alert(errorMessage)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsUsingCamera(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }, [stopCamera])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzePhoto = async (imagestr: string) => {
    setIsAnalyzing(true)
    setShowResults(false)
    setCurrentStep(0)
    setProgress(0)
    setShowPhotoDialog(false)

    try {
      console.log("Starting photo analysis...")

      // Progress bar simulation
      const progressInterval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % analysisSteps.length
          setProgress(((next + 1) / analysisSteps.length) * 90)
          return next
        })
      }, 1000)

      // Call the ML analysis function
      const result = await analyzeFashion(imagestr)

      clearInterval(progressInterval)
      setProgress(100)
      setCurrentStep(analysisSteps.length - 1)

      setMlServerStatus(result.mlServerStatus === "online" ? "online" : "offline")
      setAnalysisData(result)
      setRecommendations(result.recommendations)

      setTimeout(() => {
        setIsAnalyzing(false)
        setShowResults(true)
      }, 1000)

    } catch (error) {
      console.error("Analysis failed:", error)
      setIsAnalyzing(false)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      alert(
        `Analysis failed: ${errorMessage}\n\nPlease try again or check your connection.`,
      )
    }
  }

  const resetAnalysis = () => {
    setShowResults(false)
    setIsAnalyzing(false)
    setProgress(0)
    setCurrentStep(0)
    setCapturedImage(null)
    setRecommendations([])
    setAnalysisData(null)
  }

  const toggleLike = (itemId: number) => {
    setLikedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const trendingItems = latestFashionTrends.filter((item) => item.trending)
  function FashionComponent() {
    const allItems = latestFashionTrends;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-4"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">AI Fashion Recommender</h1>
              {process.env.NODE_ENV === "development" && (
                <div className="text-center mt-2">
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                    ML Server: {process.env.NEXT_PUBLIC_ML_SERVER_URL || "Not configured"}
                  </div>
                </div>
              )}
            </div>
            {mlServerStatus !== "unknown" && (
              <div
                className={`flex items-center px-3 py-1 rounded-full text-sm ml-4 ${
                  mlServerStatus === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {mlServerStatus === "online" ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                ML Server {mlServerStatus}
              </div>
            )}
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your photo to get personalized fashion recommendations powered by advanced AI models. 
            Discover styles that complement your unique features and current trends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Input Section */}
            {!isAnalyzing && !showResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden">
                  <CardContent className="p-8">
                    <motion.div whileHover={{ scale: 1.02 }} className="space-y-6">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="h-12 w-12" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-2">Get Your Style Analysis</h3>
                        <p className="text-purple-100 text-lg">
                          Upload a photo or take a live picture to receive AI-powered fashion recommendations
                        </p>
                      </div>

                      {capturedImage && (
                        <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border-4 border-white/30">
                          <Image
                            src={capturedImage || "/placeholder.svg"}
                            alt="Captured"
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={() => setCapturedImage(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      <div className="space-y-4">
                        {!capturedImage ? (
                          <Button
                            onClick={() => setShowPhotoDialog(true)}
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full w-full text-lg"
                          >
                            <Camera className="mr-3 h-6 w-6" />
                            Take Photo / Upload Image
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => analyzePhoto(capturedImage)}
                              size="lg"
                              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full w-full text-lg"
                            >
                              <Sparkles className="mr-3 h-6 w-6" />
                              Analyze My Style
                            </Button>
                            <div className="flex space-x-3">
                              <Button
                                onClick={() => setShowPhotoDialog(true)}
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-white/30 text-white hover:bg-white/10 flex-1"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retake
                              </Button>
                              <Button
                                onClick={() => setCapturedImage(null)}
                                size="sm"
                                variant="outline"
                                className="bg-transparent border-white/30 text-white hover:bg-white/10 flex-1"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Analysis Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl">Analyzing Your Photo with AI...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
                        />

                        {/** ✅ Fix here — declare Icon before usage */}
                        {(() => {
                          const Icon = analysisSteps[currentStep]?.icon;
                          return (
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              {Icon && <Icon className="h-6 w-6 text-purple-600" />}
                              <p className="text-xl font-semibold text-gray-700">
                                {analysisSteps[currentStep]?.title}
                              </p>
                            </div>
                          );
                        })()}

                        <p className="text-gray-500">{analysisSteps[currentStep]?.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Analysis Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>

                      <div className="grid grid-cols-5 gap-3">
                        {analysisSteps.map((step, index) => (
                          <motion.div
                            key={step.step}
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ 
                              scale: index <= currentStep ? 1 : 0.8,
                              opacity: index <= currentStep ? 1 : 0.5
                            }}
                            className={`text-center p-3 rounded-xl transition-all ${
                              index <= currentStep ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <step.icon className="h-6 w-6 mx-auto mb-2" />
                            <div className="text-xs font-medium">{step.title}</div>
                          </motion.div>
                        ))}
                      </div>

                      {capturedImage && (
                        <div className="flex justify-center">
                          <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-purple-200">
                            <Image
                              src={capturedImage || "/placeholder.svg"}
                              alt="Analyzing"
                              width={128}
                              height={128}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {showResults && recommendations.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                      className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 rounded-full text-lg font-semibold mb-6"
                    >
                      <Check className="h-6 w-6 mr-3" />
                      AI Analysis Complete!
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personalized Style Recommendations</h2>
                    <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                      Based on our advanced AI analysis of your photo, here are the styles that suit you best
                    </p>

                    <div className="flex justify-center space-x-4">
                      <Button onClick={resetAnalysis} variant="outline" size="lg" className="px-6">
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Try Another Photo
                      </Button>
                      <Link href="/try-on">
                        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                          <Camera className="mr-2 h-5 w-5" />
                          Try On Virtually
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  {analysisData && (
                    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-lg">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI Analysis Summary</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {personalizedInsights.map((insight, index) => (
                            <motion.div
                              key={insight.title}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`bg-gradient-to-br ${insight.gradient} p-6 rounded-xl text-center`}
                            >
                              <insight.icon className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                              <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                              <p className="text-sm text-gray-600">{insight.description}</p>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-6 grid md:grid-cols-3 gap-6 text-center">
                          <div className="bg-white/60 p-4 rounded-lg">
                            <span className="font-semibold text-gray-700">Face Shape:</span>
                            <p className="text-gray-900 capitalize font-medium">{analysisData.faceShape}</p>
                          </div>
                          <div className="bg-white/60 p-4 rounded-lg">
                            <span className="font-semibold text-gray-700">Body Type:</span>
                            <p className="text-gray-900 capitalize font-medium">{analysisData.bodyType}</p>
                          </div>
                          <div className="bg-white/60 p-4 rounded-lg">
                            <span className="font-semibold text-gray-700">Skin Tone:</span>
                            <p className="text-gray-900 capitalize font-medium">{analysisData.skinTone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-8">
                    {recommendations.map((recommendation, index) => (
                      <motion.div
                        key={recommendation.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`shadow-2xl border-0 bg-gradient-to-r ${recommendation.gradient} overflow-hidden`}
                        >
                          <CardContent className="p-0">
                            <div className="grid md:grid-cols-3 gap-8 p-8">
                              {/* Style Info */}
                              <div className="md:col-span-1 space-y-6">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-white/90 text-gray-700 font-semibold text-lg px-4 py-2">
                                    {recommendation.match}% Match
                                  </Badge>
                                  <TrendingUp className="h-6 w-6 text-gray-600" />
                                </div>

                                <div>
                                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{recommendation.style}</h3>
                                  <p className="text-gray-700 mb-4 leading-relaxed">{recommendation.description}</p>

                                  <div className="space-y-3 text-sm">
                                    <div className="bg-white/60 p-3 rounded-lg">
                                      <span className="font-semibold">Skin Analysis:</span>
                                      <p className="text-gray-700">{recommendation.skinTone}</p>
                                    </div>
                                    <div className="bg-white/60 p-3 rounded-lg">
                                      <span className="font-semibold">Body Type:</span>
                                      <p className="text-gray-700">{recommendation.bodyType}</p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Perfect Colors for You:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {recommendation.colors.map((color) => (
                                      <Badge key={color} variant="secondary" className="text-sm bg-white/80">
                                        {color}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <Link href="/try-on">
                                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg">
                                      Try This Style Virtually
                                      <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                  </Link>
                                  <Button variant="outline" className="w-full py-3">
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Shop Similar Items
                                  </Button>
                                </div>
                              </div>

                              {/* Recommended Items */}
                              <div className="md:col-span-2">
                                <h4 className="font-bold text-gray-900 mb-6 text-xl">AI Recommended Items:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                  {recommendation.items.map((item) => (
                                    <motion.div
                                      key={item.name}
                                      whileHover={{ scale: 1.05 }}
                                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center space-y-4 shadow-lg"
                                    >
                                      <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                                        <img
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                                        <p className="text-purple-600 font-bold text-lg">{item.price}</p>
                                        <div className="flex items-center justify-center space-x-2 mt-2">
                                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                          <span className="text-sm text-gray-600 font-medium">
                                            {Math.round(item.confidence * 100)}% match
                                          </span>
                                        </div>
                                        <Badge variant="outline" className="text-xs mt-2">
                                          {item.category}
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          View Item
                                        </Button>
                                      </div>
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Additional Fashion Inspiration */}
            {!isAnalyzing && !showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-6 w-6 text-orange-500" />
                      <span>Fashion Inspiration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {latestFashionTrends.slice(0, 6).map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                        >
                          <div className="relative">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-48 object-cover"
                            />
                            {item.trending && (
                              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                🔥 Trending
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-black/60 text-white text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                            <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-900">{item.price}</span>
                                <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                {item.discount}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Latest Fashion Sidebar */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Latest Fashion</h3>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="all">All Items</TabsTrigger>
                  </TabsList>

                  <TabsContent value="trending" className="space-y-4">
                    {trendingItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.brand}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">{item.rating}</span>
                                  <span className="text-xs text-gray-400">({item.reviews})</span>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleLike(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart
                                  className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-gray-900">{item.price}</span>
                                <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {item.discount}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Eye className="h-3 w-3" />
                                <span>{item.likes}</span>
                              </div>
                              <Link href="/try-on">
                                <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white">
                                  Try On
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>

                  <TabsContent value="all" className="space-y-4">
                    {allItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                      >
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-gray-900 truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.brand}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">{item.rating}</span>
                                  <span className="text-xs text-gray-400">({item.reviews})</span>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleLike(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart
                                  className={`h-4 w-4 ${likedItems.includes(item.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm text-gray-900">{item.price}</span>
                                <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {item.discount}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Eye className="h-3 w-3" />
                                <span>{item.likes}</span>
                              </div>
                              <Link href="/try-on">
                                <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white">
                                  Try On
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Style Tips */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span>Style Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-purple-700">
                    For best results, use a well-lit photo with your face clearly visible and minimal background distractions.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📸 Photo Guidelines</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Face the camera directly</li>
                    <li>• Ensure good lighting</li>
                    <li>• Avoid heavy makeup or filters</li>
                    <li>• Include shoulders in the frame</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Accuracy</h4>
                  <p className="text-sm text-green-700">
                    Our AI analyzes 50+ facial and body features to provide 95%+ accurate style recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Input Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {!isUsingCamera && !capturedImage
                  ? "Choose Photo Input Method"
                  : isUsingCamera
                    ? "Take Your Photo"
                    : "Photo Preview"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {!isUsingCamera && !capturedImage ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={startCamera}>
                      <CardContent className="p-8 text-center">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                        <h3 className="font-bold text-xl mb-2">Take Live Photo</h3>
                        <p className="text-gray-600">Use your camera to take a photo</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CardContent className="p-8 text-center">
                        <Upload className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                        <h3 className="font-bold text-xl mb-2">Upload Photo</h3>
                        <p className="text-gray-600">Choose from your device</p>
                        <p className="text-sm text-green-600 mt-2">Recommended if camera issues occur</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">📋 Camera Access Help</h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p>• Make sure you're using HTTPS (secure connection)</p>
                      <p>• Allow camera permissions when prompted</p>
                      <p>• Close other apps that might be using your camera</p>
                      <p>• Try refreshing the page if camera doesn't work</p>
                    </div>
                  </div>
                </div>
              ) : isUsingCamera && !capturedImage ? (
                <div className="space-y-6">
                  <div className="relative bg-black rounded-xl overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-96 object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 right-4">
                        <div className="bg-black/60 text-white px-4 py-3 rounded-lg text-center backdrop-blur-sm">
                          Position yourself in the frame and click capture when ready
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                    >
                      <Camera className="mr-2 h-6 w-6" />
                      Capture Photo
                    </Button>
                    <Button onClick={stopCamera} variant="outline" size="lg" className="px-8 py-3">
                      <X className="mr-2 h-5 w-5" />
                      Cancel
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Camera not working?</p>
                    <Button
                      onClick={() => {
                        stopCamera()
                        setCapturedImage(null)
                      }}
                      variant="link"
                      className="text-purple-600"
                    >
                      Try uploading a photo instead
                    </Button>
                  </div>
                </div>
              ) : capturedImage ? (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={capturedImage || "/placeholder.svg"}
                        alt="Captured photo"
                        width={600}
                        height={400}
                        className="w-full h-auto max-h-96 object-cover mx-auto"
                      />
                    </div>

                    <div className="absolute top-4 left-4 right-4">
                      <div className="bg-green-500 text-white px-4 py-3 rounded-lg text-center backdrop-blur-sm">
                        ✓ Photo captured successfully! Ready for AI analysis.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => {
                        analyzePhoto(capturedImage)
                      }}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                    >
                      <Sparkles className="mr-2 h-6 w-6" />
                      Analyze My Style
                    </Button>

                    <Button
                      onClick={() => {
                        setCapturedImage(null)
                        startCamera()
                      }}
                      variant="outline"
                      size="lg"
                      className="px-6 py-3"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Retake
                    </Button>

                    <Button
                      onClick={() => {
                        setCapturedImage(null)
                        setShowPhotoDialog(false)
                      }}
                      variant="outline"
                      size="lg"
                      className="px-6 py-3"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Cancel
                    </Button>
                  </div>

                  <div className="text-center text-gray-600">
                    <p>Make sure your face is clearly visible and well-lit for best results</p>
                  </div>
                </div>
              ) : null}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
}