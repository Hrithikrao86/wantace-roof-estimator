import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [expandedLead, setExpandedLead] = useState(null);

  async function load() {
    try {
      const [nextConfig, nextLeads] = await Promise.all([api.getAdminConfig(), api.getLeads()]);
      setConfig(nextConfig);
      setLeads(nextLeads);
    } catch (err) {
      if (err.status === 401) navigate('/admin/login');
      else setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  function updateQuestion(index, patch) {
    setConfig((current) => {
      const next = clone(current);
      next.questions[index] = { ...next.questions[index], ...patch };
      return next;
    });
  }

  function updateOption(questionIndex, optionIndex, patch) {
    setConfig((current) => {
      const next = clone(current);
      next.questions[questionIndex].options[optionIndex] = {
        ...next.questions[questionIndex].options[optionIndex],
        ...patch
      };
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setSaved('');
    setError('');
    try {
      const next = await api.updateConfig({ business: config.business, questions: config.questions, modifiers: config.modifiers });
      setConfig(next);
      setSaved(`Published configuration v${next.config_version}. New estimator sessions will use it.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await api.logout();
    navigate('/admin/login');
  }

  if (!config) return <div className="state-card">Loading owner panel…</div>;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div><div className="eyebrow">Northline Roofing & Exteriors</div><h1>Owner panel</h1></div>
        <div className="header-actions"><a href="/">View estimator</a><button className="button secondary" onClick={logout}>Sign out</button></div>
      </header>

      {error && <div className="form-error admin-message">{error}</div>}
      {saved && <div className="success-message admin-message">{saved}</div>}

      <main className="admin-grid">
        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">Configuration v{config.config_version}</span><h2>Estimator settings</h2></div><button className="button primary" onClick={save} disabled={saving}>{saving ? 'Publishing…' : 'Publish changes'}</button></div>

          <div className="settings-block">
            <h3>Business details</h3>
            <div className="two-col">
              {['name', 'region', 'currency'].map((key) => (
                <div className="field" key={key}><label>{key}</label><input value={config.business[key]} onChange={(e) => setConfig({ ...config, business: { ...config.business, [key]: e.target.value } })} /></div>
              ))}
            </div>
          </div>

          <div className="settings-block">
            <h3>Global modifiers</h3>
            <div className="three-col">
              <div className="field"><label>Waste factor</label><input type="number" step="0.01" value={config.modifiers.waste_factor} onChange={(e) => setConfig({ ...config, modifiers: { ...config.modifiers, waste_factor: Number(e.target.value) } })} /></div>
              <div className="field"><label>Permit fee</label><input type="number" value={config.modifiers.permit_flat_fee} onChange={(e) => setConfig({ ...config, modifiers: { ...config.modifiers, permit_flat_fee: Number(e.target.value) } })} /></div>
              <div className="field"><label>Range spread %</label><input type="number" value={config.modifiers.range_spread_pct} onChange={(e) => setConfig({ ...config, modifiers: { ...config.modifiers, range_spread_pct: Number(e.target.value) } })} /></div>
            </div>
          </div>

          <div className="settings-block">
            <h3>Questions</h3>
            <div className="question-editor-list">
              {config.questions.map((question, qi) => (
                <article className={`question-editor ${question.active ? '' : 'disabled'}`} key={question.key}>
                  <div className="question-editor-top">
                    <div><strong>{question.key}</strong><span className="muted"> · {question.type}</span></div>
                    <label className="toggle"><input type="checkbox" checked={question.active} onChange={(e) => updateQuestion(qi, { active: e.target.checked })} /><span>Active</span></label>
                  </div>
                  <div className="field"><label>Label</label><input value={question.label} onChange={(e) => updateQuestion(qi, { label: e.target.value })} /></div>
                  {question.type === 'number' && <div className="three-col"><div className="field"><label>Unit</label><input value={question.unit || ''} onChange={(e) => updateQuestion(qi, { unit: e.target.value })} /></div><div className="field"><label>Min</label><input type="number" value={question.min ?? ''} onChange={(e) => updateQuestion(qi, { min: Number(e.target.value) })} /></div><div className="field"><label>Max</label><input type="number" value={question.max ?? ''} onChange={(e) => updateQuestion(qi, { max: Number(e.target.value) })} /></div></div>}
                  {question.type === 'select' && <div className="option-editor-list">{question.options.map((option, oi) => <div className="option-editor" key={option.value}><div className="field"><label>Label</label><input value={option.label} onChange={(e) => updateOption(qi, oi, { label: e.target.value })} /></div>{option.rate_per_sqft !== undefined && <div className="field"><label>$/sq ft</label><input type="number" step="0.01" value={option.rate_per_sqft} onChange={(e) => updateOption(qi, oi, { rate_per_sqft: Number(e.target.value) })} /></div>}{option.multiplier !== undefined && <div className="field"><label>Multiplier</label><input type="number" step="0.01" value={option.multiplier} onChange={(e) => updateOption(qi, oi, { multiplier: Number(e.target.value) })} /></div>}{option.tear_off_per_sqft !== undefined && <div className="field"><label>Tear-off $/sq ft</label><input type="number" step="0.01" value={option.tear_off_per_sqft} onChange={(e) => updateOption(qi, oi, { tear_off_per_sqft: Number(e.target.value) })} /></div>}</div>)}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">Captured customers</span><h2>Leads</h2></div><span className="count-badge">{leads.length}</span></div>
          <div className="lead-list">
            {leads.map((lead) => (
              <article className="lead-card" key={lead._id}>
                <button className="lead-summary" onClick={() => setExpandedLead(expandedLead === lead._id ? null : lead._id)}>
                  <span><strong>{lead.name}</strong><small>{lead.email}</small></span>
                  <span><strong>${lead.estimate_low.toLocaleString()} — ${lead.estimate_high.toLocaleString()}</strong><small>{new Date(lead.captured_at).toLocaleString()}</small></span>
                </button>
                {expandedLead === lead._id && <div className="lead-details"><div><strong>Phone</strong><span>{lead.phone}</span></div><div><strong>Config</strong><span>v{lead.config_version}</span></div><div><strong>Answers</strong><pre>{JSON.stringify(lead.answers, null, 2)}</pre></div></div>}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
