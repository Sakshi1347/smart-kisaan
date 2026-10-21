import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LanguageProvider, useLanguage, LANGUAGE_STORAGE_KEY } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Landing from "@/pages/Landing";
import Help from "@/pages/Help";

// Dummy test component to test navigation and translation
const TestApp = () => {
  const { t } = useLanguage();
  return (
    <div>
      <LanguageToggle />
      <nav>
        <Link to="/">HomeLink</Link>
        <Link to="/help">HelpLink</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  );
};

describe("Phase 1 — Feature 2: Hindi-English Language Switching", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";

    // Mock SpeechSynthesis
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
        speak: vi.fn(),
        cancel: vi.fn(),
        pause: vi.fn(),
        resume: vi.fn(),
        getVoices: vi.fn().mockReturnValue([]),
      },
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("defaults to English when localStorage is empty", () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </LanguageProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: /Smart Kisaan/i })).toBeInTheDocument();
    expect(screen.getByText("Government Schemes")).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("en");

    // The English toggle button is pressed
    const enBtn = screen.getAllByRole("button", { name: "English" })[0];
    const hiBtn = screen.getAllByRole("button", { name: "हिन्दी" })[0];
    expect(enBtn).toHaveAttribute("aria-pressed", "true");
    expect(hiBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("safely handles invalid language in localStorage and falls back to English", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "invalid_lang");

    render(
      <LanguageProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </LanguageProvider>,
    );

    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByText("Government Schemes")).toBeInTheDocument();
  });

  it("restores Hindi preference from localStorage on initial load", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "hi");

    render(
      <LanguageProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </LanguageProvider>,
    );

    expect(document.documentElement.lang).toBe("hi");
    expect(screen.getByRole("heading", { level: 1, name: "स्मार्ट किसान" })).toBeInTheDocument();
    expect(screen.getByText("सरकारी योजनाएँ")).toBeInTheDocument();

    const enBtn = screen.getAllByRole("button", { name: "English" })[0];
    const hiBtn = screen.getAllByRole("button", { name: "हिन्दी" })[0];
    expect(enBtn).toHaveAttribute("aria-pressed", "false");
    expect(hiBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("switches to Hindi immediately and saves preference to localStorage", () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </LanguageProvider>,
    );

    const hiBtn = screen.getAllByRole("button", { name: "हिन्दी" })[0];
    fireEvent.click(hiBtn);

    // Immediate interface update
    expect(screen.getByRole("heading", { level: 1, name: "स्मार्ट किसान" })).toBeInTheDocument();
    expect(screen.getByText("सरकारी योजनाएँ")).toBeInTheDocument();
    expect(screen.getByText("पात्रता देखें")).toBeInTheDocument();
    expect(screen.getByText("ज़रूरी कागज़")).toBeInTheDocument();

    // Stored in localStorage
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("hi");

    // HTML lang updated
    expect(document.documentElement.lang).toBe("hi");
  });

  it("switches back to English immediately and updates localStorage", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "hi");

    render(
      <LanguageProvider>
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      </LanguageProvider>,
    );

    expect(screen.getByText("सरकारी योजनाएँ")).toBeInTheDocument();

    const enBtn = screen.getAllByRole("button", { name: "English" })[0];
    fireEvent.click(enBtn);

    expect(screen.getByText("Government Schemes")).toBeInTheDocument();
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("persists language selection across page navigation without page reload", () => {
    render(
      <LanguageProvider>
        <BrowserRouter>
          <TestApp />
        </BrowserRouter>
      </LanguageProvider>,
    );

    // Switch to Hindi on home page
    const hiBtn = screen.getAllByRole("button", { name: "हिन्दी" })[0];
    fireEvent.click(hiBtn);

    expect(screen.getByRole("heading", { level: 1, name: "स्मार्ट किसान" })).toBeInTheDocument();

    // Navigate to Help page
    const helpLink = screen.getByText("HelpLink");
    fireEvent.click(helpLink);

    // Help page should render in Hindi
    expect(screen.getByRole("heading", { level: 1, name: "स्मार्ट किसान कैसे चलाएँ" })).toBeInTheDocument();
    expect(screen.getByText("1. सरकारी योजनाएँ दबाएँ")).toBeInTheDocument();
    expect(screen.getByText("आधार कार्ड")).toBeInTheDocument();

    // Navigate back to Home page
    const homeLink = screen.getByText("HomeLink");
    fireEvent.click(homeLink);

    // Home page should still be in Hindi
    expect(screen.getByRole("heading", { level: 1, name: "स्मार्ट किसान" })).toBeInTheDocument();
    expect(screen.getByText("सरकारी योजनाएँ")).toBeInTheDocument();
  });

  it("provides full accessibility attributes on the LanguageToggle control", () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Choose language");

    const enBtn = screen.getByRole("button", { name: "English" });
    const hiBtn = screen.getByRole("button", { name: "हिन्दी" });

    expect(enBtn).toHaveAttribute("aria-pressed", "true");
    expect(hiBtn).toHaveAttribute("aria-pressed", "false");

    // Click Hindi
    fireEvent.click(hiBtn);
    expect(enBtn).toHaveAttribute("aria-pressed", "false");
    expect(hiBtn).toHaveAttribute("aria-pressed", "true");
  });
});
