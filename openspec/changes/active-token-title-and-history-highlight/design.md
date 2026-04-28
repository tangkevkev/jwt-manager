## Context

The JWT Manager displays decoded tokens in a main view (header + payload panels). Users can load tokens from a history panel. Currently, once a history entry is selected, there is no persistent visual tie between the main view and the history panel — the user has no way to tell at a glance which named token they're looking at, or which history entry corresponds to what's on screen.

Both features share a single root cause: **no "active entry" concept in app state**. Adding that one piece of state unlocks both the title display and the history highlight.

## Goals / Non-Goals

**Goals:**
- Track which history entry (by ID) is currently active in app state
- Display the active entry's title above the decoded view when one exists
- Apply a visual highlight to the active history entry in the panel
- Clear the active entry reference when the user pastes a new token manually

**Non-Goals:**
- Changing how titles are set or edited (existing inline-edit flow is unchanged)
- Persisting "last active entry" across page reloads
- Any change to the decoded header/payload display itself

## Decisions

**Single `activeEntryId` field in app state**
Store just the ID (string | null) of the currently active history entry. This is the minimal change — the title and other display details are derived by looking up the entry from the existing history array. Alternative: store the full entry object. Rejected because it creates a second source of truth that can drift if the entry is renamed.

**Clear active on manual paste**
When the user types or pastes a new token into the input, `activeEntryId` is set to `null`. This prevents a stale title from showing while the user is working with a different token. The title area is simply hidden when `activeEntryId` is null or the entry has no name.

**Title shown only when entry has a name**
Temporary (unsaved) entries typically have no user-assigned name. Showing a fallback like "Untitled" or the truncated token adds noise. The title area is rendered only when the active entry exists and has a non-empty `name` field.

## Risks / Trade-offs

- [Entry renamed while active] → Title updates immediately since it's derived from live state, not a snapshot. No special handling needed.
- [Active entry deleted from history] → `activeEntryId` will reference a non-existent entry. Guard with a null-check on lookup; title area will simply not render.

## Migration Plan

No persistent data changes. This is purely additive UI/state logic — no localStorage schema changes, no breaking changes to existing behavior.
