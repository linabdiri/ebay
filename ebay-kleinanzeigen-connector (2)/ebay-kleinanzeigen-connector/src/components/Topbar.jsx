import { useT } from '../i18n/I18nContext';
import { useToast } from '../hooks/useToast';

export default function Topbar({ title, subtitle, onOpenLog }) {
  const { lang, setLang, t } = useT();
  const { showToast } = useToast();

  function simulateSync() {
    showToast(t('syncStarted'));
    setTimeout(() => showToast(t('syncFinished')), 1500);
  }

  return (
    <div className="topbar">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="actions">
        <div className="lang-switch">
          <button
            className={lang === 'de' ? 'active' : ''}
            onClick={() => setLang('de')}
          >DE</button>
          <button
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >EN</button>
            <button
            className={lang === 'fr' ? 'active' : ''}
            onClick={() => setLang('fr')}
          >FR</button>
        </div>
        <button className="secondary" onClick={onOpenLog}>
          {t('showLog')}
        </button>
        <button className="primary" onClick={simulateSync}>
          {t('syncNow')}
        </button>
      </div>
    </div>
  );
}
