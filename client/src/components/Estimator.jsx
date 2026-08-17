import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import Progress from './Progress';
import QuestionField from './QuestionField';

const CONTACT_STEP_KEY = '__contact__';

export default function Estimator() {
  const [config, setConfig] = useState(null);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api.getConfig()
      .then(setConfig)
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const steps = useMemo(() => [...(config?.questions || []), { key: CONTACT_STEP_KEY }], [config]);
  const currentQuestion = steps[step];

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  }

  function validateCurrentStep() {
    if (currentQuestion.key === CONTACT_STEP_KEY) {
      const nextErrors = {};
      if (!contact.name.trim()) nextErrors.name = 'Name is required.';
      if (!contact.phone.trim()) nextErrors.phone = 'Phone is required.';
      if (!/^\S+@\S+\.\S+$/.test(contact.email.trim())) nextErrors.email = 'Enter a valid email address.';
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    const value = answers[currentQuestion.key];
    if (currentQuestion.required && (value === undefined || value === '')) {
      setErrors({ [currentQuestion.key]: 'Please answer this question.' });
      return false;
    }
    if (currentQuestion.type === 'number' && value !== undefined && value !== '') {
      if (value < currentQuestion.min || value > currentQuestion.max) {
        setErrors({ [currentQuestion.key]: `Enter a value between ${currentQuestion.min} and ${currentQuestion.max}.` });
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateCurrentStep()) return;
    setErrors({});
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previous() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit(event) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    try {
      const result = await api.createEstimate({
        config_version: config.config_version,
        ...contact,
        answers
      });
      setEstimate(result);
    } catch (error) {
      setErrors(error.fields || { form: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="state-card"><div className="spinner" />Loading estimator…</div>;
  if (loadError) return <div className="state-card error-card"><h2>Estimator unavailable</h2><p>{loadError}</p></div>;
  if (estimate) return <EstimateResult config={config} estimate={estimate} />;

  const isContact = currentQuestion?.key === CONTACT_STEP_KEY;
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: config.business.currency, maximumFractionDigits: 0 });

  return (
    <section className="estimator-shell">
      <div className="estimator-card">
        <div className="eyebrow">Instant roof estimate</div>
        <h1>Get a realistic roofing range in minutes.</h1>
        <p className="intro">Answer a few questions about your roof. We’ll calculate a range using current pricing.</p>
        <Progress current={step + 1} total={steps.length} />
        <form onSubmit={submit}>
          {!isContact ? (
            <QuestionField
              question={currentQuestion}
              value={answers[currentQuestion.key]}
              error={errors[currentQuestion.key]}
              onChange={updateAnswer}
            />
          ) : (
            <div className="contact-step">
              <div>
                <div className="eyebrow">Almost there</div>
                <h2>Where should we send your estimate?</h2>
                <p>Your contact details are saved with the answers used to calculate the range.</p>
              </div>
              {['name', 'phone', 'email'].map((key) => (
                <div className="field" key={key}>
                  <label htmlFor={key}>{key[0].toUpperCase() + key.slice(1)}</label>
                  <input
                    id={key}
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    value={contact[key]}
                    onChange={(event) => {
                      setContact((current) => ({ ...current, [key]: event.target.value }));
                      setErrors((current) => ({ ...current, [key]: '' }));
                    }}
                    aria-invalid={Boolean(errors[key])}
                  />
                  {errors[key] && <p className="field-error">{errors[key]}</p>}
                </div>
              ))}
            </div>
          )}
          {errors.form && <div className="form-error">{errors.form}</div>}
          <div className="button-row">
            <button type="button" className="button secondary" onClick={previous} disabled={step === 0}>Back</button>
            {!isContact ? (
              <button type="button" className="button primary" onClick={next}>Continue</button>
            ) : (
              <button type="submit" className="button primary" disabled={submitting}>{submitting ? 'Calculating…' : 'Get my estimate'}</button>
            )}
          </div>
        </form>
        <p className="privacy-note">Your estimate is calculated securely on our server.</p>
      </div>
    </section>
  );
}

function EstimateResult({ config, estimate }) {
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: config.business.currency, maximumFractionDigits: 0 });
  return (
    <section className="result-shell">
      <div className="result-card">
        <div className="eyebrow">Your estimate</div>
        <h1>Estimated project range</h1>
        <div className="estimate-range">{currency.format(estimate.estimate_low)} <span>—</span> {currency.format(estimate.estimate_high)}</div>
        <p className="result-copy">This is a planning range based on the details you provided. A final quote may change after an on-site inspection.</p>
        <div className="result-meta">
          <span>Estimate ID</span>
          <strong>{String(estimate.lead_id).slice(-8)}</strong>
        </div>
        <a className="button primary" href="/">Start another estimate</a>
      </div>
    </section>
  );
}
