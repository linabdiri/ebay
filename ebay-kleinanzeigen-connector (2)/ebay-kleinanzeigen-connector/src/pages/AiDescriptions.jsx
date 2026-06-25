import { useState, useEffect } from 'react';
import { useT } from '../i18n/I18nContext';
import { useToast } from '../hooks/useToast';
import { fetchAiRules, saveAiRules, generateAiDescription } from '../services/api.js';

export default function AiDescriptions() {
  const { t } = useT();
  const { showToast, showError } = useToast();

  const [loading, setLoading]     = useState(true);
  const [generating, setGenerating] = useState(false);

  const [tone, setTone]               = useState('sales');
  const [pricing, setPricing]         = useState('negotiable');
  const [mandatory, setMandatory]     = useState('');
  const [forbidden, setForbidden]     = useState('');
  const [originalText, setOriginal]   = useState('');
  const [previewText, setPreview]     = useState('');
  const [generated, setGenerated]     = useState(false);

  useEffect(() => {
    fetchAiRules().then(r => {
      setTone(r.tone);
      setPricing(r.pricing);
      setMandatory(r.mandatoryNotes);
      setForbidden(r.forbiddenTerms);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function generate() {
    setGenerating(true);
    try {
      const { description } = await generateAiDescription(
        originalText || t('originalDescription'),
        t('previewPrice')
      );
      setPreview(description);
      setGenerated(true);
      showToast(t('aiTextGenerated'));
    } catch (err) {
      showError(t('errorAiGeneration'));
    } finally {
      setGenerating(false);
    }
  }

  async function saveRules() {
    await saveAiRules({ tone, pricing, mandatoryNotes: mandatory, forbiddenTerms: forbidden });
    showToast(t('automationSaved'));
  }

  function approveAi() {
    showToast(t('aiApproved'));
    setGenerated(false);
  }

  if (loading) return <div className="card"><p>Laden...</p></div>;

  return (
    <div className="split">
      {/* Left — Generator form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="card">
          <h3 style={{ margin: '0 0 4px' }}>{t('aiGenerator')}</h3>
          <p style={{ margin: '0 0 18px', color: '#6b7280', fontSize: 14 }}>{t('aiGeneratorSub')}</p>

          <div className="form-grid">
            <div className="form-row">
              <label>{t('tone')}</label>
              <select value={tone} onChange={e => setTone(e.target.value)}>
                <option value="sales">{t('toneSales')}</option>
                <option value="casual">{t('toneCasual')}</option>
                <option value="short">{t('toneShort')}</option>
              </select>
            </div>

            <div className="form-row">
              <label>{t('pricingStrategy')}</label>
              <select value={pricing} onChange={e => setPricing(e.target.value)}>
                <option value="fixed">{t('fixedPrice')}</option>
                <option value="negotiable">{t('addNegotiable')}</option>
                <option value="round">{t('roundPrice')}</option>
              </select>
            </div>

            <div className="form-row">
              <label>{t('mandatoryNotes')}</label>
              <input value={mandatory} onChange={e => setMandatory(e.target.value)} />
            </div>

            <div className="form-row">
              <label>{t('forbiddenTerms')}</label>
              <input value={forbidden} onChange={e => setForbidden(e.target.value)} />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: 14 }}>
            <label>{t('ebayOriginal')}</label>
            <textarea
              placeholder={t('originalDescription')}
              value={originalText}
              onChange={e => setOriginal(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="primary" onClick={generate} disabled={generating}>
              {generating ? '...' : t('generateAi')}
            </button>
            <button className="secondary" onClick={saveRules}>
              {t('saveRules')}
            </button>
          </div>
        </div>
      </div>

      {/* Right — Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="card">
          <h3 style={{ margin: '0 0 4px' }}>{t('previewTitle')}</h3>
          <p style={{ margin: '0 0 14px', color: '#6b7280', fontSize: 14 }}>{t('previewSub')}</p>

          <div className="preview-card">
            <div className="preview-image">
              <span>📷 {t('productImage')}</span>
            </div>
            <div className="preview-body">
              <h4>{t('previewProductTitle')}</h4>
              <div className="price">{t('previewPrice')}</div>
              <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                {previewText || t('aiTextDefault')}
              </p>

              {generated && (
                <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                  <button className="success" onClick={approveAi}>
                    ✓ {t('aiApproved')}
                  </button>
                  <button className="secondary" onClick={generate}>
                    ↺ {t('generateAi')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
