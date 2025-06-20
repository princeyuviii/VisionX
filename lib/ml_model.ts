// This file would contain the actual ML model integrations
// For demonstration, we're showing the structure

export interface FashionAnalysisResult {
  skinTone: string
  bodyType: string
  faceShape: string
  measurements: any
  colorPalette: string[]
  stylePreference: string
  recommendations: StyleRecommendation[]
  mlServerStatus?: string
  errors?: any
}

export interface StyleRecommendation {
  id: number
  style: string
  match: number
  description: string
  matchDetails?: string
  skinTone: string
  bodyType: string
  items: RecommendationItem[]
  colors: string[]
  gradient: string
}

export interface RecommendationItem {
  name: string
  price: string
  image: string
  confidence: number
  category: string
}

// Configuration for your ML server
const ML_SERVER_URL = process.env.NEXT_PUBLIC_ML_SERVER_URL

// Convert base64 image to File object for API
function base64ToFile(base64String: string, filename = "image.jpg"): File {
  try {
    // Handle both data URLs and plain base64
    const base64Data = base64String.includes(",") ? base64String.split(",")[1] : base64String
    const mimeMatch = base64String.match(/data:([^;]+);/)
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg"

    const bstr = atob(base64Data)
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  } catch (error) {
    console.error("Error converting base64 to file:", error)
    throw new Error("Invalid image format")
  }
}

