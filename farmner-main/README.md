# Smart Kisaan

Working demo for **scheme discovery + farmer profile + eligibility guidance**.  
Future DIY chatbot and accessibility are documented in [`FUTURE_PHASES.md`](./FUTURE_PHASES.md) — not implemented in this build.

## Current demo

1. Browse / search / filter schemes (local catalog — no Supabase required)
2. Open scheme details
3. Save a farmer profile (localStorage)
4. See Application Copilot eligibility + checklist
5. English / Hindi language toggle

## Not in this build

- AI chatbot (DIY version planned later — **no OpenAI/Gemini APIs**)
- Universal accessibility system (planned later)
- Auth, dashboard, saved schemes, scheme compare
- Document verify / convert / OCR
- Crop health scanner

Feature flags: `src/lib/phase1.ts`  
Chatbot integration stub (unimplemented): `src/lib/chatbot/contract.ts`

## Run

```bash
npm install
npm run dev
```

Open http://localhost:8080 — no `.env` required for the current demo.

## Demo script

1. Home → **Explore Schemes**
2. Filter by state/category → open a scheme
3. Fill **Farmer profile** → save
4. Review **Application Copilot** eligibility
