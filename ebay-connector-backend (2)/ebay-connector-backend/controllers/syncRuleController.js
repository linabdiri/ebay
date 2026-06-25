import SyncRule from '../models/SyncRule.js';

export async function getRules(req, res) {
  try {
    const rules = await SyncRule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createRule(req, res) {
  try {
    const rule = await SyncRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteRule(req, res) {
  try {
    await SyncRule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
