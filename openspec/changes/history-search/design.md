## Context

The history sidebar lists decoded JWTs in SAVED/RECENT sections. The main panel shows a decoded token (payload, header, signature). There is currently no way to find a specific token by content.

The app is vanilla TypeScript with no framework. All UI is rendered via `.innerHTML` string injection. The main panel (`#payload-output`) is currently always showing the decode view or empty.

## Goals / Non-Goals

**Goals:**
- Search input at the top of the history sidebar, always visible
- Searching filters across all history entries (both SAVED and RECENT) by payload JSON text and entry name/label
- Main panel switches to a results view while a query is active
- Each result card shows the entry name/label and a plain-text snippet of the matching payload context with the match term highlighted
- Clicking a result loads the token fully (same flow as selecting from history)
- Clearing the search input restores the previous main panel state (decode view or empty)

**Non-Goals:**
- Fuzzy matching — exact substring match (case-insensitive) is sufficient
- Searching header or signature content
- Persisting search queries
- Real-time debouncing (search on every keystroke is fine given small local dataset)

## Decisions

**1. Search logic in a separate `history-search.ts` module**

Keeps the search algorithm (filter + snippet extraction) pure and easily testable. The UI modules call it rather than embedding the logic inline.

**2. Snippet extraction: find first match in the stringified payload**

Stringify the payload to JSON, locate the first occurrence of the query, return ~60 characters of surrounding context. This is simple, reliable, and covers nested fields without needing to traverse the object tree. Alternative (field-by-field traversal) adds complexity with no user-visible benefit at this scale.

**3. Main panel swap via a shared state flag in `main.ts`**

`main.ts` already owns the main panel containers. A `currentQuery` string variable controls whether the panel shows the decode view or the search results. When query is non-empty, render search results into `#payload-output`; when empty, restore the decode view (or clear it if no token is loaded). No new state management library needed.

**4. Results rendered directly into `#payload-output`**

Reusing the existing payload container for search results avoids adding a new DOM element to the layout. The results view replaces the payload card while searching, which is intentional — the main panel's job shifts from "show current token" to "show search results".

## Risks / Trade-offs

- **Performance with large history**: Searching all entries on every keystroke is O(n) over the full history. Acceptable for a local tool where history is unlikely to exceed hundreds of entries.
  → No mitigation needed now; debounce can be added later if it becomes noticeable.

- **Snippet may be hard to read for deeply nested payloads**: Stringified JSON with context around the match may include structural characters (`{`, `"`, `:`).
  → Acceptable — it's a preview, not a full render. The user clicks through for the full view.

- **Clearing search when a token is loaded**: Restoring the decode view requires knowing which token was last active. `currentRaw` in `main.ts` already tracks this — re-run decode on it.
