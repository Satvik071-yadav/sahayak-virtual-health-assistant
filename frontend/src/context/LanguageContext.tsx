import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "../i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    (localStorage.getItem("vha_lang") as Lang) || "en"
  );

  useEffect(() => {
    localStorage.setItem("vha_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] ?? translations.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
