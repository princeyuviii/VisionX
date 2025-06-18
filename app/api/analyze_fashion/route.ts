import { type NextRequest, NextResponse } from "next/server"
import { analyzeFashion, checkMLServerHealth } from "@/lib/ml_model"

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 })
    }

    // Check if ML server is available
    const isMLServerHealthy = await checkMLServerHealth()
    if (!isMLServerHealthy) {
      console.warn("ML server is not available, using fallback analysis")
    }

    // Perform fashion analysis using your ML models
    const analysisResult = await analyzeFashion(imageData)

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      mlServerStatus: isMLServerHealthy ? "online" : "offline",
    })
  } catch (error) {
    console.error("Fashion analysis error:", error)

    // Return error with helpful message
    return NextResponse.json(
      {
        success: false,
        error: "Analysis failed. Please check if the ML server is running.",
        details: error instanceof Error ? error.message : "Unknown error",
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
