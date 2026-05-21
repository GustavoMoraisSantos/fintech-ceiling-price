import { useState, useEffect } from 'react';
import en from '@/locales/en.json';
import ptBR from '@/locales/pt-BR.json';

type Locale = 'en' | 'pt-BR';

const translations = {
  en,
  'pt-BR': ptBR,
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Check if locale is already stored in localStorage
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale && storedLocale in translations) {
      setLocale(storedLocale);
    } else {
      // Check browser language
      const browserLang = navigator.language || 'en';
      if (browserLang.startsWith('pt')) {
        setLocale('pt-BR');
        localStorage.setItem('locale', 'pt-BR');
      } else {
        setLocale('en');
        localStorage.setItem('locale', 'en');
      }
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) {
      // Fallback to English if translation not found
      value = translations['en'];
      for (const k of keys) {
        value = value?.[k];
      }
    }

    return value || key;
  };

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'pt-BR' : 'en';
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return { t, locale, toggleLocale };
}
