import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ clerkId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
