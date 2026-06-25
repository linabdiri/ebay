import mongoose from 'mongoose';

const syncRuleSchema = new mongoose.Schema({
  event:    { type: String, required: true },
  action:   { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status:   { type: String, enum: ['active', 'disabled'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('SyncRule', syncRuleSchema);
