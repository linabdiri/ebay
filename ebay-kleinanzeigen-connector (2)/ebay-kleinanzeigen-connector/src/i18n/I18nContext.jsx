import { createContext, useContext, useState } from 'react';
import dict from './dict';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('de');

  function t(key) {
    return (dict[lang] && dict[lang][key]) || dict.de[key] || key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
