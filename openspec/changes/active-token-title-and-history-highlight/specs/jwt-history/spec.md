## MODIFIED Requirements

### Requirement: User can view saved JWT history
The system SHALL display history in two visually separated sections: **Saved** (permanent entries) above **Recent** (temporary entries). Section headers SHALL be omitted when a section is empty. The currently active entry (matching `activeEntryId`) SHALL be visually distinguished from other entries with a highlight style.

#### Scenario: History list is shown with two sections
- **WHEN** at least one JWT has been saved or decoded
- **THEN** the system SHALL render a "SAVED" section (if any saved entries exist) and a "RECENT" section (if any temporary entries exist), each listing their entries

#### Scenario: Selecting a history item decodes it
- **WHEN** the user selects an entry from either section
- **THEN** the system SHALL populate the input field with the raw token and display its decoded header and payload

#### Scenario: Empty history state
- **WHEN** no tokens have been decoded yet
- **THEN** the system SHALL display an empty state message prompting the user to paste their first JWT

#### Scenario: Active entry is highlighted
- **WHEN** an entry's ID matches `activeEntryId`
- **THEN** the system SHALL render that entry with a distinct highlight (e.g. background color or left border accent) that clearly differentiates it from non-active entries

#### Scenario: No entry highlighted when activeEntryId is null
- **WHEN** `activeEntryId` is null
- **THEN** the system SHALL render all history entries without any highlight

## ADDED Requirements

### Requirement: History entry names are fully readable
The system SHALL ensure history entry names are not truncated in a way that hides meaning. Long names SHALL wrap or expand to show their full content rather than being clipped to a single line.

#### Scenario: Long name wraps in the history panel
- **WHEN** a history entry has a name longer than the panel width can display on one line
- **THEN** the system SHALL wrap the name to additional lines rather than truncating with ellipsis
