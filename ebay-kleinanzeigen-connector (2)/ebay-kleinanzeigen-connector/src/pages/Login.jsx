import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot reach server');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fb',
    }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: 360, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div className="brand-mark" style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #22c55e)', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#fff' }}>EK</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 17 }}>Connector Admin</h2>
            <span style={{ fontSize: 12, color: '#6b7280' }}>eBay → Kleinanzeigen</span>
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: 14 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            required
          />
        </div>

        <div className="form-row" style={{ marginBottom: 20 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{error}</p>
        )}

        <button className="primary" type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? '...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}