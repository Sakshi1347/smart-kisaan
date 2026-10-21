import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "@/pages/Landing";

const renderHomePage = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    </LanguageProvider>,
  );
};

describe("Feature 1: Simple, Accessible Home Page", () => {
  beforeEach(() => {
    // Mock SpeechSynthesisUtterance
    class MockUtterance {
      text: string;
      lang = "";
      rate = 1;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    (window as any).SpeechSynthesisUtterance = MockUtterance;

    // Mock speechSynthesis
    Object.defineProperty(window, "speechSynthesis", {
      writable: true,
      value: {
        speak: vi.fn((utterance: MockUtterance) => {
          if (utterance.onstart) utterance.onstart();
        }),
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: vi.fn().mockReturnValue([]),
      },
    });
  });

  it("renders the project title, logo, and short welcome message", () => {
    renderHomePage();

    // Project title & brand
    expect(screen.getByRole("heading", { level: 1, name: /Smart Kisaan/i })).toBeInTheDocument();
    expect(screen.getByAltText("Smart Kisaan logo")).toBeInTheDocument();

    // Welcome message
    expect(screen.getByText(/This app helps you find government schemes for farmers/i)).toBeInTheDocument();
  });

  it("includes a WCAG skip to main content link targeting #main-content", () => {
    renderHomePage();

    const skipLink = screen.getByRole("link", { name: /Skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");

    const mainElement = document.querySelector("#main-content");
    expect(mainElement).toBeInTheDocument();
  });

  it("renders all 5 main home page actions with icons, titles, and descriptions", () => {
    renderHomePage();

    // 1. Government Schemes -> /schemes
    const schemesLink = screen.getByRole("link", { name: /Government Schemes/i });
    expect(schemesLink).toHaveAttribute("href", "/schemes");
    expect(screen.getByText("Government Schemes")).toBeInTheDocument();

    // 2. Check Eligibility -> /eligibility (Phase 1 Feature 4)
    const eligibilityLink = screen.getByRole("link", { name: /Check Eligibility/i });
    expect(eligibilityLink).toHaveAttribute("href", "/eligibility");
    expect(screen.getByText("Check Eligibility")).toBeInTheDocument();

    // 3. Required Documents -> /documents (Phase 1 Feature 4)
    const documentsLink = screen.getByRole("link", { name: /Required Documents/i });
    expect(documentsLink).toHaveAttribute("href", "/documents");
    expect(screen.getByText("Required Documents")).toBeInTheDocument();

    // 4. Crop Disease Detection -> /crop-disease (Phase 1 Feature 5)
    const cropLink = screen.getByRole("link", { name: /Crop Disease Detection/i });
    expect(cropLink).toHaveAttribute("href", "/crop-disease");
    expect(screen.getByText("Crop Disease Detection")).toBeInTheDocument();

    // 5. Help / How to Use -> /help
    const helpLink = screen.getByRole("link", { name: /Help \/ How to Use/i });
    expect(helpLink).toHaveAttribute("href", "/help");
    expect(screen.getByText("Help / How to Use")).toBeInTheDocument();
  });

  it("switches language between English and Hindi across the entire home page", () => {
    renderHomePage();

    // Initially English
    expect(screen.getByRole("heading", { level: 1, name: /Smart Kisaan/i })).toBeInTheDocument();
    expect(screen.getByText("Government Schemes")).toBeInTheDocument();

    // Click Hindi button
    const hindiButton = screen.getByRole("button", { name: "हिन्दी" });
    fireEvent.click(hindiButton);

    // Document lang attribute is updated for screen readers
    expect(document.documentElement.lang).toBe("hi");

    // Elements should now be in Hindi
    expect(screen.getByRole("heading", { level: 1, name: "स्मार्ट किसान" })).toBeInTheDocument();
    expect(screen.getByText("सरकारी योजनाएँ")).toBeInTheDocument();
    expect(screen.getByText("पात्रता देखें")).toBeInTheDocument();
    expect(screen.getByText("ज़रूरी कागज़")).toBeInTheDocument();
    expect(screen.getByText("फसल बीमारी जाँच")).toBeInTheDocument();
    expect(screen.getByText("मदद / कैसे चलाएँ")).toBeInTheDocument();
    expect(screen.getAllByText("उपलब्ध").length).toBeGreaterThan(0);

    // Switch back to English
    const englishButton = screen.getByRole("button", { name: "English" });
    fireEvent.click(englishButton);

    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByText("Government Schemes")).toBeInTheDocument();
  });

  it("provides audio guidance trigger for low-literacy users", () => {
    renderHomePage();

    const audioButton = screen.getByRole("button", { name: /Listen to Page Instructions/i });
    expect(audioButton).toBeInTheDocument();

    fireEvent.click(audioButton);
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("renders a 3-step simple guide for illiterate and low-literacy farmers", () => {
    renderHomePage();

    expect(screen.getByText(/How Smart Kisaan Works/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Find a Scheme/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Check Documents/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Check Eligibility/i)).toBeInTheDocument();
  });

  it("renders official Kisan Call Center toll-free helpline information", () => {
    renderHomePage();

    expect(screen.getByText(/Kisan Call Center/i)).toBeInTheDocument();
    expect(screen.getByText("1800-180-1551")).toBeInTheDocument();

    const callLink = screen.getByRole("link", { name: /Call Toll-Free Helpline: 1800-180-1551/i });
    expect(callLink).toHaveAttribute("href", "tel:18001801551");
  });
});
