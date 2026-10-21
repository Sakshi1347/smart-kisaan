# Future phases

The current Smart Kisaan demo covers: **browse schemes → details → farmer profile → eligibility copilot**.

The two major extensions below are **planned only**. Do not implement them in the current build.

Integration hooks already reserved:

- Route `/chat` → placeholder until DIY chatbot ships
- Contract stub: `src/lib/chatbot/contract.ts` (`askChatbot`, context types)
- Reusable data: scheme catalog (`useSchemes`), farmer profile (`useFarmerProfile`), eligibility (`copilot.ts`), keyword helpers (`schemeMatching.ts`)
- Language toggle exists and can feed EN/HI into later modes
- Flag file: `src/lib/phase1.ts` (`chatbot: false`)

**Do not** use OpenAI, Gemini, or other hosted LLM APIs for the planned DIY chatbot.

---

## Future Feature 1 — DIY AI chatbot (no external LLM API)

### Goal

Build a scheme-help chatbot **yourself**: intent understanding, retrieval over your scheme data, and answer generation — without calling OpenAI/Gemini/Claude APIs.

### What to research

- Rule-based vs ML chatbots for closed domains (govt schemes)
- Intent classification (keywords, TF-IDF + Naive Bayes/SVM, small neural classifiers)
- Entity extraction (state, crop, landholding, scheme names)
- Retrieval: keyword / BM25 over scheme text (start simple; embeddings only if you train/host them yourself)
- Response templates + slot filling vs generative models you train offline
- Evaluation: intent accuracy, retrieval precision@k, user task success
- Hindi + English (and Hinglish) handling for farmer queries

### Concepts / skills to learn

| Area | Learn |
|------|--------|
| NLP basics | Tokenization, normalization, stopwords (EN/HI), stemming/lemmatization |
| Intent recognition | Label set (`find_scheme`, `check_eligibility`, `list_documents`, `greet`, `fallback`) |
| QA / retrieval | Rank schemes from catalog; cite title + eligibility + next step |
| Algorithms | Start: rules + TF-IDF; optional: small classifier (scikit-learn) or tiny local model |
| Data | Hand-labeled Q→intent pairs; FAQ pairs from your catalog |
| Engineering | Message list UI; call `askChatbot()`; show related scheme cards |

### Build from scratch

1. Intent taxonomy + labeled examples (you create)
2. Preprocessor (lowercase, Hindi/English normalize — can reuse ideas from `schemeLanguage.ts`)
3. Intent classifier (your code)
4. Retriever over `SchemeRow[]` (can evolve from `schemeMatching.ts`)
5. Answer composer (templates first: “Based on your profile in {state}, consider {scheme}…”)
6. Chat page that calls `askChatbot(messages, context)` from `src/lib/chatbot/contract.ts`
7. Wire context: current profile + full/filtered catalog + optional `activeSchemeId`
8. Tests with fixed queries (“irrigation subsidy Maharashtra”)

### Integration with the current app

```
UI /chat  →  askChatbot(messages, { language, profile, schemes, activeSchemeId })
                ↓
         your DIY engine (local)
                ↓
         ChatbotReply { content, relatedSchemeIds, intent }
                ↓
         render markdown + links to /schemes/:id
```

Optional later: reuse `assessSchemeEligibility` from `copilot.ts` when intent is eligibility.

### Approximate effort (student pace)

| Stage | Time |
|-------|------|
| Research + dataset labeling | 1–2 weeks |
| Rules + retrieval MVP | 2–3 weeks |
| Classifier + bilingual polish + UI | 2–3 weeks |
| **Total** | **~5–8 weeks** |

---

## Future Feature 2 — Universal accessibility

### Goal

Make Smart Kisaan usable by people with different disabilities and literacy levels — not a single “default” user.

### Users to design for

| Need | Direction (research / later build) |
|------|-------------------------------------|
| Deaf / hard of hearing | Captions for any audio; visual alerts; text-first flows; avoid sound-only cues |
| Blind / low vision | Screen-reader semantics; high contrast; scalable text; keyboard nav; TTS for content |
| Illiterate / low literacy | Icon-first flows; minimal text; voice input/output; pictorial scheme categories |
| Speech / communication difficulty | Large tap targets; typed or symbol boards; avoid voice-only paths |
| Mobility | Full keyboard / switch access; large controls; no hover-only actions |
| Cognitive load | Short steps; one task per screen; plain language (EN/HI) |

### What to research

- WCAG 2.2 basics (perceivable, operable, understandable, robust)
- ARIA patterns for React (labels, live regions, focus order)
- Web Speech API (STT/TTS) vs on-device alternatives — for accessibility, browser APIs are OK; this is separate from the “no LLM API” chatbot rule
- Iconography and pictogram systems for agri tasks
- Sign-language video clips for key flows (feasibility: pre-recorded ISL clips for 5–10 screens, not real-time avatar unless researched later)
- Inclusive design with rural users (literacy, shared phones, noise)

### Concepts / skills to learn

- Semantic HTML + focus management
- `prefers-reduced-motion`, contrast, zoom to 200%
- Screen-reader testing (NVDA / VoiceOver)
- Multimodal UI: voice ↔ text ↔ icons
- Progressive enhancement (app usable with JS + without audio)

### Build from scratch (phased a11y work)

1. Audit current pages (schemes, details, profile, copilot)
2. Fix structure: headings, labels, alt text, focus rings, skip link
3. Keyboard-only pass through main flow
4. High-contrast / large-text theme toggle
5. Icon + short-label mode for low literacy
6. Optional TTS for scheme description / copilot summary
7. Optional STT for search box (accessibility aid, not the DIY brain)
8. Visual-only notifications (no sound-only errors)
9. Optional: short ISL video helpers for “How to apply” steps

### Integration with the current app

- Wrap existing pages; do not rewrite scheme/copilot logic
- Accessibility settings in context (e.g. `AccessibilityProvider`) reading/writing preferences
- Chatbot (when built) should respect the same modes: TTS replies, high contrast, simple language templates

### Approximate effort (student pace)

| Stage | Time |
|-------|------|
| WCAG research + audit | 3–5 days |
| Core a11y fixes + keyboard/screen reader | 1–2 weeks |
| Literacy / icon / TTS-STT modes | 2–3 weeks |
| Sign-language clips (limited set) | +1–2 weeks optional |
| **Total** | **~4–7 weeks** (deeper ISL work longer) |

---

## Suggested order after the current demo

1. Keep the demo stable  
2. **Accessibility foundation** (helps all later UI, including chat)  
3. **DIY chatbot** using `contract.ts` + scheme/profile context  
4. Multimodal polish (voice + icons) on top of both  

## Current vs later

| In the current demo | Not now |
|---------------------|---------|
| Scheme browse/filter | DIY chatbot UI/engine |
| Scheme details | External LLM chat |
| Farmer profile | Full accessibility system |
| Eligibility copilot | Document OCR, crop scan, auth dashboard |
| EN/HI toggle | Sign language, STT/TTS product modes |
