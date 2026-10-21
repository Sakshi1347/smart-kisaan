import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  FileText,
  HelpCircle,
  Leaf,
  PhoneCall,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import Footer from "@/components/Footer";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  speakSmartKisaanAudio,
  stopSpeech,
  isSpeechSynthesisSupported,
} from "@/lib/speechSynthesisHelper";

const Landing = () => {
  const { t, language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);

  // Stop any active speech synthesis
  const handleStopSpeech = () => {
    cancelSpeechRef.current?.();
    cancelSpeechRef.current = null;
    stopSpeech();
    setIsSpeaking(false);
    setSpeechStatus(null);
  };

  // Browser speech synthesis audio guide (accessible fallback without external APIs)
  const handleToggleSpeech = () => {
    if (!isSpeechSynthesisSupported()) {
      setSpeechStatus(t("home.audioNotSupported"));
      return;
    }

    if (isSpeaking) {
      handleStopSpeech();
      return;
    }

    const textHi = `${t("home.title")}। ${t("home.welcome")}। ${t("home.choose")}। पहला: सरकारी योजनाएँ, खेती की योजनाएँ देखें। दूसरा: पात्रता देखें, अपनी जानकारी भरें। तीसरा: ज़रूरी कागज़, आधार और ज़मीन के कागज़ देखें। चौथा: फसल बीमारी जाँच, पत्ती की फोटो से रोग पहचानें। पाँचवाँ: मदद और कैसे चलाएँ, ऐप चलाने के आसान चरण।`;

    const textHiPhonetic = "Namaste. Smart Kisaan mein aapka swagat hai. Kripya apna vikalp chuniye. Number 1: Sarkari yojana - kheti ki schemes dekhein. Number 2: Patrata jaanch - apni eligibility check karein. Number 3: Zaroori dastavez - Aadhaar aur zameen ke kagaz dekhein. Number 4: Fasal bimari jaanch - patti ki photo se bimari pehchanein. Number 5: Madad aur helpline - 1800 180 1551 par call karein.";

    const textEn = `${t("home.title")}. ${t("home.welcome")}. ${t("home.choose")}. Option 1: Government Schemes, explore available farm schemes. Option 2: Check Eligibility, find schemes that fit you. Option 3: Required Documents, see papers like Aadhaar and land records. Option 4: Crop Disease Detection, scan leaf health. Option 5: Help and How to Use, simple guidance.`;

    cancelSpeechRef.current = speakSmartKisaanAudio({
      textHi,
      textHiPhonetic,
      textEn,
      language,
      rate: 0.86,
      onStart: () => {
        setIsSpeaking(true);
        setSpeechStatus(t("home.audioPlaying"));
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeechStatus(null);
        cancelSpeechRef.current = null;
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeechStatus(null);
        cancelSpeechRef.current = null;
      },
      onVoiceSelected: (info) => {
        if (language === "hi") {
          setSpeechStatus(
            info.isNativeHindi
              ? `${t("home.audioPlaying")} (प्राकृतिक आवाज़)`
              : `${t("home.audioPlaying")} (सुझाव: बेहतर आवाज़ हेतु Edge में खोलें)`
          );
        } else {
          setSpeechStatus(t("home.audioPlaying"));
        }
      },
    });
  };

  // Cancel speech on component unmount
  useEffect(() => {
    return () => {
      cancelSpeechRef.current?.();
      stopSpeech();
    };
  }, []);

  const actions = [
    {
      id: "schemes",
      number: "1",
      to: "/schemes",
      available: true,
      icon: ScrollText,
      iconColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/30",
      title: t("home.schemes"),
      desc: t("home.schemesDesc"),
      badge: t("home.availableBadge"),
    },
    {
      id: "eligibility",
      number: "2",
      to: "/eligibility",
      available: true,
      icon: ShieldCheck,
      iconColor: "text-blue-400 bg-blue-500/15 border-blue-500/30",
      badgeColor: "bg-blue-950/80 text-blue-300 border-blue-500/30",
      title: t("home.eligibility"),
      desc: t("home.eligibilityDesc"),
      badge: t("home.availableBadge"),
    },
    {
      id: "documents",
      number: "3",
      to: "/documents",
      available: true,
      icon: FileText,
      iconColor: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      badgeColor: "bg-amber-950/80 text-amber-300 border-amber-500/30",
      title: t("home.documents"),
      desc: t("home.documentsDesc"),
      badge: t("home.availableBadge"),
    },
    {
      id: "crop",
      number: "4",
      to: "/crop-disease",
      available: true,
      icon: Leaf,
      iconColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/30",
      title: t("home.crop"),
      desc: t("home.cropDesc"),
      badge: t("home.availableBadge"),
    },
    {
      id: "help",
      number: "5",
      to: "/help",
      available: true,
      icon: HelpCircle,
      iconColor: "text-teal-400 bg-teal-500/15 border-teal-500/30",
      badgeColor: "bg-teal-950/80 text-teal-300 border-teal-500/30",
      title: t("home.help"),
      desc: t("home.helpDesc"),
      badge: t("home.availableBadge"),
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* WCAG 2.4.1 Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
      >
        {t("home.skipLink")}
      </a>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-8 md:pt-10 focus:outline-none"
      >
        {/* Welcome Header */}
        <header className="mb-8 md:mb-10 rounded-3xl bg-surface-container p-6 md:p-8 ghost-border shadow-lg">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t("home.portalBadge")}</span>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <img
                src="/brand/smart-kisaan-mark.svg"
                alt="Smart Kisaan logo"
                className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-2xl bg-surface-high/60 p-2 object-contain ghost-border"
              />
              <div>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary md:text-5xl">
                  {t("home.title")}
                </h1>
                <p className="mt-1 text-sm md:text-base font-semibold text-accent">
                  {t("home.tagline")}
                </p>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="shrink-0 self-start">
              <LanguageToggle />
            </div>
          </div>

          {/* Welcome Message & Prompt */}
          <div className="mt-6 border-t border-outline-variant/20 pt-6">
            <p className="max-w-3xl text-lg md:text-xl font-medium leading-relaxed text-foreground">
              {t("home.welcome")}
            </p>
            <p className="mt-2 text-base md:text-lg text-on-surface-variant">
              {t("home.choose")}
            </p>

            {/* Audio Guidance Control */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSpeech}
                aria-pressed={isSpeaking}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-2xl bg-surface-highest/80 hover:bg-surface-high border border-outline-variant/30 px-5 py-3 text-sm md:text-base font-bold text-foreground transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
              >
                {isSpeaking ? (
                  <VolumeX className="h-5 w-5 text-destructive" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
                )}
                <span>{isSpeaking ? t("home.audioStop") : t("home.audioGuide")}</span>
              </button>

              {speechStatus && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2.5 text-xs md:text-sm text-foreground"
                >
                  <Volume2 className="h-4 w-4 shrink-0 text-primary animate-pulse" aria-hidden="true" />
                  <span>{speechStatus}</span>
                </div>
              )}
            </div>

            {/* Helpful tip for authentic Hindi voice */}
            {language === "hi" && (
              <p className="mt-3 text-xs text-on-surface-variant flex items-center gap-1.5">
                <span aria-hidden="true">💡</span>
                <span>
                  प्राकृतिक हिन्दी आवाज़ के लिए Microsoft Edge में खोलें या Windows Settings में &quot;Hindi Speech&quot; जोड़ें।
                </span>
              </p>
            )}
          </div>
        </header>

        {/* Main 5 Action Cards Section */}
        <section aria-labelledby="main-actions-heading" className="mb-12">
          <div className="mb-6">
            <h2
              id="main-actions-heading"
              className="font-headline text-2xl md:text-3xl font-extrabold text-foreground"
            >
              {t("home.mainActions")}
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              {t("home.mainActionsDesc")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              if (!action.available) {
                // Honest, clearly disabled placeholder card for Crop Disease Detection
                return (
                  <div
                    key={action.id}
                    role="region"
                    aria-label={`${action.title}: ${action.desc} - ${action.badge}`}
                    aria-disabled="true"
                    tabIndex={0}
                    className="flex min-h-[175px] flex-col justify-between rounded-3xl border-2 border-dashed border-outline-variant/40 bg-surface-container/60 p-6 text-left opacity-80 cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-highest text-xs font-extrabold text-on-surface-variant"
                            aria-hidden="true"
                          >
                            {action.number}
                          </span>
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${action.iconColor}`}
                          >
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${action.badgeColor}`}
                        >
                          {action.badge}
                        </span>
                      </div>

                      <h3 className="font-headline text-xl font-bold leading-snug text-foreground md:text-2xl">
                        {action.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                        {action.desc}
                      </p>
                      {action.disabledNotice && (
                        <p className="mt-2 text-xs italic text-zinc-400">
                          {action.disabledNotice}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 rounded-full">
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t("home.cropSoon")}</span>
                      </span>
                    </div>
                  </div>
                );
              }

              // Active, accessible action link card
              return (
                <Link
                  key={action.id}
                  to={action.to!}
                  aria-label={`${action.title}: ${action.desc}`}
                  className="group flex min-h-[175px] flex-col justify-between rounded-3xl border border-outline-variant/25 bg-surface-container p-6 text-left shadow-md transition-all hover:bg-surface-high hover:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-highest text-xs font-extrabold text-primary"
                          aria-hidden="true"
                        >
                          {action.number}
                        </span>
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${action.iconColor} transition-transform group-hover:scale-105`}
                        >
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${action.badgeColor}`}
                      >
                        {action.badge}
                      </span>
                    </div>

                    <h3 className="font-headline text-xl font-bold leading-snug text-foreground md:text-2xl group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-sm md:text-base leading-relaxed text-on-surface-variant">
                      {action.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="font-headline text-sm font-bold text-primary group-hover:underline">
                      {t("home.open")} <span aria-hidden="true">→</span>
                    </span>
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3-Step Simple Guide for Low-Literacy / Illiterate Farmers */}
        <section
          aria-labelledby="quick-steps-heading"
          className="mb-12 rounded-3xl bg-surface-container/60 p-6 md:p-8 ghost-border"
        >
          <div className="mb-6">
            <h2
              id="quick-steps-heading"
              className="font-headline text-2xl md:text-3xl font-extrabold text-foreground"
            >
              {t("home.quickStepsTitle")}
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              {t("home.quickStepsSubtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col gap-3 rounded-2xl bg-surface-high/60 p-5 ghost-border">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-headline text-lg font-extrabold text-primary"
                  aria-hidden="true"
                >
                  1
                </span>
                <Search className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-headline text-lg font-bold text-foreground">
                {t("home.step1Title")}
              </h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {t("home.step1Desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3 rounded-2xl bg-surface-high/60 p-5 ghost-border">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-headline text-lg font-extrabold text-primary"
                  aria-hidden="true"
                >
                  2
                </span>
                <FileText className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <h3 className="font-headline text-lg font-bold text-foreground">
                {t("home.step2Title")}
              </h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {t("home.step2Desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3 rounded-2xl bg-surface-high/60 p-5 ghost-border">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-headline text-lg font-extrabold text-primary"
                  aria-hidden="true"
                >
                  3
                </span>
                <ShieldCheck className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="font-headline text-lg font-bold text-foreground">
                {t("home.step3Title")}
              </h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {t("home.step3Desc")}
              </p>
            </div>
          </div>
        </section>

        {/* Kisan Call Center Toll-Free Helpline Support Card */}
        <aside
          aria-labelledby="helpline-heading"
          className="mb-12 rounded-3xl bg-surface-container p-6 md:p-8 border border-primary/25 shadow-lg"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary"
                aria-hidden="true"
              >
                <PhoneCall className="h-7 w-7" />
              </div>
              <div>
                <h2
                  id="helpline-heading"
                  className="font-headline text-xl md:text-2xl font-extrabold text-foreground"
                >
                  {t("home.helplineTitle")}
                </h2>
                <p className="mt-1 text-sm md:text-base text-on-surface-variant">
                  {t("home.helplineDesc")}
                </p>
                <p className="mt-1 font-headline text-2xl font-bold tracking-wide text-primary">
                  {t("home.helplineNumber")}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {t("home.helplineTiming")}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="tel:18001801551"
                className="inline-flex min-h-12 w-full md:w-auto items-center justify-center gap-2 rounded-2xl px-6 py-3 font-headline font-bold text-base gradient-primary text-primary-foreground shadow-md transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`${t("home.helplineCall")}: 1800-180-1551`}
              >
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
                <span>{t("home.helplineCall")}</span>
              </a>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
