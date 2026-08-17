import { Lead } from '../models/Lead.js';
import { getConfigByVersion } from './configController.js';
import { calculateEstimate } from '../services/calculator.js';
import { validateAnswers, validateContact } from '../services/validation.js';

export async function createEstimate(req, res) {
  const { config_version, name, phone, email, answers } = req.body ?? {};
  if (!Number.isInteger(Number(config_version))) {
    return res.status(400).json({ error: 'A valid configuration version is required.' });
  }

  const config = await getConfigByVersion(Number(config_version));
  if (!config) return res.status(409).json({ error: 'That estimator version is no longer available. Please restart the estimate.' });

  const contactErrors = validateContact({ name, phone, email });
  const answerErrors = validateAnswers(config, answers);
  if (Object.keys(contactErrors).length || Object.keys(answerErrors).length) {
    return res.status(422).json({ error: 'Please correct the highlighted fields.', fields: { ...contactErrors, ...answerErrors } });
  }

  try {
    const estimate = calculateEstimate(config, answers);
    const lead = await Lead.create({
      _id: `ld_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      config_version: config.config_version,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      answers,
      ...estimate
    });

    return res.status(201).json({
      lead_id: lead._id,
      config_version: config.config_version,
      ...estimate
    });
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
}
