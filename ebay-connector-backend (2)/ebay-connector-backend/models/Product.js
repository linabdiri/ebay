import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  ebayStatus:   { type: String, enum: ['active', 'sold', 'disabled'], default: 'active' },
  kleinStatus:  { type: String, enum: ['online', 'draft', 'disabled', 'error'], default: 'draft' },
  transfer:     { type: String, enum: ['done', 'open'], default: 'open' },
  price:        { type: String },
  stock:        { type: Number, default: 1 },
  category:     { type: String },
  lastCheck:    { type: String },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
