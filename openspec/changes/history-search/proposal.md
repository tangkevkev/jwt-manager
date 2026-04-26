## Why

As the history grows, finding a specific token becomes tedious — the user has to visually scan the list or remember a name. A search bar lets users find tokens instantly by matching against payload content or entry name.

## What Changes

- A search input is added to the top of the history sidebar
- Typing a query switches the main panel from the decode view to a **search results view**
- The results view lists all matching history entries, each with a highlighted snippet showing where the match occurs in the payload
- Clicking a result loads the full token (equivalent to selecting it from the history list)
- Clearing the search restores the previous main panel state
- Search matches against both the payload JSON and the entry name/label

## Capabilities

### New Capabilities

- `history-search`: Search across history entries by payload content or name, with a results view and match preview

### Modified Capabilities

- (none)

## Impact

- `src/ui/history-panel.ts`: Add search input at the top; filter and highlight matching entries
- `src/ui/search-results-view.ts` (new): Render the cross-history results panel in the main area
- `src/lib/history-search.ts` (new): Search logic — filter entries, extract match snippets
- `src/main.ts`: Wire search input state; swap main panel content between decode view and search results view
- `src/__tests__/history-search.test.ts` (new): Unit tests for search and snippet extraction
