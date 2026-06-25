import Product from '../models/Product.js';
import SyncRule from '../models/SyncRule.js';
import Tenant from '../models/Tenant.js';

export async function getDashboard(req, res) {
  try {
    const [
      ebayActive,
      kleinActive,
      queue,
      soldToday,
      totalRules,
      totalTenants,
    ] = await Promise.all([
      Product.countDocuments({ ebayStatus: 'active' }),
      Product.countDocuments({ kleinStatus: 'online' }),
      Product.countDocuments({ transfer: 'open' }),
      Product.countDocuments({ ebayStatus: 'sold' }),
      SyncRule.countDocuments(),
      Tenant.countDocuments({ status: 'active' }),
    ]);

    const attentionItems = await Product.find({ kleinStatus: 'error' }).limit(5);

    res.json({
      metrics: { ebayActive, kleinActive, queue, soldToday, totalRules, totalTenants },
      attentionItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
