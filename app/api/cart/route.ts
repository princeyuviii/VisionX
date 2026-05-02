import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CartItem from '@/models/Cart';
import Product from '@/models/Product';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const cart = await CartItem.find({ clerkId: userId }).populate('productId');
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity = 1 } = await req.json();
    await connectToDatabase();
    
    const cartItem = await CartItem.findOneAndUpdate(
      { clerkId: userId, productId },
      { $inc: { quantity } },
      { upsert: true, new: true }
    );

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    await connectToDatabase();
    
    await CartItem.findOneAndDelete({ clerkId: userId, productId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
