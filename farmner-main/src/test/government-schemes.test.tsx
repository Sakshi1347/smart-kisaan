import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "@/pages/Landing";
import SchemeExplorer from "@/pages/SchemeExplorer";
import SchemeDetails from "@/pages/SchemeDetails";
import { VERIFIED_GOVERNMENT_SCHEMES } from "@/lib/localSchemeCatalog";

function renderWithProviders(initialEntry = "/schemes") {
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
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/schemes" element={<SchemeExplorer />} />
              <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
            </Routes>
          </MemoryRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe("Phase 1 — Feature 3: Government Agriculture Schemes", () => {
  it("includes exactly 5 verified real Indian government agriculture schemes", () => {
    expect(VERIFIED_GOVERNMENT_SCHEMES).toHaveLength(5);
    const ids = VERIFIED_GOVERNMENT_SCHEMES.map((s) => s.id);
    expect(ids).toContain("pm-kisan");
    expect(ids).toContain("pmfby");
    expect(ids).toContain("kcc");
    expect(ids).toContain("soil-health-card");
    expect(ids).toContain("pmksy-pdmc");
  });

  it("navigates from the home page to the Government Schemes page", async () => {
    localStorage.clear();
    renderWithProviders("/");

    const schemeCard = screen.getByRole("heading", { name: /Government Schemes/i });
    expect(schemeCard).toBeInTheDocument();

    const openSchemesLink = screen.getByRole("link", { name: /Government Schemes/i });
    expect(openSchemesLink).toHaveAttribute("href", "/schemes");
  });

  it("renders verified scheme cards with benefits, eligibility, documents, and official portal links", async () => {
    localStorage.clear();
    renderWithProviders("/schemes");

    // Wait for async scheme data to render
    const pmKisanHeading = await screen.findByRole("heading", {
      level: 2,
      name: /PM-KISAN \(Pradhan Mantri Kisan Samman Nidhi\)/i,
    });
    expect(pmKisanHeading).toBeInTheDocument();

    // Page heading and explanation
    expect(
      screen.getByRole("heading", { level: 1, name: /Government Agriculture Schemes/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explore verified Indian government agriculture and farmer-welfare schemes/i),
    ).toBeInTheDocument();

    // Verify benefits and eligibility
    expect(screen.getByText(/₹6,000 annual direct income support/i)).toBeInTheDocument();
    expect(
      screen.getByText(/All landholder farmer families who have cultivable land/i),
    ).toBeInTheDocument();

    // Verify official portal links
    const officialLinks = screen.getAllByRole("link", {
      name: /Opens official government website in a new tab/i,
    });
    expect(officialLinks.length).toBeGreaterThanOrEqual(5);

    const pmKisanLink = officialLinks.find(
      (link) => link.getAttribute("href") === "https://pmkisan.gov.in/",
    );
    expect(pmKisanLink).toBeDefined();
    expect(pmKisanLink).toHaveAttribute("target", "_blank");
    expect(pmKisanLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("filters schemes by search query in English and Hindi", async () => {
    localStorage.clear();
    renderWithProviders("/schemes");

    // Wait for schemes to load
    await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i });

    const searchInput = screen.getByLabelText(/Search Schemes/i);

    // Search by keyword "Insurance"
    fireEvent.change(searchInput, { target: { value: "Insurance" } });
    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: /Pradhan Mantri Fasal Bima Yojana \(PMFBY\)/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: /Soil Health Card/i }),
    ).not.toBeInTheDocument();

    // Search by Hindi keyword "सिंचाई" (Irrigation)
    fireEvent.change(searchInput, { target: { value: "सिंचाई" } });
    expect(
      await screen.findByRole("heading", { level: 2, name: /PM Krishi Sinchayee Yojana/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: /PM-KISAN/i })).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByLabelText(/Clear Search/i);
    fireEvent.click(clearBtn);
    expect(
      await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i }),
    ).toBeInTheDocument();
  });

  it("filters schemes by category pills", async () => {
    localStorage.clear();
    renderWithProviders("/schemes");

    // Wait for schemes and category tabs to load
    await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i });
    const cropInsuranceTab = await screen.findByRole("tab", { name: /Crop Insurance/i });
    fireEvent.click(cropInsuranceTab);

    expect(
      await screen.findByRole("heading", { level: 2, name: /Pradhan Mantri Fasal Bima Yojana/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: /PM-KISAN/i })).not.toBeInTheDocument();

    // Return to All Categories
    const allTab = await screen.findByRole("tab", { name: /All Categories/i });
    fireEvent.click(allTab);
    expect(
      await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Soil Health Card/i })).toBeInTheDocument();
  });

  it("displays an accessible empty state with a reset button when no schemes match", async () => {
    localStorage.clear();
    renderWithProviders("/schemes");

    await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i });

    const searchInput = screen.getByLabelText(/Search Schemes/i);
    fireEvent.change(searchInput, { target: { value: "NonExistentSchemeXYZ" } });

    expect(
      await screen.findByRole("heading", { level: 2, name: /No matching schemes found/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No schemes found matching your search/i)).toBeInTheDocument();

    // Reset filters
    const resetButtons = screen.getAllByRole("button", { name: /Reset Search & Filters/i });
    fireEvent.click(resetButtons[0]);

    expect(
      await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i }),
    ).toBeInTheDocument();
  });

  it("supports Hindi language switching across scheme cards and scheme details", async () => {
    localStorage.setItem("smart_kisaan_language", "hi");
    renderWithProviders("/schemes");

    // Wait for Hindi content
    const pmKisanHeading = await screen.findByRole("heading", {
      level: 2,
      name: /पीएम-किसान \(प्रधानमंत्री किसान सम्मान निधि\)/i,
    });
    expect(pmKisanHeading).toBeInTheDocument();

    // Heading in Hindi
    expect(
      screen.getByRole("heading", { level: 1, name: /सरकारी कृषि योजनाएँ/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/सरकारी सत्यापित/i).length).toBeGreaterThan(0);

    // Open scheme details
    const viewDetailLinks = screen.getAllByRole("link", { name: /योजना विवरण देखें/i });
    fireEvent.click(viewDetailLinks[0]);

    // Check SchemeDetails content in Hindi
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /पीएम-किसान \(प्रधानमंत्री किसान सम्मान निधि\)/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /सत्यापित पात्रता शर्तें/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /आवश्यक दस्तावेज़/i })).toBeInTheDocument();
    expect(
      screen.getByText(/आधार कार्ड \(अनिवार्य और मोबाइल से लिंक\)/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /आधिकारिक पोर्टल पर जाएँ/i })).toBeInTheDocument();
  });

  it("provides proper accessibility attributes (WCAG 2.1 AA)", async () => {
    localStorage.clear();
    renderWithProviders("/schemes");

    await screen.findByRole("heading", { level: 2, name: /PM-KISAN/i });

    // Skip to content link
    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#schemes-main-content");

    // Live region status for results count
    const liveStatuses = screen.getAllByRole("status");
    expect(liveStatuses.some((el) => el.getAttribute("aria-live") === "polite")).toBe(true);

    // Tablist with aria-selected
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs.length).toBeGreaterThan(1);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    // External link disclaimer
    expect(screen.getByText(/Official Application Notice/i)).toBeInTheDocument();
  });
});
