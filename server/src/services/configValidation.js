export function validateConfigPayload({ business, questions, modifiers }) {
  const errors = [];
  if (!business?.name || !business?.region || !business?.currency) errors.push('Business name, region, and currency are required.');
  if (!Array.isArray(questions) || questions.length === 0) errors.push('At least one question is required.');
  if (!modifiers || !Number.isFinite(Number(modifiers.waste_factor)) || !Number.isFinite(Number(modifiers.permit_flat_fee)) || !Number.isFinite(Number(modifiers.range_spread_pct))) {
    errors.push('Waste factor, permit fee, and range spread must be valid numbers.');
  }
  if (Number(modifiers?.waste_factor) < 0 || Number(modifiers?.permit_flat_fee) < 0 || Number(modifiers?.range_spread_pct) < 0 || Number(modifiers?.range_spread_pct) >= 100) {
    errors.push('Global modifiers contain an invalid negative value or spread.');
  }

  const keys = new Set();
  for (const question of questions || []) {
    if (!question.key || keys.has(question.key)) errors.push(`Question key must be unique: ${question.key || '(missing)'}`);
    keys.add(question.key);
    if (!question.label || !['number', 'select'].includes(question.type)) errors.push(`Question ${question.key || '(missing)'} is missing a valid label or type.`);
    if (question.type === 'number') {
      if (!Number.isFinite(Number(question.min)) || !Number.isFinite(Number(question.max)) || Number(question.min) > Number(question.max)) {
        errors.push(`Question ${question.key} has invalid min/max bounds.`);
      }
    }
    if (question.type === 'select') {
      if (!Array.isArray(question.options) || question.options.length === 0) errors.push(`Question ${question.key} must have options.`);
      const optionKeys = new Set();
      for (const option of question.options || []) {
        if (!option.value || !option.label || optionKeys.has(option.value)) errors.push(`Question ${question.key} has an invalid or duplicate option.`);
        optionKeys.add(option.value);
      }
    }
  }
  return errors;
}
