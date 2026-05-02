import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  image: string;
  type: string;
  price: string;
  originalPrice?: string;
  trending: boolean;
  tags: string[];
  colors: string[];
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  likes: number;
  category: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: String, required: true },
  originalPrice: { type: String },
  trending: { type: Boolean, default: false },
  tags: [{ type: String }],
  colors: [{ type: String }],
  brand: { type: String, default: "VisionX Elite" },
  description: { type: String },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
