import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CropDisease from "@/pages/CropDisease";
import {
  validateCropImageFile,
  generateSampleLeafDataUrl,
  analyzeCropImage,
} from "@/lib/cropDiseaseEngine";

// Mock canvas and ImageData for jsdom environment
class MockImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  constructor(dataOrWidth: number | Uint8ClampedArray, widthOrHeight: number, height?: number) {
    if (typeof dataOrWidth === "number") {
      this.width = dataOrWidth;
      this.height = widthOrHeight;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else {
      this.data = dataOrWidth;
      this.width = widthOrHeight;
      this.height = height || Math.floor(dataOrWidth.length / (widthOrHeight * 4));
    }
  }
}

if (typeof (global as any).ImageData === "undefined") {
  (global as any).ImageData = MockImageData;
}

let activePixelGenerator: ((x: number, y: number, w: number, h: number) => [number, number, number, number]) | null = null;

const createMockContext = () => ({
  fillStyle: "#000",
  strokeStyle: "#000",
  lineWidth: 1,
  fillRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  beginPath: vi.fn(),
  ellipse: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  drawImage: vi.fn(),
  getImageData: vi.fn((sx: number, sy: number, sw: number, sh: number) => {
    const data = new Uint8ClampedArray(sw * sh * 4);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const idx = (y * sw + x) * 4;
        if (activePixelGenerator) {
          const [r, g, b, a] = activePixelGenerator(x, y, sw, sh);
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = a;
        } else {
          // Default: simulate healthy green leaf in center, neutral outside
          const dx = x - sw / 2;
          const dy = y - sh / 2;
          const dist = (dx * dx) / (sw * 0.35 * sw * 0.35) + (dy * dy) / (sh * 0.45 * sh * 0.45);
          if (dist <= 1.0) {
            data[idx] = 40;     // red
            data[idx + 1] = 130; // green (dominant)
            data[idx + 2] = 40;  // blue
            data[idx + 3] = 255;
          } else {
            data[idx] = 220;
            data[idx + 1] = 220;
            data[idx + 2] = 220;
            data[idx + 3] = 255;
          }
        }
      }
    }
    return new MockImageData(data, sw, sh);
  }),
});

beforeEach(() => {
  activePixelGenerator = null;

  // Mock HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => createMockContext()) as any;
  HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue("data:image/jpeg;base64,mockSampleLeafData");

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

  // Mock Image onload trigger in jsdom when src is assigned
  Object.defineProperty(HTMLImageElement.prototype, "src", {
    set(value: string) {
      this._mockSrc = value;
      setTimeout(() => {
        if (this.onload) {
          (this.onload as any)({} as Event);
        }
      }, 0);
    },
    get() {
      return this._mockSrc;
    },
    configurable: true,
  });
});

