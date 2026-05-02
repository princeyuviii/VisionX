import { type NextRequest, NextResponse } from "next/server"
import { analyzeFashion, checkMLServerHealth } from "@/lib/ml_model"
import { auth } from "@clerk/nextjs"
import connectToDatabase from "@/lib/mongodb"
import Analysis from "@/models/Analysis"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    console.log("API: Starting fashion analysis request for user:", userId)

    const body = await request.json()
    const { imageData } = body

    if (!imageData) {
      return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 })
    }

    const isMLServerHealthy = await checkMLServerHealth()
    const analysisResult = await analyzeFashion(imageData)

    // Save to database if user is logged in
    if (userId) {
      try {
        await connectToDatabase();
        await Analysis.create({
          clerkId: userId,
          image: imageData.substring(0, 5000), // Storing a preview or URL would be better, but saving a snippet for now
          results: {
            skinTone: analysisResult.skinTone,
            bodyType: analysisResult.bodyType,
            faceShape: analysisResult.faceShape,
            recommendations: analysisResult.recommendations
          }
        });
        console.log("API: Analysis saved to database");
      } catch (dbError) {
        console.error("API: Database save failed:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      mlServerStatus: isMLServerHealthy ? "online" : "offline",
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
