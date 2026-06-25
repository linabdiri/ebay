import { createContext, useContext, useState, useCallback } from 'react';
import { useT } from '../i18n/I18nContext';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const { t } = useT();
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 2600);
  }, []);

  const showError = useCallback((msg) => {
    setErrorMessage(msg);
    setErrorVisible(true);
  }, []);

  const closeError = useCallback(() => {
    setErrorVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showError }}>
      {children}

      {visible && (
        <div className="toast show">{message}</div>
      )}

      {errorVisible && (
        <div className="error-modal-backdrop" onClick={closeError}>
          <div className="error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="error-modal-icon">⚠</div>
            <h3>{t('errorTitle')}</h3>
            <p>{errorMessage}</p>
            <button className="primary" onClick={closeError}>{t('errorClose')}</button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}