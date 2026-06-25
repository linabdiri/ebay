import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LogModal from './components/LogModal';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AiDescriptions from './pages/AiDescriptions';
import Sync from './pages/Sync';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import { useT } from './i18n/I18nContext';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';

const pageMeta = {
  '/':          { title: 'dashboardTitle', sub: 'dashboardSub' },
  '/products':  { title: 'productsTitle',  sub: 'productsSub' },
  '/ai':        { title: 'aiTitle',        sub: 'aiSub' },
  '/sync':      { title: 'syncTitle',      sub: 'syncSub' },
  '/customers': { title: 'customersTitle', sub: 'customersSub' },
  '/settings':  { title: 'settingsTitle',  sub: 'settingsSub' },
};

export default function App() {
  const { t } = useT();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [logOpen, setLogOpen] = useState(false);

  const meta = pageMeta[location.pathname] || pageMeta['/'];
  if (!isAuthenticated) {
  return <Login />;
}

  return (
    <div className="app">
      <Sidebar />
      <main>
        <Topbar
          title={t(meta.title)}
          subtitle={t(meta.sub)}
          onOpenLog={() => setLogOpen(true)}
        />
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/products"  element={<Products />} />
          <Route path="/ai"        element={<AiDescriptions />} />
          <Route path="/sync"      element={<Sync />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </main>
      <LogModal show={logOpen} onClose={() => setLogOpen(false)} />
    </div>
  );
}
