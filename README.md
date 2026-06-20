# Go Siargao 🏝️

A realtime island-guide app for **Siargao, Philippines** — surf spots, lagoons,
food, stays and events. Built with **Expo (SDK 56)**, **Convex** (realtime
database) and **Convex Auth** with **Google OAuth**. The UI is a faithful
implementation of the [Claude Design](https://claude.ai/design/p/08447a87-f818-44a7-89ff-885af046af64?file=Siargao.dc.html)
source (`Siargao.dc.html`).

## Stack

| Concern        | Choice                                                   |
| -------------- | -------------------------------------------------------- |
| App framework  | Expo SDK 56 · React Native 0.85 · React 19               |
| Navigation     | Expo Router (file-based, typed routes)                   |
| Database       | Convex (realtime queries + mutations)                    |
| Auth           | Convex Auth (`@convex-dev/auth`) → Google OAuth          |
| Icons / shapes | `react-native-svg` (every icon transcribed from the design) |
| Fonts          | Inter (body) · Space Grotesk (display stand-in for Clash Display) |

## Screens

`Discover` · `Explore` (list + map) · `Events` · `My Trip` (saved + itinerary)
· `Place Detail` · `Search`, plus a branded Google **Login/Signup** gate. Saved
places sync in realtime per user through Convex.

## Project layout

```
convex/                 # Backend: schema, auth, queries/mutations, seed
  schema.ts             # places + saves tables (+ Convex Auth tables)
  auth.ts               # Convex Auth w/ Google provider
  places.ts saves.ts    # queries / mutations (saves = realtime "My Trip")
  seed.ts               # `npm run seed` populates the catalog
src/
  app/                  # Expo Router routes
    _layout.tsx         # fonts + providers + auth gate
    (tabs)/             # Discover / Explore / Events / My Trip + custom tab bar
    place/[id].tsx      # Place detail
    search.tsx          # Search modal
  components/           # Icon, PhotoBlock, cards, primitives, Toast, LoginScreen
  data/places.ts        # The catalog (single source of truth; seeds Convex)
  lib/                  # convex client, catalog/saves hooks, place actions
  theme/                # colors, fonts, radii, shadows
design/Siargao.dc.html  # imported design source (reference)
```

## Setup

### 1. Install

```bash
npm install
```

### 2. Convex (realtime database)

```bash
npx convex dev
```

This logs you into Convex, creates a dev deployment, regenerates
`convex/_generated/*` and writes `EXPO_PUBLIC_CONVEX_URL` into `.env.local`.
Leave it running (it watches `convex/`). Then seed the catalog:

```bash
npm run seed          # = npx convex run seed:run  → "Seeded 10 places"
```

### 3. Convex Auth + Google OAuth

a. Initialise auth keys (one-time — generates `JWT_PRIVATE_KEY` / `JWKS` and
`SITE_URL` on the deployment):

```bash
npx @convex-dev/auth
```

b. Create an OAuth client in the
[Google Cloud Console](https://console.cloud.google.com/apis/credentials)
→ **Create credentials → OAuth client ID → Web application**. Add this
**Authorized redirect URI** (use your real deployment domain from
`npx convex dashboard`):

```
https://<your-deployment>.convex.site/api/auth/callback/google
```

c. Store the credentials on the Convex deployment:

```bash
npx convex env set AUTH_GOOGLE_ID     <client-id>
npx convex env set AUTH_GOOGLE_SECRET <client-secret>
```

### 4. Run

```bash
npx expo start
```

> **Native build required for Google sign-in.** The OAuth redirect uses the
> `gosiargao://` scheme, which Expo Go can't register. Use a dev build:
> `npx expo run:ios` / `npx expo run:android` (or an EAS dev build). The rest of
> the app runs in Expo Go.

Until `EXPO_PUBLIC_CONVEX_URL` is set the app shows a **"Connect Convex"**
screen instead of crashing. The catalog also falls back to bundled data while
Convex loads, so screens are never empty.

## Notes

- **Display font.** The design uses *Clash Display* (Fontshare). To keep the
  project buildable straight from `npm install`, the display face is **Space
  Grotesk** (Google Fonts). Drop Clash Display `.ttf`s into `assets/fonts` and
  remap `fonts.display` in `src/theme/index.ts` for a 1:1 match.
- **Placeholder imagery.** Like the design, photos are tinted blocks with a
  diagonal hatch (`src/components/PhotoBlock.tsx`) rather than real images.
- See [`STAGES.md`](./STAGES.md) for the staged build plan and status.
