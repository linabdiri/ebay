import mongoose from 'mongoose';

const aiRulesSchema = new mongoose.Schema({
  tone:             { type: String, default: 'sales' },
  pricing:          { type: String, default: 'negotiable' },
  mandatoryNotes:   { type: String, default: 'Versand möglich, Abholung nach Absprache' },
  forbiddenTerms:   { type: String, default: 'Garantieversprechen, Neuware wenn gebraucht' },
}, { timestamps: true });

export default mongoose.model('AiRules', aiRulesSchema);
