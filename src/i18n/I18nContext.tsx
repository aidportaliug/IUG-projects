import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en, Messages } from './en';
import { nb } from './nb';

export type Language = 'nb' | 'en';

const messages: Record<Language, Messages> = { nb, en };
const locales: Record<Language, string> = { nb: 'nb-NO', en: 'en-GB' };
const STORAGE_KEY = 'lang';

// Saved choice first, then the browser language (Norwegian bokmål/nynorsk → nb), otherwise English.
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'nb' || saved === 'en') return saved;
  } catch {
    // Storage can be blocked (private mode); fall back to the browser language.
  }
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return browserLanguages.some((lang) => /^(nb|nn|no)\b/i.test(lang ?? '')) ? 'nb' : 'en';
}

interface I18nValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Messages;
  formatDate: (value: string | Date, options?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice then lasts only for this visit.
    }
  }, []);

  const formatDate = useCallback(
    (value: string | Date, options?: Intl.DateTimeFormatOptions) =>
      new Date(value).toLocaleDateString(locales[lang], options),
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t: messages[lang], formatDate }), [lang, setLang, formatDate]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return value;
}
