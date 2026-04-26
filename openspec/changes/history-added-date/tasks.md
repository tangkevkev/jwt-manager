## 1. Data Model

- [x] 1.1 Add `addedAt: number` field to `HistoryEntry` type in `history-store.ts`
- [x] 1.2 In `saveToHistory`, set `addedAt: Date.now()` only when creating a new entry; carry forward `existing.addedAt` on deduplication update
- [x] 1.3 Add defensive read in `load()` — entries without `addedAt` fall back to `savedAt`

## 2. Tests

- [x] 2.1 Add test that `addedAt` is set on first save
- [x] 2.2 Add test that `addedAt` is preserved (not updated) when the same token is re-saved
- [x] 2.3 Add test that entries without `addedAt` fall back to `savedAt`

## 3. Date Display

- [x] 3.1 Update `formatDate` in `history-panel.ts` to accept a timestamp and return a string including weekday, day, month, year, and time (e.g. "Mon, Apr 26 2026 · 14:32")
- [x] 3.2 Update the history entry render to pass `entry.addedAt ?? entry.savedAt` to `formatDate`
