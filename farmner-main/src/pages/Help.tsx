import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { REQUIRED_DOCS } from "@/lib/documentRequirements";

const Help = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  const commonDocs = REQUIRED_DOCS.Agriculture ?? [];

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen pt-20">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
      >
        {t("home.skipLink")}
      </a>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-8 md:px-8 focus:outline-none">
        <Link
          to="/"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-primary"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
          {t("help.backHome")}
        </Link>

        <h1 className="mb-4 font-headline text-3xl font-extrabold md:text-4xl">{t("help.title")}</h1>
        <p className="mb-8 text-lg leading-relaxed text-on-surface-variant">{t("help.intro")}</p>

        <ol className="mb-10 space-y-4">
          {[
            { title: t("help.step1"), desc: t("help.step1Desc") },
            { title: t("help.step2"), desc: t("help.step2Desc") },
            { title: t("help.step3"), desc: t("help.step3Desc") },
            { title: t("help.step4"), desc: t("help.step4Desc") },
          ].map((step) => (
            <li key={step.title} className="rounded-3xl bg-surface-container p-5 ghost-border">
              <p className="font-headline text-xl font-bold">{step.title}</p>
              <p className="mt-2 text-base leading-relaxed text-on-surface-variant">{step.desc}</p>
            </li>
          ))}
        </ol>

        <section id="documents" className="scroll-mt-28 rounded-3xl bg-surface-container p-6 ghost-border">
          <h2 className="mb-2 font-headline text-2xl font-bold">{t("help.docsTitle")}</h2>
          <p className="mb-4 text-base leading-relaxed text-on-surface-variant">{t("help.docsIntro")}</p>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-lg">
            {commonDocs.map((doc) => (
              <li key={doc.en}>{language === "hi" ? doc.hi : doc.en}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/documents"
              className="inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-headline font-bold gradient-primary text-primary-foreground"
            >
              {language === "hi" ? "इंटरैक्टिव दस्तावेज़ चेकलिस्ट खोलें" : "Open Interactive Document Checklist"}
            </Link>
            <Link
              to="/schemes"
              className="inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-headline font-bold bg-surface-high hover:bg-surface-highest ghost-border text-foreground"
            >
              {t("help.openSchemes")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
