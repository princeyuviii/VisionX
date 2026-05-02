import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import CartItem from '@/models/Cart';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const orders = await Order.find({ clerkId: userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items, totalAmount } = await req.json();
    await connectToDatabase();
    
    const trackingId = `VX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const order = await Order.create({
      clerkId: userId,
      items,
      totalAmount,
      trackingId
    });

    // Clear cart after order
    await CartItem.deleteMany({ clerkId: userId });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
