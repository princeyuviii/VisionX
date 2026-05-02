import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: { type: String } // Snapshot of price at time of order
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Synthesized', enum: ['Synthesized', 'Transiting', 'Deployed'] },
  trackingId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
