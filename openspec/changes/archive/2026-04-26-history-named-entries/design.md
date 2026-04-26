## Context

The history sidebar currently stores every decoded JWT as a flat list with no metadata beyond the raw token and decoded payload. The `HistoryEntry` type has: `id`, `raw`, `header`, `payload`, `savedAt`. All entries persist indefinitely.

The UI renders a single scrollable list in `history-panel.ts`. There is no concept of importance or expiry.

## Goals / Non-Goals

**Goals:**
- Add `saved: boolean` and `name?: string` to `HistoryEntry`
- Auto-prune temporary entries (saved: false) older than 24h on app load
- Split sidebar into Saved / Recent sections
- Bookmark icon on Recent entries to promote to Saved
- Inline rename for Saved entries (click name to edit, Enter/blur to confirm)
- Backward-compatible: existing entries without `saved` field treated as temporary

**Non-Goals:**
- Sync or export of saved entries
- Drag-to-reorder
- Tags or multiple categories beyond Saved/Recent

## Decisions

**1. Extend `HistoryEntry` in place rather than a separate saved-store**

Adding `saved` and `name` fields to the existing shape keeps the localStorage key (`jwt-manager-history`) and all existing store functions. Alternatives: a separate `jwt-manager-saved` key would allow different eviction rules but adds complexity with no benefit here.

**2. Pruning on app load, not on write**

Pruning old temporaries at startup keeps the write path simple (no TTL timers, no background workers). For a local tool opened on demand this is sufficient. Risk: a tab left open indefinitely won't prune until reload — acceptable.

**3. Inline rename via contenteditable or a toggled `<input>`**

A toggled `<input>` (hidden by default, shown on click) is simpler to implement and style consistently than `contenteditable`. The input is auto-focused and confirmed on Enter or blur.

**4. Visual separation: two labelled sections, Saved above Recent**

Saved entries are the user's intentional bookmarks so they appear first. Section headers ("SAVED", "RECENT") use the same small-caps style as existing card titles for consistency.

## Risks / Trade-offs

- **localStorage schema change**: existing entries lack `saved`/`name`. Treat missing `saved` as `false` (temporary) on read — forward-compatible.
  → Mitigation: defensive read in `getHistory()` with fallback defaults.

- **Inline rename loses focus unexpectedly**: blur fires when user clicks elsewhere, committing an empty name.
  → Mitigation: on blur with empty value, keep previous name (or remove name if it was never set).

- **Section headers when one section is empty**: showing a "SAVED" header with nothing under it looks odd.
  → Mitigation: omit the section header entirely when that section is empty.
