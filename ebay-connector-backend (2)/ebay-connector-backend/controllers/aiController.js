import { GoogleGenerativeAI } from '@google/generative-ai';
import AiRules from '../models/AiRules.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const toneLabels = {
  sales:  'professional and sales-oriented',
  casual: 'casual and informal, as if sold by a private person',
  short:  'short and factual, no fluff',
};

const pricingLabels = {
  fixed:       'state the price as a fixed price',
  negotiable:  'add "negotiable" (VB) after the price',
  round:       'round the price down slightly and mention it is negotiable',
};

export async function generateDescription(req, res) {
  try {
    const { originalText, price } = req.body;

    let rules = await AiRules.findOne();
    if (!rules) rules = await AiRules.create({});

    const tone     = toneLabels[rules.tone] || toneLabels.sales;
    const pricing  = pricingLabels[rules.pricing] || pricingLabels.negotiable;

    const prompt = `You are writing a product listing description for Kleinanzeigen (a German classifieds platform), based on an original eBay listing description.

Original eBay description:
"${originalText || 'Apple Watch Series 8, 45 mm, GPS, very good condition, including charging cable and original packaging. Fully functional.'}"

Price: ${price || '299 €'}

Instructions:
- Write the description in German.
- Tone: ${tone}.
- Pricing note: ${pricing}.
- You must include this mandatory note somewhere in the text: "${rules.mandatoryNotes}"
- Never use these forbidden terms or concepts: "${rules.forbiddenTerms}"
- Keep it concise: 3-5 sentences maximum.
- Do not include a title, just the description body.
- Do not use markdown formatting.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    res.json({ description: text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
}

export async function getAiRules(req, res) {
  try {
    let rules = await AiRules.findOne();
    if (!rules) rules = await AiRules.create({});
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function saveAiRules(req, res) {
  try {
    let rules = await AiRules.findOne();
    if (!rules) {
      rules = await AiRules.create(req.body);
    } else {
      Object.assign(rules, req.body);
      await rules.save();
    }
    res.json(rules);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
