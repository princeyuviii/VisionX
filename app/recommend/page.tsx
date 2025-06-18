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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"

const latestFashionTrends = [
  {
    id: 1,
    title: "Autumn Elegance Collection",
    brand: "Luxury Brands",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
    price: "$299",
    originalPrice: "$399",
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
    price: "$89",
    originalPrice: "$129",
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
    price: "$199",
    originalPrice: "$249",
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
    price: "$159",
    originalPrice: "$199",
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
    price: "$129",
    originalPrice: "$169",
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
    price: "$179",
    originalPrice: "$229",
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
  { step: 1, title: "Photo Processing", description: "Processing and enhancing your image" },
  { step: 2, title: "Face Shape Analysis", description: "Analyzing facial features using AI" },
  { step: 3, title: "Body Measurements", description: "Detecting pose and body proportions" },
  { step: 4, title: "Skin Tone Detection", description: "Analyzing skin tone and undertones" },
  { step: 5, title: "Style Matching", description: "Generating personalized recommendations" },
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

  const analyzePhoto = async (imageData: string) => {
    setIsAnalyzing(true)
    setShowResults(false)
    setCurrentStep(0)
    setProgress(0)
    setShowPhotoDialog(false)

    try {
      // Call your actual ML API
      const response = await fetch("/api/analyze-fashion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Analysis failed")
      }

      // Update progress through analysis steps
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i)
        setProgress(((i + 1) / analysisSteps.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      setMlServerStatus(result.mlServerStatus || "unknown")
      setAnalysisData(result.analysis)
      setRecommendations(result.analysis.recommendations)

      setIsAnalyzing(false)
      setShowResults(true)
    } catch (error) {
      console.error("Analysis failed:", error)
      setIsAnalyzing(false)
      alert(
        `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure the ML server is running.`,
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
  const allItems = latestFashionTrends

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mr-4">AI Fashion Recommender</h1>
            {mlServerStatus !== "unknown" && (
              <div
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  mlServerStatus === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {mlServerStatus === "online" ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
                ML Server {mlServerStatus}
              </div>
            )}
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your photo to get personalized fashion recommendations powered by advanced AI models.
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
                <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="p-8">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="space-y-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                        <Camera className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-bold">Get Your Style Analysis</h3>
                      <p className="text-purple-100">
                        Upload a photo or take a live picture to receive AI-powered fashion recommendations
                      </p>

                      {capturedImage && (
                        <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden border-2 border-white/30">
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
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <div className="space-y-3">
                        {!capturedImage ? (
                          <Button
                            onClick={() => setShowPhotoDialog(true)}
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full w-full"
                          >
                            <Camera className="mr-2 h-5 w-5" />
                            Take Photo / Upload
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => analyzePhoto(capturedImage)}
                              size="lg"
                              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full w-full"
                            >
                              <Sparkles className="mr-2 h-5 w-5" />
                              Analyze My Style
                            </Button>
                            <div className="flex space-x-2">
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
                  <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-center text-2xl">Analyzing Your Photo with AI...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                        />
                        <p className="text-lg font-medium text-gray-700">{analysisSteps[currentStep]?.title}</p>
                        <p className="text-sm text-gray-500">{analysisSteps[currentStep]?.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {analysisSteps.map((step, index) => (
                          <div
                            key={step.step}
                            className={`text-center p-2 rounded-lg transition-colors ${
                              index <= currentStep ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <div className="text-xs font-medium">{step.title}</div>
                          </div>
                        ))}
                      </div>

                      {capturedImage && (
                        <div className="flex justify-center">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-200">
                            <Image
                              src={capturedImage || "/placeholder.svg"}
                              alt="Analyzing"
                              width={96}
                              height={96}
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
                      className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      AI Analysis Complete!
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Personalized Style Recommendations</h2>
                    <p className="text-gray-600 mb-6">
                      Based on our advanced AI analysis of your photo, here are the styles that suit you best
                    </p>

                    <div className="flex justify-center space-x-4">
                      <Button onClick={resetAnalysis} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Another Photo
                      </Button>
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  {analysisData && (
                    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-0">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Summary</h3>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Face Shape:</span>
                            <p className="text-gray-600 capitalize">{analysisData.faceShape}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Body Type:</span>
                            <p className="text-gray-600 capitalize">{analysisData.bodyType}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Skin Tone:</span>
                            <p className="text-gray-600 capitalize">{analysisData.skinTone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid gap-6">
                    {recommendations.map((recommendation, index) => (
                      <motion.div
                        key={recommendation.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`shadow-lg border-0 bg-gradient-to-r ${recommendation.gradient} overflow-hidden`}
                        >
                          <CardContent className="p-0">
                            <div className="grid md:grid-cols-3 gap-6 p-6">
                              {/* Style Info */}
                              <div className="md:col-span-1 space-y-4">
                                <div className="flex items-center justify-between">
                                  <Badge className="bg-white/20 text-gray-700 font-medium">
                                    {recommendation.match}% Match
                                  </Badge>
                                  <TrendingUp className="h-5 w-5 text-gray-600" />
                                </div>

                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{recommendation.style}</h3>
                                  <p className="text-gray-700 text-sm mb-3">{recommendation.description}</p>

                                  <div className="space-y-2 text-xs">
                                    <p>
                                      <span className="font-medium">Analysis:</span> {recommendation.skinTone}
                                    </p>
                                    <p>
                                      <span className="font-medium">Body Type:</span> {recommendation.bodyType}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Perfect Colors:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {recommendation.colors.map((color) => (
                                      <Badge key={color} variant="secondary" className="text-xs">
                                        {color}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Link href="/try-on">
                                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                                    Try This Style
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>

                              {/* Recommended Items */}
                              <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-900 mb-4">AI Recommended Items:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {recommendation.items.map((item) => (
                                    <motion.div
                                      key={item.name}
                                      whileHover={{ scale: 1.05 }}
                                      className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center space-y-2"
                                    >
                                      <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                        <img
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <h5 className="font-medium text-sm text-gray-900">{item.name}</h5>
                                      <p className="text-purple-600 font-semibold text-sm">{item.price}</p>
                                      <div className="flex items-center justify-center space-x-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-600">
                                          {Math.round(item.confidence * 100)}% match
                                        </span>
                                      </div>
                                      <Badge variant="outline" className="text-xs">
                                        {item.category}
                                      </Badge>
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
          </div>

          {/* Latest Fashion Sidebar */}
          <div className="space-y-6">
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
          </div>
        </div>

        {/* Photo Input Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {!isUsingCamera && !capturedImage
                  ? "Choose Photo Input Method"
                  : isUsingCamera
                    ? "Take Your Photo"
                    : "Photo Preview"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {!isUsingCamera && !capturedImage ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={startCamera}>
                      <CardContent className="p-6 text-center">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                        <h3 className="font-semibold mb-2">Take Live Photo</h3>
                        <p className="text-sm text-gray-600">Use your camera to take a photo</p>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CardContent className="p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                        <h3 className="font-semibold mb-2">Upload Photo</h3>
                        <p className="text-sm text-gray-600">Choose from your device</p>
                        <p className="text-xs text-green-600 mt-2">Recommended if camera issues occur</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Camera Access Help</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Make sure you're using HTTPS (secure connection)</p>
                      <p>• Allow camera permissions when prompted</p>
                      <p>• Close other apps that might be using your camera</p>
                      <p>• Try refreshing the page if camera doesn't work</p>
                    </div>
                  </div>
                </div>
              ) : isUsingCamera && !capturedImage ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-h-96 object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 right-4">
                        <div className="bg-black/50 text-white px-3 py-2 rounded-lg text-sm text-center">
                          Position yourself in the frame and click capture
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Photo
                    </Button>
                    <Button onClick={stopCamera} variant="outline" size="lg" className="px-8">
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Camera not working?</p>
                    <Button
                      onClick={() => {
                        stopCamera()
                        setCapturedImage(null)
                      }}
                      variant="link"
                      className="text-purple-600 text-sm"
                    >
                      Try uploading a photo instead
                    </Button>
                  </div>
                </div>
              ) : capturedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={capturedImage || "/placeholder.svg"}
                        alt="Captured photo"
                        width={600}
                        height={400}
                        className="w-full h-auto max-h-96 object-cover mx-auto"
                      />
                    </div>

                    <div className="absolute top-4 left-4 right-4">
                      <div className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm text-center">
                        ✓ Photo captured successfully! Ready for AI analysis.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button
                      onClick={() => {
                        analyzePhoto(capturedImage)
                      }}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze My Style
                    </Button>

                    <Button
                      onClick={() => {
                        setCapturedImage(null)
                        startCamera()
                      }}
                      variant="outline"
                      size="lg"
                      className="px-6"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retake
                    </Button>

                    <Button
                      onClick={() => {
                        setCapturedImage(null)
                        setShowPhotoDialog(false)
                      }}
                      variant="outline"
                      size="lg"
                      className="px-6"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-600">
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
