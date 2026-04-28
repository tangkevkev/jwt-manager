## 1. App State

- [x] 1.1 Add `let activeEntryId: string | null = null` to `main.ts`
- [x] 1.2 Update `onSelect` callback in `refreshHistory` to receive `(id, raw)` and set `activeEntryId = id` before calling `handleInput`
- [x] 1.3 Clear `activeEntryId = null` in `handleInput` when the user triggers a manual paste (i.e. token comes from textarea input, not history selection)
- [x] 1.4 Clear `activeEntryId = null` in the `clearBtn` click handler and the `document` paste handler

## 2. Title Display in Main View

- [x] 2.1 Add a `<div id="active-token-title">` element to the HTML in `main.ts`, positioned above the `#payload-output` in the main content area
- [x] 2.2 Write a `updateTitleDisplay(entry: HistoryEntry | null)` helper in `main.ts` that shows/hides the title element based on whether `entry` has a non-empty `name`
- [x] 2.3 Call `updateTitleDisplay` inside `refreshHistory` — derive the active entry from `getHistory()` using `activeEntryId`, passing `null` when `activeEntryId` is null or no matching entry is found

## 3. History Panel — Active Highlight

- [x] 3.1 Add `activeEntryId?: string` parameter to `renderHistoryPanel` signature in `history-panel.ts`
- [x] 3.2 Pass `activeEntryId` into `renderEntry` calls (both saved and recent maps)
- [x] 3.3 Add `isActive` boolean to `renderEntry`; apply a highlight class (e.g. `bg-blue-950 border-l-2 border-blue-500`) to the entry's root `<div>` when `isActive` is true
- [x] 3.4 Pass `activeEntryId` from `refreshHistory` in `main.ts` to `renderHistoryPanel`

## 4. History Panel — Name Wrapping

- [x] 4.1 Remove `truncate` and `max-w-[160px]` from the saved-entry label `<span>` in `renderEntry`; allow the name to wrap naturally
- [x] 4.2 Remove `truncate` and `max-w-[130px]` from the recent-entry label `<span>` in `renderEntry`
- [x] 4.3 Remove the corresponding `max-w-[160px]` constraint from the rename `<input>` elements so they expand to the available width

## 5. Wire Up History Selection

- [x] 5.1 Update `renderHistoryPanel` `onSelect` invocation to pass both `entry.id` and `entry.raw` so `main.ts` can set `activeEntryId` correctly (update the `Callbacks` interface accordingly)
