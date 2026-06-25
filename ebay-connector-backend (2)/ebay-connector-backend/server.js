import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes       from './routes/auth.js';
import productRoutes    from './routes/products.js';
import syncRuleRoutes   from './routes/syncRules.js';
import tenantRoutes     from './routes/tenants.js';
import dashboardRoutes  from './routes/dashboard.js';
import settingsRoutes   from './routes/settings.js';
import aiRoutes          from './routes/ai.js';
import { protect } from './middleware/auth.js';

dotenv.config();

console.log('Email:', process.env.ADMIN_EMAIL);
console.log('Hash:', process.env.ADMIN_PASSWORD_HASH);
console.log('Secret:', process.env.JWT_SECRET);

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/products',   protect, productRoutes);
app.use('/api/sync-rules', protect, syncRuleRoutes);
app.use('/api/tenants',    protect, tenantRoutes);
app.use('/api/dashboard',  protect, dashboardRoutes);
app.use('/api/settings',   protect, settingsRoutes);
app.use('/api/ai',         protect, aiRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });