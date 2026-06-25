import { useState, useEffect, useRef } from 'react';
import { useT } from '../i18n/I18nContext';
import { useToast } from '../hooks/useToast';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { fetchTenants, createTenant, updateTenant } from '../services/api.js';

const statusColor = { active: 'green', setup: 'yellow', test: 'gray' };

export default function Customers() {
  const { t } = useT();
  const { showToast } = useToast();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [manageModal, setManageModal] = useState(null);

  // Create form state
  const [newName, setNewName]       = useState('');
  const [newPlan, setNewPlan]       = useState('Starter');
  const [newMax, setNewMax]         = useState(100);
  const [newBilling, setNewBilling] = useState('monthly');

  // Manage form state (controlled)
  const [editName, setEditName]       = useState('');
  const [editPlan, setEditPlan]       = useState('');
  const [editMax, setEditMax]         = useState(0);
  const [editBilling, setEditBilling] = useState('');

  useEffect(() => {
    fetchTenants()
      .then(data => { setCustomers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function openManage(c) {
    setEditName(c.name);
    setEditPlan(c.plan);
    setEditMax(c.maxListings);
    setEditBilling(c.billing);
    setManageModal(c);
  }

  async function saveCustomer() {
    if (!newName) return;
    const tenant = await createTenant({ name: newName, plan: newPlan, maxListings: newMax, billing: newBilling });
    setCustomers(prev => [...prev, tenant]);
    setCreateModal(false);
    setNewName(''); setNewPlan('Starter'); setNewMax(100); setNewBilling('monthly');
    showToast(t('tenantSaved'));
  }

  async function saveTenant() {
    const updated = await updateTenant(manageModal._id, {
      name: editName,
      plan: editPlan,
      maxListings: editMax,
      billing: editBilling,
    });
    setCustomers(prev => prev.map(c => c._id === updated._id ? updated : c));
    setManageModal(null);
    showToast(t('tenantSaved'));
  }

  if (loading) return <div className="card"><p>Laden...</p></div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
        <button className="primary" onClick={() => setCreateModal(true)}>+ {t('createCustomer')}</button>
      </div>

      <div className="grid cols-3">
        {customers.map(c => (
          <div className="card" key={c._id} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 16 }}>{c.name}</strong>
              <StatusBadge label={t(c.status)} color={statusColor[c.status] || 'gray'} />
            </div>
            <div style={{ display: 'grid', gap: 6, fontSize: 13, color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('plan')}</span><strong style={{ color: '#111827' }}>{c.plan}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('maxListings')}</span><strong style={{ color: '#111827' }}>{c.maxListings}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>eBay</span>
                <StatusBadge label={c.ebayConnected ? t('connected') : '—'} color={c.ebayConnected ? 'green' : 'gray'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kleinanzeigen</span>
                <StatusBadge label={c.kleinConnected ? t('connected') : '—'} color={c.kleinConnected ? 'green' : 'gray'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t('billing')}</span><strong style={{ color: '#111827' }}>{t(c.billing)}</strong>
              </div>
            </div>
            <button className="secondary" onClick={() => openManage(c)}>{t('manage')}</button>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        show={createModal}
        onClose={() => setCreateModal(false)}
        title={t('createCustomer')}
        footer={
          <>
            <button className="secondary" onClick={() => setCreateModal(false)}>{t('cancel')}</button>
            <button className="primary" onClick={saveCustomer}>{t('save')}</button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-row">
            <label>{t('companyName')}</label>
            <input placeholder="Firma GmbH" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <div className="form-row">
            <label>{t('plan')}</label>
            <select value={newPlan} onChange={e => setNewPlan(e.target.value)}>
              <option>Starter</option><option>Professional</option><option>Enterprise</option>
            </select>
          </div>
          <div className="form-row">
            <label>{t('maxListings')}</label>
            <input type="number" value={newMax} onChange={e => setNewMax(Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>{t('billing')}</label>
            <select value={newBilling} onChange={e => setNewBilling(e.target.value)}>
              <option value="monthly">{t('monthly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Manage Modal */}
      <Modal
        show={!!manageModal}
        onClose={() => setManageModal(null)}
        title={t('manageTenant')}
        footer={
          <>
            <button className="secondary" onClick={() => setManageModal(null)}>{t('cancel')}</button>
            <button className="primary" onClick={saveTenant}>{t('save')}</button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-row">
            <label>{t('companyName')}</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} />
          </div>
          <div className="form-row">
            <label>{t('plan')}</label>
            <select value={editPlan} onChange={e => setEditPlan(e.target.value)}>
              <option>Starter</option><option>Professional</option><option>Enterprise</option>
            </select>
          </div>
          <div className="form-row">
            <label>{t('maxListings')}</label>
            <input type="number" value={editMax} onChange={e => setEditMax(Number(e.target.value))} />
          </div>
          <div className="form-row">
            <label>{t('billing')}</label>
            <select value={editBilling} onChange={e => setEditBilling(e.target.value)}>
              <option value="monthly">{t('monthly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
