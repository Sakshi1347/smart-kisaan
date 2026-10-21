import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useLanguage } from "./LanguageContext";

export type TextSize = "normal" | "large" | "xl";

export interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  toggleReducedMotion: () => void;
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  announce: (message: string, priority?: "polite" | "assertive") => void;
  resetAll: () => void;
}

export const STORAGE_KEY_TEXT_SIZE = "smart_kisaan_text_size";
export const STORAGE_KEY_HIGH_CONTRAST = "smart_kisaan_high_contrast";
export const STORAGE_KEY_REDUCED_MOTION = "smart_kisaan_reduced_motion";

const getInitialTextSize = (): TextSize => {
  if (typeof window === "undefined") return "normal";
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TEXT_SIZE);
    if (saved === "normal" || saved === "large" || saved === "xl") {
      return saved;
    }
  } catch (e) {
    console.warn("Failed to read text size from localStorage:", e);
  }
  return "normal";
};

const getInitialHighContrast = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY_HIGH_CONTRAST) === "true";
  } catch (e) {
    console.warn("Failed to read high contrast from localStorage:", e);
    return false;
  }
};

const getInitialReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_REDUCED_MOTION);
    if (saved !== null) {
      return saved === "true";
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    console.warn("Failed to read reduced motion from localStorage:", e);
    return false;
  }
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  textSize: "normal",
  setTextSize: () => {},
  increaseTextSize: () => {},
  decreaseTextSize: () => {},
  highContrast: false,
  setHighContrast: () => {},
  toggleHighContrast: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  toggleReducedMotion: () => {},
  isHelpModalOpen: false,
  openHelpModal: () => {},
  closeHelpModal: () => {},
  announce: () => {},
  resetAll: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();
  const [textSize, setTextSizeState] = useState<TextSize>(getInitialTextSize);
  const [highContrast, setHighContrastState] = useState<boolean>(getInitialHighContrast);
  const [reducedMotion, setReducedMotionState] = useState<boolean>(getInitialReducedMotion);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<{
    message: string;
    priority: "polite" | "assertive";
    id: number;
  }>({ message: "", priority: "polite", id: 0 });

  // Sync classes to documentElement
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.classList.remove("text-size-normal", "text-size-large", "text-size-xl");
    root.classList.add(`text-size-${textSize}`);

    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("reduce-motion", reducedMotion);
  }, [textSize, highContrast, reducedMotion]);

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    setAnnouncement({ message, priority, id: Date.now() });
  }, []);

  const setTextSize = useCallback(
    (size: TextSize) => {
      setTextSizeState(size);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_TEXT_SIZE, size);
        }
      } catch (e) {
        console.warn("Failed to persist text size:", e);
      }
      const labelMap = {
        normal: t("a11y.normal"),
        large: t("a11y.large"),
        xl: t("a11y.extraLarge"),
      };
      announce(t("a11y.liveAnnounceTextSize").replace("{size}", labelMap[size]));
    },
    [t, announce]
  );

  const increaseTextSize = useCallback(() => {
    if (textSize === "normal") setTextSize("large");
    else if (textSize === "large") setTextSize("xl");
  }, [textSize, setTextSize]);

  const decreaseTextSize = useCallback(() => {
    if (textSize === "xl") setTextSize("large");
    else if (textSize === "large") setTextSize("normal");
  }, [textSize, setTextSize]);

  const setHighContrast = useCallback(
    (enabled: boolean) => {
      setHighContrastState(enabled);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_HIGH_CONTRAST, String(enabled));
        }
      } catch (e) {
        console.warn("Failed to persist high contrast:", e);
      }
      announce(enabled ? t("a11y.liveAnnounceContrastOn") : t("a11y.liveAnnounceContrastOff"));
    },
    [t, announce]
  );

  const toggleHighContrast = useCallback(() => {
    setHighContrast(!highContrast);
  }, [highContrast, setHighContrast]);

  const setReducedMotion = useCallback(
    (enabled: boolean) => {
      setReducedMotionState(enabled);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_REDUCED_MOTION, String(enabled));
        }
      } catch (e) {
        console.warn("Failed to persist reduced motion:", e);
      }
      announce(enabled ? t("a11y.liveAnnounceMotionOn") : t("a11y.liveAnnounceMotionOff"));
    },
    [t, announce]
  );

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion(!reducedMotion);
  }, [reducedMotion, setReducedMotion]);

  const openHelpModal = useCallback(() => {
    setIsHelpModalOpen(true);
  }, []);

  const closeHelpModal = useCallback(() => {
    setIsHelpModalOpen(false);
  }, []);

  const resetAll = useCallback(() => {
    setTextSizeState("normal");
    setHighContrastState(false);
    setReducedMotionState(false);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_TEXT_SIZE);
        localStorage.removeItem(STORAGE_KEY_HIGH_CONTRAST);
        localStorage.removeItem(STORAGE_KEY_REDUCED_MOTION);
      }
    } catch (e) {
      console.warn("Failed to clear accessibility storage:", e);
    }
    announce(t("a11y.liveAnnounceReset"));
  }, [t, announce]);

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        increaseTextSize,
        decreaseTextSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        reducedMotion,
        setReducedMotion,
        toggleReducedMotion,
        isHelpModalOpen,
        openHelpModal,
        closeHelpModal,
        announce,
        resetAll,
      }}
    >
      {/* Live Region for Screen Reader Announcements */}
      <div
        id="a11y-live-announcer"
        role="status"
        aria-live={announcement.priority}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement.message}
      </div>

      {children}
    </AccessibilityContext.Provider>
  );
};
