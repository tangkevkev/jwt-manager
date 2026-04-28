## Context

JWT Manager is a local-first PWA that stores all token history in `localStorage`. There is no backend. The existing history entry shape is `{ token, savedAt, saved, name?, ... }`. Users currently have no way to categorize tokens beyond the freeform name field, making it hard to scan a long history list.

## Goals / Non-Goals

**Goals:**
- Allow users to attach zero or more text labels to any history entry
- Display labels as colored chips in the history list and token detail view
- Provide autocomplete when editing labels, suggesting all labels already in use (sorted by frequency)
- Let users click a label chip in the history panel to filter the list to that label
- Give each unique label a consistent, deterministic color without user input
- Remove the "valid" badge from history entries (implementation detail, not specced, adds noise)

**Non-Goals:**
- Global label management (rename/delete across all tokens)
- User-chosen label colors
- Persisting the active filter across sessions
- Label hierarchies or nesting

## Decisions

### 1. Store labels as `string[]` on the history entry

Add `labels: string[]` to each entry in the existing localStorage array. Entries without the field are treated as `labels: []` — fully backward-compatible, no migration needed.

**Alternatives considered**: Separate label index in localStorage — rejected as unnecessary complexity for a list that will be small.

### 2. Derive label color from a string hash

Map each label name to one of ~10 hand-picked, visually distinct pastel colors using `hash(label) % palette.length`. Same label always maps to the same color everywhere in the app without any stored state.

**Alternatives considered**: Random color assigned at creation time — rejected because the color would vary between sessions and require storing the mapping.

### 3. Build autocomplete suggestions on demand

When the label input is focused, scan all history entries and build a frequency map of all labels. Present suggestions sorted by frequency descending, then alphabetically. No caching needed — the list is small and the operation is O(n) on localStorage.

**Alternatives considered**: Store a separate label frequency index — rejected as premature; the history list is bounded and small.

### 4. Filter state lives in React component state

The active label filter is ephemeral UI state — no need to persist it to localStorage or the URL. Resets on page reload, which is acceptable behavior for a quick filter.

**Alternatives considered**: Persist filter to URL hash — rejected; adds complexity for minimal benefit in a single-page tool.

## Risks / Trade-offs

- **Color collisions**: Two different labels could hash to the same color, reducing visual distinction. Mitigation: choose a palette of at least 10 well-separated colors; most users will have far fewer than 10 distinct labels.
- **No global label rename**: Renaming a label requires editing every token that uses it. Mitigation: out of scope for v1; acceptable given typical label set sizes.

## Migration Plan

No migration required. The `labels` field is optional — existing entries without it behave as if they have no labels. No data transformation needed on first load.
