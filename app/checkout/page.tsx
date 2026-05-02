'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, ArrowLeft, CreditCard, 
  ShieldCheck, Truck, ChevronRight, CheckCircle2,
  Package, Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, cartCount, fetchCart } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseInt(item.productId?.price.replace(/[^0-9]/g, '') || '0');
    return acc + (price * (item.quantity || 1));
  }, 0);

  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
          })),
          totalAmount: total
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setPlacedOrder(data);
        await fetchCart(); // Refresh cart count in navbar
        setOrderComplete(true);
      }
    } catch (err) {
      console.error("Order placement failed:", err);
    } finally {
      setIsOrdering(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/30">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Order_Synthesized</h1>
            <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase italic">
              Your fashion protocol has been successfully initiated. <br /> 
              Tracking ID: {placedOrder?.trackingId || `VX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
            </p>
          </div>
          <Link href="/">
            <Button className="w-full bg-primary text-black hover:bg-white transition-all font-black py-8 rounded-none uppercase tracking-[0.4em] text-xs mt-8">
              Return_To_Studio
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-16 px-4">
      <div className="absolute inset-0 cyber-grid opacity-10 -z-10" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">Checkout_Portal</h1>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <Package className="h-3 w-3" />
                <span>Items in queue: {cartCount}</span>
              </div>
            </div>
            <Link href="/recommend">
              <Button variant="ghost" className="text-zinc-500 hover:text-primary hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" /> CONTINUE_EXPLORING
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="bg-black/40 border-white/5 rounded-none group hover:border-primary/20 transition-all overflow-hidden">
                      <CardContent className="p-6 flex items-center space-x-6">
                        <div className="w-24 h-24 bg-zinc-900 overflow-hidden relative border border-white/10">
                          <Image 
                            src={item.productId?.image || "/placeholder.svg"} 
                            alt={item.productId?.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-black tracking-widest uppercase text-sm">{item.productId?.name}</h3>
                              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">{item.productId?.brand}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.productId?._id)}
                              className="text-zinc-700 hover:text-red-500 transition-colors p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between pt-4">
                            <Badge variant="outline" className="border-white/10 text-primary text-[8px] font-mono tracking-widest uppercase">
                              QTY: {item.quantity || 1}
                            </Badge>
                            <span className="font-black text-primary text-sm tracking-tighter italic">{item.productId?.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 text-center space-y-6">
                  <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-8 w-8 text-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black uppercase tracking-widest text-zinc-500">Cart_Empty</h3>
                    <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest italic">No items identified in selection queue.</p>
                  </div>
                  <Link href="/recommend">
                    <Button className="bg-primary text-black hover:bg-white transition-all font-black rounded-none px-12 py-6 text-xs uppercase tracking-[0.4em]">
                      Browse_Archive
                    </Button>
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-8">
          <Card className="bg-zinc-950 border-white/10 rounded-none shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <CardContent className="p-10 space-y-8">
              <h2 className="text-xl font-black tracking-tighter uppercase italic border-b border-white/10 pb-4">Protocol_Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                  <span>Neural_Tax (18%)</span>
                  <span className="text-white">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-zinc-500">
                  <span>Expedited_Transit</span>
                  <span className="text-white">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-primary">Total_Cost</span>
                  <span className="text-3xl font-black tracking-tighter text-glow-premium italic text-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="flex items-center space-x-3 p-4 bg-white/[0.03] border border-white/5">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">Payment_Gateway</p>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest italic italic">VisionX Pay // Secure Protocol</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-800" />
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white/[0.03] border border-white/5">
                  <Truck className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">Transit_Mode</p>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest italic">Global Hyper-Delivery</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-800" />
                </div>
              </div>

              <Button 
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || isOrdering}
                className="w-full bg-primary text-black hover:bg-white transition-all font-black py-10 rounded-none uppercase tracking-[0.5em] text-xs shadow-[0_0_40px_rgba(251,191,36,0.15)] group relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isOrdering ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-3"
                    >
                      <Zap className="h-4 w-4 animate-pulse" />
                      <span>Synthesizing...</span>
                    </motion.div>
                  ) : (
                    <motion.span 
                      key="label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Commit_Order
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <div className="flex items-center justify-center space-x-2 text-[8px] font-mono text-zinc-700 tracking-widest uppercase">
                <ShieldCheck className="h-3 w-3" />
                <span>Secure 256-bit AES Encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
