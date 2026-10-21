import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle = ({ className = "" }: LanguageToggleProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1.5 p-1 rounded-full bg-surface-container-high/80 ghost-border ${className}`}
      role="group"
      aria-label={t("common.chooseLanguage")}
    >
      <span className="sr-only">{t("common.chooseLanguage")}</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`min-h-12 min-w-[5.5rem] rounded-full px-4 py-2 text-sm md:text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          language === "en"
            ? "gradient-primary text-primary-foreground shadow-sm"
            : "text-on-surface-variant hover:text-foreground hover:bg-surface-highest/40"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={`min-h-12 min-w-[5.5rem] rounded-full px-4 py-2 text-sm md:text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          language === "hi"
            ? "gradient-primary text-primary-foreground shadow-sm"
            : "text-on-surface-variant hover:text-foreground hover:bg-surface-highest/40"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};

export default LanguageToggle;
