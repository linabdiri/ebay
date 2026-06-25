import { useState, useEffect } from 'react';
import { useT } from '../i18n/I18nContext';
import { useToast } from '../hooks/useToast';
import { fetchSettings, saveSettings } from '../services/api.js';

export default function Settings() {
  const { t } = useToast ? useT() : { t: k => k };
  const { showToast } = useToast();
  const { t: tFunc } = useT();

  const [loading, setLoading] = useState(true);

  // API settings
  const [ebayClientId, setEbayClientId]         = useState('');
  const [ebayClientSecret, setEbayClientSecret] = useState('');
  const [kleinToken, setKleinToken]             = useState('');

  // Automation settings
  const [importInterval, setImportInterval]       = useState('every15');
  const [newListingAction, setNewListingAction]   = useState('drafts');
  const [autoDisableOnSold, setAutoDisableOnSold] = useState(true);

  useEffect(() => {
    fetchSettings().then(s => {
      setEbayClientId(s.ebayClientId || '');
      setEbayClientSecret(s.ebayClientSecret || '');
      setKleinToken(s.kleinToken || '');
      setImportInterval(s.importInterval || 'every15');
      setNewListingAction(s.newListingAction || 'drafts');
      setAutoDisableOnSold(s.autoDisableOnSold ?? true);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function saveApiSettings() {
    await saveSettings({ ebayClientId, ebayClientSecret, kleinToken });
    showToast(tFunc('apiSaved'));
  }

  async function saveAutomation() {
    await saveSettings({ importInterval, newListingAction, autoDisableOnSold });
    showToast(tFunc('automationSaved'));
  }

  if (loading) return <div className="card"><p>Laden...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* API Connections */}
      <div className="card">
        <h3 style={{ margin: '0 0 18px' }}>{tFunc('apiConnections')}</h3>
        <div className="form-grid">
          <div className="form-row">
            <label>eBay Client ID</label>
            <input value={ebayClientId} onChange={e => setEbayClientId(e.target.value)} />
          </div>
          <div className="form-row">
            <label>eBay Client Secret</label>
            <input type="password" value={ebayClientSecret} onChange={e => setEbayClientSecret(e.target.value)} />
          </div>
          <div className="form-row">
            <label>{tFunc('kleinAccess')}</label>
            <input value={kleinToken} onChange={e => setKleinToken(e.target.value)} />
          </div>
          <div className="form-row">
            <label>{tFunc('postingLimit')}</label>
            <input value={tFunc('limitValue')} readOnly style={{ background: '#f8fafc', color: '#6b7280' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <button className="primary" onClick={saveApiSettings}>{tFunc('save')}</button>
        </div>
      </div>

      {/* Automation */}
      <div className="card">
        <h3 style={{ margin: '0 0 18px' }}>{tFunc('automation')}</h3>
        <div className="form-grid">
          <div className="form-row">
            <label>{tFunc('importInterval')}</label>
            <select value={importInterval} onChange={e => setImportInterval(e.target.value)}>
              <option value="every15">{tFunc('every15')}</option>
              <option value="every30">{tFunc('every30')}</option>
              <option value="hourly">{tFunc('hourly')}</option>
            </select>
          </div>
          <div className="form-row">
            <label>{tFunc('newEbayListings')}</label>
            <select value={newListingAction} onChange={e => setNewListingAction(e.target.value)}>
              <option value="drafts">{tFunc('createDrafts')}</option>
              <option value="auto">{tFunc('publishAfterAi')}</option>
              <option value="notify">{tFunc('notifyOnly')}</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={autoDisableOnSold}
              onChange={e => setAutoDisableOnSold(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            {tFunc('whenSold')} — {tFunc('autoDisableOther')}
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <button className="primary" onClick={saveAutomation}>{tFunc('save')}</button>
        </div>
      </div>

    </div>
  );
}
