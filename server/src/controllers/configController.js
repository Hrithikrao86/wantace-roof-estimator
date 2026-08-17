import { Config } from '../models/Config.js';
import { validateConfigPayload } from '../services/configValidation.js';

function publicConfig(config) {
  return {
    config_version: config.config_version,
    business: config.business,
    questions: config.questions.filter((question) => question.active),
    modifiers: undefined
  };
}

export async function getPublicConfig(_req, res) {
  const config = await Config.findOne({ active: true }).lean();
  if (!config) return res.status(503).json({ error: 'Estimator configuration is not available.' });
  return res.json(publicConfig(config));
}

export async function getAdminConfig(_req, res) {
  const config = await Config.findOne({ active: true }).lean();
  if (!config) return res.status(503).json({ error: 'Estimator configuration is not available.' });
  return res.json(config);
}

export async function updateConfig(req, res) {
  const current = await Config.findOne({ active: true }).lean();
  if (!current) return res.status(503).json({ error: 'Active configuration is missing.' });

  const { business, questions, modifiers } = req.body ?? {};
  const validationErrors = validateConfigPayload({ business, questions, modifiers });
  if (validationErrors.length) {
    return res.status(422).json({ error: 'Configuration is invalid.', fields: validationErrors });
  }

  const nextVersion = current.config_version + 1;
  // Publish the new version first so there is never a period with no active configuration.
  // The tiny overlap is harmless because the public query returns one active version and
  // the next request receives the newly published configuration.
  const created = await Config.create({
    config_version: nextVersion,
    active: true,
    business,
    questions,
    modifiers
  });
  await Config.updateMany(
    { _id: { $ne: created._id }, active: true },
    { $set: { active: false } }
  );
  return res.json(created);
}

export async function getConfigByVersion(version) {
  return Config.findOne({ config_version: version }).lean();
}
