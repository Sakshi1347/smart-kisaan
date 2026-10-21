import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-4xl font-bold font-headline">404</h1>
        <p className="mb-2 text-xl font-semibold text-foreground">{t("notFound.title")}</p>
        <p className="mb-6 text-sm text-muted-foreground">{t("notFound.desc")}</p>
        <Link
          to="/"
          className="inline-flex min-h-12 items-center justify-center rounded-xl gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm hover:opacity-95"
        >
          {t("notFound.returnHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
