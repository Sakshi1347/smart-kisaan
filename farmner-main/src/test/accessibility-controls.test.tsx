import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  AccessibilityProvider,
  useAccessibility,
  STORAGE_KEY_TEXT_SIZE,
  STORAGE_KEY_HIGH_CONTRAST,
  STORAGE_KEY_REDUCED_MOTION,
} from "@/contexts/AccessibilityContext";
import AccessibilityModal from "@/components/AccessibilityModal";
import Navbar from "@/components/Navbar";
import Landing from "@/pages/Landing";
import SchemeExplorer from "@/pages/SchemeExplorer";
import EligibilityCheck from "@/pages/EligibilityCheck";
import CropDisease from "@/pages/CropDisease";
import SchemeDetails from "@/pages/SchemeDetails";
import Help from "@/pages/Help";

function renderAccessibilityApp(initialEntries: string[] = ["/"]) {
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
          <AccessibilityProvider>
            <MemoryRouter initialEntries={initialEntries}>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/schemes" element={<SchemeExplorer />} />
                <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
                <Route path="/eligibility" element={<EligibilityCheck />} />
                <Route path="/crop-disease" element={<CropDisease />} />
                <Route path="/help" element={<Help />} />
              </Routes>
              <AccessibilityModal />
            </MemoryRouter>
          </AccessibilityProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Test harness component to test context hook directly
function ContextTestConsumer() {
  const {
    textSize,
    setTextSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    resetAll,
    openHelpModal,
    announce,
  } = useAccessibility();

  return (
    <div>
      <span data-testid="val-size">{textSize}</span>
      <span data-testid="val-contrast">{String(highContrast)}</span>
      <span data-testid="val-motion">{String(reducedMotion)}</span>
      <button onClick={() => setTextSize("large")}>Set Large</button>
      <button onClick={() => setTextSize("xl")}>Set XL</button>
      <button onClick={() => setTextSize("normal")}>Set Normal</button>
      <button onClick={toggleHighContrast}>Toggle Contrast</button>
      <button onClick={toggleReducedMotion}>Toggle Motion</button>
      <button onClick={resetAll}>Reset Defaults</button>
      <button onClick={openHelpModal}>Open Modal</button>
      <button onClick={() => announce("Test notification")}>Announce Test</button>
    </div>
  );
}

function renderContextOnly() {
  return render(
    <LanguageProvider>
      <AccessibilityProvider>
        <ContextTestConsumer />
        <AccessibilityModal />
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

describe("Phase 1 — Feature 6: Basic Accessibility Controls", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    vi.restoreAllMocks();
  });

  describe("Accessibility Context & HTML Root Attribute Synchronization", () => {
    it("initializes with default text-size-normal and no high-contrast class", () => {
      renderContextOnly();
      expect(screen.getByTestId("val-size").textContent).toBe("normal");
      expect(screen.getByTestId("val-contrast").textContent).toBe("false");
      expect(screen.getByTestId("val-motion").textContent).toBe("false");
      expect(document.documentElement.classList.contains("text-size-normal")).toBe(true);
      expect(document.documentElement.classList.contains("high-contrast")).toBe(false);
      expect(document.documentElement.classList.contains("reduce-motion")).toBe(false);
    });

    it("updates document root classes and localStorage when text size is changed", () => {
      renderContextOnly();

      fireEvent.click(screen.getByRole("button", { name: "Set Large" }));
      expect(screen.getByTestId("val-size").textContent).toBe("large");
      expect(document.documentElement.classList.contains("text-size-large")).toBe(true);
      expect(document.documentElement.classList.contains("text-size-normal")).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY_TEXT_SIZE)).toBe("large");

      fireEvent.click(screen.getByRole("button", { name: "Set XL" }));
      expect(screen.getByTestId("val-size").textContent).toBe("xl");
      expect(document.documentElement.classList.contains("text-size-xl")).toBe(true);
      expect(document.documentElement.classList.contains("text-size-large")).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY_TEXT_SIZE)).toBe("xl");

      fireEvent.click(screen.getByRole("button", { name: "Set Normal" }));
      expect(screen.getByTestId("val-size").textContent).toBe("normal");
      expect(document.documentElement.classList.contains("text-size-normal")).toBe(true);
      expect(document.documentElement.classList.contains("text-size-xl")).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY_TEXT_SIZE)).toBe("normal");
    });

    it("toggles high contrast mode on html root and persists to localStorage", () => {
      renderContextOnly();

      fireEvent.click(screen.getByRole("button", { name: "Toggle Contrast" }));
      expect(screen.getByTestId("val-contrast").textContent).toBe("true");
      expect(document.documentElement.classList.contains("high-contrast")).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY_HIGH_CONTRAST)).toBe("true");

      fireEvent.click(screen.getByRole("button", { name: "Toggle Contrast" }));
      expect(screen.getByTestId("val-contrast").textContent).toBe("false");
      expect(document.documentElement.classList.contains("high-contrast")).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY_HIGH_CONTRAST)).toBe("false");
    });

    it("toggles reduced motion mode on html root and persists to localStorage", () => {
      renderContextOnly();

      fireEvent.click(screen.getByRole("button", { name: "Toggle Motion" }));
      expect(screen.getByTestId("val-motion").textContent).toBe("true");
      expect(document.documentElement.classList.contains("reduce-motion")).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY_REDUCED_MOTION)).toBe("true");

      fireEvent.click(screen.getByRole("button", { name: "Toggle Motion" }));
      expect(screen.getByTestId("val-motion").textContent).toBe("false");
      expect(document.documentElement.classList.contains("reduce-motion")).toBe(false);
      expect(localStorage.getItem(STORAGE_KEY_REDUCED_MOTION)).toBe("false");
    });

    it("restores preferences from localStorage on mount", () => {
      localStorage.setItem(STORAGE_KEY_TEXT_SIZE, "xl");
      localStorage.setItem(STORAGE_KEY_HIGH_CONTRAST, "true");
      localStorage.setItem(STORAGE_KEY_REDUCED_MOTION, "true");

      renderContextOnly();

      expect(screen.getByTestId("val-size").textContent).toBe("xl");
      expect(screen.getByTestId("val-contrast").textContent).toBe("true");
      expect(screen.getByTestId("val-motion").textContent).toBe("true");
      expect(document.documentElement.classList.contains("text-size-xl")).toBe(true);
      expect(document.documentElement.classList.contains("high-contrast")).toBe(true);
      expect(document.documentElement.classList.contains("reduce-motion")).toBe(true);
    });

    it("resets all preferences to defaults", () => {
      renderContextOnly();

      fireEvent.click(screen.getByRole("button", { name: "Set XL" }));
      fireEvent.click(screen.getByRole("button", { name: "Toggle Contrast" }));
      fireEvent.click(screen.getByRole("button", { name: "Toggle Motion" }));

      expect(screen.getByTestId("val-size").textContent).toBe("xl");
      expect(screen.getByTestId("val-contrast").textContent).toBe("true");

      fireEvent.click(screen.getByRole("button", { name: "Reset Defaults" }));

      expect(screen.getByTestId("val-size").textContent).toBe("normal");
      expect(screen.getByTestId("val-contrast").textContent).toBe("false");
      expect(screen.getByTestId("val-motion").textContent).toBe("false");
      expect(document.documentElement.classList.contains("text-size-normal")).toBe(true);
      expect(document.documentElement.classList.contains("high-contrast")).toBe(false);
    });
  });

  describe("ARIA Live Region Announcer", () => {
    it("creates a persistent live announcer element with polite and atomic attributes", () => {
      renderContextOnly();
      const announcer = document.getElementById("a11y-live-announcer");
      expect(announcer).not.toBeNull();
      expect(announcer?.getAttribute("aria-live")).toBe("polite");
      expect(announcer?.getAttribute("aria-atomic")).toBe("true");
      expect(announcer?.classList.contains("sr-only")).toBe(true);
    });

    it("announces custom messages to screen readers through live announcer", () => {
      renderContextOnly();
      fireEvent.click(screen.getByRole("button", { name: "Announce Test" }));
      const announcer = document.getElementById("a11y-live-announcer");
      expect(announcer?.textContent).toBe("Test notification");
    });
  });

  describe("Accessibility Toolbar in Header", () => {
    it("renders text size controls (Normal, Large, Extra Large) with accurate aria-pressed states", () => {
      renderAccessibilityApp(["/"]);

      // Get text size buttons
      const btnNormal = screen.getAllByRole("button", { name: /text size: normal/i })[0];
      const btnLarge = screen.getAllByRole("button", { name: /text size: large/i })[0];
      const btnXL = screen.getAllByRole("button", { name: /text size: extra large/i })[0];

      expect(btnNormal.getAttribute("aria-pressed")).toBe("true");
      expect(btnLarge.getAttribute("aria-pressed")).toBe("false");
      expect(btnXL.getAttribute("aria-pressed")).toBe("false");

      // Switch to Large
      fireEvent.click(btnLarge);
      expect(btnNormal.getAttribute("aria-pressed")).toBe("false");
      expect(btnLarge.getAttribute("aria-pressed")).toBe("true");
      expect(btnXL.getAttribute("aria-pressed")).toBe("false");
      expect(document.documentElement.classList.contains("text-size-large")).toBe(true);

      // Switch to XL
      fireEvent.click(btnXL);
      expect(btnLarge.getAttribute("aria-pressed")).toBe("false");
      expect(btnXL.getAttribute("aria-pressed")).toBe("true");
      expect(document.documentElement.classList.contains("text-size-xl")).toBe(true);
    });

    it("renders high contrast toggle button and updates aria-pressed", () => {
      renderAccessibilityApp(["/"]);

      const contrastButtons = screen.getAllByRole("button", { name: /high contrast/i });
      const contrastBtn = contrastButtons[0];
      expect(contrastBtn.getAttribute("aria-pressed")).toBe("false");

      fireEvent.click(contrastBtn);
      expect(contrastBtn.getAttribute("aria-pressed")).toBe("true");
      expect(document.documentElement.classList.contains("high-contrast")).toBe(true);

      fireEvent.click(contrastBtn);
      expect(contrastBtn.getAttribute("aria-pressed")).toBe("false");
      expect(document.documentElement.classList.contains("high-contrast")).toBe(false);
    });

    it("has accessible touch targets >= 44px", () => {
      renderAccessibilityApp(["/"]);
      const btnNormal = screen.getAllByRole("button", { name: /text size: normal/i })[0];
      expect(btnNormal.className).toMatch(/min-h-\[44px\]/);
      expect(btnNormal.className).toMatch(/min-w-\[44px\]/);
    });
  });

  describe("Accessibility Modal Dialog & Keyboard Trap", () => {
    it("opens when clicking the accessibility help button and has proper dialog roles", () => {
      renderAccessibilityApp(["/"]);

      // Modal should initially not be visible
      expect(screen.queryByRole("dialog")).toBeNull();

      // Click help/settings button in toolbar
      const helpButtons = screen.getAllByRole("button", { name: /accessibility support & settings/i });
      fireEvent.click(helpButtons[0]);

      // Dialog should now be in the DOM
      const dialog = screen.getByRole("dialog");
      expect(dialog).not.toBeNull();
      expect(dialog.getAttribute("aria-modal")).toBe("true");
      expect(dialog.getAttribute("aria-labelledby")).toBe("a11y-dialog-title");

      // Contains title
      expect(screen.getByRole("heading", { name: /accessibility support & settings/i })).not.toBeNull();
    });

    it("opens when clicking the Accessibility footer button", () => {
      renderAccessibilityApp(["/"]);

      const footerBtn = screen.getByRole("button", { name: /^accessibility$/i });
      fireEvent.click(footerBtn);

      expect(screen.getByRole("dialog")).not.toBeNull();
    });

    it("closes modal on Escape key press", () => {
      renderAccessibilityApp(["/"]);

      const helpButtons = screen.getAllByRole("button", { name: /accessibility support & settings/i });
      fireEvent.click(helpButtons[0]);
      expect(screen.getByRole("dialog")).not.toBeNull();

      // Press Escape
      fireEvent.keyDown(window, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("closes modal when clicking the Close button", () => {
      renderAccessibilityApp(["/"]);

      const helpButtons = screen.getAllByRole("button", { name: /accessibility support & settings/i });
      fireEvent.click(helpButtons[0]);
      const closeBtn = screen.getAllByRole("button", { name: /close window/i })[0];

      fireEvent.click(closeBtn);
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("displays keyboard guide with shortcuts explained", () => {
      renderAccessibilityApp(["/"]);

      const helpButtons = screen.getAllByRole("button", { name: /accessibility support & settings/i });
      fireEvent.click(helpButtons[0]);

      // Check keyboard guide presence
      expect(screen.getByText(/keyboard navigation guide/i)).not.toBeNull();
      expect(screen.getByText("Tab / Shift+Tab")).not.toBeNull();
      expect(screen.getByText("Enter / Space")).not.toBeNull();
      expect(screen.getAllByText(/Escape \(Esc\)/i).length).toBeGreaterThan(0);
    });

    it("displays toll-free Kisan Call Centre helpline 1800-180-1551", () => {
      renderAccessibilityApp(["/"]);

      const helpButtons = screen.getAllByRole("button", { name: /accessibility support & settings/i });
      fireEvent.click(helpButtons[0]);

      const helplineLinks = screen.getAllByRole("link", { name: /1800-180-1551/i });
      expect(helplineLinks.length).toBeGreaterThan(0);
      expect(helplineLinks[0].getAttribute("href")).toBe("tel:18001801551");
    });
  });

  describe("Bilingual Accessibility Translations (English & Hindi)", () => {
    it("renders accessibility labels and dialog in Hindi when language is switched", () => {
      renderAccessibilityApp(["/"]);

      // Switch language to Hindi
      const hiButton = screen.getAllByRole("button", { name: /हिन्दी/i })[0];
      fireEvent.click(hiButton);

      // Verify toolbar title / labels in Hindi
      const hindiHelpButtons = screen.getAllByRole("button", { name: /सुगमता सहायता एवं सेटिंग्स/i });
      expect(hindiHelpButtons.length).toBeGreaterThan(0);

      // Open modal in Hindi
      fireEvent.click(hindiHelpButtons[0]);
      expect(screen.getByRole("heading", { name: /सुगमता सहायता एवं सेटिंग्स/i })).not.toBeNull();
      expect(screen.getAllByText(/अक्षर आकार/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/उच्च कंट्रास्ट/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/कीबोर्ड नेविगेशन निर्देश/i)).not.toBeNull();
    });
  });

  describe("Skip Links and Semantic Landmarks Across Phase 1 Pages", () => {
    it("has accessible skip link and main landmark on Landing page", () => {
      renderAccessibilityApp(["/"]);
      const skipLink = screen.getByRole("link", { name: /skip to main content/i });
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute("href")).toBe("#main-content");
      expect(document.getElementById("main-content")).not.toBeNull();
    });

    it("has accessible skip link and main landmark on SchemeExplorer page", () => {
      renderAccessibilityApp(["/schemes"]);
      const skipLink = screen.getByRole("link", { name: /skip to main content/i });
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute("href")).toBe("#schemes-main-content");
      expect(document.getElementById("schemes-main-content")).not.toBeNull();
    });

    it("has accessible skip link and main landmark on EligibilityCheck page", () => {
      renderAccessibilityApp(["/eligibility"]);
      const skipLink = screen.getByRole("link", { name: /skip to main content/i });
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute("href")).toBe("#eligibility-main-content");
      expect(document.getElementById("eligibility-main-content")).not.toBeNull();
    });

    it("has accessible skip link and main landmark on CropDisease page", () => {
      renderAccessibilityApp(["/crop-disease"]);
      const skipLink = screen.getByRole("link", { name: /skip to main content/i });
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute("href")).toBe("#main-content");
      expect(document.getElementById("main-content")).not.toBeNull();
    });

    it("has accessible skip link and main landmark on SchemeDetails page", () => {
      renderAccessibilityApp(["/schemes/pm-kisan"]);
      const skipLink = screen.getByRole("link", { name: /skip to main content/i });
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute("href")).toBe("#main-content");
      expect(document.getElementById("main-content")).not.toBeNull();
    });

    it("has accessible skip link and main landmark on Help page", () => {
      renderAccessibilityApp(["/help"]);
      const skipLink = screen.getByRole("link", { name: /skip to main content/i });
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute("href")).toBe("#main-content");
      expect(document.getElementById("main-content")).not.toBeNull();
    });
  });
});
