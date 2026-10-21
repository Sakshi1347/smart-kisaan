import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type PhaseLaterProps = {
  feature: string;
  featureHi?: string;
};

const PhaseLater = ({ feature, featureHi }: PhaseLaterProps) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const name = isHi && featureHi ? featureHi : feature;

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-6">
      <div className="max-w-lg text-center bg-surface-container rounded-3xl p-8 ghost-border">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Construction className="h-7 w-7" />
        </div>
        <h1 className="font-headline text-2xl font-bold mb-3">
          {isHi ? `${name} जल्द आ रहा है` : `${name} coming soon`}
        </h1>
        <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
          {isHi
            ? "यह सुविधा अभी उपलब्ध नहीं है। अभी डेमो: योजना खोज → विवरण → प्रोफ़ाइल → पात्रता सहायक।"
            : "This feature is not available yet. Current demo: browse schemes → details → profile → eligibility copilot."}
        </p>
        <Link
          to="/schemes"
          className="gradient-primary text-primary-foreground font-medium px-5 py-2.5 rounded-lg inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {isHi ? "योजनाएँ देखें" : "Browse schemes"}
        </Link>
      </div>
    </div>
  );
};

export default PhaseLater;
