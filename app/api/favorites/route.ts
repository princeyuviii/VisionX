import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import Product from '@/models/Product';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const favorites = await Favorite.find({ clerkId: userId }).populate('productId');
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    await connectToDatabase();
    
    // Toggle logic: If exists, remove. If not, add.
    const existing = await Favorite.findOne({ clerkId: userId, productId });
    
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return NextResponse.json({ status: 'removed' });
    } else {
      const favorite = await Favorite.create({ clerkId: userId, productId });
      return NextResponse.json({ status: 'added', favorite });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}
