import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  clerkId: string;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
}

const CartItemSchema: Schema = new Schema({
  clerkId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user can't have duplicate products in cart - instead increment quantity
CartItemSchema.index({ clerkId: 1, productId: 1 }, { unique: true });

export default mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);
