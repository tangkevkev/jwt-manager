## Why

The JWT history panel shows all saved tokens but provides no way to visually distinguish them beyond the raw token preview. Users need a lightweight labeling system to categorize and identify tokens at a glance without having to decode each one.

## What Changes

- Add a `labels` field (string array) to stored JWT entries in local storage
- Labels appear as small colored chips on each history entry row
- Clicking a label chip in the history panel filters the list to that label
- Token detail view gets an inline label editor with autocomplete suggesting existing labels sorted by usage frequency
- Each unique label receives a consistent auto-derived color (based on label string hash)
- Remove the existing "valid" badge from history entries as it adds noise without user value

## Capabilities

### New Capabilities

- `token-labels`: Attach, edit, and remove text labels on saved JWT entries; display labels as colored chips in history and detail views; filter history by label; autocomplete suggests existing labels sorted by frequency

### Modified Capabilities

- `jwt-history`: History entries now display label chips and support label-based filtering; "valid" badge removed

## Impact

- `localStorage` schema for JWT history entries gains a `labels: string[]` field (backward-compatible: missing field treated as empty array)
- History panel component updated to render label chips and a filter UI
- Token detail/editor component updated to render an inline label editor with autocomplete
- No backend, no external dependencies — purely frontend change
