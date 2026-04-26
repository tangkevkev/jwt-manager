## Why

History entries currently show `savedAt` as their timestamp, which updates every time the same token is re-pasted. There is no way to know when a token was first seen, and the display omits the weekday and year — making older entries hard to place in time.

## What Changes

- Add `addedAt: number` (unix ms) to `HistoryEntry`, set once on first save and never updated on re-paste
- Update the history panel date display to include weekday and year: e.g. **"Mon, Apr 26 2026 · 14:32"**
- Backward-compatible: existing entries without `addedAt` fall back to `savedAt` for display

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `jwt-history`: Requirements change — entries must record a first-added timestamp distinct from last-seen, and display it with full date context (weekday, day, month, year, time)

## Impact

- `src/lib/history-store.ts`: Add `addedAt` to `HistoryEntry`; set in `saveToHistory` only when creating a new entry (not on deduplication update); defensive read falls back to `savedAt`
- `src/ui/history-panel.ts`: Update `formatDate` to include weekday and year
- `src/__tests__/history-store.test.ts`: Add test that `addedAt` is preserved on re-save
