## 1. Project Scaffold

- [x] 1.1 Initialize Vite project with Vanilla TypeScript template (`npm create vite@latest`)
- [x] 1.2 Install and configure Tailwind CSS v4 with Vite
- [x] 1.3 Install `vite-plugin-pwa` and configure Workbox GenerateSW strategy
- [x] 1.4 Add Web App Manifest (name, icons, theme color, display: standalone)
- [x] 1.5 Set up TypeScript strict mode and basic tsconfig
- [x] 1.6 Install and configure Vitest for unit testing

## 2. JWT Decode

- [x] 2.1 Implement `decodeJwt(token: string)` — split on `.`, base64url-decode header and payload, return typed result
- [x] 2.2 Handle decode errors (malformed token, non-JSON payload) and return typed error result
- [x] 2.3 Write unit tests for `decodeJwt` covering valid tokens, invalid input, and edge cases
- [x] 2.4 Build the decode view: textarea input + decoded header/payload panels (pretty-printed JSON)
- [x] 2.5 Display `exp` claim as a human-readable date/time next to the raw value
- [x] 2.6 Show signature section with "not verified" notice

## 3. JWT History

- [x] 3.1 Implement `historyStore` module: load, save, delete entries from localStorage
- [x] 3.2 Write unit tests for `historyStore` (save, dedup, delete, load on init)
- [x] 3.3 Auto-save a successfully decoded JWT to history (dedup by token string)
- [x] 3.4 Build the history list panel: show label (`sub`/`iss` or truncated token), expiry status, saved-at date
- [x] 3.5 Wire history item selection: populate input and trigger decode
- [x] 3.6 Add delete button per history entry with immediate localStorage + UI update
- [x] 3.7 Show empty state message when history is empty

## 4. App Shell & Layout

- [x] 4.1 Build overall page layout: history sidebar + main decode panel
- [x] 4.2 Make layout responsive (stacked on mobile, side-by-side on desktop)
- [x] 4.3 Verify app loads and runs fully offline (service worker precaches all assets)
- [x] 4.4 Confirm PWA install prompt appears in a supported browser
