import { useState, useEffect } from 'react';
import { useT } from '../i18n/I18nContext';
import { useToast } from '../hooks/useToast';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { fetchSyncRules, createSyncRule } from '../services/api.js';

const priorityColor = { high: 'red', medium: 'yellow', low: 'gray' };

export default function Sync() {
  const { t } = useT();
  const { showToast } = useToast();

  const [rules, setRules]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [ruleModal, setRuleModal] = useState(false);
  const [newEvent, setNewEvent]   = useState('');
  const [newAction, setNewAction] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  useEffect(() => {
    fetchSyncRules()
      .then(data => { setRules(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function saveRule() {
    if (!newEvent || !newAction) return;
    const rule = await createSyncRule({ event: newEvent, action: newAction, priority: newPriority });
    setRules(prev => [...prev, rule]);
    setRuleModal(false);
    setNewEvent(''); setNewAction(''); setNewPriority('medium');
    showToast(t('ruleCreated'));
  }

  if (loading) return <div className="card"><p>Laden...</p></div>;

  return (
    <>
      <div className="grid cols-3">
        <MetricCard label={t('syncInterval')} value="15 min" sub={t('syncActive')} />
        <MetricCard label={t('apiErrors')} value="2" sub={t('belowLimit')} />
        <MetricCard label={t('runtime')} value="1.3s" sub={t('lastJobOk')} />
      </div>

      <div className="section-title">
        <div><h3>{t('syncRules')}</h3><p>{t('syncRulesSub')}</p></div>
        <button className="primary" onClick={() => setRuleModal(true)}>+ {t('addRule')}</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>{t('event')}</th>
              <th>{t('action')}</th>
              <th>{t('priority')}</th>
              <th>{t('thStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule._id}>
                <td>{t(rule.event)}</td>
                <td>{t(rule.action)}</td>
                <td><StatusBadge label={t(rule.priority)} color={priorityColor[rule.priority] || 'gray'} /></td>
                <td><StatusBadge label={t('statusActive')} color="green" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={ruleModal}
        onClose={() => setRuleModal(false)}
        title={t('addRuleTitle')}
        footer={
          <>
            <button className="secondary" onClick={() => setRuleModal(false)}>{t('cancel')}</button>
            <button className="primary" onClick={saveRule}>{t('saveRule')}</button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-row">
            <label>{t('when')}</label>
            <select value={newEvent} onChange={e => setNewEvent(e.target.value)}>
              <option value="">{t('bulkChoose')}</option>
              <option value="eventEbaySold">{t('eventEbaySold')}</option>
              <option value="eventKleinSold">{t('eventKleinSold')}</option>
              <option value="eventPriceChanged">{t('eventPriceChanged')}</option>
              <option value="eventNewEbay">{t('eventNewEbay')}</option>
            </select>
          </div>
          <div className="form-row">
            <label>{t('then')}</label>
            <select value={newAction} onChange={e => setNewAction(e.target.value)}>
              <option value="">{t('bulkChoose')}</option>
              <option value="actDisableKlein">{t('actDisableKlein')}</option>
              <option value="actEndEbay">{t('actEndEbay')}</option>
              <option value="actUpdatePrice">{t('actUpdatePrice')}</option>
              <option value="actCreateDraft">{t('actCreateDraft')}</option>
            </select>
          </div>
          <div className="form-row">
            <label>{t('priority')}</label>
            <select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
              <option value="high">{t('high')}</option>
              <option value="medium">{t('medium')}</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
