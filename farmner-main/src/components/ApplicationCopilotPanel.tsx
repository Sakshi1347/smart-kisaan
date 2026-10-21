import { AlertTriangle, CheckCircle2, ClipboardList, Download, FileStack, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SchemeRow } from "@/hooks/useSchemes";
import { EligibilityAssessment, FarmerProfile } from "@/lib/copilotTypes";
import { assessSchemeEligibility, buildCopilotChecklist } from "@/lib/copilot";
import { DocumentReadinessSummary } from "@/lib/copilotTypes";
import { buildApplicationDossier, exportApplicationDossierPdf } from "@/lib/applicationDossier";
import { localizeSchemeReason } from "@/lib/schemeLanguage";
import { toast } from "sonner";

type ApplicationCopilotPanelProps = {
  scheme: SchemeRow;
  profile: FarmerProfile;
  readiness: DocumentReadinessSummary;
  language: "en" | "hi";
};

const getStatusStyles = (
  language: "en" | "hi",
): Record<
  EligibilityAssessment["status"],
  { badge: string; title: string; icon: JSX.Element }
> => ({
  likely_eligible: {
    badge: "bg-green-500/10 text-green-400",
    title: language === "hi" ? "पात्र होने की संभावना" : "Likely eligible",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  needs_info: {
    badge: "bg-yellow-500/10 text-yellow-300",
    title: language === "hi" ? "और जानकारी चाहिए" : "Needs more info",
    icon: <HelpCircle className="w-4 h-4" />,
  },
  at_risk: {
    badge: "bg-destructive/10 text-destructive",
    title: language === "hi" ? "पात्रता में रुकावट संभव" : "Possible blocker",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
});

const ApplicationCopilotPanel = ({
  scheme,
  profile,
  readiness,
  language,
}: ApplicationCopilotPanelProps) => {
  const assessment = assessSchemeEligibility(scheme, profile, readiness);
  const checklist = buildCopilotChecklist(scheme, assessment, readiness);
  const statusMap = getStatusStyles(language);
  const style = statusMap[assessment.status];

  const handleExportDossier = () => {
    try {
      const dossier = buildApplicationDossier({
        scheme,
        profile,
        readiness,
        assessment,
        checklist,
      });
      const pdf = exportApplicationDossierPdf(dossier);
      const fileName = `${scheme.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-application-dossier.pdf`;
      pdf.save(fileName);
      toast.success(
        language === "hi"
          ? "आवेदन सारांश सफलतापूर्वक डाउनलोड हो गया।"
          : "Application dossier exported.",
      );
    } catch (error) {
      console.error("dossier export failed", error);
      toast.error(
        language === "hi"
          ? "आवेदन सारांश डाउनलोड नहीं हो सका।"
          : "Could not export the dossier.",
      );
    }
  };

  const copy =
    language === "hi"
      ? {
          title: "आवेदन सहायक (पात्रता मार्गदर्शन)",
          subtitle:
            "आपकी प्रोफ़ाइल, ज़रूरी कागज़ात और योजना शर्तों को मिलाकर स्पष्ट मार्गदर्शन।",
          scorecard: "पात्रता परिणाम",
          documentReadiness: "कागज़ात तैयारी",
          checklist: "आवेदन चेकलिस्ट",
          matched: "यह आपके लिए क्यों उपयुक्त है",
          missing: "बाकी बची जानकारी",
          risks: "ध्यान देने योग्य बातें",
          steps: "आगे के आवश्यक चरण",
          profileUsed: "उपयोग की गई प्रोफ़ाइल",
          docsReady: "कागज़ात तैयार",
          dossier: "आवेदन सारांश",
          dossierDesc:
            "पात्रता, कागज़ात और अगले चरणों का सारांश पीडीएफ डाउनलोड करें।",
          exportDossier: "पीडीएफ सारांश डाउनलोड करें",
          confidence: "विश्वास स्कोर",
          noMissing: "अभी कोई अतिरिक्त जानकारी आवश्यक नहीं है।",
          noRisks: "अभी तक कोई बड़ी रुकावट नहीं पाई गई।",
          noSignals: "अभी कोई प्रोफ़ाइल संकेत सेव नहीं हैं।",
          missingDoc: "बाकी है",
          notUploaded: "अभी अपलोड नहीं किया गया",
          eligibility: "पात्रता",
          readiness: "तैयारी",
        }
      : {
          title: "AI Application Copilot",
          subtitle:
            "Rules-first guidance that combines profile details, required documents, and scheme data into clear next steps.",
          scorecard: "Eligibility scorecard",
          documentReadiness: "Document readiness",
          checklist: "Application success checklist",
          matched: "Why this looks relevant",
          missing: "Questions still missing",
          risks: "Watch-outs",
          steps: "Next best actions",
          profileUsed: "Profile used",
          docsReady: "documents ready",
          dossier: "Application dossier",
          dossierDesc:
            "Export a reviewer-ready PDF with eligibility, documents, and next steps.",
          exportDossier: "Export PDF dossier",
          confidence: "Confidence",
          noMissing: "No additional questions right now.",
          noRisks: "No major blockers detected yet.",
          noSignals: "No saved profile signals yet.",
          missingDoc: "Missing",
          notUploaded: "Not uploaded yet",
          eligibility: "Eligibility",
          readiness: "Readiness",
        };

  return (
    <section className="bg-surface-container rounded-3xl p-6 ghost-border">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-2xl">{copy.title}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{copy.subtitle}</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="rounded-3xl bg-surface-high p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-bold text-lg">{copy.scorecard}</h3>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.badge}`}
              >
                {style.icon}
                {style.title}
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-6 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                  {copy.confidence}
                </p>
                <p className="font-headline text-4xl font-extrabold">{assessment.confidence}%</p>
              </div>
              <p className="text-sm text-on-surface-variant max-w-xl">
                {localizeSchemeReason(assessment.explanation, language)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-background/30 p-4">
                <p className="text-xs uppercase tracking-wider text-accent mb-3">{copy.matched}</p>
                <ul className="space-y-2">
                  {assessment.matchedCriteria.map((item) => (
                    <li key={item} className="text-sm text-foreground">
                      {localizeSchemeReason(item, language)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-background/30 p-4">
                <p className="text-xs uppercase tracking-wider text-yellow-400 mb-3">{copy.missing}</p>
                <ul className="space-y-2">
                  {assessment.missingCriteria.length > 0 ? (
                    assessment.missingCriteria.map((item) => (
                      <li key={item} className="text-sm text-on-surface-variant">
                        {localizeSchemeReason(item, language)}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-on-surface-variant">{copy.noMissing}</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl bg-background/30 p-4">
                <p className="text-xs uppercase tracking-wider text-destructive mb-3">{copy.risks}</p>
                <ul className="space-y-2">
                  {assessment.risks.length > 0 ? (
                    assessment.risks.map((item) => (
                      <li key={item} className="text-sm text-on-surface-variant">
                        {localizeSchemeReason(item, language)}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-on-surface-variant">{copy.noRisks}</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl bg-background/30 p-4">
                <p className="text-xs uppercase tracking-wider text-primary mb-3">{copy.steps}</p>
                <ul className="space-y-2">
                  {assessment.nextSteps.map((item) => (
                    <li key={item} className="text-sm text-foreground">
                      {localizeSchemeReason(item, language)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface-high p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h3 className="font-headline font-bold text-lg">{copy.checklist}</h3>
            </div>
            <div className="grid gap-3">
              {checklist.map((item) => (
                <div key={item} className="rounded-2xl bg-background/30 p-4 text-sm text-on-surface-variant">
                  {localizeSchemeReason(item, language)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-surface-high p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileStack className="w-5 h-5 text-primary" />
              <h3 className="font-headline font-bold text-lg">{copy.documentReadiness}</h3>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <p className="font-headline text-4xl font-extrabold">{readiness.completionPct}%</p>
              <p className="text-sm text-on-surface-variant">
                {readiness.verifiedDocs.length}/{readiness.requiredDocs.length} {copy.docsReady}
              </p>
            </div>

            <div className="space-y-3">
              {readiness.requiredDocs.map((doc) => {
                const entry = readiness.entries.find((item) => item.documentType === doc);
                return (
                  <div key={doc} className="rounded-2xl bg-background/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{doc}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          entry?.status === "VERIFIED"
                            ? "bg-green-500/10 text-green-400"
                            : entry?.status === "NEEDS_REVIEW"
                              ? "bg-yellow-500/10 text-yellow-300"
                              : entry?.status === "REJECTED"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-surface-highest text-on-surface-variant"
                        }`}
                      >
                        {entry?.status === "VERIFIED"
                          ? (language === "hi" ? "सत्यापित" : "Verified")
                          : entry?.status === "NEEDS_REVIEW"
                            ? (language === "hi" ? "समीक्षा आवश्यक" : "Needs Review")
                            : entry?.status === "REJECTED"
                              ? (language === "hi" ? "अस्वीकृत" : "Rejected")
                              : copy.missingDoc}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      {entry?.fileName || copy.notUploaded}
                    </p>
                    {entry?.qualityWarnings.length ? (
                      <p className="text-xs text-yellow-300 mt-2">{entry.qualityWarnings.join(" | ")}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-surface-high p-5">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-3">{copy.profileUsed}</p>
            <div className="flex flex-wrap gap-2">
              {assessment.profileSignals.length > 0 ? (
                assessment.profileSignals.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {localizeSchemeReason(item, language)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-on-surface-variant">{copy.noSignals}</span>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-[linear-gradient(145deg,rgba(10,83,72,0.18),rgba(255,255,255,0.04))] p-5 ghost-border">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-accent mb-2">{copy.dossier}</p>
                <p className="text-sm text-on-surface-variant">{copy.dossierDesc}</p>
              </div>
              <div className="rounded-2xl bg-accent/10 p-3 text-accent">
                <Download className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl bg-background/30 p-3">
                <p className="text-[11px] uppercase tracking-wider text-on-surface-variant mb-1">{copy.eligibility}</p>
                <p className="font-headline text-2xl font-extrabold">{assessment.confidence}%</p>
              </div>
              <div className="rounded-2xl bg-background/30 p-3">
                <p className="text-[11px] uppercase tracking-wider text-on-surface-variant mb-1">{copy.readiness}</p>
                <p className="font-headline text-2xl font-extrabold">{readiness.completionPct}%</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportDossier}
              className="w-full rounded-2xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {copy.exportDossier}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationCopilotPanel;
