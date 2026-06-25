import { NavLink } from 'react-router-dom';
import { useT } from '../i18n/I18nContext';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/',          labelKey: 'navDashboard' },
  { to: '/products',  labelKey: 'navProducts' },
  { to: '/ai',        labelKey: 'navAi' },
  { to: '/sync',      labelKey: 'navSync' },
  { to: '/customers', labelKey: 'navCustomers' },
  { to: '/settings',  labelKey: 'navSettings' },
];

export default function Sidebar() {
  const { t } = useT();
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">EK</div>
        <div>
          <h1>eBay → Kleinanzeigen</h1>
          <span>{t('brandSub')}</span>
        </div>
      </div>

      <nav className="nav">
        {navItems.map(({ to, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <button className={isActive ? 'active' : ''}>
                <span>{t(labelKey)}</span>
                <span>›</span>
              </button>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="tenant-box">
        <small>{t('activeTenant')}</small>
        <strong>{t('tenantName')}</strong>
        <small>{t('plan')}: Professional</small>
        <button onClick={logout} style={{ marginTop: 12, width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1', borderRadius: 10, padding: '8px 10px', cursor: 'pointer', fontSize: 13 }}>
  Logout
</button>
      </div>
    </aside>
  );
}
