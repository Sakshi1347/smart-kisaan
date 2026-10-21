/**
 * Smart Kisaan — Robust Browser Speech Synthesis (TTS) Helper
 *
 * Solves browser TTS limitations across Chrome, Microsoft Edge, and Windows:
 * 1. Multi-tier voice selection:
 *    - Tier 1: True native Hindi voice (Microsoft Swara/Madhur Natural, Google हिन्दी, Microsoft Kalpana/Hemant).
 *    - Tier 2: Indian English voice (Microsoft Heera, Microsoft Ravi, Google English India) with clean phonetic Hindi.
 *    - Tier 3: Universal fallback voice with cadence-optimized phonetic script so it NEVER fails silently.
 * 2. Automatic runtime error recovery:
 *    - If Devanagari Unicode fails on Windows SAPI (language-unavailable), catches the error and auto-recovers
 *      with the phonetic Indian voice instead of aborting into silence.
 * 3. Asynchronous voice loading handling for Chromium (speechSynthesis.onvoiceschanged).
 * 4. Resumes stalled speech state via `speechSynthesis.resume()`.
 */

export interface VoiceInfo {
  isNativeHindi: boolean;
  voiceName: string;
  isIndianVoice: boolean;
}

export interface SpeakOptions {
  textHi: string;
  textHiPhonetic: string;
  textEn: string;
  language: "hi" | "en";
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (errorMsg: string) => void;
  onVoiceSelected?: (info: VoiceInfo) => void;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voice cache and listeners
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices?.() || [];
    window.speechSynthesis.onvoiceschanged = () => {
      try {
        cachedVoices = window.speechSynthesis.getVoices?.() || [];
      } catch {
        // ignore
      }
    };
  } catch {
    // ignore
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  try {
    const live = window.speechSynthesis.getVoices?.() || [];
    if (live.length > 0) {
      cachedVoices = live;
      return live;
    }
  } catch {
    // ignore
  }
  return cachedVoices;
}

/**
 * Searches for a true native Hindi voice in the browser/OS, prioritizing natural neural voices.
 */
export function findHindiVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  // 1. High-fidelity Natural / Neural voices in Edge & Chrome (Swara, Madhur, Google हिन्दी)
  const naturalVoice = voices.find((v) => {
    const name = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase().replace(/_/g, "-");
    const isHindi = lang.startsWith("hi") || name.includes("hindi") || name.includes("हिन्दी");
    return isHindi && (name.includes("natural") || name.includes("google") || name.includes("online"));
  });
  if (naturalVoice) return naturalVoice;

  // 2. Explicit hi-IN or hi voice code
  const exactCode = voices.find((v) => {
    const code = (v.lang || "").toLowerCase().replace(/_/g, "-");
    return code === "hi-in" || code === "hi" || code.startsWith("hi-");
  });
  if (exactCode) return exactCode;

  // 3. Voices with Hindi/हिन्दी in the name (e.g. Microsoft Kalpana, Hemant, Lekha, Neerja)
  const nameMatch = voices.find((v) => {
    const name = (v.name || "").toLowerCase();
    return (
      name.includes("hindi") ||
      name.includes("हिन्दी") ||
      name.includes("swara") ||
      name.includes("madhur") ||
      name.includes("kalpana") ||
      name.includes("hemant") ||
      name.includes("lekha") ||
      name.includes("neerja")
    );
  });
  if (nameMatch) return nameMatch;

  return null;
}

/**
 * Checks if a native Hindi voice pack is available in the current browser/OS.
 */
export function hasNativeHindiVoice(): boolean {
  return findHindiVoice() !== null;
}

/**
 * Searches for an Indian-accented English voice (en-IN), e.g. Microsoft Heera, Ravi, Google English India.
 * These voices naturally pronounce Indian names, syllables, and words far better than US/UK voices.
 */
export function findIndianVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  return (
    voices.find((v) => {
      const code = (v.lang || "").toLowerCase().replace(/_/g, "-");
      const name = (v.name || "").toLowerCase();
      return (
        code === "en-in" ||
        name.includes("heera") ||
        name.includes("ravi") ||
        (code.startsWith("en") && name.includes("india"))
      );
    }) || null
  );
}

