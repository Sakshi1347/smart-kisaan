import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DocumentVerifier from "@/components/DocumentVerifier";
import DocumentConverter from "@/components/DocumentConverter";

const mockGetSession = vi.fn();
const mockToastError = vi.fn();
const mockInvoke = vi.fn();

const translations: Record<string, string> = {
  "doc.title": "Document Verification",
  "doc.requiredDocs": "Required documents",
  "doc.confidence": "Confidence",
  "doc.reupload": "Re-upload",
  "doc.allVerified": "All verified",
  "doc.verifyFailed": "Verification failed",
  "doc.autoVerifyFail": "Auto verification failed",
};

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    t: (key: string) => translations[key] ?? key,
  }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

vi.mock("@/lib/supabaseConfig", () => ({
  getSupabaseFunctionUrl: (name: string) => `https://example.supabase.co/functions/v1/${name}`,
  getSupabasePublishableKey: () => "test-publishable-key",
}));

vi.mock("@/hooks/useDocumentReadiness", () => ({
  useDocumentReadiness: () => ({
    summary: {
      requiredDocs: ["Aadhaar Card", "Bank Passbook"],
      uploadedDocs: [],
      verifiedDocs: [],
      missingDocs: ["Aadhaar Card", "Bank Passbook"],
      qualityWarnings: [],
      completionPct: 0,
      entries: [],
    },
    saveReadinessEntry: vi.fn(),
    isSaving: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

describe("document flows (deferred components; not in current UI)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockInvoke.mockResolvedValue({ data: null, error: null });

    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: vi.fn((input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();

        if (url.includes("/verify-document")) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                status: "VERIFIED",
                confidence: 92,
                message: "OCR matched the Aadhaar fields.",
                extractedText: "Name: Ravi Kumar\nAadhaar: 1234 5678 9012",
                detectedFields: ["Name", "Aadhaar number"],
                missingFields: [],
                tips: [],
                ocrPerformed: true,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            ),
          );
        }

        if (url.includes("/convert-document")) {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                translatedText: "यह अनूदित दस्तावेज़ है।",
                originalText: "This is the source document.",
                detectedSourceLanguage: "English",
                warnings: [],
                ocrPerformed: true,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            ),
          );
        }

        return Promise.reject(new Error(`Unexpected fetch call: ${url}`));
      }),
    });

    Object.defineProperty(globalThis.URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:preview"),
    });
  });

  it("uploads a real file to document verification and renders OCR results", async () => {
    render(
      <DocumentVerifier
        scheme={{ title: "Farmer Scheme", category: "Agriculture" } as never}
        onClose={vi.fn()}
      />,
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["image-data"], "aadhaar.png", { type: "image/png" });

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      const verifyCall = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.find(([url]) =>
        String(url).includes("/verify-document"),
      );
      expect(verifyCall).toBeTruthy();
      const payload = JSON.parse(String(verifyCall?.[1]?.body ?? "{}"));
      expect(payload.documentType).toBe("Aadhaar Card");
      expect(payload.fileName).toBe("aadhaar.png");
      expect(payload.fileMimeType).toBe("image/png");
      expect(payload.fileBase64).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText("OCR matched the Aadhaar fields.")).toBeInTheDocument();
    });

    expect(screen.getByText("OCR")).toBeInTheDocument();
    expect(screen.getByText(/Aadhaar: 1234 5678 9012/)).toBeInTheDocument();
    expect(screen.getAllByText((content) => content.includes("Aadhaar Card")).length).toBeGreaterThan(0);
  });

  it("uploads a document for conversion and renders the translated output", async () => {
    render(<DocumentConverter />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["image-data"], "notice.png", { type: "image/png" });

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByRole("button", { name: "Convert document" }));

    await waitFor(() => {
      const convertCall = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.find(([url]) =>
        String(url).includes("/convert-document"),
      );
      expect(convertCall).toBeTruthy();
      const payload = JSON.parse(String(convertCall?.[1]?.body ?? "{}"));
      expect(payload.sourceLanguage).toBe("en");
      expect(payload.targetLanguage).toBe("hi");
      expect(payload.fileName).toBe("notice.png");
      expect(payload.fileMimeType).toBe("image/png");
      expect(payload.fileBase64).toBeTruthy();
    });

    await waitFor(() => {
      expect(screen.getByText("यह अनूदित दस्तावेज़ है।")).toBeInTheDocument();
    });

    expect(screen.getByText("Detected source language:")).toBeInTheDocument();
    expect(screen.getByText("Download text")).toBeInTheDocument();
  });
});
