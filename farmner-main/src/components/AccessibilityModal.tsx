import React, { useEffect, useRef } from "react";
import {
  X,
  Eye,
  Type,
  Sparkles,
  PhoneCall,
  RotateCcw,
  Check,
  Keyboard,
  HelpCircle,
  Minimize2,
} from "lucide-react";
import { useAccessibility, TextSize } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const AccessibilityModal: React.FC = () => {
  const {
    isHelpModalOpen,
    closeHelpModal,
    textSize,
    setTextSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    resetAll,
  } = useAccessibility();

  const { t, language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isHelpModalOpen) return;

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeHelpModal();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHelpModalOpen, closeHelpModal]);

  if (!isHelpModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeHelpModal();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-dialog-title"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-container border-2 border-primary/30 shadow-2xl p-6 sm:p-8 space-y-6 text-foreground"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t("a11y.toolbarLabel")}</span>
            </div>
            <h2
              id="a11y-dialog-title"
              className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight"
            >
              {t("a11y.dialogTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("a11y.dialogIntro")}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeHelpModal}
            className="rounded-full p-2 bg-surface-high hover:bg-surface-highest text-foreground transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
            aria-label={t("a11y.close")}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Section 1: Text Sizing Controls */}
        <section aria-labelledby="a11y-text-size-heading" className="space-y-3">
          <h3
            id="a11y-text-size-heading"
            className="font-headline text-base sm:text-lg font-bold flex items-center gap-2"
          >
            <Type className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>{t("a11y.textSize")}</span>
          </h3>

          <div
            role="radiogroup"
            aria-label={t("a11y.textSize")}
            className="grid grid-cols-3 gap-3"
          >
            {(
              [
                { id: "normal", label: t("a11y.normal"), iconText: "A", desc: "100%" },
                { id: "large", label: t("a11y.large"), iconText: "A+", desc: "112.5%" },
                { id: "xl", label: t("a11y.extraLarge"), iconText: "A++", desc: "125%" },
              ] as const
            ).map((opt) => {
              const isSelected = textSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setTextSize(opt.id as TextSize)}
                  className={`min-h-[56px] rounded-2xl p-3 border text-center transition-all flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-md"
                      : "bg-surface-high hover:bg-surface-highest border-border text-foreground"
                  }`}
                >
                  <span className="font-headline text-lg sm:text-xl font-extrabold">
                    {opt.iconText}
                  </span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground italic">
            {language === "hi"
              ? "अक्षर आकार बदलने से पूरी ऐप में टेक्स्ट का आकार स्वतः बड़ा हो जाता है।"
              : "Adjusting text size scales all typography and buttons proportionally across every page."}
          </p>
        </section>

        {/* Section 2: Visual Contrast & Motion Toggles */}
        <section aria-labelledby="a11y-contrast-heading" className="space-y-3 pt-4 border-t border-border/50">
          <h3
            id="a11y-contrast-heading"
            className="font-headline text-base sm:text-lg font-bold flex items-center gap-2"
          >
            <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>{t("a11y.contrast")}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* High Contrast Toggle */}
            <button
              type="button"
              aria-pressed={highContrast}
              onClick={toggleHighContrast}
              className={`min-h-[64px] p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
                highContrast
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-md"
                  : "bg-surface-high hover:bg-surface-highest border-border text-foreground"
              }`}
            >
              <div>
                <p className="font-bold text-sm">
                  {highContrast ? t("a11y.highContrastEnabled") : t("a11y.toggleHighContrast")}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  {language === "hi"
                    ? "गहरा काला बैकग्राउंड और स्पष्ट सफेद टेक्स्ट"
                    : "Deep black background with crisp white text"}
                </p>
              </div>
              <div
                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                  highContrast ? "border-primary-foreground bg-primary-foreground text-primary" : "border-border"
                }`}
                aria-hidden="true"
              >
                {highContrast && <Check className="h-4 w-4" />}
              </div>
            </button>

            {/* Reduced Motion Toggle */}
            <button
              type="button"
              aria-pressed={reducedMotion}
              onClick={toggleReducedMotion}
              className={`min-h-[64px] p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${
                reducedMotion
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-md"
                  : "bg-surface-high hover:bg-surface-highest border-border text-foreground"
              }`}
            >
              <div>
                <p className="font-bold text-sm">{t("a11y.reduceMotion")}</p>
                <p className="text-xs opacity-80 mt-0.5">{t("a11y.reduceMotionDesc")}</p>
              </div>
              <div
                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                  reducedMotion ? "border-primary-foreground bg-primary-foreground text-primary" : "border-border"
                }`}
                aria-hidden="true"
              >
                {reducedMotion && <Check className="h-4 w-4" />}
              </div>
            </button>
          </div>
        </section>

        {/* Section 3: Keyboard Navigation Quick Reference */}
        <section aria-labelledby="a11y-keyboard-heading" className="space-y-3 pt-4 border-t border-border/50">
          <h3
            id="a11y-keyboard-heading"
            className="font-headline text-base sm:text-lg font-bold flex items-center gap-2"
          >
            <Keyboard className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>{t("a11y.keyboardGuideTitle")}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-xl bg-surface-high p-3 border border-border/50">
              <span className="font-bold text-primary mr-1.5 font-mono px-1.5 py-0.5 rounded bg-surface-highest">
                Tab / Shift+Tab
              </span>
              <span className="text-muted-foreground">{t("a11y.keyboardTab")}</span>
            </div>
            <div className="rounded-xl bg-surface-high p-3 border border-border/50">
              <span className="font-bold text-primary mr-1.5 font-mono px-1.5 py-0.5 rounded bg-surface-highest">
                Enter / Space
              </span>
              <span className="text-muted-foreground">{t("a11y.keyboardEnter")}</span>
            </div>
            <div className="rounded-xl bg-surface-high p-3 border border-border/50">
              <span className="font-bold text-primary mr-1.5 font-mono px-1.5 py-0.5 rounded bg-surface-highest">
                Escape (Esc)
              </span>
              <span className="text-muted-foreground">{t("a11y.keyboardEsc")}</span>
            </div>
            <div className="rounded-xl bg-surface-high p-3 border border-border/50">
              <span className="font-bold text-primary mr-1.5 font-mono px-1.5 py-0.5 rounded bg-surface-highest">
                Skip Link
              </span>
              <span className="text-muted-foreground">{t("a11y.skipLinkGuide")}</span>
            </div>
          </div>
        </section>

        {/* Section 4: Phone Helpline Assistance */}
        <section
          aria-labelledby="a11y-helpline-heading"
          className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-4 space-y-2 text-xs text-emerald-200"
        >
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            <h3 id="a11y-helpline-heading">{t("a11y.phoneAssistanceTitle")}</h3>
          </div>
          <p className="leading-relaxed">{t("a11y.phoneAssistanceDesc")}</p>
          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 font-bold text-xs transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 mt-1 min-h-[44px]"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            <span>{t("a11y.callHelpline")}</span>
          </a>
        </section>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50">
          <button
            type="button"
            onClick={resetAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface-high hover:bg-surface-highest text-muted-foreground hover:text-foreground px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary min-h-[44px]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{t("a11y.reset")}</span>
          </button>

          <button
            type="button"
            onClick={closeHelpModal}
            className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-sm font-bold shadow-md transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary min-h-[44px]"
          >
            {t("a11y.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityModal;
