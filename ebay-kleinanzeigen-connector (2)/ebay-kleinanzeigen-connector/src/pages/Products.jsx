import { useState, useEffect, useMemo } from 'react';
import { useT } from '../i18n/I18nContext';
import { useToast } from '../hooks/useToast';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { fetchProducts, updateProduct } from '../services/api.js';

const statusColor = {
  active: 'green', online: 'green', draft: 'yellow',
  sold: 'gray', disabled: 'gray', error: 'red', open: 'blue', done: 'green',
};

export default function Products() {
  const { t } = useT();
  const { showToast } = useToast();

  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('');
  const [filterCat, setFilterCat]   = useState('');
  const [selected, setSelected]     = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [productModal, setProductModal] = useState(null);
  const [importModal, setImportModal]   = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(data => { setRows(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visible = useMemo(() => rows.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.ebayStatus === filterStatus || p.kleinStatus === filterStatus;
    const matchCat    = !filterCat || p.category.toLowerCase().includes(filterCat.toLowerCase());
    return matchSearch && matchStatus && matchCat;
  }), [rows, search, filterStatus, filterCat]);

  const allChecked = visible.length > 0 && visible.every(p => selected.includes(p._id));

  function toggleAll() {
    if (allChecked) setSelected([]);
    else setSelected(visible.map(p => p._id));
  }

  function toggleOne(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function selectOpen() {
    setSelected(visible.filter(p => p.transfer === 'open').map(p => p._id));
  }

  async function runBulk() {
    if (!bulkAction || selected.length === 0) { showToast(t('noBulk')); return; }
    const updates = selected.map(id =>
      updateProduct(id, bulkAction === 'approve'
        ? { kleinStatus: 'online', transfer: 'done' }
        : { kleinStatus: 'draft' }
      )
    );
    await Promise.all(updates);
    setRows(prev => prev.map(p =>
      selected.includes(p._id)
        ? { ...p, ...(bulkAction === 'approve' ? { kleinStatus: 'online', transfer: 'done' } : { kleinStatus: 'draft' }) }
        : p
    ));
    setSelected([]);
    showToast(t('bulkDone'));
  }

  async function approveOne(id) {
    await updateProduct(id, { kleinStatus: 'online', transfer: 'done' });
    setRows(prev => prev.map(p => p._id === id ? { ...p, kleinStatus: 'online', transfer: 'done' } : p));
    showToast(t('oneApproved'));
  }

  if (loading) return <div className="card"><p>Laden...</p></div>;

  return (
    <>
      <div className="toolbar">
        <input placeholder={t('searchProduct')} value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterStatus} onChange={e => setFilter(e.target.value)}>
          <option value="">{t('allStatuses')}</option>
          <option value="active">{t('statusActive')}</option>
          <option value="draft">{t('statusDraft')}</option>
          <option value="sold">{t('statusSold')}</option>
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">{t('allCategories')}</option>
          <option value="elektronik">{t('catElectronics')}</option>
          <option value="haushalt">{t('catHousehold')}</option>
          <option value="mode">{t('catFashion')}</option>
        </select>
        <button className="secondary" onClick={() => setImportModal(true)}>{t('startImport')}</button>
      </div>

      <div className="toolbar" style={{ marginBottom: 14 }}>
        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
          <option value="">{t('bulkChoose')}</option>
          <option value="approve">{t('bulkApprove')}</option>
          <option value="review">{t('bulkReview')}</option>
        </select>
        <button className="secondary" onClick={selectOpen}>{t('selectOpen')}</button>
        <button className="primary" onClick={runBulk}>{t('runBulk')}</button>
        {selected.length > 0 && <span className="bulk-info">{selected.length} {t('selected')}</span>}
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {visible.length === 0 ? (
          <div className="empty-state"><strong>Keine Produkte gefunden</strong></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="check-cell"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
                <th>{t('thProduct')}</th>
                <th>{t('thEbay')}</th>
                <th>{t('thKleinanzeigen')}</th>
                <th>{t('thTransfer')}</th>
                <th>{t('thPrice')}</th>
                <th>{t('thStock')}</th>
                <th>{t('thLastCheck')}</th>
                <th>{t('thAction')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(p => (
                <tr key={p._id}>
                  <td className="check-cell">
                    <input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggleOne(p._id)} />
                  </td>
                  <td>
                    <strong>{p.title}</strong>
                    <br /><small style={{ color: '#6b7280', fontSize: 12 }}>{p.category}</small>
                  </td>
                  <td><StatusBadge label={p.ebayStatus} color={statusColor[p.ebayStatus] || 'gray'} /></td>
                  <td><StatusBadge label={p.kleinStatus} color={statusColor[p.kleinStatus] || 'gray'} /></td>
                  <td>
                    <StatusBadge
                      label={p.transfer === 'done' ? t('transferDone') : t('transferOpen')}
                      color={p.transfer === 'done' ? 'green' : 'yellow'}
                    />
                  </td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td style={{ color: '#6b7280', fontSize: 13 }}>{p.lastCheck}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="secondary" onClick={() => setProductModal(p)}>{t('details')}</button>
                      {p.transfer === 'open' && (
                        <button className="success" onClick={() => approveOne(p._id)}>{t('approval')}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        show={!!productModal}
        onClose={() => setProductModal(null)}
        title={t('productModalTitle')}
        footer={
          <>
            <button className="secondary" onClick={() => setProductModal(null)}>{t('cancel')}</button>
            <button className="success" onClick={() => { if (productModal) approveOne(productModal._id); setProductModal(null); }}>
              {t('approval')}
            </button>
          </>
        }
      >
        {productModal && (
          <>
            <div className="form-grid">
              <div className="form-row"><label>{t('titleForKlein')}</label><input defaultValue={productModal.title} /></div>
              <div className="form-row"><label>{t('price')}</label><input defaultValue={productModal.price} /></div>
              <div className="form-row"><label>{t('category')}</label><input defaultValue={productModal.category} /></div>
              <div className="form-row"><label>{t('thStock')}</label><input defaultValue={productModal.stock} type="number" /></div>
            </div>
            <div className="form-row" style={{ marginTop: 14 }}>
              <label>{t('description')}</label>
              <textarea defaultValue={t('aiTextDefault')} />
            </div>
          </>
        )}
      </Modal>

      <Modal
        show={importModal}
        onClose={() => setImportModal(false)}
        title={t('startImport')}
        footer={
          <>
            <button className="secondary" onClick={() => setImportModal(false)}>{t('cancel')}</button>
            <button className="primary" onClick={() => { setImportModal(false); showToast(t('importStarted')); }}>
              {t('startImportBtn')}
            </button>
          </>
        }
      >
        <p style={{ color: '#6b7280', marginTop: 0 }}>{t('importText')}</p>
        <div className="form-grid">
          <div className="form-row">
            <label>{t('importScope')}</label>
            <select><option>{t('allActiveEbay')}</option><option>{t('onlyCategories')}</option></select>
          </div>
          <div className="form-row">
            <label>{t('publishing')}</label>
            <select><option>{t('firstDrafts')}</option><option>{t('autoAfterAi')}</option></select>
          </div>
        </div>
      </Modal>
    </>
  );
}
