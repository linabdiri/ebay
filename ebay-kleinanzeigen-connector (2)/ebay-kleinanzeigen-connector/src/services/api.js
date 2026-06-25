import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Token is set by AuthProvider on login and cleared on logout.
let authToken = null;
export function setAuthToken(token) {
  authToken = token;
}

// Interceptor: automatically attaches the JWT token to every outgoing request.
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Interceptor: if the token is invalid/expired, log the user out automatically.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setAuthToken(null);
      // Optionally force a reload to show the Login page again
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export async function fetchProducts(params = {}) {
  const res = await api.get('/products', { params });
  return res.data;
}

export async function updateProduct(id, data) {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
}

export async function fetchDashboard() {
  const res = await api.get('/dashboard');
  return res.data;
}

export async function fetchSyncRules() {
  const res = await api.get('/sync-rules');
  return res.data;
}

export async function createSyncRule(data) {
  const res = await api.post('/sync-rules', data);
  return res.data;
}

export async function fetchTenants() {
  const res = await api.get('/tenants');
  return res.data;
}

export async function createTenant(data) {
  const res = await api.post('/tenants', data);
  return res.data;
}

export async function updateTenant(id, data) {
  const res = await api.put(`/tenants/${id}`, data);
  return res.data;
}

export async function fetchSettings() {
  const res = await api.get('/settings');
  return res.data;
}

export async function saveSettings(data) {
  const res = await api.put('/settings', data);
  return res.data;
}

export async function generateAiDescription(originalText, price) {
  const res = await api.post('/ai/generate', { originalText, price });
  return res.data;
}

export async function fetchAiRules() {
  const res = await api.get('/ai/rules');
  return res.data;
}

export async function saveAiRules(data) {
  const res = await api.put('/ai/rules', data);
  return res.data;
}