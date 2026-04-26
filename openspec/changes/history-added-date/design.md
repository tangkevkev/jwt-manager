## Context

`HistoryEntry` has a `savedAt: number` field that records the last time a token was decoded. On deduplication, `saveToHistory` updates this field — so re-pasting a token changes the timestamp. There is no immutable first-seen date.

The history panel's `formatDate` renders `savedAt` as `"Apr 26, 14:32"` — omitting weekday and year.

## Goals / Non-Goals

**Goals:**
- Add `addedAt: number` to `HistoryEntry`, set only when first creating the entry, never overwritten on re-paste
- Display `addedAt` (falling back to `savedAt` for old entries) with format: `"Mon, Apr 26 2026 · 14:32"`
- Backward-compatible with existing localStorage data

**Non-Goals:**
- Changing how `savedAt` works (it remains "last seen", used for sorting)
- Timezone display or user-configurable date formats

## Decisions

**1. `addedAt` set only on new entry, not on deduplication update**

In `saveToHistory`, when an existing entry is found (`existingIndex >= 0`), carry forward `existing.addedAt`. When creating a new entry, set `addedAt: Date.now()`. This is the minimal change needed — `savedAt` continues to drive sorting and recency.

**2. Defensive fallback: `addedAt ?? savedAt`**

Existing entries in localStorage have no `addedAt`. Reading them back with `?? savedAt` gives a reasonable approximation rather than showing an undefined date.

**3. Display format using `Intl.DateTimeFormat` options**

`toLocaleDateString` with `{ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }` produces locale-aware output close to `"Mon, Apr 26 2026, 14:32"`. A simple string replace turns the comma+space separator into ` · ` for readability.

## Risks / Trade-offs

- **Locale variance**: `toLocaleDateString` output varies by browser locale — the separator and ordering may differ. → Acceptable for a personal local tool; no internationalization requirement exists.
- **`addedAt` approximation for old entries**: Existing entries show `savedAt` as the added date, which may be the last-seen time rather than first-seen. → Unavoidable without a migration; the approximation is clearly better than nothing.
