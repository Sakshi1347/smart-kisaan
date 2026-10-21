import { Link, useLocation } from "react-router-dom";
import { HelpCircle, Home, Leaf, ScrollText, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import { PHASE1 } from "@/lib/phase1";

const Navbar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.schemes"), path: "/schemes" },
    { label: t("nav.eligibility"), path: "/eligibility" },
    { label: t("nav.crop"), path: "/crop-disease" },
    { label: t("nav.help"), path: "/help" },
    ...(PHASE1.authAndDashboard ? [{ label: t("nav.dashboard"), path: "/dashboard" }] : []),
  ];

  const mobileNavLinks = [
    { label: t("nav.home"), path: "/", icon: Home, match: (path: string) => path === "/" },
    {
      label: t("nav.schemes"),
      path: "/schemes",
      icon: ScrollText,
      match: (path: string) => path.startsWith("/schemes"),
    },
    {
      label: t("nav.eligibility"),
      path: "/eligibility",
      icon: ShieldCheck,
      match: (path: string) => path.startsWith("/eligibility") || path.startsWith("/documents"),
    },
    {
      label: t("nav.crop"),
      path: "/crop-disease",
      icon: Leaf,
      match: (path: string) => path.startsWith("/crop-disease"),
    },
    { label: t("nav.help"), path: "/help", icon: HelpCircle, match: (path: string) => path.startsWith("/help") },
  ];

  return (
    <>
      <nav aria-label="Main navigation" className="fixed top-0 z-50 flex h-20 w-full items-center justify-between gap-3 px-3 glass-panel md:px-8">
        <div className="flex min-w-0 items-center gap-3 md:gap-8">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 rounded-xl p-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Smart Kisaan - Home"
          >
            <img
              src="/brand/smart-kisaan-mark.svg"
              alt="Smart Kisaan"
              className="h-11 w-11 shrink-0 rounded-xl object-contain"
            />
            <span className="truncate font-headline text-xl font-extrabold tracking-tighter text-primary md:text-2xl">
              Smart Kisaan
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-2 py-1 font-headline font-bold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive ? "border-b-2 border-primary text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AccessibilityToolbar compact />
          <LanguageToggle />
        </div>
      </nav>

      <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/20 bg-surface-container/95 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1 px-1 py-1.5">
          {mobileNavLinks.map((link) => {
            const isActive = link.match(location.pathname);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-on-surface-variant hover:bg-surface-high hover:text-foreground"
                }`}
              >
                <link.icon className="h-5 w-5" aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
