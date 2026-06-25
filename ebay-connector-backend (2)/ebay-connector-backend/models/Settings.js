import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  ebayClientId:     { type: String, default: 'ebay-client-id-xxxx-xxxx' },
  ebayClientSecret: { type: String, default: '' },
  kleinToken:       { type: String, default: 'klein-api-token-xxxx' },
  importInterval:   { type: String, default: 'every15' },
  newListingAction: { type: String, default: 'drafts' },
  autoDisableOnSold:{ type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
