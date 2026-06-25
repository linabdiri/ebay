import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  plan:            { type: String, default: 'Starter' },
  status:          { type: String, enum: ['active', 'setup', 'test'], default: 'setup' },
  ebayConnected:   { type: Boolean, default: false },
  kleinConnected:  { type: Boolean, default: false },
  maxListings:     { type: Number, default: 100 },
  billing:         { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);
