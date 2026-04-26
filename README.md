# JWT Manager

**[https://tangkevkev.github.io/jwt-manager/](https://tangkevkev.github.io/jwt-manager/)**

A minimal tool for working with JSON Web Tokens — runs entirely in your browser, no external server communication involved.

## What it does

Paste a JWT and instantly see its decoded header and payload in a readable format. The expiry claim is highlighted so you can tell at a glance whether a token is still valid.

Tokens you decode are saved to a local history so you can come back to them later. Recent tokens expire automatically after 24 hours. Tokens you explicitly save are kept permanently and can be given a custom name.

## Key properties

- **Offline-capable** — works without an internet connection once loaded
- **Installable** — can be installed as a PWA (Progressive Web App) from your browser, so it behaves like a native app on desktop or mobile
- **Local-only** — all data stays in your browser's local storage, nothing is sent anywhere
- **No account required** — open it and use it

## Install as an app

In any major browser, open the app URL and look for the install prompt in the address bar or browser menu. On mobile, use "Add to Home Screen".

Once installed, JWT Manager opens in its own window without browser chrome and works fully offline.

## Development

```bash
npm install
npm run dev      # start dev server
npm test         # run tests
npm run build    # production build
```

Built with TypeScript, Vite, and Tailwind CSS v4.
