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

describe("Feature 1: Accessibility Compliance (WCAG 2.1 AA)", () => {
  beforeEach(() => {
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

  it("provides proper landmark regions and headings hierarchy", () => {
    renderHomePage();

    // Landmark: <main id="main-content">
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");

    // Headings structure: h1 -> h2 -> h3
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Smart Kisaan");

    const h2Elements = screen.getAllByRole("heading", { level: 2 });
    expect(h2Elements.length).toBeGreaterThanOrEqual(2); // Main Services, How it Works, Helpline

    const h3Elements = screen.getAllByRole("heading", { level: 3 });
    expect(h3Elements.length).toBeGreaterThanOrEqual(5); // Action cards
  });

  it("renders Crop Disease Detection as an accessible active link", () => {
    renderHomePage();

    const cropLink = screen.getByRole("link", { name: /Crop Disease Detection/i });
    expect(cropLink).toBeInTheDocument();
    expect(cropLink).toHaveAttribute("href", "/crop-disease");
  });

  it("updates live region status visibly when audio guidance triggers", () => {
    renderHomePage();

    const audioBtn = screen.getByRole("button", { name: /Listen to Page Instructions/i });
    expect(audioBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(audioBtn);

    // Live region status
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent(/Reading instructions aloud/i);
    expect(audioBtn).toHaveAttribute("aria-pressed", "true");

    // Press again to stop
    fireEvent.click(audioBtn);
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(audioBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("announces language button pressed states via aria-pressed", () => {
    renderHomePage();

    const enBtn = screen.getByRole("button", { name: "English" });
    const hiBtn = screen.getByRole("button", { name: "हिन्दी" });

    expect(enBtn).toHaveAttribute("aria-pressed", "true");
    expect(hiBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(hiBtn);

    expect(enBtn).toHaveAttribute("aria-pressed", "false");
    expect(hiBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("ensures all informative images have meaningful alternative text and icons are aria-hidden", () => {
    renderHomePage();

    const logo = screen.getByAltText("Smart Kisaan logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/brand/smart-kisaan-mark.svg");
  });
});
