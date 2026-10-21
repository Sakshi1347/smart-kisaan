import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "@/lib/translations";

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export const LANGUAGE_STORAGE_KEY = "smart_kisaan_language";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "en" || saved === "hi") {
      return saved;
    }
  } catch (error) {
    console.warn("Failed to read language from localStorage:", error);
  }
  return "en";
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Sync HTML lang attribute whenever language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLang: Language) => {
    if (newLang !== "en" && newLang !== "hi") return;
    setLanguageState(newLang);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      }
    } catch (error) {
      console.warn("Failed to save language preference to localStorage:", error);
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key]?.[language] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
