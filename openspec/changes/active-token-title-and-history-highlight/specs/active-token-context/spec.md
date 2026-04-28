## ADDED Requirements

### Requirement: App tracks the active history entry
The system SHALL maintain an `activeEntryId` (string | null) in app state representing the history entry currently loaded in the main view. It SHALL be null when no history entry is active (e.g. the user pasted a fresh token).

#### Scenario: Active entry is set on history selection
- **WHEN** the user selects an entry from the history panel
- **THEN** the system SHALL set `activeEntryId` to that entry's ID

#### Scenario: Active entry is cleared on manual input
- **WHEN** the user types or pastes a token directly into the input field
- **THEN** the system SHALL set `activeEntryId` to null

### Requirement: Active token title is displayed in the main view
When a history entry with a name is active, the system SHALL display that name prominently above the decoded header and payload panels.

#### Scenario: Title shown when active entry has a name
- **WHEN** `activeEntryId` refers to a history entry with a non-empty `name` field
- **THEN** the system SHALL render the entry's name as a heading above the decoded panels

#### Scenario: Title hidden when no active entry
- **WHEN** `activeEntryId` is null
- **THEN** the system SHALL NOT render any title heading above the decoded panels

#### Scenario: Title hidden when active entry has no name
- **WHEN** `activeEntryId` refers to a history entry whose `name` field is empty or absent
- **THEN** the system SHALL NOT render any title heading above the decoded panels

#### Scenario: Title updates if entry is renamed while active
- **WHEN** the user renames the active history entry
- **THEN** the system SHALL immediately reflect the new name in the title heading without any additional action
