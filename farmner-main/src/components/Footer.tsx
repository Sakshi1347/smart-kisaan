import { useLanguage } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const Footer = () => {
  const { t } = useLanguage();
  const { openHelpModal } = useAccessibility();

  return (
    <footer className="border-t border-outline-variant/10 py-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant uppercase tracking-wider">
          {t("footer.copyright")}
        </p>
        <div className="flex flex-wrap items-center gap-6 text-xs text-on-surface-variant uppercase tracking-wider">
          <button
            type="button"
            onClick={openHelpModal}
            className="hover:text-foreground cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded py-1 px-1.5 min-h-[44px] inline-flex items-center"
          >
            {t("footer.accessibility")}
          </button>
          <span className="hover:text-foreground transition-colors py-1">{t("footer.privacy")}</span>
          <span className="hover:text-foreground transition-colors py-1">{t("footer.terms")}</span>
          <span className="hover:text-foreground transition-colors py-1">{t("footer.contact")}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