/**
 * Searches for an English voice, preferring Indian English (en-IN).
 */
export function findEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  // 1. Indian English voice (e.g. en-IN, Microsoft Heera, Google English India)
  const indianEn = findIndianVoice();
  if (indianEn) return indianEn;

  // 2. Any English voice
  const anyEn = voices.find((v) => {
    const code = (v.lang || "").toLowerCase();
    return code.startsWith("en");
  });
  if (anyEn) return anyEn;

  // 3. System default or first voice
  return voices.find((v) => v.default) || voices[0] || null;
}

/**
 * Stops any ongoing speech synthesis safely.
 */
export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Speaks text using the best matching voice and script with multi-tier fallback and auto-recovery.
 * Returns a cancel function.
 */
export function speakSmartKisaanAudio(options: SpeakOptions): () => void {
  const {
    textHi,
    textHiPhonetic,
    textEn,
    language,
    rate = 0.88,
    pitch = 1.0,
    onStart,
    onEnd,
    onError,
    onVoiceSelected,
  } = options;

  if (!isSpeechSynthesisSupported()) {
    onError?.("Speech synthesis is not supported on this browser.");
    return () => {};
  }

  // Cancel any existing speech and resume if paused
  try {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    if (typeof window.speechSynthesis.resume === "function") {
      window.speechSynthesis.resume();
    }
  } catch {
    // ignore
  }

  let fallbackAttempted = false;

  const playSpeech = (
    text: string,
    voice: SpeechSynthesisVoice | null,
    langCode: string,
    speechRate: number,
    isHindiNative: boolean
  ) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = speechRate;
      utterance.pitch = pitch;

      if (voice) {
        utterance.voice = voice;
      }

      const voiceName = voice?.name || "System Voice";
      const voiceLang = (voice?.lang || "").toLowerCase();
      const isIndian =
        isHindiNative ||
        voiceLang.includes("in") ||
        voiceName.toLowerCase().includes("india") ||
        voiceName.toLowerCase().includes("heera") ||
        voiceName.toLowerCase().includes("ravi");

      onVoiceSelected?.({
        isNativeHindi: isHindiNative,
        voiceName,
        isIndianVoice: isIndian,
      });

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        // If native Hindi failed (e.g. language-unavailable or synthesis-failed on Windows SAPI),
        // automatically recover using the Indian / English phonetic voice instead of silent failure!
        if (language === "hi" && isHindiNative && !fallbackAttempted) {
          fallbackAttempted = true;
          const fallbackVoice = findIndianVoice() || findEnglishVoice();
          const targetLang = fallbackVoice?.lang || "en-IN";
          playSpeech(textHiPhonetic, fallbackVoice, targetLang, Math.min(speechRate, 0.82), false);
          return;
        }

        onError?.(e?.error || "Speech failed");
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      if (language === "hi" && isHindiNative && !fallbackAttempted) {
        fallbackAttempted = true;
        const fallbackVoice = findIndianVoice() || findEnglishVoice();
        const targetLang = fallbackVoice?.lang || "en-IN";
        playSpeech(textHiPhonetic, fallbackVoice, targetLang, Math.min(speechRate, 0.82), false);
        return;
      }
      onError?.(err?.message || "Speech failed");
      onEnd?.();
    }
  };

  if (language === "hi") {
    const hindiVoice = findHindiVoice();
    if (hindiVoice) {
      // True native Hindi voice available (e.g. Edge Swara/Madhur or Chrome Google हिन्दी or Windows Kalpana/Hemant)
      playSpeech(textHi, hindiVoice, "hi-IN", rate, true);
    } else {
      // No native Hindi voice installed on the OS.
      // Use Indian English voice (Heera/Ravi) or English voice with phonetic script so it NEVER fails silently!
      fallbackAttempted = true;
      const fallbackVoice = findIndianVoice() || findEnglishVoice();
      const targetLang = fallbackVoice?.lang || "en-IN";
      playSpeech(textHiPhonetic, fallbackVoice, targetLang, Math.min(rate, 0.82), false);
    }
  } else {
    const englishVoice = findEnglishVoice();
    playSpeech(textEn, englishVoice, englishVoice?.lang || "en-IN", rate, false);
  }

  return () => {
    stopSpeech();
  };
}
