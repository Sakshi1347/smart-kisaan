/**
 * Current product scope flags (~30–40% working demo).
 * Core demo: browse schemes → open details → save profile → see eligibility copilot.
 *
 * Future (documented in FUTURE_PHASES.md — not implemented here):
 * - DIY AI chatbot (no OpenAI/Gemini/external LLM APIs)
 * - Universal accessibility (multi-disability support)
 */
export const PHASE1 = {
  /** Prefer built-in catalog so demos work without Supabase. */
  preferLocalSchemeCatalog: true,
  /** Auth, saved schemes, chat history sync */
  authAndDashboard: false,
  /** Multi-scheme compare */
  schemeCompare: false,
  /** Document verifier / converter / OCR */
  documentTools: false,
  /** Crop health camera scanner */
  cropScanner: true,
  /**
   * Chatbot UI/API — off in the current demo.
   * Future DIY chatbot mounts at /chat via the contract in src/lib/chatbot/.
   */
  chatbot: false,
  /** Voice recording / STT — future accessibility + chatbot work */
  voiceTranscription: false,
  /** External LLM APIs (Gemini/OpenAI) — never for the planned DIY chatbot */
  remoteAiChat: false,
} as const;
