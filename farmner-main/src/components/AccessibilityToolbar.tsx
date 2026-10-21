import React from "react";
import { Eye, HelpCircle, Sparkles, Type } from "lucide-react";
import { useAccessibility, TextSize } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccessibilityToolbarProps {
  className?: string;
  compact?: boolean;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  className = "",
  compact = false,
}) => {
  const {
    textSize,
    setTextSize,
    highContrast,
    toggleHighContrast,
    openHelpModal,
  } = useAccessibility();
  const { t, language } = useLanguage();

  return (
    <div
      role="toolbar"
      aria-label={t("a11y.toolbarLabel")}
      className={`inline-flex items-center gap-1.5 p-1 rounded-full bg-surface-container-high/80 ghost-border ${className}`}
    >
      {/* Quick Text Size Selector */}
      <div
        role="group"
        aria-label={t("a11y.textSize")}
        className="inline-flex items-center gap-1"
      >
        <button
          type="button"
          onClick={() => setTextSize("normal")}
          aria-pressed={textSize === "normal"}
          aria-label={t("a11y.textSizeAria").replace("{size}", t("a11y.normal"))}
          className={`min-h-[44px] min-w-[44px] h-11 px-2.5 rounded-full text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
            textSize === "normal"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-highest/40"
          }`}
        >
          A
        </button>
        <button
          type="button"
          onClick={() => setTextSize("large")}
          aria-pressed={textSize === "large"}
          aria-label={t("a11y.textSizeAria").replace("{size}", t("a11y.large"))}
          className={`min-h-[44px] min-w-[44px] h-11 px-2.5 rounded-full text-sm font-extrabold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
            textSize === "large"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-highest/40"
          }`}
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => setTextSize("xl")}
          aria-pressed={textSize === "xl"}
          aria-label={t("a11y.textSizeAria").replace("{size}", t("a11y.extraLarge"))}
          className={`min-h-[44px] min-w-[44px] h-11 px-2.5 rounded-full text-base font-extrabold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
            textSize === "xl"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-highest/40"
          }`}
        >
          A++
        </button>
      </div>

      <div className="h-5 w-px bg-border/40 my-auto" aria-hidden="true" />

      {/* Contrast Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        aria-label={highContrast ? t("a11y.highContrastEnabled") : t("a11y.toggleHighContrast")}
        className={`min-h-[44px] min-w-[44px] h-11 px-3 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
          highContrast
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-surface-highest/40"
        }`}
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        <span className={compact ? "sr-only sm:not-sr-only" : ""}>
          {t("a11y.contrast")}
        </span>
      </button>

      {/* Accessibility Settings / Help Modal Button */}
      <button
        type="button"
        onClick={openHelpModal}
        aria-label={t("a11y.dialogTitle")}
        className="min-h-[44px] min-w-[44px] h-11 px-2.5 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-surface-highest/40 transition-all inline-flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only sm:inline-block">
          {language === "hi" ? "सुगमता" : "A11y"}
        </span>
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
