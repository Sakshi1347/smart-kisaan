import { useMemo, useState } from "react";
import {
  Search,
  Check,
  Loader2,
  ChevronRight,
  LayoutGrid,
  ShieldCheck,
  FileText,
  UserCheck,
  ExternalLink,
  X,
  Info,
  Building,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useSchemes, useSchemeCategories } from "@/hooks/useSchemes";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  localizeSchemeBenefit,
  localizeSchemeCategory,
  localizeSchemeState,
} from "@/lib/schemeLanguage";

const ALL_CATEGORIES = "ALL_CATEGORIES";
const ITEMS_PER_PAGE = 6;

const SchemeExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const { t, language } = useLanguage();
  const { data: schemes = [], isLoading } = useSchemes({
    category: selectedCategory,
    search: searchQuery || undefined,
  });
  const { data: categories = [] } = useSchemeCategories();

  const totalPages = Math.ceil(schemes.length / ITEMS_PER_PAGE) || 1;
  const paginatedSchemes = schemes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORIES);
    setPage(1);
  };

  const sidebarItems = [
    { icon: LayoutGrid, label: t("nav.schemes"), path: "/schemes" },
  ];

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Skip to Content for Screen Readers and Keyboard Navigation */}
      <a
        href="#schemes-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-24 focus:left-6 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-400"
      >
        {t("home.skipLink")}
      </a>

      {/* Responsive Sidebar for quick navigation */}
      <Sidebar
        title="Smart Kisaan"
        subtitle={language === "hi" ? "योजना सूची" : "Schemes Catalog"}
        items={sidebarItems}
      />

      <main id="schemes-main-content" className="flex-1 px-4 sm:px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header section with accessible titles and explanation */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{t("schemes.verifiedBadge")}</span>
                </div>
                <h1 className="font-headline font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground mb-2">
                  {t("schemes.pageHeading")}
                </h1>
                <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
                  {t("schemes.pageExplanation")}
                </p>
              </div>

              {/* View Mode Switcher (Grid / List) */}
              <div
                role="group"
                aria-label={language === "hi" ? "प्रदर्शन शैली चुनें" : "Choose view mode"}
                className="hidden sm:inline-flex bg-surface-container rounded-xl ghost-border p-1 self-start"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
                    viewMode === "grid"
                      ? "gradient-primary text-primary-foreground shadow"
                      : "text-on-surface-variant hover:text-foreground"
                  }`}
                >
                  {t("schemes.gridView")}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] min-w-[44px] inline-flex items-center justify-center ${
                    viewMode === "list"
                      ? "gradient-primary text-primary-foreground shadow"
                      : "text-on-surface-variant hover:text-foreground"
                  }`}
                >
                  {t("schemes.listView")}
                </button>
              </div>
            </div>

            {/* Live Search and Filter Controls */}
            <div className="bg-surface-container rounded-2xl p-4 sm:p-5 ghost-border space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Accessible Search Input */}
                <div className="relative flex-1">
                  <label htmlFor="scheme-search-input" className="sr-only">
                    {t("schemes.searchLabel")}
                  </label>
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
                    aria-hidden="true"
                  />
                  <input
                    id="scheme-search-input"
                    type="search"
                    placeholder={t("schemes.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-surface-highest pl-10 pr-10 py-3 rounded-xl text-sm text-foreground placeholder:text-on-surface-variant focus:outline-none focus:ring-4 focus:ring-primary/40 border border-outline-variant/15 min-h-[48px]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setPage(1);
                      }}
                      aria-label={t("schemes.clearSearch")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-on-surface-variant hover:text-foreground rounded-full hover:bg-surface-high transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Reset button if active search or category */}
                {(searchQuery || selectedCategory !== ALL_CATEGORIES) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-3 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-foreground bg-surface-high ghost-border inline-flex items-center justify-center gap-2 min-h-[48px] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t("schemes.resetFilters")}</span>
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="pt-2 border-t border-outline-variant/10">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider block mb-2">
                  {t("schemes.categoryLabel")}:
                </span>
                <div
                  role="tablist"
                  aria-label={t("schemes.categoryLabel")}
                  className="flex flex-wrap gap-2"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === ALL_CATEGORIES}
                    onClick={() => {
                      setSelectedCategory(ALL_CATEGORIES);
                      setPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] inline-flex items-center gap-1.5 ${
                      selectedCategory === ALL_CATEGORIES
                        ? "gradient-primary text-primary-foreground shadow"
                        : "bg-surface-highest text-on-surface-variant hover:text-foreground ghost-border"
                    }`}
                  >
                    <span>{t("schemes.allCategories")}</span>
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={selectedCategory === category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setPage(1);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] inline-flex items-center gap-1.5 ${
                        selectedCategory === category
                          ? "gradient-primary text-primary-foreground shadow"
                          : "bg-surface-highest text-on-surface-variant hover:text-foreground ghost-border"
                      }`}
                    >
                      <span>{localizeSchemeCategory(category, language)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count live status indicator */}
            <div
              role="status"
              aria-live="polite"
              className="mt-4 text-xs sm:text-sm text-on-surface-variant flex items-center justify-between"
            >
              <span>
                {t("schemes.showingResults")}{" "}
                <strong className="text-foreground font-semibold">{schemes.length}</strong>{" "}
                {t("schemes.verifiedSchemes")}
                {searchQuery ? ` (${language === "hi" ? "खोज परिणाम" : "matching query"})` : ""}
              </span>
            </div>
          </header>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center" aria-busy="true">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" aria-hidden="true" />
              <p className="text-sm text-on-surface-variant">
                {language === "hi" ? "योजनाएँ लोड हो रही हैं..." : "Loading verified schemes..."}
              </p>
            </div>
          ) : schemes.length === 0 ? (
            /* Empty State when no schemes match */
            <div
              role="region"
              aria-label={t("schemes.noResultsTitle")}
              className="bg-surface-container rounded-3xl p-8 sm:p-12 text-center ghost-border max-w-xl mx-auto my-8"
            >
              <div className="w-16 h-16 rounded-full bg-surface-highest flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
                <Search className="w-8 h-8 opacity-60" aria-hidden="true" />
              </div>
              <h2 className="font-headline font-bold text-2xl mb-2 text-foreground">
                {t("schemes.noResultsTitle")}
              </h2>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                {t("schemes.noResults")}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 shadow"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>{t("schemes.resetFilters")}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Scheme Cards Grid or List */}
              <div
                className={`grid ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                } gap-6 mb-8`}
              >
                {paginatedSchemes.map((scheme, index) => {
                  const displayTitle =
                    language === "hi" && scheme.title_hi ? scheme.title_hi : scheme.title;
                  const displayDescription =
                    language === "hi" && scheme.description_hi
                      ? scheme.description_hi
                      : scheme.description;
                  const displayEligibility =
                    language === "hi" && scheme.eligibility_hi
                      ? scheme.eligibility_hi
                      : scheme.eligibility;
                  const displayBenefits =
                    language === "hi" && scheme.benefits_hi
                      ? scheme.benefits_hi
                      : scheme.benefits || [];
                  const displayDocs =
                    language === "hi" && scheme.documents_hi
                      ? scheme.documents_hi
                      : scheme.documents || [];

                  return (
                    <motion.article
                      key={scheme.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      aria-labelledby={`scheme-title-${scheme.id}`}
                      className="bg-surface-container rounded-2xl p-6 ghost-border hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        {/* Badges */}
                        <div className="flex gap-2 flex-wrap mb-3.5 items-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            {localizeSchemeCategory(scheme.category, language)}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            {t("schemes.verifiedBadge")}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-highest text-on-surface-variant inline-flex items-center gap-1">
                            <Building className="w-3 h-3" aria-hidden="true" />
                            {localizeSchemeState(scheme.state, language)}
                          </span>
                        </div>

                        {/* Readable Title */}
                        <h2
                          id={`scheme-title-${scheme.id}`}
                          className="font-headline font-bold text-lg sm:text-xl mb-1 text-foreground leading-snug"
                        >
                          {displayTitle}
                        </h2>

                        {/* English short subtitle if viewing in Hindi for easy identification */}
                        {language === "hi" && (
                          <p className="text-xs text-on-surface-variant font-mono mb-3">
                            {scheme.title}
                          </p>
                        )}

                        {/* Brief plain-language description */}
                        <p className="text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-3">
                          {displayDescription}
                        </p>

                        {/* Max Benefit highlight box */}
                        {scheme.max_benefit && (
                          <div className="bg-surface-highest/60 rounded-xl p-3 mb-4 border border-outline-variant/10">
                            <span className="text-[11px] text-on-surface-variant block uppercase tracking-wider font-semibold">
                              {t("schemes.maxBenefit")}
                            </span>
                            <span className="text-sm font-bold text-emerald-400 block mt-0.5">
                              {scheme.max_benefit}
                            </span>
                          </div>
                        )}

                        {/* Key Benefits */}
                        <div className="mb-4">
                          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                            {t("schemes.keyBenefits")}
                          </h3>
                          <ul className="space-y-1.5" aria-label={t("schemes.keyBenefits")}>
                            {displayBenefits.slice(0, 2).map((benefit, bIdx) => (
                              <li
                                key={bIdx}
                                className="flex items-start gap-2 text-xs sm:text-sm text-foreground"
                              >
                                <Check
                                  className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Basic Verified Eligibility */}
                        <div className="mb-4">
                          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                            <span>{t("schemes.basicEligibility")}</span>
                          </h3>
                          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                            {displayEligibility}
                          </p>
                        </div>

                        {/* Required Documents */}
                        <div className="mb-4">
                          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                            <span>{t("schemes.requiredDocs")}</span>
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {displayDocs.slice(0, 3).map((doc, dIdx) => (
                              <span
                                key={dIdx}
                                className="text-[11px] bg-surface-highest text-foreground px-2 py-0.5 rounded-md border border-outline-variant/10"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Verification Note distinguishing general info vs state rules */}
                        {scheme.requires_local_confirmation && (
                          <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20 mb-4">
                            <Info
                              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400"
                              aria-hidden="true"
                            />
                            <span>
                              {language === "hi" && scheme.verification_note_hi
                                ? scheme.verification_note_hi
                                : scheme.verification_note || t("schemes.stateDependentNote")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-outline-variant/10 flex flex-col sm:flex-row gap-2">
                        <Link
                          to={`/schemes/${scheme.id}`}
                          className="flex-1 min-h-[48px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all gradient-primary text-primary-foreground inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                        >
                          <span>{t("schemes.viewDetails")}</span>
                          <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </Link>

                        <Link
                          to={`/eligibility?scheme=${scheme.id}`}
                          aria-label={`${t("nav.eligibility")} - ${displayTitle}`}
                          className="min-h-[48px] py-2.5 px-3 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                          <span>{t("nav.eligibility")}</span>
                        </Link>

                        {scheme.website_url && (
                          <a
                            href={scheme.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${displayTitle} — ${t("schemes.officialPortalAria")}`}
                            className="min-h-[48px] py-2.5 px-3 rounded-xl text-xs font-semibold text-foreground bg-surface-high hover:bg-surface-highest ghost-border inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 transition-colors"
                          >
                            <span>{t("schemes.officialPortal")}</span>
                            <ExternalLink
                              className="w-3.5 h-3.5 text-on-surface-variant"
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Accessible Pagination (if total schemes exceed ITEMS_PER_PAGE) */}
              {totalPages > 1 && (
                <nav
                  aria-label={language === "hi" ? "पृष्ठ संख्या" : "Pagination"}
                  className="flex items-center justify-center gap-2 mb-12"
                >
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    aria-label={language === "hi" ? "पिछला पृष्ठ" : "Previous page"}
                    className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl ghost-border text-on-surface-variant hover:text-foreground disabled:opacity-30 inline-flex items-center justify-center"
                  >
                    {"<"}
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNumber = idx + 1;
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        aria-current={page === pageNumber ? "page" : undefined}
                        className={`min-h-[44px] min-w-[44px] rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center ${
                          page === pageNumber
                            ? "gradient-primary text-primary-foreground shadow"
                            : "ghost-border text-on-surface-variant hover:text-foreground"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    aria-label={language === "hi" ? "अगला पृष्ठ" : "Next page"}
                    className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl ghost-border text-on-surface-variant hover:text-foreground disabled:opacity-30 inline-flex items-center justify-center"
                  >
                    {">"}
                  </button>
                </nav>
              )}
            </>
          )}

          {/* Official Redirection and Authenticity Disclaimer Banner */}
          <aside
            aria-label={t("schemes.disclaimerTitle")}
            className="bg-surface-high/60 rounded-2xl p-5 border border-outline-variant/15 flex items-start gap-3 mt-8 mb-4"
          >
            <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                {t("schemes.disclaimerTitle")}
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t("schemes.disclaimerText")}
              </p>
            </div>
          </aside>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default SchemeExplorer;
