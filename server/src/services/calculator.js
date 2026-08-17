export function calculateEstimate(config, answers) {
  const getQuestion = (key) => config.questions.find((question) => question.key === key);
  const getSelectedOption = (key) => {
    const question = getQuestion(key);
    if (!question) return null;
    return question.options.find((option) => option.value === answers[key]) ?? null;
  };

  const roofArea = Number(answers.roof_area);
  const material = getSelectedOption('material');
  const pitch = getSelectedOption('pitch');
  const layers = getSelectedOption('layers');
  const stories = getSelectedOption('stories');

  if (!Number.isFinite(roofArea) || !material || !pitch || !layers || !stories) {
    throw new Error('Required estimating answers are incomplete or invalid');
  }

  const ratePerSqft = Number(material.rate_per_sqft);
  const pitchMultiplier = Number(pitch.multiplier);
  const tearOffPerSqft = Number(layers.tear_off_per_sqft);
  const storiesMultiplier = Number(stories.multiplier);
  const wasteFactor = Number(config.modifiers.waste_factor);
  const permitFee = Number(config.modifiers.permit_flat_fee);
  const spread = Number(config.modifiers.range_spread_pct) / 100;

  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const adjustedSubtotal = (baseMaterialCost + tearOffCost) * pitchMultiplier * storiesMultiplier;
  const midpoint = adjustedSubtotal + permitFee;

  return {
    estimate_low: Math.round(midpoint * (1 - spread)),
    estimate_high: Math.round(midpoint * (1 + spread))
  };
}
