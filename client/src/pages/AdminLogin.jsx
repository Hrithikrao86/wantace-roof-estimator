import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.login(form);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">Owner panel</div>
        <h1>Sign in</h1>
        <p>Manage estimator configuration and captured leads.</p>
        <div className="field"><label htmlFor="username">Username</label><input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" /></div>
        {error && <div className="form-error">{error}</div>}
        <button className="button primary full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        <a className="back-link" href="/">← Back to estimator</a>
      </form>
    </section>
  );
}
