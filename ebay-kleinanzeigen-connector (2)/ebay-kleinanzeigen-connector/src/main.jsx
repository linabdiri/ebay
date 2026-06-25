import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { ToastProvider } from './hooks/useToast';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/useAuth';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
          <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
          </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
