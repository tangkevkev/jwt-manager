## Why

The history panel currently auto-saves every valid JWT with no way to distinguish important tokens from noise. Users have no way to label tokens for easy identification, and there is no cleanup mechanism — the list grows indefinitely.

## What Changes

- History entries are now either **temporary** (auto-deleted after 24 hours) or **saved** (permanent)
- All new entries start as temporary
- A bookmark/save icon on each temporary entry promotes it to saved
- Saved entries support an inline-editable name label
- The history sidebar is split into two visual sections: **Saved** (top) and **Recent** (bottom)
- On app load, temporary entries older than 24 hours are pruned automatically

## Capabilities

### New Capabilities

- (none — extends existing jwt-history capability)

### Modified Capabilities

- `jwt-history`: Requirements change to add saved/temporary state, optional name field, 24h auto-expiry for temporary entries, and two-section sidebar layout

## Impact

- `src/lib/history-store.ts`: `HistoryEntry` type gains `saved: boolean` and `name?: string` fields; add pruning logic on load; add `saveEntry(id)` and `renameEntry(id, name)` functions
- `src/ui/history-panel.ts`: Render two sections (Saved / Recent), bookmark button, inline rename input
- `src/__tests__/history-store.test.ts`: New tests for save, rename, pruning
- `src/__tests__/history-panel.test.ts` (if it exists): Update for new UI
- localStorage data shape changes (existing entries without `saved` field treated as temporary)
