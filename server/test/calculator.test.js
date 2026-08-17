import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEstimate } from '../src/services/calculator.js';

const config = {
  questions: [
    { key: 'roof_area', options: [] },
    { key: 'material', options: [{ value: 'material', rate_per_sqft: 10 }] },
    { key: 'pitch', options: [{ value: 'pitch', multiplier: 1.2 }] },
    { key: 'layers', options: [{ value: 'layers', tear_off_per_sqft: 2 }] },
    { key: 'stories', options: [{ value: 'stories', multiplier: 1.1 }] }
  ],
  modifiers: { waste_factor: 0.1, permit_flat_fee: 350, range_spread_pct: 12 }
};

test('calculator returns the deterministic low/high range', () => {
  const result = calculateEstimate(config, {
    roof_area: 1000,
    material: 'material',
    pitch: 'pitch',
    layers: 'layers',
    stories: 'stories'
  });

  // material 11,000 + tear-off 2,000 = 13,000; *1.2*1.1 = 17,160; +350 = 17,510
  assert.deepEqual(result, { estimate_low: 15409, estimate_high: 19611 });
});
