## 1. Search Logic

- [x] 1.1 Create `src/lib/history-search.ts` with a `searchHistory(entries, query)` function that returns entries whose payload JSON or name/label contains the query (case-insensitive)
- [x] 1.2 Add `extractSnippet(payload, query)` function that returns a ~60-character context string around the first match in the stringified payload
- [x] 1.3 Export a `SearchResult` type: `{ entry: HistoryEntry, snippet: string }`

## 2. Tests

- [x] 2.1 Test `searchHistory`: matches by payload value, matches by name, case-insensitive, no match returns empty array
- [x] 2.2 Test `extractSnippet`: returns context around match, handles match near start/end of string, returns empty string for no match

## 3. Search Results UI

- [x] 3.1 Create `src/ui/search-results-view.ts` with `renderSearchResults(container, results, query, onSelect)` that renders a list of result cards into the given container
- [x] 3.2 Each result card shows the entry name/label and the snippet with the matched term wrapped in a highlight span
- [x] 3.3 Render an empty state message when `results` is empty
- [x] 3.4 Wire click on each result card to call `onSelect(entry.raw)` and clear the search

## 4. History Panel Search Input

- [x] 4.1 Add a search `<input>` at the top of the history sidebar HTML in `main.ts`
- [x] 4.2 Style it consistently with the existing textarea (dark background, border, focus ring)

## 5. Main.ts Wiring

- [x] 5.1 Add `currentQuery` state variable; listen to `input` event on search field
- [x] 5.2 When query is non-empty: call `searchHistory`, render results into `#payload-output` via `renderSearchResults`; hide `#header-output` and `#signature-output`
- [x] 5.3 When query is cleared: restore `#header-output` and `#signature-output` visibility; re-render decode view for `currentRaw` if present, else clear
- [x] 5.4 When a search result is clicked: clear search input, reset `currentQuery`, load and decode the selected token (reuse `handleInput` flow)
