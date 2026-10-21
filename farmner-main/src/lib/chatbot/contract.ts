/**
 * Future DIY chatbot — integration contract only (not implemented in the current demo).
 *
 * Later you will implement askChatbot() yourself using your own NLP / intent /
 * retrieval logic. Do NOT wire OpenAI, Gemini, or other hosted LLM APIs here.
 *
 * Existing app data you can reuse as context:
 * - Farmer profile: useFarmerProfile / FarmerProfile
 * - Scheme catalog: useSchemes / SchemeRow
 * - Matching helpers (optional starting point): schemeMatching.ts, copilot.ts
 */

import type { FarmerProfile } from "@/lib/copilotTypes";
import type { SchemeRow } from "@/hooks/useSchemes";

export type ChatbotRole = "user" | "assistant" | "system";

export type ChatbotMessage = {
  role: ChatbotRole;
  content: string;
};

export type ChatbotRequestContext = {
  language: "en" | "hi";
  profile: FarmerProfile | null;
  /** Active catalog slice the bot may search or cite */
  schemes: SchemeRow[];
  /** Optional scheme the user is currently viewing */
  activeSchemeId?: string | null;
};

export type ChatbotReply = {
  content: string;
  /** Optional scheme IDs the answer refers to (for UI cards later) */
  relatedSchemeIds?: string[];
  /** Optional intent label from your own classifier */
  intent?: string;
};

/**
 * Placeholder for the future DIY chatbot engine.
 * The current demo deliberately does not provide an implementation.
 */
export async function askChatbot(
  _messages: ChatbotMessage[],
  _context: ChatbotRequestContext,
): Promise<ChatbotReply> {
  throw new Error(
    "DIY chatbot is not available yet. See FUTURE_PHASES.md and implement askChatbot() without external LLM APIs.",
  );
}
