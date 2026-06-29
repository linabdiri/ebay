import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import SyncRule from './models/SyncRule.js';
import Tenant from './models/Tenant.js';

dotenv.config();

const products = [
  { title: 'Apple Watch Series 8 45mm GPS', ebayStatus: 'active', kleinStatus: 'online', transfer: 'done', price: '299,00 €', stock: 1, category: 'Elektronik > Smartwatches', lastCheck: 'vor 4 Min.' },
  { title: 'Sony WH-1000XM5 Kopfhörer', ebayStatus: 'active', kleinStatus: 'draft', transfer: 'open', price: '249,00 €', stock: 2, category: 'Elektronik > Kopfhörer', lastCheck: 'vor 7 Min.' },
  { title: 'Nintendo Switch OLED', ebayStatus: 'sold', kleinStatus: 'disabled', transfer: 'done', price: '279,00 €', stock: 0, category: 'Elektronik > Spielekonsolen', lastCheck: 'vor 2 Min.' },
  { title: 'Bosch Akkuschrauber Set', ebayStatus: 'active', kleinStatus: 'error', transfer: 'open', price: '89,00 €', stock: 1, category: 'Haushalt > Werkzeug', lastCheck: 'vor 15 Min.' },
  { title: 'Apple iPhone 13 Pro 256 GB', ebayStatus: 'active', kleinStatus: 'draft', transfer: 'open', price: '649,00 €', stock: 1, category: 'Elektronik > Handys', lastCheck: 'vor 20 Min.' },
  { title: 'Dyson V11 Absolute', ebayStatus: 'active', kleinStatus: 'error', transfer: 'open', price: '349,00 €', stock: 1, category: 'Haushalt > Staubsauger', lastCheck: 'vor 32 Min.' },
  { title: 'Samsung Galaxy Tab S8', ebayStatus: 'active', kleinStatus: 'online', transfer: 'done', price: '499,00 €', stock: 3, category: 'Elektronik > Tablets', lastCheck: 'vor 1 Std.' },
  { title: "Levi's 501 Jeans W32 L32", ebayStatus: 'active', kleinStatus: 'draft', transfer: 'open', price: '45,00 €', stock: 1, category: 'Mode > Hosen', lastCheck: 'vor 2 Std.' },
];

const syncRules = [
  { event: 'eventEbaySold',     action: 'actDisableKlein', priority: 'high',   status: 'active' },
  { event: 'eventKleinSold',    action: 'actEndEbay',      priority: 'high',   status: 'active' },
  { event: 'eventPriceChanged', action: 'actUpdatePrice',  priority: 'medium', status: 'active' },
  { event: 'eventNewEbay',      action: 'actCreateDraft',  priority: 'medium', status: 'active' },
];

const tenants = [
  { name: 'Muster-Shop GmbH',   plan: 'Professional', status: 'active', ebayConnected: true,  kleinConnected: true,  maxListings: 500, billing: 'monthly' },
  { name: 'Technikhandel Nord', plan: 'Starter',       status: 'setup',  ebayConnected: true,  kleinConnected: false, maxListings: 100, billing: 'monthly' },
  { name: 'Demo Mandant',       plan: 'Demo',          status: 'test',   ebayConnected: false, kleinConnected: false, maxListings: 10,  billing: 'yearly'  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // On vérifie 
    const productCount = await Product.countDocuments();
    const ruleCount     = await SyncRule.countDocuments();
    const tenantCount   = await Tenant.countDocuments();

    if (productCount > 0 || ruleCount > 0 || tenantCount > 0) {
      console.log('⚠️  La base contient déjà des données — seed annulé pour ne pas écraser tes changements.');
      console.log(`   - ${productCount} produits, ${ruleCount} règles, ${tenantCount} mandants déjà présents.`);
      process.exit(0);
    }

    // on insère 
    await Product.insertMany(products);
    await SyncRule.insertMany(syncRules);
    await Tenant.insertMany(tenants);

    console.log('✅ Base de données initialisée avec succès');
    console.log(`   - ${products.length} produits`);
    console.log(`   - ${syncRules.length} règles de synchro`);
    console.log(`   - ${tenants.length} mandants`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed:', err.message);
    process.exit(1);
  }
}

seed();
