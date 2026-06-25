import { useState, useEffect } from 'react';
import { useT } from '../i18n/I18nContext';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { fetchDashboard } from '../services/api.js';
import dashboardStatic from '../data/dashboard.json';

export default function Dashboard() {
  const { t } = useT();
  const [metrics, setMetrics]         = useState(null);
  const [attentionItems, setAttention] = useState([]);
  const [loading, setLoading]          = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [mappingModalOpen, setMappingModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboard()
      .then(data => {
        setMetrics(data.metrics);
        setAttention(data.attentionItems);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function openModal(name) {
    if (name === 'productModal') setProductModalOpen(true);
    if (name === 'mappingModal') setMappingModalOpen(true);
  }

  if (loading) return <div className="card"><p>Laden...</p></div>;

  return (
    <>
      {/* KPI Metrics from API */}
      <div className="grid cols-4">
        <MetricCard label={t('mEbayActive')}  value={metrics?.ebayActive  ?? '—'} sub={t('mEbayActiveSub')} />
        <MetricCard label={t('mKleinActive')} value={metrics?.kleinActive ?? '—'} sub={t('mKleinActiveSub')} />
        <MetricCard label={t('mQueue')}       value={metrics?.queue       ?? '—'} sub={t('mQueueSub')} />
        <MetricCard label={t('mSoldToday')}   value={metrics?.soldToday   ?? '—'} sub={t('mSoldTodaySub')} />
      </div>

      {/* Activity Timeline — static */}
      <div className="section-title">
        <div><h3>{t('lastActivities')}</h3><p>{t('lastActivitiesSub')}</p></div>
      </div>
      <div className="card">
        <div className="timeline">
          {dashboardStatic.activityLog.map((item, i) => (
            <div className="timeline-item" key={item.id}>
              <div className="dot">{i + 1}</div>
              <div>
                <strong>{t(item.titleKey)}</strong>
                <span>{t(item.subKey)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attention items from API */}
      <div className="section-title">
        <div><h3>{t('attention')}</h3><p>{t('attentionSub')}</p></div>
      </div>
      <div className="card">
        {attentionItems.length === 0 ? (
          <div className="empty-state"><strong>Keine Artikel — alles in Ordnung ✅</strong></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('thItem')}</th>
                <th>{t('thProblem')}</th>
                <th>{t('thStatus')}</th>
                <th>{t('thAction')}</th>
              </tr>
            </thead>
            <tbody>
              {attentionItems.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.title}</strong><br /><small style={{ color: '#6b7280' }}>{item.category}</small></td>
                  <td>{t('problemRejected')}</td>
                  <td><StatusBadge label={t('statusError')} color="red" /></td>
                  <td>
                    <button className="secondary" onClick={() => openModal('productModal')}>
                      {t('edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Modal */}
      <Modal
        show={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={t('productModalTitle')}
        footer={
          <>
            <button className="secondary" onClick={() => setProductModalOpen(false)}>{t('cancel')}</button>
            <button className="success" onClick={() => setProductModalOpen(false)}>{t('approval')}</button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-row"><label>{t('titleForKlein')}</label><input defaultValue={t('previewProductTitle')} /></div>
          <div className="form-row"><label>{t('price')}</label><input defaultValue={t('priceValue')} /></div>
          <div className="form-row"><label>{t('category')}</label><select><option>{t('catSmartwatch')}</option></select></div>
          <div className="form-row">
            <label>{t('thStatus')}</label>
            <select><option>{t('statusDraft')}</option><option>{t('statusOnline')}</option></select>
          </div>
        </div>
        <div className="form-row" style={{ marginTop: 14 }}>
          <label>{t('description')}</label>
          <textarea defaultValue={t('aiTextDefault')} />
        </div>
      </Modal>

      {/* Mapping Modal */}
      <Modal
        show={mappingModalOpen}
        onClose={() => setMappingModalOpen(false)}
        title={t('mappingTitle')}
        footer={<button className="primary" onClick={() => setMappingModalOpen(false)}>{t('saveMapping')}</button>}
      >
        {[
          { ebay: t('map1'), klein: t('map1Target') },
          { ebay: t('map2'), klein: t('map2Target') },
          { ebay: t('map3'), klein: t('map3Target') },
        ].map((row, i) => (
          <div className="mapping-row" key={i}>
            <strong>{row.ebay}</strong>
            <select><option>{row.klein}</option></select>
            <button className="secondary">{t('apply')}</button>
          </div>
        ))}
      </Modal>
    </>
  );
}
