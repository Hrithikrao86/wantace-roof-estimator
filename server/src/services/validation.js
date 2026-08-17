export function validateAnswers(config, answers = {}) {
  const errors = {};
  const activeQuestions = config.questions.filter((question) => question.active);

  for (const question of activeQuestions) {
    const value = answers[question.key];
    const missing = value === undefined || value === null || value === '';

    if (question.required && missing) {
      errors[question.key] = `${question.label} is required.`;
      continue;
    }
    if (missing) continue;

    if (question.type === 'number') {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        errors[question.key] = `${question.label} must be a valid number.`;
        continue;
      }
      if (question.min !== undefined && number < question.min) {
        errors[question.key] = `${question.label} must be at least ${question.min}.`;
      }
      if (question.max !== undefined && number > question.max) {
        errors[question.key] = `${question.label} must be at most ${question.max}.`;
      }
      continue;
    }

    if (question.type === 'select') {
      const valid = question.options.some((option) => option.value === value);
      if (!valid) errors[question.key] = `${question.label} has an invalid selection.`;
    }
  }

  return errors;
}

export function validateContact({ name, phone, email }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required.';
  if (!phone?.trim()) errors.phone = 'Phone is required.';
  if (!email?.trim()) errors.email = 'Email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
  return errors;
}
