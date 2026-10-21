import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider, LANGUAGE_STORAGE_KEY } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import EligibilityCheck from "@/pages/EligibilityCheck";
import {
  getAllEligibilityRuleSets,
  getEligibilityRuleSet,
} from "@/lib/eligibilityRules";

function renderWithProviders(initialEntries: string[] = ["/eligibility"]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path="/eligibility" element={<EligibilityCheck />} />
              <Route path="/documents" element={<EligibilityCheck />} />
            </Routes>
          </MemoryRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe("Phase 1 — Feature 4: Scheme Eligibility and Required-Document Checklist", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Rule Engine: Verified 5 Schemes", () => {
    it("has rule sets and document lists for all 5 verified schemes", () => {
      const schemes = getAllEligibilityRuleSets();
      expect(schemes.length).toBe(5);

      const ids = schemes.map((s) => s.schemeId);
      expect(ids).toContain("pm-kisan");
      expect(ids).toContain("pmfby");
      expect(ids).toContain("kcc");
      expect(ids).toContain("soil-health-card");
      expect(ids).toContain("pmksy-pdmc");

      schemes.forEach((s) => {
        expect(s.questions.length).toBeGreaterThan(0);
        expect(s.documents.length).toBeGreaterThan(0);
        expect(s.officialPortalUrl).toMatch(/^https?:\/\//);
      });
    });

    it("evaluates PM-KISAN: may meet, may not meet, and needs verification", () => {
      const ruleSet = getEligibilityRuleSet("pm-kisan")!;
      expect(ruleSet).toBeDefined();

      // Case A: May meet (land: yes, exclusions: none, aadhaar_ekyc: yes)
      const eligibleAnswers = {
        landholding: "yes",
        exclusions: "none",
        aadhaar_ekyc: "yes",
      };
      const resA = ruleSet.evaluate(eligibleAnswers);
      expect(resA.status).toBe("may_meet");
      expect(resA.matchedCriteriaEn.length).toBeGreaterThan(0);
      expect(resA.issuesOrGapsEn.length).toBe(0);

      // Case B: May not meet (Exclusion applies, e.g. taxpayer or govt employee)
      const ineligibleAnswers = {
        landholding: "yes",
        exclusions: "excluded",
        aadhaar_ekyc: "yes",
      };
      const resB = ruleSet.evaluate(ineligibleAnswers);
      expect(resB.status).toBe("may_not_meet");
      expect(resB.issuesOrGapsEn.some((g) => g.toLowerCase().includes("exclusion"))).toBe(true);

      // Case C: Needs verification (Land & exclusions fine, but e-KYC pending)
      const verifyAnswers = {
        landholding: "yes",
        exclusions: "none",
        aadhaar_ekyc: "not_sure",
      };
      const resC = ruleSet.evaluate(verifyAnswers);
      expect(resC.status).toBe("needs_verification");
    });

    it("evaluates PMFBY: may meet, may not meet, and needs verification", () => {
      const ruleSet = getEligibilityRuleSet("pmfby")!;
      expect(ruleSet).toBeDefined();

      // Case A: May meet
      const eligible = {
        notified_crop: "yes",
        farmer_type: "owner",
        deadline: "yes",
      };
      const resA = ruleSet.evaluate(eligible);
      expect(resA.status).toBe("may_meet");

      // Case B: May not meet (Not a notified crop in district)
      const ineligible = {
        notified_crop: "no",
        farmer_type: "owner",
        deadline: "yes",
      };
      const resB = ruleSet.evaluate(ineligible);
      expect(resB.status).toBe("may_not_meet");

      // Case C: Needs verification (Not sure whether crop is notified this season)
      const verify = {
        notified_crop: "not_sure",
        farmer_type: "owner",
        deadline: "yes",
      };
      const resC = ruleSet.evaluate(verify);
      expect(resC.status).toBe("needs_verification");
    });

    it("evaluates KCC: handles active farmer vs wilful default vs tenant verification", () => {
      const ruleSet = getEligibilityRuleSet("kcc")!;
      expect(ruleSet).toBeDefined();

      // Case A: May meet (active farmer, owner, good credit)
      const eligible = {
        activity: "yes",
        tenure_type: "owner",
        loan_standing: "good",
      };
      const resA = ruleSet.evaluate(eligible);
      expect(resA.status).toBe("may_meet");

      // Case B: Wilful default -> may not meet
      const defaulted = {
        activity: "yes",
        tenure_type: "owner",
        loan_standing: "default",
      };
      const resB = ruleSet.evaluate(defaulted);
      expect(resB.status).toBe("may_not_meet");

      // Case C: Tenant farmer -> needs verification / JLG
      const tenant = {
        activity: "yes",
        tenure_type: "tenant",
        loan_standing: "good",
      };
      const resC = ruleSet.evaluate(tenant);
      expect(resC.status).toBe("needs_verification");
    });

    it("evaluates Soil Health Card & PMKSY-PDMC", () => {
      const shc = getEligibilityRuleSet("soil-health-card")!;
      expect(shc.evaluate({ land_access: "yes", sample_readiness: "yes" }).status).toBe("may_meet");

      const pmksy = getEligibilityRuleSet("pmksy-pdmc")!;
      expect(
        pmksy.evaluate({
          water_source: "yes",
          farmer_category: "small_marginal",
          pumping_setup: "yes",
        }).status
      ).toBe("may_meet");

      expect(
        pmksy.evaluate({
          water_source: "yes",
          farmer_category: "small_marginal",
          pumping_setup: "not_sure",
        }).status
      ).toBe("needs_verification");
    });
  });

  describe("UI Component: Page Rendering & Accessibility", () => {
    it("renders page title, preliminary guidance disclaimer, and skip link", () => {
      renderWithProviders(["/eligibility"]);

      expect(screen.getByText("Scheme Eligibility & Document Checklist")).toBeInTheDocument();
      expect(
        screen.getByText(/Preliminary Guidance Only: This check is an indicative assessment/i)
      ).toBeInTheDocument();

      const skipLink = screen.getByText("Skip to main content");
      expect(skipLink).toBeInTheDocument();
      expect(skipLink.getAttribute("href")).toBe("#eligibility-main-content");
    });

    it("renders 5 scheme radio selector options with accessible roles", () => {
      renderWithProviders(["/eligibility"]);

      const radioGroup = screen.getByRole("radiogroup", { name: "Select a Government Scheme" });
      expect(radioGroup).toBeInTheDocument();

      const schemeButtons = within(radioGroup).getAllByRole("radio");
      expect(schemeButtons.length).toBe(5);

      expect(within(radioGroup).getByText("PM-KISAN")).toBeInTheDocument();
      expect(within(radioGroup).getByText("PMFBY")).toBeInTheDocument();
      expect(within(radioGroup).getByText("KCC")).toBeInTheDocument();
      expect(within(radioGroup).getByText("SHC")).toBeInTheDocument();
      expect(within(radioGroup).getByText("PMKSY (PDMC)")).toBeInTheDocument();
    });

    it("supports switching tabs between Eligibility Checker and Document Checklist", () => {
      renderWithProviders(["/eligibility"]);

      const eligibilityTab = screen.getByRole("tab", { name: /Eligibility Checker/i });
      const documentsTab = screen.getByRole("tab", { name: /Document Checklist/i });

      expect(eligibilityTab).toHaveAttribute("aria-selected", "true");
      expect(documentsTab).toHaveAttribute("aria-selected", "false");

      // Switch to documents tab
      fireEvent.click(documentsTab);
      expect(documentsTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText(/Preparation Progress:/i)).toBeInTheDocument();

      // Switch back
      fireEvent.click(eligibilityTab);
      expect(eligibilityTab).toHaveAttribute("aria-selected", "true");
    });

    it("opens document checklist directly when accessing /documents", () => {
      renderWithProviders(["/documents?scheme=pm-kisan"]);

      const documentsTab = screen.getByRole("tab", { name: /Document Checklist/i });
      expect(documentsTab).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText(/Preparation Progress:/i)).toBeInTheDocument();
    });

    it("pre-selects scheme from query param ?scheme=kcc", () => {
      renderWithProviders(["/eligibility?scheme=kcc"]);

      expect(
        screen.getByRole("heading", { name: /Kisan Credit Card \(KCC\) Scheme/i, level: 2 })
      ).toBeInTheDocument();
    });
  });

  describe("Eligibility Workflow & Answering", () => {
    it("renders semantic fieldsets with legends for scheme questions", () => {
      renderWithProviders(["/eligibility?scheme=pm-kisan"]);

      const fieldsets = document.querySelectorAll("fieldset");
      expect(fieldsets.length).toBe(3); // PM-KISAN has 3 questions

      const legends = document.querySelectorAll("legend");
      expect(legends.length).toBe(3);
      expect(legends[0].textContent).toContain("Q1.");
    });

    it("calculates answered questions counter and displays result upon completing all answers", () => {
      renderWithProviders(["/eligibility?scheme=pm-kisan"]);

      expect(screen.getByText("Answered 0 of 3 questions")).toBeInTheDocument();
      expect(
        screen.getByText(/Please answer all questions above to calculate your preliminary eligibility result/i)
      ).toBeInTheDocument();

      // Answer Q1: cultivable land = yes
      const q1Option = screen.getByLabelText(/Yes, cultivable land is registered in my \/ family name/i);
      fireEvent.click(q1Option);

      expect(screen.getByText("Answered 1 of 3 questions")).toBeInTheDocument();

      // Answer Q2: exclusions = none
      const q2Option = screen.getByLabelText(/No, none of these exclusions apply to my household/i);
      fireEvent.click(q2Option);

      expect(screen.getByText("Answered 2 of 3 questions")).toBeInTheDocument();

      // Answer Q3: ekyc = yes
      const q3Option = screen.getByLabelText(/Yes, Aadhaar is linked to bank and e-KYC is completed/i);
      fireEvent.click(q3Option);

      expect(screen.getByText("Answered 3 of 3 questions")).toBeInTheDocument();

      // Result status should now appear
      const resultBadges = screen.getAllByText("May Meet Basic Criteria");
      expect(resultBadges.length).toBeGreaterThan(0);
      expect(screen.getByText(/Criteria Appearing to Match:/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommended Next Steps:/i)).toBeInTheDocument();

      // Official portal button
      const officialPortalLinks = screen.getAllByRole("link", {
        name: /Visit Official Scheme Portal/i,
      });
      expect(officialPortalLinks.length).toBeGreaterThan(0);
      expect(officialPortalLinks[0]).toHaveAttribute("href", "https://pmkisan.gov.in/");
      expect(officialPortalLinks[0]).toHaveAttribute("target", "_blank");
      expect(officialPortalLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("shows negative/gap explanation when user answers indicate ineligibility", () => {
      renderWithProviders(["/eligibility?scheme=pm-kisan"]);

      // Answer Q1: cultivable land = yes
      fireEvent.click(
        screen.getByLabelText(/Yes, cultivable land is registered in my \/ family name/i)
      );

      // Answer Q2: income tax payee / exclusion = yes
      fireEvent.click(
        screen.getByLabelText(/Yes, someone in the household is an income tax payee or government employee/i)
      );

      // Answer Q3: ekyc = yes
      fireEvent.click(
        screen.getByLabelText(/Yes, Aadhaar is linked to bank and e-KYC is completed/i)
      );

      // Status should be May Not Meet Basic Criteria
      const resultBadges = screen.getAllByText("May Not Meet Basic Criteria");
      expect(resultBadges.length).toBeGreaterThan(0);
      expect(
        screen.getByText(/Conditions Inconsistent or Requiring Attention:/i)
      ).toBeInTheDocument();
    });

    it("allows resetting answers", () => {
      renderWithProviders(["/eligibility?scheme=pm-kisan"]);

      // Answer Q1
      const q1Option = screen.getByLabelText(/Yes, cultivable land is registered in my \/ family name/i);
      fireEvent.click(q1Option);
      expect(screen.getByText("Answered 1 of 3 questions")).toBeInTheDocument();

      // Click Reset Answers
      const resetBtn = screen.getByRole("button", { name: /Reset Answers/i });
      fireEvent.click(resetBtn);

      expect(screen.getByText("Answered 0 of 3 questions")).toBeInTheDocument();
      expect(
        screen.getByText(/Please answer all questions above to calculate your preliminary eligibility result/i)
      ).toBeInTheDocument();
    });
  });

  describe("Interactive Document Checklist", () => {
    it("displays mandatory and conditional document badges and allows interactive tracking", () => {
      renderWithProviders(["/documents?scheme=pm-kisan"]);

      expect(screen.getByText(/Required Documents Checklist/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Important: Checking off documents here is solely for your personal preparation/i)
      ).toBeInTheDocument();

      // PM-KISAN mandatory documents
      const mandatoryBadges = screen.getAllByText("Mandatory");
      expect(mandatoryBadges.length).toBeGreaterThan(0);

      // Check off the first document checkbox
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(4);
      expect(checkboxes[0]).not.toBeChecked();

      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).toBeChecked();

      // Counter should reflect 1 ready document
      expect(screen.getByText(/1 of 4 documents ready/i)).toBeInTheDocument();

      // Reset checklist button
      const resetBtn = screen.getByRole("button", { name: /Reset Checklist/i });
      fireEvent.click(resetBtn);

      expect(checkboxes[0]).not.toBeChecked();
      expect(screen.getByText(/0 of 4 documents ready/i)).toBeInTheDocument();
    });

    it("displays progress bar with proper aria attributes", () => {
      renderWithProviders(["/documents?scheme=pm-kisan"]);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");

      // Check first doc
      const firstCheck = screen.getAllByRole("checkbox")[0];
      fireEvent.click(firstCheck);

      expect(progressBar).toHaveAttribute("aria-valuenow", "25");
    });
  });

  describe("Hindi Language Switching Support", () => {
    it("renders in Hindi when language is set to hi", () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, "hi");
      renderWithProviders(["/eligibility"]);

      expect(
        screen.getByRole("heading", { name: /योजना पात्रता एवं आवश्यक दस्तावेज़ चेकलिस्ट/i, level: 1 })
      ).toBeInTheDocument();

      expect(
        screen.getByText(/केवल प्रारंभिक मार्गदर्शन: यह जाँच प्रकाशित नियमों पर आधारित अनुमानित मूल्यांकन है/i)
      ).toBeInTheDocument();

      expect(screen.getByRole("tab", { name: /पात्रता जाँच/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /दस्तावेज़ चेकलिस्ट/i })).toBeInTheDocument();
    });
  });
});
