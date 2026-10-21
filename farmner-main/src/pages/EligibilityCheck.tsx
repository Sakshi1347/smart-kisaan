import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  Info,
  ChevronRight,
  ArrowLeft,
  Check,
  Phone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import {
  getAllEligibilityRuleSets,
  getEligibilityRuleSet,
  EligibilityResultStatus,
  EvaluationResult,
} from "@/lib/eligibilityRules";

const LOCAL_STORAGE_DOC_PREFIX = "smart_kisaan_docs_v1_";
const LOCAL_STORAGE_ANS_PREFIX = "smart_kisaan_elig_ans_v1_";

const EligibilityCheck: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const allSchemes = useMemo(() => getAllEligibilityRuleSets(), []);

  // Pre-select scheme from URL query param or default to first scheme
  const schemeParam = searchParams.get("scheme");
  const tabParam = searchParams.get("tab");
  const isDocsRoute = location.pathname.startsWith("/documents");

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(() => {
    if (schemeParam && allSchemes.some((s) => s.schemeId === schemeParam)) {
      return schemeParam;
    }
    return allSchemes[0]?.schemeId || "pm-kisan";
  });

  const [activeTab, setActiveTab] = useState<"eligibility" | "documents">(() => {
    return isDocsRoute || tabParam === "documents" ? "documents" : "eligibility";
  });

  // Track answers for current scheme: { [questionId]: optionId }
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_ANS_PREFIX}${selectedSchemeId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track checked documents for current scheme: { [docId]: boolean }
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_DOC_PREFIX}${selectedSchemeId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Keep scheme selection synced with URL parameter if it changes externally
  useEffect(() => {
    if (schemeParam && allSchemes.some((s) => s.schemeId === schemeParam)) {
      if (schemeParam !== selectedSchemeId) {
        setSelectedSchemeId(schemeParam);
      }
    }
  }, [schemeParam, allSchemes, selectedSchemeId]);

  useEffect(() => {
    if ((isDocsRoute || tabParam === "documents") && activeTab !== "documents") {
      setActiveTab("documents");
    } else if (tabParam === "eligibility" && activeTab !== "eligibility") {
      setActiveTab("eligibility");
    }
  }, [isDocsRoute, tabParam, activeTab]);

  // Load scheme answers & checklist from localStorage when selectedSchemeId changes
  useEffect(() => {
    try {
      const savedAns = localStorage.getItem(`${LOCAL_STORAGE_ANS_PREFIX}${selectedSchemeId}`);
      setAnswers(savedAns ? JSON.parse(savedAns) : {});
    } catch {
      setAnswers({});
    }

    try {
      const savedDocs = localStorage.getItem(`${LOCAL_STORAGE_DOC_PREFIX}${selectedSchemeId}`);
      setCheckedDocs(savedDocs ? JSON.parse(savedDocs) : {});
    } catch {
      setCheckedDocs({});
    }
  }, [selectedSchemeId]);

  const currentRuleSet = useMemo(() => {
    return getEligibilityRuleSet(selectedSchemeId) || allSchemes[0];
  }, [selectedSchemeId, allSchemes]);

  // Handle scheme change
  const handleSelectScheme = (newSchemeId: string) => {
    setSelectedSchemeId(newSchemeId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("scheme", newSchemeId);
      return next;
    });
  };

  // Handle tab switch
  const handleSelectTab = (tab: "eligibility" | "documents") => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    });
  };

  // Handle answering a question
  const handleAnswerChange = (questionId: string, optionId: string) => {
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_ANS_PREFIX}${selectedSchemeId}`,
        JSON.stringify(nextAnswers)
      );
    } catch {
      // ignore storage quotas
    }
  };

  // Reset eligibility answers
  const handleResetAnswers = () => {
    setAnswers({});
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_ANS_PREFIX}${selectedSchemeId}`);
    } catch {
      // ignore
    }
  };

  // Toggle document checklist item
  const handleToggleDoc = (docId: string) => {
    const nextChecked = { ...checkedDocs, [docId]: !checkedDocs[docId] };
    setCheckedDocs(nextChecked);
    try {
      localStorage.setItem(
        `${LOCAL_STORAGE_DOC_PREFIX}${selectedSchemeId}`,
        JSON.stringify(nextChecked)
      );
    } catch {
      // ignore
    }
  };

  // Reset document checklist
  const handleResetChecklist = () => {
    setCheckedDocs({});
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_DOC_PREFIX}${selectedSchemeId}`);
    } catch {
      // ignore
    }
  };

  // Calculate question progress & evaluation
  const totalQuestions = currentRuleSet?.questions.length || 0;
  const answeredCount = currentRuleSet
    ? currentRuleSet.questions.filter((q) => Boolean(answers[q.id])).length
    : 0;
  const allQuestionsAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const evaluationResult: EvaluationResult | null = useMemo(() => {
    if (!currentRuleSet || !allQuestionsAnswered) return null;
    return currentRuleSet.evaluate(answers);
  }, [currentRuleSet, answers, allQuestionsAnswered]);

  // Calculate document checklist stats
  const totalDocs = currentRuleSet?.documents.length || 0;
  const readyDocsCount = currentRuleSet
    ? currentRuleSet.documents.filter((d) => checkedDocs[d.id]).length
    : 0;
  const mandatoryDocs = currentRuleSet?.documents.filter((d) => d.isMandatory) || [];
  const allMandatoryReady =
    mandatoryDocs.length > 0 && mandatoryDocs.every((d) => checkedDocs[d.id]);
  const docProgressPct = totalDocs > 0 ? Math.round((readyDocsCount / totalDocs) * 100) : 0;

  return (
    <div className="min-h-screen pt-20 bg-background text-foreground flex flex-col justify-between">
      {/* Skip to Main Content Link for WCAG Keyboard Navigation */}
      <a
        href="#eligibility-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
      >
        {t("home.skipLink")}
      </a>

      <main id="eligibility-main-content" className="flex-1 px-4 sm:px-6 md:px-10 py-6 max-w-5xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant">
            <li>
              <Link
                to="/"
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                {t("nav.home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/schemes"
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                {t("nav.schemes")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-foreground" aria-current="page">
              {activeTab === "eligibility" ? t("nav.eligibility") : t("nav.documents")}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{language === "hi" ? "चरण 1: आधिकारिक नियम सत्यापन" : "Phase 1: Verified Official Rules"}</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-foreground mb-3">
            {t("eligibility.title")}
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
            {t("eligibility.subtitle")}
          </p>

          {/* Preliminary Guidance Disclaimer Alert */}
          <aside
            role="note"
            aria-label="Guidance disclaimer"
            className="mt-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">{t("eligibility.disclaimer")}</p>
          </aside>
        </header>

        {/* Scheme Selector */}
        <section
          aria-labelledby="scheme-selector-heading"
          className="bg-surface-container rounded-3xl p-5 sm:p-6 ghost-border mb-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2
                id="scheme-selector-heading"
                className="font-headline font-bold text-lg sm:text-xl text-foreground"
              >
                {t("eligibility.selectSchemeLabel")}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {language === "hi"
                  ? "5 सत्यापित राष्ट्रीय कृषि योजनाओं में से एक चुनें"
                  : "Choose one of 5 verified national agriculture schemes"}
              </p>
            </div>
            <Link
              to="/schemes"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{t("eligibility.exploreAllSchemes")}</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Scheme Selection Buttons Grid */}
          <div
            role="radiogroup"
            aria-label={t("eligibility.selectSchemeLabel")}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
          >
            {allSchemes.map((scheme) => {
              const isSelected = scheme.schemeId === selectedSchemeId;
              const displayName = language === "hi" ? scheme.schemeNameHi : scheme.schemeNameEn;
              return (
                <button
                  key={scheme.schemeId}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectScheme(scheme.schemeId)}
                  className={`min-h-[52px] p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${
                    isSelected
                      ? "bg-primary/15 border-primary text-foreground shadow-sm"
                      : "bg-surface-high border-outline-variant/15 text-on-surface-variant hover:text-foreground hover:bg-surface-highest"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-highest text-primary">
                      {scheme.shortCode}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      {scheme.category}
                    </span>
                  </div>
                  <span className="font-semibold text-xs sm:text-sm line-clamp-2">
                    {displayName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Feature Tab Switcher */}
        <div
          role="tablist"
          aria-label="Features"
          className="flex rounded-2xl bg-surface-container p-1.5 mb-8 ghost-border max-w-xl mx-auto"
        >
          <button
            type="button"
            role="tab"
            id="tab-eligibility"
            aria-selected={activeTab === "eligibility"}
            aria-controls="panel-eligibility"
            onClick={() => handleSelectTab("eligibility")}
            className={`flex-1 min-h-[48px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${
              activeTab === "eligibility"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-on-surface-variant hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>{t("eligibility.tabCheck")}</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-documents"
            aria-selected={activeTab === "documents"}
            aria-controls="panel-documents"
            onClick={() => handleSelectTab("documents")}
            className={`flex-1 min-h-[48px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${
              activeTab === "documents"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-on-surface-variant hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>{t("eligibility.tabDocs")}</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === "documents"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-surface-highest text-foreground"
              }`}
            >
              {totalDocs}
            </span>
          </button>
        </div>

        {/* Selected Scheme Summary Header */}
        {currentRuleSet && (
          <div className="bg-surface-container/70 border border-outline-variant/15 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                  {currentRuleSet.shortCode}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {currentRuleSet.category}
                </span>
              </div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-foreground">
                {language === "hi" ? currentRuleSet.schemeNameHi : currentRuleSet.schemeNameEn}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/schemes/${currentRuleSet.schemeId}`}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-high hover:bg-surface-highest text-foreground ghost-border inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              >
                <span>{t("common.viewDetails")}</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              <a
                href={currentRuleSet.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("eligibility.officialPortal")}: ${
                  language === "hi" ? currentRuleSet.schemeNameHi : currentRuleSet.schemeNameEn
                } ${t("eligibility.officialPortalAria")}`}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-high hover:bg-surface-highest text-foreground ghost-border inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
              >
                <span>{t("eligibility.officialPortal")}</span>
                <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 1: ELIGIBILITY CHECKER */}
        {activeTab === "eligibility" && (
          <section
            id="panel-eligibility"
            role="tabpanel"
            aria-labelledby="tab-eligibility"
            className="space-y-8"
          >
            {/* Questions Card */}
            <div className="bg-surface-container rounded-3xl p-5 sm:p-7 ghost-border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-outline-variant/10">
                <div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl text-foreground">
                    {t("eligibility.questionsHeading")}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t("eligibility.questionsSubtitle")}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-high text-foreground border border-outline-variant/15">
                    {t("eligibility.answeredCount")
                      .replace("{answered}", String(answeredCount))
                      .replace("{total}", String(totalQuestions))}
                  </span>
                  {answeredCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetAnswers}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/30 border border-rose-500/20 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t("eligibility.resetAnswers")}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {currentRuleSet.questions.map((q, qIndex) => {
                  const currentSelected = answers[q.id];
                  const questionText = language === "hi" ? q.questionHi : q.questionEn;
                  const helpText = language === "hi" ? q.helpTextHi : q.helpTextEn;

                  return (
                    <fieldset
                      key={q.id}
                      className="rounded-2xl p-4 sm:p-5 bg-surface-high/60 border border-outline-variant/15 focus-within:border-primary/50 transition-colors"
                    >
                      <legend className="font-headline font-bold text-sm sm:text-base text-foreground px-2 float-left w-full mb-2">
                        <span className="text-primary mr-2 font-extrabold">Q{qIndex + 1}.</span>
                        {questionText}
                      </legend>

                      {helpText && (
                        <p className="text-xs text-on-surface-variant clear-both mb-3 px-2">
                          {helpText}
                        </p>
                      )}

                      <div className="grid grid-cols-1 gap-2.5 clear-both mt-2">
                        {q.options.map((opt) => {
                          const isOptionSelected = currentSelected === opt.id;
                          const optLabel = language === "hi" ? opt.labelHi : opt.labelEn;
                          const optHint = language === "hi" ? opt.hintHi : opt.hintEn;
                          const inputId = `${currentRuleSet.schemeId}-${q.id}-${opt.id}`;

                          return (
                            <label
                              key={opt.id}
                              htmlFor={inputId}
                              className={`min-h-[50px] p-3.5 rounded-xl cursor-pointer border flex items-start gap-3 transition-all ${
                                isOptionSelected
                                  ? "bg-primary/15 border-primary text-foreground shadow-sm ring-1 ring-primary"
                                  : "bg-surface-container border-outline-variant/15 text-foreground hover:bg-surface-highest"
                              }`}
                            >
                              <input
                                type="radio"
                                id={inputId}
                                name={`${currentRuleSet.schemeId}-${q.id}`}
                                value={opt.id}
                                checked={isOptionSelected}
                                onChange={() => handleAnswerChange(q.id, opt.id)}
                                className="w-5 h-5 mt-0.5 text-primary border-outline-variant focus:ring-4 focus:ring-primary/40 shrink-0"
                              />
                              <div className="flex-1">
                                <div className="text-xs sm:text-sm font-semibold">{optLabel}</div>
                                {optHint && (
                                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                                    {optHint}
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  );
                })}
              </form>
            </div>

            {/* Assessment Result Section */}
            {allQuestionsAnswered && evaluationResult ? (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                aria-live="polite"
                aria-labelledby="result-title"
                className={`rounded-3xl p-6 sm:p-8 border shadow-lg ${
                  evaluationResult.status === "may_meet"
                    ? "bg-emerald-950/20 border-emerald-500/40 text-foreground"
                    : evaluationResult.status === "may_not_meet"
                    ? "bg-rose-950/20 border-rose-500/40 text-foreground"
                    : "bg-amber-950/20 border-amber-500/40 text-foreground"
                }`}
              >
                {/* Result Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {evaluationResult.status === "may_meet" && (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" aria-hidden="true" />
                      </div>
                    )}
                    {evaluationResult.status === "may_not_meet" && (
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-7 h-7 text-rose-400" aria-hidden="true" />
                      </div>
                    )}
                    {evaluationResult.status === "needs_verification" && (
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-7 h-7 text-amber-400" aria-hidden="true" />
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">
                        {t("eligibility.resultHeading")}
                      </span>
                      <h4
                        id="result-title"
                        className={`font-headline font-extrabold text-xl sm:text-2xl ${
                          evaluationResult.status === "may_meet"
                            ? "text-emerald-300"
                            : evaluationResult.status === "may_not_meet"
                            ? "text-rose-300"
                            : "text-amber-300"
                        }`}
                      >
                        {language === "hi" ? evaluationResult.titleHi : evaluationResult.titleEn}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-full border ${
                      evaluationResult.status === "may_meet"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                        : evaluationResult.status === "may_not_meet"
                        ? "bg-rose-950/60 text-rose-300 border-rose-500/40"
                        : "bg-amber-950/60 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {evaluationResult.status === "may_meet"
                      ? t("eligibility.stateMayMeet")
                      : evaluationResult.status === "may_not_meet"
                      ? t("eligibility.stateMayNotMeet")
                      : t("eligibility.stateNeedsVerification")}
                  </span>
                </div>

                {/* Explanation text */}
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 mb-6 bg-surface-high/40 p-4 rounded-2xl border border-outline-variant/10">
                  {language === "hi"
                    ? evaluationResult.explanationHi
                    : evaluationResult.explanationEn}
                </p>

                {/* Matched Criteria */}
                {evaluationResult.matchedCriteriaEn.length > 0 && (
                  <div className="mb-5">
                    <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      <span>{t("eligibility.criteriaMatched")}</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs sm:text-sm">
                      {(language === "hi"
                        ? evaluationResult.matchedCriteriaHi
                        : evaluationResult.matchedCriteriaEn
                      ).map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-foreground/90 bg-surface-high/40 px-3 py-2 rounded-xl"
                        >
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues or Verification Gaps */}
                {evaluationResult.issuesOrGapsEn.length > 0 && (
                  <div className="mb-5">
                    <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                      <span>{t("eligibility.criteriaIssues")}</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs sm:text-sm">
                      {(language === "hi"
                        ? evaluationResult.issuesOrGapsHi
                        : evaluationResult.issuesOrGapsEn
                      ).map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-foreground/90 bg-surface-high/40 px-3 py-2 rounded-xl"
                        >
                          <span className="text-amber-400 font-bold shrink-0">!</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {evaluationResult.nextStepsEn.length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span>{t("eligibility.nextSteps")}</span>
                    </h5>
                    <ol className="space-y-1.5 text-xs sm:text-sm">
                      {(language === "hi"
                        ? evaluationResult.nextStepsHi
                        : evaluationResult.nextStepsEn
                      ).map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-foreground/90 bg-surface-high/40 px-3 py-2 rounded-xl"
                        >
                          <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Action Buttons: View Checklist & Visit Official Portal */}
                <div className="pt-4 border-t border-outline-variant/15 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectTab("documents")}
                    className="min-h-[48px] px-5 py-3 rounded-xl font-bold text-xs sm:text-sm gradient-primary text-primary-foreground shadow-md inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>{t("eligibility.viewChecklistForScheme")}</span>
                  </button>

                  <a
                    href={currentRuleSet.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t("eligibility.officialPortal")}: ${
                      language === "hi" ? currentRuleSet.schemeNameHi : currentRuleSet.schemeNameEn
                    } ${t("eligibility.officialPortalAria")}`}
                    className="min-h-[48px] px-4 py-3 rounded-xl font-bold text-xs sm:text-sm bg-surface-highest hover:bg-surface-high text-foreground ghost-border inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                  >
                    <span>{t("eligibility.officialPortal")}</span>
                    <ExternalLink className="w-4 h-4 text-on-surface-variant" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleResetAnswers}
                    className="min-h-[48px] px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-on-surface-variant hover:text-foreground bg-surface-high hover:bg-surface-highest ghost-border inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>{t("eligibility.resetAnswers")}</span>
                  </button>
                </div>
              </motion.article>
            ) : (
              <div className="p-5 rounded-2xl bg-surface-container/60 border border-outline-variant/10 text-center text-on-surface-variant text-xs sm:text-sm">
                <Info className="w-5 h-5 mx-auto mb-2 text-primary opacity-80" aria-hidden="true" />
                <p>{t("eligibility.unansweredNote")}</p>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: REQUIRED DOCUMENTS CHECKLIST */}
        {activeTab === "documents" && (
          <section
            id="panel-documents"
            role="tabpanel"
            aria-labelledby="tab-documents"
            className="space-y-6"
          >
            {/* Checklist Header & Progress Box */}
            <div className="bg-surface-container rounded-3xl p-5 sm:p-7 ghost-border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-headline font-bold text-lg sm:text-xl text-foreground">
                    {t("checklist.heading")}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {t("checklist.subtitle")}
                  </p>
                </div>

                {readyDocsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetChecklist}
                    className="self-start sm:self-auto min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/30 border border-rose-500/20 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t("checklist.resetBtn")}</span>
                  </button>
                )}
              </div>

              {/* Offline/Tracking Disclaimer */}
              <div
                role="note"
                className="p-3.5 rounded-2xl bg-surface-high border border-outline-variant/15 text-xs text-on-surface-variant mb-6 flex items-start gap-2.5"
              >
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">{t("checklist.disclaimer")}</p>
              </div>

              {/* Progress Bar & Counter */}
              <div className="bg-surface-high/60 rounded-2xl p-4 border border-outline-variant/10 mb-6">
                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold mb-2">
                  <span className="text-foreground">{t("checklist.progressLabel")}</span>
                  <span className="text-primary font-bold">
                    {t("checklist.readyCount")
                      .replace("{ready}", String(readyDocsCount))
                      .replace("{total}", String(totalDocs))
                      .replace("{pct}", String(docProgressPct))}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={t("checklist.progressLabel")}
                  aria-valuenow={docProgressPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-full h-3 bg-surface-container rounded-full overflow-hidden border border-outline-variant/10"
                >
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                    style={{ width: `${docProgressPct}%` }}
                  />
                </div>

                {allMandatoryReady && (
                  <div className="mt-3 text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>{t("checklist.allMandatoryReady")}</span>
                  </div>
                )}
              </div>

              {/* Document List Items */}
              {currentRuleSet.documents.length > 0 ? (
                <div className="space-y-3">
                  {currentRuleSet.documents.map((doc, index) => {
                    const isChecked = Boolean(checkedDocs[doc.id]);
                    const docName = language === "hi" ? doc.nameHi : doc.nameEn;
                    const docGuidance = language === "hi" ? doc.guidanceHi : doc.guidanceEn;
                    const inputId = `doc-check-${currentRuleSet.schemeId}-${doc.id}`;

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isChecked
                            ? "bg-emerald-950/20 border-emerald-500/40"
                            : "bg-surface-high border-outline-variant/15"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <label
                            htmlFor={inputId}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer -m-2 p-2 shrink-0"
                          >
                            <input
                              type="checkbox"
                              id={inputId}
                              checked={isChecked}
                              onChange={() => handleToggleDoc(doc.id)}
                              className="w-5 h-5 rounded text-emerald-600 focus:ring-4 focus:ring-emerald-400/40 cursor-pointer"
                            />
                            <span className="sr-only">
                              {isChecked
                                ? language === "hi"
                                  ? `${docName} तैयार चिह्नित है`
                                  : `${docName} is marked ready`
                                : language === "hi"
                                ? `${docName} तैयार नहीं चिह्नित है`
                                : `${docName} is marked not ready`}
                            </span>
                          </label>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-on-surface-variant">
                                #{index + 1}
                              </span>
                              <span
                                className={`font-semibold text-xs sm:text-sm ${
                                  isChecked ? "line-through text-on-surface-variant" : "text-foreground"
                                }`}
                              >
                                {docName}
                              </span>

                              {doc.isMandatory ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30">
                                  {t("checklist.mandatoryBadge")}
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
                                  {t("checklist.conditionalBadge")}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              <span className="font-medium text-foreground/80">
                                {t("checklist.whyNeeded")}{" "}
                              </span>
                              {docGuidance}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-on-surface-variant text-xs py-8">
                  {t("checklist.empty")}
                </p>
              )}
            </div>

            {/* Helpline and Portal Assist Card */}
            <div className="bg-surface-container/80 rounded-2xl p-5 border border-outline-variant/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    {t("home.helplineTitle")}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    {t("home.helplineDesc")}
                  </div>
                </div>
              </div>

              <a
                href="tel:18001801551"
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30 inline-flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <span>{t("home.helplineNumber")}</span>
              </a>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EligibilityCheck;
