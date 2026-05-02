import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Analysis from '@/models/Analysis';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const analysis = await Analysis.findOne({ clerkId: userId }).sort({ createdAt: -1 });
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();
    
    // Update or create new analysis for this user
    const analysis = await Analysis.findOneAndUpdate(
      { clerkId: userId },
      { 
        ...body, 
        clerkId: userId,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
  }
}