// Face Shape Analysis using your ML model
export class FaceAnalysisModel {
  static async analyzeFace(imageData: string): Promise<any> {
    try {
      console.log("Starting face analysis...")
      const file = base64ToFile(imageData)
      console.log("File created:", file.name, file.size, file.type)

      const formData = new FormData()
      formData.append("file", file)

      console.log("Calling ML server at:", `${ML_SERVER_URL}/predict/face-shape`)
      const response = await fetch(`${ML_SERVER_URL}/predict/face-shape`, {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Face analysis API error:", errorText)
        throw new Error(`Face analysis failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log("Face analysis result:", result)

      return {
        faceShape: result.face_shape || "oval",
        confidence: 0.9,
      }
    } catch (error) {
      console.error("Face analysis error:", error)
      // Return fallback data instead of throwing
      return {
        faceShape: "oval",
        confidence: 0.8,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Body Type Analysis using your pose measurement model
export class BodyAnalysisModel {
  static async analyzeBody(imageData: string): Promise<any> {
    try {
      console.log("Starting body analysis...")
      const file = base64ToFile(imageData)
      const formData = new FormData()
      formData.append("file", file)

      console.log("Calling ML server at:", `${ML_SERVER_URL}/predict/pose-measurement`)
      const response = await fetch(`${ML_SERVER_URL}/predict/pose-measurement`, {
        method: "POST",
        body: formData,
      })

      console.log("Body analysis response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Body analysis API error:", errorText)
        throw new Error(`Body analysis failed: ${response.status} ${response.statusText}`)
      }

      const measurements = await response.json()
      console.log("Body analysis result:", measurements)

      const bodyType = this.determineBodyType(measurements)

      return {
        bodyType,
        measurements,
        proportions: "balanced",
      }
    } catch (error) {
      console.error("Body analysis error:", error)
      return {
        bodyType: "athletic",
        measurements: {},
        proportions: "balanced",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private static determineBodyType(measurements: any): string {
    // Logic to determine body type from pose measurements
    // You can customize this based on your measurement data structure
    if (!measurements || Object.keys(measurements).length === 0) {
      return "athletic"
    }

    // Example logic - adjust based on your actual measurement structure
    const { shoulder_width, waist_width, hip_width } = measurements

    if (shoulder_width && waist_width && hip_width) {
      const shoulderToWaist = shoulder_width / waist_width
      const hipToWaist = hip_width / waist_width

      if (shoulderToWaist > 1.2 && hipToWaist < 1.1) {
        return "athletic"
      } else if (hipToWaist > 1.2 && shoulderToWaist < 1.1) {
        return "pear"
      } else if (shoulderToWaist > 1.1 && hipToWaist > 1.1) {
        return "hourglass"
      } else {
        return "rectangle"
      }
    }

    return "athletic" // default
  }
}

// Skin Tone Analysis using your ML model
export class SkinToneAnalysisModel {
  static async analyzeSkinTone(imageData: string): Promise<any> {
    try {
      console.log("Starting skin tone analysis...")
      const file = base64ToFile(imageData)
      const formData = new FormData()
      formData.append("file", file)

      console.log("Calling ML server at:", `${ML_SERVER_URL}/predict/skin-tone`)
      const response = await fetch(`${ML_SERVER_URL}/predict/skin-tone`, {
        method: "POST",
        body: formData,
      })

      console.log("Skin tone analysis response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Skin tone analysis API error:", errorText)
        throw new Error(`Skin tone analysis failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Skin tone analysis result:", result)

      return {
        skinTone: result.skin_tone || "medium",
        undertones: this.getUndertones(result.skin_tone || "medium"),
        confidence: 0.9,
      }
    } catch (error) {
      console.error("Skin tone analysis error:", error)
      return {
        skinTone: "medium",
        undertones: "warm",
        confidence: 0.8,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private static getUndertones(skinTone: string): string {
    // Map skin tone to undertones - customize based on your model output
    const undertoneMap: { [key: string]: string } = {
      light: "cool",
      medium: "warm",
      dark: "warm",
      fair: "cool",
      olive: "neutral",
    }

    return undertoneMap[skinTone.toLowerCase()] || "neutral"
  }
}

// Color Analysis based on skin tone
export class ColorAnalysisModel {
  static async analyzeColors(skinTone: string, undertones: string): Promise<string[]> {
    // Color recommendations based on skin tone and undertones
    const colorPalettes: { [key: string]: { [key: string]: string[] } } = {
      light: {
        cool: ["navy", "royal blue", "emerald", "purple", "pink", "white", "silver"],
        warm: ["coral", "peach", "gold", "cream", "camel", "warm brown", "orange"],
        neutral: ["teal", "jade", "soft pink", "lavender", "gray", "black", "white"],
      },
      medium: {
        cool: ["jewel tones", "sapphire", "ruby", "black", "white", "silver", "cool gray"],
        warm: ["earth tones", "rust", "golden yellow", "warm red", "bronze", "olive", "cream"],
        neutral: ["burgundy", "forest green", "plum", "charcoal", "ivory", "taupe"],
      },
      dark: {
        cool: ["bright white", "electric blue", "hot pink", "emerald", "silver", "black"],
        warm: ["golden yellow", "orange", "warm red", "bronze", "gold", "cream", "brown"],
        neutral: ["jewel tones", "deep purple", "forest green", "navy", "gray", "white"],
      },
    }

    const palette = colorPalettes[skinTone]?.[undertones] || colorPalettes.medium.neutral
    return palette
  }
}

// Style Recommendation Engine
export class StyleRecommendationEngine {
  static async generateRecommendations(
    faceAnalysis: any,
    bodyAnalysis: any,
    skinToneAnalysis: any,
    colorPalette: string[],
  ): Promise<StyleRecommendation[]> {
    const { faceShape } = faceAnalysis
    const { bodyType, measurements } = bodyAnalysis
    const { skinTone, undertones } = skinToneAnalysis

    // Generate recommendations based on analysis
    const recommendations: StyleRecommendation[] = []

    // Style 1: Based on face shape and body type
    const primaryStyle = this.getPrimaryStyle(faceShape, bodyType)
    recommendations.push({
      id: 1,
      style: primaryStyle.name,
      match: primaryStyle.match,
      description: primaryStyle.description,
      skinTone: `${undertones} undertones detected`,
      bodyType: `${bodyType} build - ${primaryStyle.bodyAdvice}`,
      items: await this.getRecommendedItems(primaryStyle.categories, colorPalette),
      colors: colorPalette.slice(0, 4),
      gradient: primaryStyle.gradient,
    })

    // Style 2: Alternative style
    const secondaryStyle = this.getSecondaryStyle(faceShape, bodyType)
    recommendations.push({
      id: 2,
      style: secondaryStyle.name,
      match: secondaryStyle.match,
      description: secondaryStyle.description,
      skinTone: `${skinTone} skin tone with ${undertones} undertones`,
      bodyType: `${bodyType} proportions - ${secondaryStyle.bodyAdvice}`,
      items: await this.getRecommendedItems(secondaryStyle.categories, colorPalette),
      colors: colorPalette.slice(2, 6),
      gradient: secondaryStyle.gradient,
    })

    // Style 3: Trendy option
    const trendyStyle = this.getTrendyStyle(bodyType)
    recommendations.push({
      id: 3,
      style: trendyStyle.name,
      match: trendyStyle.match,
      description: trendyStyle.description,
      skinTone: `Colors that complement your ${skinTone} complexion`,
      bodyType: `${bodyType} silhouette recommendations`,
      items: await this.getRecommendedItems(trendyStyle.categories, colorPalette),
      colors: colorPalette.slice(1, 5),
      gradient: trendyStyle.gradient,
    })

    return recommendations
  }

  private static getPrimaryStyle(faceShape: string, bodyType: string) {
    // Primary style recommendations based on face shape and body type
    const styleMap: { [key: string]: any } = {
      oval: {
        name: "Classic Elegance",
        match: 94,
        description: "Your balanced oval face shape suits timeless, sophisticated styles",
        bodyAdvice: "structured pieces recommended",
        categories: ["blazers", "button-downs", "tailored-pants"],
        gradient: "from-blue-100 to-blue-200",
      },
      round: {
        name: "Angular Sophistication",
        match: 91,
        description: "Sharp, angular styles complement your soft facial features",
        bodyAdvice: "vertical lines and structured silhouettes",
        categories: ["v-necks", "blazers", "straight-leg-pants"],
        gradient: "from-purple-100 to-purple-200",
      },
      square: {
        name: "Soft Romantic",
        match: 89,
        description: "Curved and flowing styles soften your strong jawline",
        bodyAdvice: "rounded necklines and flowing fabrics",
        categories: ["curved-necklines", "flowing-tops", "soft-fabrics"],
        gradient: "from-pink-100 to-pink-200",
      },
      heart: {
        name: "Balanced Proportions",
        match: 92,
        description: "Styles that balance your broader forehead with your narrower chin",
        bodyAdvice: "wider bottoms and detailed lower halves",
        categories: ["wide-leg-pants", "detailed-bottoms", "simple-tops"],
        gradient: "from-green-100 to-green-200",
      },
      diamond: {
        name: "Cheekbone Enhancing",
        match: 90,
        description: "Styles that highlight your beautiful cheekbones",
        bodyAdvice: "open necklines and statement accessories",
        categories: ["open-necklines", "statement-jewelry", "fitted-tops"],
        gradient: "from-yellow-100 to-yellow-200",
      },
    }

    return styleMap[faceShape] || styleMap["oval"]
  }

  private static getSecondaryStyle(faceShape: string, bodyType: string) {
    // Secondary style options
    return {
      name: "Contemporary Minimalist",
      match: 88,
      description: "Clean, modern aesthetics that complement your natural features",
      bodyAdvice: "streamlined silhouettes recommended",
      categories: ["minimalist-tops", "clean-lines", "neutral-pieces"],
      gradient: "from-gray-100 to-gray-200",
    }
  }

  private static getTrendyStyle(bodyType: string) {
    // Trendy style options
    return {
      name: "Urban Chic",
      match: 82,
      description: "Modern street style with sophisticated touches",
      bodyAdvice: "relaxed fits with structured elements",
      categories: ["streetwear", "casual-chic", "modern-basics"],
      gradient: "from-orange-100 to-red-200",
    }
  }

  private static async getRecommendedItems(
    categories: string[],
    colorPalette: string[],
  ): Promise<RecommendationItem[]> {
    // Mock recommended items - in production, this would query your fashion database
    const itemDatabase: { [key: string]: RecommendationItem[] } = {
      blazers: [
        {
          name: "Tailored Blazer",
          price: "$249",
          image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
          confidence: 0.92,
          category: "Outerwear",
        },
      ],
      "button-downs": [
        {
          name: "Crisp White Shirt",
          price: "$89",
          image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
          confidence: 0.89,
          category: "Tops",
        },
      ],
      "tailored-pants": [
        {
          name: "Dark Wash Jeans",
          price: "$129",
          image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
          confidence: 0.87,
          category: "Bottoms",
        },
      ],
      // Add more categories as needed
    }

    const items: RecommendationItem[] = []
    for (const category of categories) {
      const categoryItems = itemDatabase[category] || []
      items.push(...categoryItems)
    }

    // If no specific items found, return default items
    if (items.length === 0) {
      return [
        {
          name: "Classic Blazer",
          price: "$199",
          image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
          confidence: 0.85,
          category: "Outerwear",
        },
        {
          name: "Essential Top",
          price: "$79",
          image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
          confidence: 0.82,
          category: "Tops",
        },
        {
          name: "Perfect Fit Bottoms",
          price: "$119",
          image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
          confidence: 0.8,
          category: "Bottoms",
        },
      ]
    }

    return items.slice(0, 3) // Return top 3 items
  }

  static async getFallbackRecommendations(): Promise<StyleRecommendation[]> {
    return [
      {
        id: 1,
        style: "Classic Versatile",
        match: 85,
        description: "Timeless pieces that work for most body types and occasions",
        skinTone: "Suitable for most skin tones",
        bodyType: "Flattering for various body types",
        items: [
          {
            name: "Classic Blazer",
            price: "$199",
            image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg",
            confidence: 0.85,
            category: "Outerwear",
          },
          {
            name: "White Button Shirt",
            price: "$79",
            image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg",
            confidence: 0.82,
            category: "Tops",
          },
          {
            name: "Dark Jeans",
            price: "$119",
            image: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg",
            confidence: 0.8,
            category: "Bottoms",
          },
        ],
        colors: ["Navy", "White", "Black", "Gray"],
        gradient: "from-blue-100 to-gray-200",
      },
    ]
  }
}

// Main Fashion Analysis Function
export async function analyzeFashion(imageData: string): Promise<FashionAnalysisResult> {
  try {
    console.log("Starting fashion analysis with ML models...")
    console.log("ML Server URL:", ML_SERVER_URL)
    console.log("Image data length:", imageData.length)

    // Check ML server health first
    const isHealthy = await checkMLServerHealth()
    console.log("ML server health check:", isHealthy)

    if (!isHealthy) {
      console.warn("ML server is not responding, using fallback analysis")
    }

    // Run all analyses in parallel for better performance
    const [faceAnalysis, bodyAnalysis, skinToneAnalysis] = await Promise.all([
      FaceAnalysisModel.analyzeFace(imageData),
      BodyAnalysisModel.analyzeBody(imageData),
      SkinToneAnalysisModel.analyzeSkinTone(imageData),
    ])

    console.log("ML Analysis Results:", { faceAnalysis, bodyAnalysis, skinToneAnalysis })

    // Generate color palette based on skin tone
    const colorPalette = await ColorAnalysisModel.analyzeColors(skinToneAnalysis.skinTone, skinToneAnalysis.undertones)

    // Generate recommendations based on all analyses
    const recommendations = await StyleRecommendationEngine.generateRecommendations(
      faceAnalysis,
      bodyAnalysis,
      skinToneAnalysis,
      colorPalette,
    )

    return {
      skinTone: skinToneAnalysis.skinTone,
      bodyType: bodyAnalysis.bodyType,
      faceShape: faceAnalysis.faceShape,
      measurements: bodyAnalysis.measurements,
      colorPalette,
      stylePreference: "personalized",
      recommendations,
      mlServerStatus: isHealthy ? "online" : "offline",
      errors: {
        faceAnalysis: faceAnalysis.error,
        bodyAnalysis: bodyAnalysis.error,
        skinToneAnalysis: skinToneAnalysis.error,
      },
    }
  } catch (error) {
    console.error("Fashion analysis failed:", error)

    // Return fallback analysis instead of throwing
    return {
      skinTone: "medium",
      bodyType: "athletic",
      faceShape: "oval",
      measurements: {},
      colorPalette: ["navy", "white", "charcoal", "camel"],
      stylePreference: "classic",
      recommendations: await StyleRecommendationEngine.getFallbackRecommendations(),
      mlServerStatus: "offline",
      errors: {
        general: error instanceof Error ? error.message : "Analysis failed",
      },
    }
  }
}

// Health check for ML server
export async function checkMLServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ML_SERVER_URL}/`)
    return response.ok
  } catch (error) {
    console.error("ML server health check failed:", error)
    return false
  }
}
