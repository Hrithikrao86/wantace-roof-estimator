import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
  rate_per_sqft: Number,
  multiplier: Number,
  tear_off_per_sqft: Number
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, enum: ['number', 'select'], required: true },
  unit: String,
  required: { type: Boolean, default: true },
  min: Number,
  max: Number,
  active: { type: Boolean, default: true },
  options: { type: [OptionSchema], default: [] }
}, { _id: false });

const ConfigSchema = new mongoose.Schema({
  config_version: { type: Number, required: true, unique: true },
  active: { type: Boolean, default: false, index: true },
  business: {
    name: { type: String, required: true },
    region: { type: String, required: true },
    currency: { type: String, required: true }
  },
  questions: { type: [QuestionSchema], default: [] },
  modifiers: {
    waste_factor: { type: Number, default: 0.10 },
    permit_flat_fee: { type: Number, default: 350 },
    range_spread_pct: { type: Number, default: 12 }
  }
}, { timestamps: true });

export const Config = mongoose.model('Config', ConfigSchema);
