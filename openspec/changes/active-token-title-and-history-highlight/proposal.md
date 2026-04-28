## Why

When viewing a saved JWT from history, there is no visual feedback indicating which token is active or what it's called — the user loses context about which named token they're looking at, especially when switching between multiple saved tokens.

## What Changes

- Display the saved title of the currently active JWT prominently in the main view (above the decoded header/payload)
- Visually highlight the active entry in the history panel so it's clear which token is currently selected
- When no title exists (e.g. an unsaved/anonymous token), no title is shown

## Capabilities

### New Capabilities
- `active-token-context`: Tracks and surfaces which history entry is currently active, including displaying its title in the main view and highlighting its entry in the history panel

### Modified Capabilities
- `jwt-history`: History entries now support an "active" selected state that is visually distinguished from unselected entries

## Impact

- History panel component: add active/selected highlight state to entries
- Main decode view: add title display area above header/payload sections
- App state: track which history entry (if any) is currently active
