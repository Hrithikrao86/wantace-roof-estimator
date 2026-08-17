import { Lead } from '../models/Lead.js';

export async function getLeads(_req, res) {
  const leads = await Lead.find().sort({ captured_at: -1 }).lean();
  return res.json(leads);
}