const renderCropDiseasePage = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <CropDisease />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe("Phase 1 — Feature 5: Basic Crop Disease Detection Prototype", () => {
  describe("Engine Unit Tests: Validation, Generation, and Classification", () => {
    it("validates crop image file formats and 10MB limits correctly", () => {
      // Valid JPG file
      const validJpg = new File(["dummy content"], "leaf.jpg", { type: "image/jpeg" });
      expect(validateCropImageFile(validJpg).isValid).toBe(true);

      // Valid PNG file
      const validPng = new File(["dummy content"], "crop.png", { type: "image/png" });
      expect(validateCropImageFile(validPng).isValid).toBe(true);

      // Valid WebP file
      const validWebp = new File(["dummy content"], "foliage.webp", { type: "image/webp" });
      expect(validateCropImageFile(validWebp).isValid).toBe(true);

      // Invalid file extension
      const invalidPdf = new File(["dummy"], "receipt.pdf", { type: "application/pdf" });
      const pdfRes = validateCropImageFile(invalidPdf);
      expect(pdfRes.isValid).toBe(false);
      expect(pdfRes.errorEn).toContain("Unsupported file format");

      // Oversized file > 10MB
      const hugeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], "giant_leaf.jpg", {
        type: "image/jpeg",
      });
      const hugeRes = validateCropImageFile(hugeFile);
      expect(hugeRes.isValid).toBe(false);
      expect(hugeRes.errorEn).toContain("exceeds the 10 MB limit");

      // Null file
      const nullRes = validateCropImageFile(null as any);
      expect(nullRes.isValid).toBe(false);
    });

    it("generates in-memory sample leaf data URLs", () => {
      const healthyUrl = generateSampleLeafDataUrl("healthy");
      expect(healthyUrl).toContain("data:image/jpeg;base64,");

      const blightUrl = generateSampleLeafDataUrl("blight");
      expect(blightUrl).toContain("data:image/jpeg;base64,");

      const chlorosisUrl = generateSampleLeafDataUrl("chlorosis");
      expect(chlorosisUrl).toContain("data:image/jpeg;base64,");
    });

    it("classifies healthy green foliage accurately", () => {
      // Generator for healthy green leaf (dominant green, low red/blue)
      activePixelGenerator = (x, y, w, h) => {
        const dx = x - w / 2;
        const dy = y - h / 2;
        const dist = (dx * dx) / (w * 0.35 * w * 0.35) + (dy * dy) / (h * 0.45 * h * 0.45);
        if (dist <= 1.0) {
          return [35, 140, 35, 255]; // pure healthy green
        }
        return [220, 220, 220, 255]; // backdrop
      };

      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 180;
      const result = analyzeCropImage(canvas);

      expect(result.classId).toBe("healthy");
      expect(result.confidence).toBeGreaterThanOrEqual(75);
      expect(result.severity).toBe("none");
      expect(result.metrics.healthyPct).toBeGreaterThan(80);
      expect(result.metrics.necrosisPct).toBeLessThan(10);
      expect(result.recommendationsEn.length).toBeGreaterThan(0);
    });

    it("classifies foliar leaf blight / necrotic spots accurately", () => {
      // Generator for leaf with dark brown/black necrotic lesions
      activePixelGenerator = (x, y, w, h) => {
        const dx = x - w / 2;
        const dy = y - h / 2;
        const dist = (dx * dx) / (w * 0.35 * w * 0.35) + (dy * dy) / (h * 0.45 * h * 0.45);
        if (dist <= 1.0) {
          // Half of the leaf is necrotic lesions (dark brown: red > green * 1.1, low brightness)
          if (x > w / 2) {
            return [70, 35, 20, 255]; // necrotic tissue
          }
          return [45, 120, 40, 255]; // green tissue
        }
        return [220, 220, 220, 255];
      };

      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 180;
      const result = analyzeCropImage(canvas);

      expect(result.classId).toBe("leaf_blight");
      expect(result.confidence).toBeGreaterThanOrEqual(65);
      expect(result.metrics.necrosisPct).toBeGreaterThanOrEqual(18);
      expect(result.explanationEn).toContain("necrotic lesion tissue");
    });

    it("classifies chlorosis / nutrient deficiency stress accurately", () => {
      // Generator for yellowing leaf tissue
      activePixelGenerator = (x, y, w, h) => {
        const dx = x - w / 2;
        const dy = y - h / 2;
        const dist = (dx * dx) / (w * 0.35 * w * 0.35) + (dy * dy) / (h * 0.45 * h * 0.45);
        if (dist <= 1.0) {
          // Chlorotic yellow-green (red ~ 180, green ~ 185, blue ~ 30)
          return [180, 185, 30, 255];
        }
        return [220, 220, 220, 255];
      };

      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 180;
      const result = analyzeCropImage(canvas);

      expect(result.classId).toBe("chlorosis");
      expect(result.severity).toBe("medium");
      expect(result.metrics.chlorosisPct).toBeGreaterThanOrEqual(22);
      expect(result.explanationEn).toContain("yellowing across the leaf lamina");
    });

    it("detects inconclusive / low leaf coverage when foliage is under 18%", () => {
      // Generator with only neutral backdrop and no plant foliage
      activePixelGenerator = () => [230, 230, 230, 255];

      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 180;
      const result = analyzeCropImage(canvas);

      expect(result.classId).toBe("inconclusive");
      expect(result.isReliable).toBe(false);
      expect(result.severity).toBe("uncertain");
      expect(result.titleEn).toContain("Photo Needs Better Focus");
    });
  });

  describe("UI Component Tests: Rendering, Interaction, and Accessibility", () => {
    it("renders page header, title, skip link, and client-side privacy guarantee", () => {
      renderCropDiseasePage();

      expect(screen.getByRole("heading", { level: 1, name: /Crop Disease Detection/i })).toBeInTheDocument();
      expect(screen.getByText(/Local Foliage Health Screening/i)).toBeInTheDocument();
      expect(screen.getByText(/100% Client-Side Privacy/i)).toBeInTheDocument();

      const skipLink = screen.getByRole("link", { name: /Skip to main content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main-content");
    });

    it("renders user-initiated file upload, camera, and sample leaf buttons", () => {
      renderCropDiseasePage();

      expect(screen.getByRole("button", { name: /Choose Leaf Photo/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Take Photo with Camera/i })).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /Healthy Leaf/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Leaf Blight \/ Spots/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Yellowing \/ Chlorosis/i })).toBeInTheDocument();
    });

    it("provides speech audio guidance trigger for low-literacy farmers", () => {
      renderCropDiseasePage();

      const audioBtn = screen.getByRole("button", { name: /Listen to page instructions/i });
      expect(audioBtn).toBeInTheDocument();

      fireEvent.click(audioBtn);
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    it("loads sample image, displays preview, and allows removing it", () => {
      renderCropDiseasePage();

      // Click Healthy Leaf sample
      fireEvent.click(screen.getByRole("button", { name: /Healthy Leaf/i }));

      // Preview should now appear
      const previewImg = screen.getByAltText("Selected crop leaf for disease detection");
      expect(previewImg).toBeInTheDocument();
      expect(screen.getByText(/Sample: Healthy Leaf/i)).toBeInTheDocument();

      // Actions available: Replace, Remove, Analyze
      expect(screen.getByRole("button", { name: /Replace Photo/i })).toBeInTheDocument();
      const removeBtn = screen.getByRole("button", { name: /Remove selected photo/i });
      expect(removeBtn).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Analyze Leaf Health/i })).toBeInTheDocument();

      // Click remove button
      fireEvent.click(removeBtn);
      expect(screen.queryByAltText("Selected crop leaf for disease detection")).not.toBeInTheDocument();
    });

    it("displays validation error alert when invalid file format is uploaded", () => {
      renderCropDiseasePage();

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const invalidFile = new File(["test"], "document.pdf", { type: "application/pdf" });
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
    });

    it("runs foliar pixel analysis and renders full results breakdown and recommendations", async () => {
      renderCropDiseasePage();

      // Select a sample leaf
      fireEvent.click(screen.getByRole("button", { name: /Leaf Blight \/ Spots/i }));

      // Tap Analyze Leaf Health
      const analyzeBtn = screen.getByRole("button", { name: /Analyze Leaf Health/i });
      fireEvent.click(analyzeBtn);

      // Wait for analysis to complete and results region to render
      await waitFor(() => {
        expect(screen.getByRole("region", { name: /Foliage Health Results/i })).toBeInTheDocument();
      });

      // Verify confidence progressbar
      const progressBar = screen.getByRole("progressbar", { name: /Confidence score percentage/i });
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute("aria-valuenow");

      // Verify metrics breakdown
      expect(screen.getByText(/Foliar Metrics Breakdown/i)).toBeInTheDocument();
      expect(screen.getByText(/Leaf Coverage in Image/i)).toBeInTheDocument();
      expect(screen.getByText(/Healthy Green Pigment/i)).toBeInTheDocument();
      expect(screen.getByText(/Necrotic \/ Blight Lesions/i)).toBeInTheDocument();

      // Verify recommendations and safety warnings
      expect(screen.getByText(/Recommended Safe Practical Steps/i)).toBeInTheDocument();
      expect(screen.getByText(/Safety Precaution:/i)).toBeInTheDocument();
      expect(screen.getByText(/Do not spray synthetic chemical pesticides/i)).toBeInTheDocument();

      // Verify PMFBY crop loss compensation banner link
      const pmfbyLink = screen.getByRole("link", { name: /Check PMFBY Eligibility/i });
      expect(pmfbyLink).toHaveAttribute("href", "/eligibility?scheme=pmfby");
    });

    it("displays official Kisan Call Centre helpline 1800-180-1551 with direct dial link", () => {
      renderCropDiseasePage();

      expect(screen.getByText("1800-180-1551")).toBeInTheDocument();
      const callLink = screen.getByRole("link", { name: /Call Toll-Free/i });
      expect(callLink).toHaveAttribute("href", "tel:18001801551");
    });

    it("supports switching to Hindi across the Crop Disease interface", () => {
      renderCropDiseasePage();

      // Initially in English
      expect(screen.getByRole("heading", { level: 1, name: /Crop Disease Detection/i })).toBeInTheDocument();

      // Click Hindi toggle button
      const hindiBtn = screen.getByRole("button", { name: "हिन्दी" });
      fireEvent.click(hindiBtn);

      // Verify Hindi text rendered
      expect(screen.getByRole("heading", { level: 1, name: "फसल रोग की पहचान" })).toBeInTheDocument();
      expect(screen.getByText("पत्ती की फोटो चुनें")).toBeInTheDocument();
      expect(screen.getByText("कैमरे से फोटो लें")).toBeInTheDocument();
      expect(screen.getByText(/जांची गई नमूना पत्तियों से परीक्षण करें:/i)).toBeInTheDocument();
      expect(screen.getByText(/स्वस्थ पत्ती/i)).toBeInTheDocument();
      expect(screen.getByText(/झुलसा \/ काले धब्बे/i)).toBeInTheDocument();

      // Helpline dial link in Hindi
      expect(screen.getByText("कॉल करें (टोल-फ्री)")).toBeInTheDocument();
    });
  });
});
