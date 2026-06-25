import Modal from './Modal';
import { useT } from '../i18n/I18nContext';

export default function LogModal({ show, onClose }) {
  const { t } = useT();
  return (
    <Modal show={show} onClose={onClose} title={t('systemLog')}>
      <div className="empty-state">
        <strong>{t('lastRuns')}</strong>
        <br /><br />
        <span>{t('log1')}</span><br />
        <span>{t('log2')}</span><br />
        <span>{t('log3')}</span><br />
        <span>{t('log4')}</span>
      </div>
    </Modal>
  );
}
