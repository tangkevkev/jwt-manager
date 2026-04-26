## 1. Data Model

- [x] 1.1 Add `saved: boolean` and `name?: string` fields to `HistoryEntry` type in `history-store.ts`
- [x] 1.2 Update `saveToHistory` to set `saved: false` on new entries
- [x] 1.3 Add defensive read in `getHistory` — treat missing `saved` field as `false` for backward compatibility

## 2. Store Functions

- [x] 2.1 Add `pruneTemporaryEntries()` function that removes entries where `saved === false` and `savedAt` is older than 24 hours
- [x] 2.2 Call `pruneTemporaryEntries()` at app startup in `main.ts`
- [x] 2.3 Add `saveEntry(id: string)` function that sets `saved: true` on a given entry
- [x] 2.4 Add `renameEntry(id: string, name: string)` function that updates the `name` field

## 3. Tests

- [x] 3.1 Add tests for `pruneTemporaryEntries`: entries older than 24h are removed, saved entries are not, recent temporaries survive
- [x] 3.2 Add tests for `saveEntry`: entry is promoted, unknown id is a no-op
- [x] 3.3 Add tests for `renameEntry`: name is updated, empty name is ignored

## 4. History Panel UI

- [x] 4.1 Split `renderHistoryPanel` output into two sections: "SAVED" and "RECENT"; omit section header when section is empty
- [x] 4.2 Add a bookmark button to each Recent entry row; clicking calls `onSave(id)` callback
- [x] 4.3 Render saved entries with an editable name label; clicking the label shows an inline `<input>` pre-filled with current name
- [x] 4.4 Confirm inline name input on Enter or blur: save non-empty value via `onRename(id, name)` callback; revert to previous name on empty
- [x] 4.5 After save promotion, show inline name input focused so user can immediately type a label

## 5. Main.ts Wiring

- [x] 5.1 Pass `onSave` callback to `renderHistoryPanel` that calls `saveEntry`, then `refreshHistory`
- [x] 5.2 Pass `onRename` callback to `renderHistoryPanel` that calls `renameEntry`, then `refreshHistory`
- [x] 5.3 Call `pruneTemporaryEntries()` before initial `refreshHistory()` on startup
