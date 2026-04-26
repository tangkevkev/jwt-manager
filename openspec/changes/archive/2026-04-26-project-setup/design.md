## Context

JWT Manager is a local-first PWA built from scratch. There is no existing codebase. The app runs entirely in the browser — no server, no external API calls. It must work offline after the first load, and optionally be installable on desktop/mobile via PWA standards.

Users paste a raw JWT string and see the decoded header and payload. Previously decoded tokens are persisted to localStorage so they can be reviewed later without re-pasting.

## Goals / Non-Goals

**Goals:**
- Project scaffold: Vite + Vanilla TypeScript + Tailwind CSS
- Offline-capable PWA via `vite-plugin-pwa` + Workbox
- JWT decode: split token, base64url-decode header and payload, display as formatted JSON
- JWT history: save tokens to localStorage, list them, select to view details
- Simple, responsive single-page layout

**Non-Goals:**
- JWT signature verification (no secret/key management in v1)
- Token editing or re-signing
- Backend, sync, or cloud storage
- User accounts or authentication

## Decisions

### Vanilla TypeScript over a framework
Single-responsibility UI with no routing or reactive state graph. The app has two concerns: decode a token and list saved ones. A framework adds indirection without benefit at this scale.
- Alternative considered: React — rejected because it adds a VDOM, JSX compilation, and hook mental model for what amounts to ~3 DOM interactions.

### Vite as build tool
Fastest dev server startup, native ESM, excellent TypeScript support out of the box, and `vite-plugin-pwa` is the de-facto Workbox integration for Vite projects.
- Alternative considered: esbuild directly — rejected because it lacks a dev server and HMR without additional wiring.

### Tailwind CSS for styling
Utility classes keep styling co-located with markup without CSS Modules overhead. The design is simple enough that no component library is needed.
- Alternative considered: plain CSS — rejected to keep spacing/color consistency without writing a design system.

### localStorage for persistence
Synchronous, zero-dependency, well-understood API. The dataset (a list of JWTs) will realistically stay small (hundreds of tokens at most). IndexedDB is unnecessary complexity.
- Alternative considered: IndexedDB — rejected due to async complexity with no payoff at this data scale.

### JWT decoding without a library
JWT structure is well-specified: `<base64url-header>.<base64url-payload>.<signature>`. Decoding is `atob()` + `JSON.parse()` with base64url-to-base64 normalization (replace `-` → `+`, `_` → `/`, add padding). No library needed — fewer dependencies, smaller bundle, works fully offline.

### PWA: GenerateSW strategy
`vite-plugin-pwa` with `generateSW` (Workbox) is the simplest path to a working service worker. It precaches all build assets automatically. No custom service worker code needed for v1.

## Risks / Trade-offs

- **localStorage size limit (~5 MB)** → History entries store the raw JWT string plus minimal metadata. In practice well under the limit; no mitigation needed for v1.
- **No signature verification** → Users should understand decoded content only — the app cannot confirm a token is trusted. Mitigate with a visible UI note on the decode view.
- **base64url edge cases** → Tokens with unusual padding or non-standard encoding could fail silently. Mitigation: wrap decode in try/catch and display a clear error message.
- **PWA install prompt** → Browser install heuristics vary; the app will show the install prompt when available but cannot force it. Mitigation: add a Web App Manifest with all required fields.
