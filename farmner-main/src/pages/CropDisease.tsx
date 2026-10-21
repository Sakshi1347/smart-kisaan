import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  FileText,
  HelpCircle,
  Info,
  Leaf,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import {
  analyzeCropImage,
  validateCropImageFile,
  generateSampleLeafDataUrl,
  type CropDiseaseResult,
} from "@/lib/cropDiseaseEngine";
import {
  speakSmartKisaanAudio,
  stopSpeech,
  isSpeechSynthesisSupported,
} from "@/lib/speechSynthesisHelper";

export const CropDisease: React.FC = () => {
  const { t, language } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);

  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<CropDiseaseResult | null>(null);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechStatus, setSpeechStatus] = useState<string | null>(null);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      cancelSpeechRef.current?.();
      stopSpeech();
    };
  }, []);

  const handleSpeechToggle = () => {
    if (!isSpeechSynthesisSupported()) {
      setSpeechStatus(language === "hi" ? "ऑडियो समर्थित नहीं है" : "Audio not supported");
      return;
    }

    if (isSpeaking) {
      cancelSpeechRef.current?.();
      cancelSpeechRef.current = null;
      stopSpeech();
      setIsSpeaking(false);
      setSpeechStatus(null);
      return;
    }

    const textHi = `${t("crop.title")}। ${t("crop.subtitle")}। पत्ती की फोटो अपलोड करने के लिए 'पत्ती की फोटो चुनें' दबाएँ, या कैमरे से फोटो लेने के लिए 'कैमरे से फोटो लें' दबाएँ। फोटो चुनने के बाद 'पत्ती के स्वास्थ्य की जाँच करें' बटन दबाएँ।`;

    const textHiPhonetic = "Fasal rog ki pehchaan. Patti ki photo upload karein ya camera se photo lein. Phir patti ki jaanch karein button dabayein.";

    const textEn = `${t("crop.title")}. ${t("crop.subtitle")}. Tap 'Choose Leaf Photo' to upload, or 'Take Photo with Camera' to capture. Then tap 'Analyze Leaf Health' to see the result.`;

    cancelSpeechRef.current = speakSmartKisaanAudio({
      textHi,
      textHiPhonetic,
      textEn,
      language,
      rate: 0.86,
      onStart: () => {
        setIsSpeaking(true);
        setSpeechStatus(language === "hi" ? "ऑडियो चल रहा है..." : "Playing audio...");
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeechStatus(null);
        cancelSpeechRef.current = null;
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeechStatus(null);
        cancelSpeechRef.current = null;
      },
      onVoiceSelected: (info) => {
        if (language === "hi") {
          setSpeechStatus(
            info.isNativeHindi
              ? "ऑडियो चल रहा है (प्राकृतिक आवाज़)"
              : "ऑडियो चल रहा है (सुझाव: बेहतर आवाज़ हेतु Edge में खोलें)"
          );
        } else {
          setSpeechStatus("Playing audio...");
        }
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateCropImageFile(file);

    if (!validation.isValid) {
      setValidationError(language === "hi" ? validation.errorHi || "अमान्य फ़ाइल" : validation.errorEn || "Invalid file");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImageSrc(dataUrl);
      setSelectedFileName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setSelectedFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be re-selected if desired
    e.target.value = "";
  };

  const handleSampleSelect = (type: "healthy" | "blight" | "chlorosis") => {
    setValidationError(null);
    const sampleDataUrl = generateSampleLeafDataUrl(type);
    setSelectedImageSrc(sampleDataUrl);
    const nameMap = {
      healthy: language === "hi" ? "नमूना: स्वस्थ पत्ती" : "Sample: Healthy Leaf",
      blight: language === "hi" ? "नमूना: पत्ती झुलसा" : "Sample: Leaf Blight",
      chlorosis: language === "hi" ? "नमूना: क्लोरोसिस" : "Sample: Chlorosis",
    };
    setSelectedFileName(nameMap[type]);
    setSelectedFileSize("~45 KB");
    setAnalysisResult(null);
  };

  const handleRemoveImage = () => {
    setSelectedImageSrc(null);
    setSelectedFileName(null);
    setSelectedFileSize(null);
    setAnalysisResult(null);
    setValidationError(null);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTriggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleRunAnalysis = () => {
    if (!selectedImageSrc) return;

    setIsAnalyzing(true);
    setValidationError(null);

    // Create an image element in memory to pass to client-side engine
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const result = analyzeCropImage(img);
        setAnalysisResult(result);
      } catch (err: any) {
        setValidationError(
          language === "hi"
            ? "विश्लेषण करने में त्रुटि हुई। कृपया दूसरी फोटो आज़माएँ।"
            : "Error analyzing image. Please try a different photo."
        );
      } finally {
        setIsAnalyzing(false);
      }
    };
    img.onerror = () => {
      setValidationError(
        language === "hi"
          ? "छवि लोड करने में विफल। कृपया दूसरी फोटो आज़माएँ।"
          : "Failed to load image. Please select a different file."
      );
      setIsAnalyzing(false);
    };
    img.src = selectedImageSrc;
  };

  const getSeverityBadge = (severity: CropDiseaseResult["severity"]) => {
    switch (severity) {
      case "none":
        return {
          text: t("crop.severityNone"),
          color: "bg-emerald-950/80 text-emerald-300 border-emerald-500/30",
        };
      case "low":
        return {
          text: t("crop.severityLow"),
          color: "bg-blue-950/80 text-blue-300 border-blue-500/30",
        };
      case "medium":
        return {
          text: t("crop.severityMedium"),
          color: "bg-amber-950/80 text-amber-300 border-amber-500/30",
        };
      case "high":
        return {
          text: t("crop.severityHigh"),
          color: "bg-rose-950/80 text-rose-300 border-rose-500/30",
        };
      case "uncertain":
      default:
        return {
          text: t("crop.severityUncertain"),
          color: "bg-zinc-800/80 text-zinc-300 border-zinc-600/40",
        };
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* WCAG Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-3 focus:font-headline focus:font-bold focus:text-primary-foreground focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-foreground"
      >
        {t("home.skipLink")}
      </a>

      {/* Hidden file & camera inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Upload leaf photo"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        capture="environment"
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Capture leaf photo with camera"
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-8 md:pt-10 focus:outline-none"
      >
        {/* Page Header */}
        <header className="mb-8 rounded-3xl bg-surface-container p-6 md:p-8 ghost-border shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t("crop.portalBadge")}</span>
              </div>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                {t("crop.title")}
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
                {t("crop.subtitle")}
              </p>
            </div>

            {/* Audio Guidance Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSpeechToggle}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 font-headline font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSpeaking
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-surface-high hover:bg-surface-highest text-foreground ghost-border"
                }`}
                aria-pressed={isSpeaking}
                aria-label={isSpeaking ? "Stop audio instructions" : "Listen to page instructions"}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-5 w-5" aria-hidden="true" />
                    <span>{speechStatus || "Stop Audio"}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>{language === "hi" ? "निर्देश सुनें" : "Listen Guidance"}</span>
                  </>
                )}
              </button>
              <LanguageToggle />
            </div>
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 px-4 py-3 text-xs md:text-sm text-emerald-200">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>{t("crop.privacyGuarantee")}</span>
          </div>
        </header>

        {/* Validation Error Alert */}
        {validationError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-950/50 border border-rose-500/30 p-4 text-sm text-rose-200"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold">{language === "hi" ? "फ़ाइल त्रुटि:" : "File Error:"}</p>
              <p>{validationError}</p>
            </div>
          </div>
        )}

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Image Input & Preview (5 cols) */}
          <section
            aria-labelledby="input-section-heading"
            className="space-y-6 lg:col-span-5"
          >
            <div className="rounded-3xl bg-surface-container p-6 ghost-border shadow-md space-y-5">
              <div>
                <h2
                  id="input-section-heading"
                  className="font-headline text-xl font-bold text-foreground"
                >
                  {t("crop.inputHeading")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("crop.inputSubtitle")}
                </p>
              </div>

              {/* Action Buttons: Upload & Camera */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/30 p-4 font-headline font-bold text-primary transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[90px]"
                >
                  <Upload className="h-6 w-6" aria-hidden="true" />
                  <span className="text-sm">{t("crop.uploadBtn")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerCamera}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-4 font-headline font-bold text-emerald-400 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 min-h-[90px]"
                >
                  <Camera className="h-6 w-6" aria-hidden="true" />
                  <span className="text-sm">{t("crop.cameraBtn")}</span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                {t("crop.fileHint")}
              </p>

              {/* Sample Leaves Options */}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("crop.sampleHeading")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSampleSelect("healthy")}
                    className="rounded-xl bg-surface-high hover:bg-surface-highest border border-emerald-500/30 p-2 text-xs font-semibold text-emerald-300 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    🌿 {t("crop.sampleHealthy")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleSelect("blight")}
                    className="rounded-xl bg-surface-high hover:bg-surface-highest border border-rose-500/30 p-2 text-xs font-semibold text-rose-300 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    🍂 {t("crop.sampleBlight")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleSelect("chlorosis")}
                    className="rounded-xl bg-surface-high hover:bg-surface-highest border border-amber-500/30 p-2 text-xs font-semibold text-amber-300 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    🍃 {t("crop.sampleChlorosis")}
                  </button>
                </div>
              </div>

              {/* Image Preview Box */}
              {selectedImageSrc && (
                <div className="pt-2 space-y-4">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-black/40">
                    <img
                      src={selectedImageSrc}
                      alt="Selected crop leaf for disease detection"
                      className="h-56 w-full object-contain"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-xs text-white">
                      <p className="truncate font-bold">{selectedFileName}</p>
                      {selectedFileSize && <p className="text-zinc-400">{selectedFileSize}</p>}
                    </div>
                  </div>

                  {/* Preview Controls: Replace, Remove, Analyze */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      className="flex-1 rounded-xl bg-surface-high hover:bg-surface-highest ghost-border px-3 py-2 text-xs font-bold text-foreground transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t("crop.replaceBtn")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-300 transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                      aria-label="Remove selected photo"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t("crop.removeBtn")}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 px-4 font-headline font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" aria-hidden="true" />
                        <span>{t("crop.analyzing")}</span>
                      </>
                    ) : (
                      <>
                        <Leaf className="h-5 w-5" aria-hidden="true" />
                        <span>{analysisResult ? t("crop.reanalyzeBtn") : t("crop.analyzeBtn")}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Analysis Results or Empty State (7 cols) */}
          <section
            aria-labelledby="results-section-heading"
            className="space-y-6 lg:col-span-7"
          >
            {isAnalyzing && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-3xl bg-surface-container p-8 ghost-border text-center space-y-4"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary animate-pulse">
                  <Leaf className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="font-headline text-xl font-bold text-foreground">
                  {t("crop.analyzing")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {language === "hi"
                    ? "ब्राउज़र में पिक्सल स्तर पर पर्ण वर्णक और ऊतक क्षति का मूल्यांकन किया जा रहा है..."
                    : "Offscreen canvas is evaluating foliar pigments, chlorosis, and necrotic lesion zones on your device..."}
                </p>
              </div>
            )}

            {!isAnalyzing && !analysisResult && (
              <div className="rounded-3xl bg-surface-container p-8 ghost-border text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-high text-muted-foreground ghost-border">
                  <Leaf className="h-8 w-8 opacity-40" aria-hidden="true" />
                </div>
                <h2
                  id="results-section-heading"
                  className="font-headline text-xl font-bold text-foreground"
                >
                  {t("crop.resultHeading")}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {language === "hi"
                    ? "बाईं ओर एक पत्ती की फोटो चुनें या नमूना आज़माएँ और 'पत्ती के स्वास्थ्य की जाँच करें' दबाएँ।"
                    : "Select a crop leaf photo on the left or try a sample leaf, then tap 'Analyze Leaf Health'."}
                </p>

                {/* Practical Advice Tips */}
                <div className="mt-6 rounded-2xl bg-surface-high/50 p-4 text-left text-xs space-y-2 text-muted-foreground ghost-border">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>{language === "hi" ? "बेहतर परिणाम के लिए सुझाव:" : "Tips for Accurate Results:"}</span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{language === "hi" ? "पत्ती को बीच में रखें और फ्रेम में अधिक पत्ती क्षेत्र दिखाएँ।" : "Frame a single leaf clearly against a plain background."}</li>
                    <li>{language === "hi" ? "दिन की अच्छी प्राकृतिक रोशनी में फोटो खींचें।" : "Use natural daylight without severe dark shadows or flash glare."}</li>
                    <li>{language === "hi" ? "पत्तियों के दोनों तरफ के लक्षणों का ध्यान रखें।" : "Inspect both the upper and lower leaf surface."}</li>
                  </ul>
                </div>
              </div>
            )}

            {!isAnalyzing && analysisResult && (
              <div
                role="region"
                aria-live="polite"
                aria-label={t("crop.resultHeading")}
                className="space-y-6"
              >
                {/* Result Summary Card */}
                <article className="rounded-3xl bg-surface-container p-6 md:p-8 ghost-border shadow-lg space-y-6">
                  {/* Class Badge & Severity */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                        <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {language === "hi" ? analysisResult.classNameHi : analysisResult.classNameEn}
                        </span>
                      </span>
                    </div>

                    {/* Severity Badge */}
                    {(() => {
                      const badge = getSeverityBadge(analysisResult.severity);
                      return (
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.color}`}
                        >
                          {t("crop.severityLabel")} {badge.text}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Title & Explanation */}
                  <div>
                    <h2
                      id="results-section-heading"
                      className="font-headline text-2xl font-extrabold text-foreground"
                    >
                      {language === "hi" ? analysisResult.titleHi : analysisResult.titleEn}
                    </h2>
                    <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                      {language === "hi" ? analysisResult.explanationHi : analysisResult.explanationEn}
                    </p>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-2 rounded-2xl bg-surface-high/60 p-4 ghost-border">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-foreground">{t("crop.confidenceLabel")}</span>
                      <span className="text-primary">{analysisResult.confidence}%</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={analysisResult.confidence}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Confidence score percentage"
                      className="h-3 w-full overflow-hidden rounded-full bg-surface-highest"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-500"
                        style={{ width: `${analysisResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Foliar Metrics Breakdown */}
                  <div className="space-y-3 pt-2 border-t border-border/50">
                    <h3 className="font-headline text-sm font-bold text-foreground">
                      {t("crop.metricsHeading")}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="rounded-xl bg-surface-high p-3 text-center ghost-border">
                        <p className="text-xs text-muted-foreground">{t("crop.leafCoverage")}</p>
                        <p className="font-headline text-lg font-extrabold text-foreground mt-0.5">
                          {analysisResult.metrics.leafCoveragePct}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-surface-high p-3 text-center ghost-border">
                        <p className="text-xs text-muted-foreground">{t("crop.healthyTissue")}</p>
                        <p className="font-headline text-lg font-extrabold text-emerald-400 mt-0.5">
                          {analysisResult.metrics.healthyPct}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-surface-high p-3 text-center ghost-border">
                        <p className="text-xs text-muted-foreground">{t("crop.chlorosisTissue")}</p>
                        <p className="font-headline text-lg font-extrabold text-amber-400 mt-0.5">
                          {analysisResult.metrics.chlorosisPct}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-surface-high p-3 text-center ghost-border">
                        <p className="text-xs text-muted-foreground">{t("crop.necrosisTissue")}</p>
                        <p className="font-headline text-lg font-extrabold text-rose-400 mt-0.5">
                          {analysisResult.metrics.necrosisPct}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Practical Safe Next Steps */}
                  <div className="space-y-3 pt-2 border-t border-border/50">
                    <h3 className="font-headline text-sm font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>{t("crop.recommendationsHeading")}</span>
                    </h3>
                    <ul className="space-y-2">
                      {(language === "hi"
                        ? analysisResult.recommendationsHi
                        : analysisResult.recommendationsEn
                      ).map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-foreground/90 bg-surface-high/40 rounded-xl p-2.5 ghost-border"
                        >
                          <span className="font-bold text-primary shrink-0 mt-0.5">{idx + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cautious Chemical Spray Warning */}
                  <div className="rounded-2xl bg-amber-950/40 border border-amber-500/30 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold">
                        {language === "hi" ? "सुरक्षा चेतावनी:" : "Safety Precaution:"}
                      </p>
                      <p className="mt-0.5">
                        {language === "hi"
                          ? "किसी भी रासायनिक कीटनाशक का छिड़काव बिना कृषि अधिकारी की पुष्टि के न करें। हमेशा जैविक व प्राकृतिक उपायों को प्राथमिकता दें।"
                          : "Do not spray synthetic chemical pesticides or fungicides without confirmation from an authorized agricultural extension officer. Prioritize safe non-chemical and cultural practices."}
                      </p>
                    </div>
                  </div>
                </article>

                {/* Scheme Link & Loss Compensation Banner */}
                <div className="rounded-3xl bg-surface-container p-6 ghost-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-headline font-bold text-foreground text-sm">
                      {t("crop.lossCompensation")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "hi"
                        ? "फसल बीमा योजना के तहत नुकसान की सूचना 72 घंटे के अंदर देना अनिवार्य है।"
                        : "Mandatory intimation within 72 hours for localized crop loss under PMFBY."}
                    </p>
                  </div>
                  <Link
                    to="/eligibility?scheme=pmfby"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary shrink-0"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    <span>{t("crop.checkPmfby")}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Toll-Free Agronomist Help Helpline */}
            <div className="rounded-3xl bg-surface-container p-6 ghost-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <PhoneCall className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {language === "hi" ? "किसान हेल्पलाइन" : "Kisan Call Centre Helpline"}
                  </p>
                  <p className="font-headline text-lg font-extrabold text-foreground">
                    1800-180-1551
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("crop.kvkHelp")}
                  </p>
                </div>
              </div>

              <a
                href="tel:18001801551"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400 shrink-0"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                <span>{language === "hi" ? "कॉल करें (टोल-फ्री)" : "Call Toll-Free"}</span>
              </a>
            </div>

            {/* Technical Scope & Disclaimer Box */}
            <aside
              aria-label="Technical Scope and Disclaimer"
              className="rounded-3xl bg-surface-container/70 p-6 ghost-border space-y-3 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2 font-bold text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{t("crop.disclaimerTitle")}</span>
              </div>
              <p className="leading-relaxed">
                {t("crop.disclaimerBody")}
              </p>
              <div className="pt-2 border-t border-border/40 text-[11px] space-y-1">
                <p className="font-semibold text-foreground/80">
                  {t("crop.modelInfoHeading")}:
                </p>
                <p>
                  {analysisResult?.modelInfo.engine || "Smart Kisaan Local Computer Vision (CV) Foliar Analyzer v1.0"}
                  {" • "}
                  {analysisResult?.modelInfo.processingType || "Client-Side Chromatic Spectrometry"}
                </p>
                <p className="italic">
                  {language === "hi"
                    ? analysisResult?.modelInfo.limitationsHi || "पत्तियों के रंग व धब्बों के पैटर्न पर आधारित। यह प्रयोगशाला निदान का विकल्प नहीं है।"
                    : analysisResult?.modelInfo.limitationsEn || "Analyzes foliar chromatic patterns. Does not replace laboratory pathology tests."}
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CropDisease;
