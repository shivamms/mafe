# CLAUDE.md — MAFE Project Context

> Read this before writing any code, suggesting any architecture, or making any decisions.

---

## 1. What Is MAFE?

**MAFE — Medical Assistance For Everyone**

An AI-powered multilingual medical information assistant built to make basic health knowledge accessible to everyone, everywhere — especially underserved communities.

**Live at:** https://mafe.app
**Fly.io app:** `mafe-app` (personal account — shivam.ms@gmail.com)
**GitHub:** https://github.com/shivamms/mafe

---

## 2. Core Principles

1. **Information only — never diagnosis.** Every response must recommend consulting a healthcare professional.
2. **LUI first** — Language User Interface. Conversation is the primary interface. No forms, no dashboards.
3. **Multilingual by default** — auto-detect language, respond in the same language. Never assume English.
4. **Emergency first** — life-threatening symptoms get emergency numbers before anything else.
5. **For everyone** — design for low-literacy users, slow connections, and first-time smartphone users. Avoid jargon.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| AI | Anthropic Claude (claude-sonnet-4-6) via Vercel AI SDK |
| Voice | OpenAI Whisper (auto language detection) |
| Auth | Supabase (Phase 2 — not yet built) |
| Deployment | Fly.io personal account |
| Domain | mafe.app |

---

## 4. File Structure

```
mafe/
├── CLAUDE.md
├── next.config.js          ← output: standalone (for Docker)
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json           ← @/ alias maps to project root
├── package.json
├── Dockerfile              ← multi-stage: builder + runner
├── fly.toml                ← mafe-app, iad region, internal_port=3000
├── .env.example
├── .gitignore
├── .dockerignore
├── public/
│   └── manifest.json       ← PWA manifest (installable on mobile)
├── app/
│   ├── layout.js           ← Inter font, PWA meta tags
│   ├── page.js             ← renders <Chat />
│   ├── globals.css         ← Tailwind + prose-mafe + dot animation
│   └── api/
│       ├── chat/route.js       ← streaming Claude endpoint (POST)
│       └── transcribe/route.js ← Whisper transcription (POST, multipart)
├── components/
│   ├── Chat.jsx            ← root component, useChat hook, state
│   ├── Header.jsx          ← logo + "New chat" button + Sign in
│   ├── Message.jsx         ← user/MAFE bubbles, emergency banner, markdown renderer
│   ├── InputBar.jsx        ← text + voice (MediaRecorder) + image attach + send
│   ├── Welcome.jsx         ← shown when no messages, 4 suggestion cards
│   └── DisclaimerBanner.jsx← first-visit bottom sheet, localStorage gated
└── lib/
    └── prompt.js           ← buildSystemPrompt(userContext) — the medical AI prompt
```

---

## 5. Design System

### Brand Colors
```
brand / teal-600:  #0d9488   primary (buttons, avatar, logo)
brand-dark:        #0f766e   hover states
brand-light:       #ccfbf1   tints
amber-500:         #f59e0b   accent (future use)
warm-50:           #fafaf9   page background
warm-100:          #f5f5f4   surfaces
warm-200:          #e7e5e4   borders
warm-600:          #78716c   muted text
warm-900:          #1c1917   primary text
emergency:         #dc2626   emergency alerts
```

### Typography
- Font: Inter (Google Fonts)
- Mono: system monospace (not used prominently)

### Key CSS Classes
- `.prose-mafe` — markdown rendering for AI responses (defined in globals.css)
- `.dot-1/2/3` — typing indicator bounce animation

---

## 6. Key Components

### Chat.jsx
- Uses `useChat` from `ai/react` for streaming
- `append()` for sending messages (supports multimodal content arrays)
- `setMessages([])` for new conversation
- Handles image → base64 conversion before sending

### Message.jsx
- Detects emergency keywords in AI response → shows red EmergencyBanner
- Minimal markdown renderer (bold, italic, lists, blockquotes, h3) — no external library
- User messages: right-aligned teal bubble
- MAFE messages: left-aligned white bubble with avatar

### InputBar.jsx
- Voice: `MediaRecorder` API → audio/webm blob → POST `/api/transcribe`
- Image: FileReader → base64 → passed to Chat as `imageFile` + `imagePreview`
- Textarea auto-grows with content (max 160px)
- Send on Enter (Shift+Enter for newline)

### DisclaimerBanner.jsx
- Shows on first visit only (`localStorage` key: `mafe_disclaimer_accepted`)
- Framer Motion bottom sheet + backdrop
- One button: "Got it, let's go" — stores acceptance and dismisses

---

## 7. Medical AI Prompt (lib/prompt.js)

The system prompt is the most critical piece. Key rules:
- **Emergency protocol** — life-threatening symptoms get emergency numbers FIRST (911, 108, 112, 192)
- **Language** — detect and respond in user's language (EN, ES, PT, TA, TE, KN, ML)
- **Never diagnose** — say "may indicate" or "could be associated with", never "you have X"
- **Always close** with: *"💙 This is general information only. Please consult a healthcare professional."*
- Optional `userContext` param — for Phase 2 when users have medical profiles

Do NOT modify the prompt casually. Every change has safety implications.

---

## 8. API Routes

### POST /api/chat
- Accepts: `{ messages: [], userContext: string | null }`
- Streams via Vercel AI SDK `streamText` → `toDataStreamResponse()`
- Model: `claude-sonnet-4-6`
- Max tokens: 1024

### POST /api/transcribe
- Accepts: `multipart/form-data` with `audio` field (audio/webm)
- Uses OpenAI Whisper (`whisper-1`) — no language hint, auto-detects
- Returns: `{ text: string }`

---

## 9. Environment Variables

```bash
ANTHROPIC_API_KEY=    # required — Claude API
OPENAI_API_KEY=       # required — Whisper voice transcription

# Phase 2
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Set on Fly.io with: `fly secrets set KEY=value --app mafe-app`

---

## 10. Deployment

```bash
# Dev
npm run dev

# Deploy
fly deploy --remote-only --app mafe-app

# Logs
fly logs --app mafe-app

# Secrets
fly secrets list --app mafe-app
```

### DNS (at registrar)
| Type | Name | Value |
|---|---|---|
| A | @ | 66.241.124.172 |
| AAAA | @ | 2a09:8280:1::ef:c615:0 |
| CNAME | www | mafe-app.fly.dev |

---

## 11. Phase 2 — Auth & User Context (Not Yet Built)

Planned with Supabase:
- Email + Google OAuth sign-in
- User profile: age, sex, known conditions, current medications, allergies
- This profile passed as `userContext` to `buildSystemPrompt()` — already supported
- Conversation history stored in Supabase

## 12. Future Features (Roadmap)

- **"Talk to MAFE"** — voice + camera interface (not "video consulting" — avoid regulatory language)
  - WebRTC camera access, periodic Claude Vision frames, ElevenLabs TTS response
  - Phase 3 feature
- Blog / health tips section on landing page
- Symptom history dashboard (post-auth)
- Offline support / service worker
- App Store submission (Capacitor or Expo wrapper)
