import { useMemo } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApplicationCopilotPanel from "@/components/ApplicationCopilotPanel";
import FarmerProfileCard from "@/components/FarmerProfileCard";
import Footer from "@/components/Footer";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useDocumentReadiness } from "@/hooks/useDocumentReadiness";
import { useSchemes } from "@/hooks/useSchemes";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  buildLocalizedSchemeDescription,
  buildLocalizedSchemeTitle,
  localizeSchemeBenefit,
  localizeSchemeCategory,
  localizeSchemeState,
} from "@/lib/schemeLanguage";

const SchemeDetails = () => {
  const { schemeId } = useParams();
  const { t, language } = useLanguage();
  const { data: schemes = [], isLoading } = useSchemes();
  const { profile, saveProfile, isSaving } = useFarmerProfile(language);

  const copy = useMemo(
    () =>
      language === "hi"
        ? {
            notFoundTitle: "योजना नहीं मिली",
            notFoundDesc:
              "मांगी गई योजना का विवरण लोड नहीं हो सका। कृपया योजना सूची पर वापस जाकर फिर से प्रयास करें।",
            backToSchemes: "योजनाओं पर वापस",
            quickActions: "त्वरित कार्रवाई",
            officialWebsite: "आधिकारिक पोर्टल पर जाएँ",
            officialWebsiteNotice: "आधिकारिक सरकारी वेबसाइट नई विंडो में खुलेगी",
            eligibility: "सत्यापित पात्रता शर्तें",
            eligibilityFallback: "इस योजना के लिए अभी पात्रता विवरण उपलब्ध नहीं है।",
            snapshot: "योजना स्नैपशॉट",
            maxBenefit: "अधिकतम लाभ",
            applicationDeadline: "आवेदन अंतिम तिथि",
            ministry: "मंत्रालय / विभाग",
            notSpecified: "निर्दिष्ट नहीं",
            openOrNotSpecified: "खुला है या निरंतर जारी",
            benefits: "योजना के मुख्य लाभ",
            benefitsFallback: "इस योजना के लिए अभी लाभ विवरण उपलब्ध नहीं है।",
            requiredDocs: "आवश्यक दस्तावेज़",
            requiredDocsSubtitle: "आवेदन सत्यापन के लिए आधिकारिक रूप से निर्धारित दस्तावेज़",
            verificationNote: "आधिकारिक सत्यापन एवं राज्य नियम",
          }
        : {
            notFoundTitle: "Scheme not found",
            notFoundDesc:
              "The requested scheme details could not be loaded. Please go back to the scheme directory and try again.",
            backToSchemes: "Back to schemes",
            quickActions: "Official Application",
            officialWebsite: "Visit Official Portal",
            officialWebsiteNotice: "Opens official government website in a new tab",
            eligibility: "Verified Eligibility Criteria",
            eligibilityFallback: "Eligibility details are not available yet for this scheme.",
            snapshot: "Program Snapshot",
            maxBenefit: "Maximum benefit",
            applicationDeadline: "Application deadline",
            ministry: "Ministry / Authority",
            notSpecified: "Not specified",
            openOrNotSpecified: "Open or ongoing",
            benefits: "Key Benefits",
            benefitsFallback: "Benefit details are not available yet for this scheme.",
            requiredDocs: "Required Documents",
            requiredDocsSubtitle: "Documents officially required to apply for this scheme",
            verificationNote: "Official Verification & Local Rules",
          },
    [language],
  );

  const scheme = schemes.find((entry) => entry.id === schemeId);
  const readiness = useDocumentReadiness(
    scheme?.id ?? schemeId ?? "unknown-scheme",
    scheme?.category ?? "General",
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
        >
          {t("home.skipLink")}
        </a>
        <main id="main-content" tabIndex={-1} role="status" className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="sr-only">
            {language === "hi" ? "योजना विवरण लोड हो रहा है..." : "Loading scheme details..."}
          </span>
        </main>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-6">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
        >
          {t("home.skipLink")}
        </a>
        <main id="main-content" tabIndex={-1} className="text-center max-w-lg">
          <h1 className="font-headline font-bold text-3xl mb-3">{copy.notFoundTitle}</h1>
          <p className="text-on-surface-variant mb-6">{copy.notFoundDesc}</p>
          <Link
            to="/schemes"
            className="gradient-primary text-primary-foreground font-medium px-6 py-3 rounded-lg inline-flex items-center gap-2 min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4" />
            {copy.backToSchemes}
          </Link>
        </main>
      </div>
    );
  }

  const displayTitle = buildLocalizedSchemeTitle(
    scheme.title,
    scheme.category,
    scheme.state,
    language,
    scheme.title_hi,
  );

  const displayDescription = buildLocalizedSchemeDescription(
    scheme.description,
    scheme.category,
    scheme.state,
    scheme.benefit_type,
    scheme.max_benefit,
    language,
    scheme.description_hi,
  );

  const displayEligibility =
    language === "hi" && scheme.eligibility_hi
      ? scheme.eligibility_hi
      : scheme.eligibility || copy.eligibilityFallback;

  const displayBenefits =
    language === "hi" && scheme.benefits_hi
      ? scheme.benefits_hi
      : scheme.benefits || [];

  const displayDocs =
    language === "hi" && scheme.documents_hi
      ? scheme.documents_hi
      : scheme.documents || [];

  const displayVerificationNote =
    language === "hi" && scheme.verification_note_hi
      ? scheme.verification_note_hi
      : scheme.verification_note;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 md:px-10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
      >
        {t("home.skipLink")}
      </a>

      <main id="main-content" tabIndex={-1} className="max-w-5xl mx-auto py-8 focus:outline-none">
        <Link
          to="/schemes"
          className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5 mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{copy.backToSchemes}</span>
        </Link>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container rounded-3xl p-6 md:p-8 ghost-border mb-8 shadow-sm"
        >
          <div className="flex flex-wrap gap-2 mb-4 items-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent">
              {localizeSchemeCategory(scheme.category, language)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {localizeSchemeState(scheme.state, language)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-highest text-on-surface-variant">
              {localizeSchemeBenefit(scheme.benefit_type, language)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("schemes.verifiedBadge")}</span>
            </span>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight mb-2 text-foreground">
                {displayTitle}
              </h1>
              {language === "hi" && (
                <p className="mb-3 text-xs sm:text-sm text-on-surface-variant font-mono">
                  {scheme.title}
                </p>
              )}
              <p className="text-on-surface-variant text-base leading-relaxed">
                {displayDescription}
              </p>
            </div>

            {scheme.website_url && (
              <div className="w-full lg:max-w-sm bg-surface-high rounded-2xl p-5 border border-outline-variant/15 flex flex-col gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
                    {copy.quickActions}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {copy.officialWebsiteNotice}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to={`/eligibility?scheme=${scheme.id}`}
                    className="w-full gradient-primary text-primary-foreground rounded-xl px-4 py-3 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 shadow"
                  >
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>{language === "hi" ? "इस योजना की पात्रता जाँचें" : "Check Eligibility for this Scheme"}</span>
                  </Link>

                  <a
                    href={scheme.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-surface-highest hover:bg-surface-container text-foreground ghost-border rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 shadow transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                    <span>{copy.officialWebsite}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Eligibility and Program Snapshot */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-surface-container rounded-3xl p-6 ghost-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <h2 className="font-headline font-bold text-xl text-foreground">
                {copy.eligibility}
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {displayEligibility}
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container rounded-3xl p-6 ghost-border"
          >
            <h2 className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold mb-4">
              {copy.snapshot}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">{copy.maxBenefit}</p>
                <p className="text-sm font-bold text-emerald-400">
                  {scheme.max_benefit || copy.notSpecified}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">{copy.applicationDeadline}</p>
                <p className="text-sm font-semibold text-foreground">
                  {scheme.application_deadline || copy.openOrNotSpecified}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant mb-1">{copy.ministry}</p>
                <p className="text-sm font-semibold text-foreground">
                  {scheme.ministry || copy.notSpecified}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Required Documents Section */}
        {displayDocs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.11 }}
            className="bg-surface-container rounded-3xl p-6 ghost-border mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 className="font-headline font-bold text-xl text-foreground">
                {copy.requiredDocs}
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              {copy.requiredDocsSubtitle}
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {displayDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface-high p-3.5 text-sm text-foreground flex items-center gap-2.5 border border-outline-variant/10"
                >
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-on-surface-variant">
                {language === "hi"
                  ? "तैयारी की निगरानी के लिए हमारी इंटरैक्टिव चेकलिस्ट का उपयोग करें"
                  : "Use our interactive checklist to track your document preparation"}
              </span>
              <Link
                to={`/eligibility?scheme=${scheme.id}&tab=documents`}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>{language === "hi" ? "दस्तावेज़ चेकलिस्ट खोलें" : "Open Document Checklist"}</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.section>
        )}

        {/* State / Official Verification Note */}
        {displayVerificationNote && (
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-amber-950/20 rounded-2xl p-4 border border-amber-500/25 mb-8 flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                {copy.verificationNote}
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {displayVerificationNote}
              </p>
            </div>
          </motion.aside>
        )}

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="bg-surface-container rounded-3xl p-6 ghost-border mb-8"
        >
          <h2 className="font-headline font-bold text-xl mb-4 text-foreground">
            {copy.benefits}
          </h2>
          {displayBenefits.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {displayBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface-high p-4 text-sm text-foreground flex items-start gap-2.5 border border-outline-variant/10"
                >
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">{copy.benefitsFallback}</p>
          )}
        </motion.section>

        {/* Farmer Profile Card Integration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mb-8"
        >
          <FarmerProfileCard
            language={language}
            profile={profile}
            isSaving={isSaving}
            title={language === "hi" ? "किसान प्रोफ़ाइल" : "Farmer profile"}
            subtitle={
              language === "hi"
                ? "प्रोफ़ाइल सेव करें — उसी से इस योजना की पात्रता स्कोर अपडेट होगा।"
                : "Save your profile once — Application Copilot uses it for eligibility on this scheme."
            }
            onSave={saveProfile}
          />
        </motion.div>

        {/* Application Readiness Copilot */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <ApplicationCopilotPanel
            scheme={scheme}
            profile={profile}
            readiness={readiness.summary}
            language={language}
          />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SchemeDetails;
