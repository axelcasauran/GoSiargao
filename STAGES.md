# Build Stages — Go Siargao

Staged implementation plan with status. Updated as each stage completed.

| # | Stage | Status |
|---|-------|--------|
| 0 | Import design from the `claude_design` MCP & analyze screens / data model | ✅ Done |
| 1 | Scaffold Expo SDK 56 app (TypeScript, Expo Router), theme tokens, structure | ✅ Done |
| 2 | Convex backend — schema, `places`/`saves`/`users` functions, seed, `_generated` stubs | ✅ Done (code) |
| 3 | Convex Auth + Google provider config, client provider wiring, env scaffolding | ✅ Done (code) |
| 4 | Design system — typography, SVG `Icon` set, `PhotoBlock` hatch, toast, cards/primitives | ✅ Done |
| 5 | Screens — Discover, Explore (list+map), Events, My Trip, Place Detail, Search, custom tab bar | ✅ Done |
| 6 | Auth gate (Google Login/Signup) + realtime saved-items via Convex | ✅ Done |
| 7 | Typecheck, Metro bundle verification, README + `.env.example`, stage docs | ✅ Done |

## Verification

- `npx tsc --noEmit` — clean (app **and** `convex/`).
- `npx expo export --platform android` — bundles successfully (exit 0).

## Remaining (require your accounts/credentials)

These can't be automated — they need an interactive login or external secrets:

1. **Deploy Convex** — `npx convex dev` (logs in, creates the deployment,
   regenerates `convex/_generated/*`, writes `EXPO_PUBLIC_CONVEX_URL`), then
   `npm run seed`.
2. **Google OAuth** — `npx @convex-dev/auth`, create a Google OAuth client, and
   `npx convex env set AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET`.
3. **Dev build for sign-in** — Google OAuth needs the `gosiargao://` scheme, so
   run on a dev build (`npx expo run:ios|android`), not Expo Go.

Full walkthrough in [`README.md`](./README.md) → **Setup**.

## Design fidelity notes

- Every icon is transcribed 1:1 from the design's inline SVGs (`src/components/Icon.tsx`).
- Photos are tinted hatch placeholders, matching the design (no stock imagery).
- Display font is Space Grotesk standing in for Clash Display (swap instructions in README).
