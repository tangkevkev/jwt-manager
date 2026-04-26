## Why

The JWT Manager needs a foundational technology setup before any features can be built. We need to establish the project scaffold — build tooling, PWA configuration, and base architecture — so that all future work has a consistent, offline-capable foundation.

## What Changes

- Initialize a Vite project with Vanilla TypeScript
- Configure Tailwind CSS for styling
- Set up `vite-plugin-pwa` with a service worker for offline support and installability
- Implement JWT decode view: paste a token, display decoded header and payload
- Implement JWT history: persist previously entered tokens in localStorage and list them
- Basic app shell (layout, input area, history panel, detail view)

## Capabilities

### New Capabilities

- `jwt-decode`: Accept a JWT input, decode and display the header and payload as formatted JSON
- `jwt-history`: Persist decoded JWTs to localStorage; list saved tokens with metadata (label, issued-at, expiry); select a saved token to view its details

### Modified Capabilities

<!-- None — this is the initial project setup -->

## Impact

- New project from scratch: all files created
- Dependencies: `vite`, `typescript`, `tailwindcss`, `vite-plugin-pwa`, `workbox`
- No backend, no external API calls — entirely browser-local
