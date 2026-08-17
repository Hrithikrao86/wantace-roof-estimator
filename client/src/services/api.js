const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.fields = data.fields;
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  getConfig: () => request('/config'),
  createEstimate: (payload) => request('/estimate', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  getAdminConfig: () => request('/admin/config'),
  updateConfig: (payload) => request('/admin/config', { method: 'PUT', body: JSON.stringify(payload) }),
  getLeads: () => request('/admin/leads')
};
