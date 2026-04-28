## 1. Data Layer

- [x] 1.1 Add `labels: string[]` to the `HistoryEntry` interface in `history-store.ts` (distinct from the existing auto-derived `label: string` field)
- [x] 1.2 Update `load()` in `history-store.ts` to default missing `labels` to `[]` for backward compatibility
- [x] 1.3 Add an `updateLabels(id: string, labels: string[])` function to `history-store.ts` that persists the updated labels array

## 2. Label Utilities

- [x] 2.1 Create `src/lib/label-color.ts` with a `getLabelColor(label: string): string` function that hashes the label string and maps to one of 10 distinct CSS color values (background + text pair)
- [x] 2.2 Create a `getUsedLabels(entries: HistoryEntry[]): string[]` helper in `src/lib/label-color.ts` that returns all unique labels across entries sorted by frequency descending then alphabetically

## 3. Remove Valid Badge

- [x] 3.1 Find and remove the "valid" badge rendering from `history-panel.ts` and any related CSS

## 4. Label Chips in History Panel

- [x] 4.1 Update history entry rendering in `history-panel.ts` to display label chips for entries that have labels, using `getLabelColor` for colors
- [x] 4.2 Add label filter state to the history panel component (active filter label, default null)
- [x] 4.3 Render an active-filter indicator (label name + clear button) at the top of the history panel when a filter is active
- [x] 4.4 Wire label chip clicks to set the active filter and re-render the filtered list
- [x] 4.5 Wire the clear button to reset the filter and restore the full list
- [x] 4.6 Add CSS for label chips and filter indicator in `style.css`

## 5. Inline Label Editor in Detail View

- [x] 5.1 Add a label editor section to the token detail view in `decode-view.ts` that renders current labels as chips with dismiss buttons
- [x] 5.2 Add a text input below the chips for typing new labels; add the label on Enter or comma keypress
- [x] 5.3 Show a suggestions dropdown on input focus using `getUsedLabels`, filtered by the typed substring (case-insensitive)
- [x] 5.4 Wire suggestion selection to add the label and close the dropdown
- [x] 5.5 Wire chip dismiss buttons to call `updateLabels` and re-render the editor
- [x] 5.6 Ignore duplicate labels silently (clear input, do not add)
- [x] 5.7 Add CSS for the label editor, suggestion dropdown, and chip dismiss controls in `style.css`
