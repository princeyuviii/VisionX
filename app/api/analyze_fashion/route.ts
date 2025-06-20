import { type NextRequest, NextResponse } from "next/server"
import { analyzeFashion, checkMLServerHealth } from "@/lib/ml_model"

export async function POST(request: NextRequest) {
  try {
    console.log("API: Starting fashion analysis request")

    const body = await request.json()
    const { imageData } = body

    if (!imageData) {
      console.error("API: No image data provided")
      return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 })
    }

    console.log("API: Image data received, length:", imageData.length)

    // Check if ML server is available
    console.log("API: Checking ML server health...")
    const isMLServerHealthy = await checkMLServerHealth()
    console.log("API: ML server health:", isMLServerHealthy)

    if (!isMLServerHealthy) {
      console.warn("API: ML server is not available, proceeding with fallback analysis")
    }

    // Perform fashion analysis using your ML models
    console.log("API: Starting fashion analysis...")
    const analysisResult = await analyzeFashion(imageData)
    console.log("API: Analysis completed successfully")

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      mlServerStatus: isMLServerHealthy ? "online" : "offline",
      debug: {
        imageDataLength: imageData.length,
        mlServerUrl: process.env.NEXT_PUBLIC_ML_SERVER_URL,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("API: Fashion analysis error:", error)

    // Return detailed error information
    return NextResponse.json(
      {
        success: false,
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        mlServerUrl: process.env.NEXT_PUBLIC_ML_SERVER_URL,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const isMLServerHealthy = await checkMLServerHealth()

    return NextResponse.json({
      status: "ok",
      mlServer: isMLServerHealthy ? "online" : "offline",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ status: "error", error: "Health check failed" }, { status: 500 })
  }
}
