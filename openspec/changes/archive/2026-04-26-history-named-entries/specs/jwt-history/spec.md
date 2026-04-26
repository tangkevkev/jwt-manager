## ADDED Requirements

### Requirement: History entries have a saved/temporary state
The system SHALL classify each history entry as either **saved** (permanent) or **temporary** (auto-deleted after 24 hours). New entries SHALL default to temporary.

#### Scenario: New entry defaults to temporary
- **WHEN** the user successfully decodes a valid JWT
- **THEN** the system SHALL store the entry with `saved: false`

#### Scenario: Temporary entries are pruned on load
- **WHEN** the app loads
- **THEN** the system SHALL delete all temporary entries whose `savedAt` timestamp is older than 24 hours

#### Scenario: Saved entries are never auto-deleted
- **WHEN** an entry has been promoted to saved
- **THEN** the system SHALL retain it across app loads regardless of age

### Requirement: User can promote a temporary entry to saved
The system SHALL allow the user to permanently save a history entry by clicking a bookmark icon on a temporary entry.

#### Scenario: Bookmark promotes entry to saved
- **WHEN** the user clicks the bookmark icon on a temporary entry
- **THEN** the system SHALL mark that entry as saved and move it to the Saved section

### Requirement: User can name a saved history entry
The system SHALL allow the user to give a saved entry a human-readable name via inline editing.

#### Scenario: Name is set inline on save
- **WHEN** an entry is promoted to saved
- **THEN** the system SHALL show an inline name input focused for editing so the user can optionally type a label

#### Scenario: Name is confirmed on Enter or blur
- **WHEN** the user presses Enter or moves focus away from the name input
- **THEN** the system SHALL save the typed name (if non-empty) or keep the previous name if the input is empty

#### Scenario: Name can be edited after saving
- **WHEN** the user clicks the name of a saved entry
- **THEN** the system SHALL show the inline name input pre-filled with the current name for editing

## MODIFIED Requirements

### Requirement: User can view saved JWT history
The system SHALL display history in two visually separated sections: **Saved** (permanent entries) above **Recent** (temporary entries). Section headers SHALL be omitted when a section is empty.

#### Scenario: History list is shown with two sections
- **WHEN** at least one JWT has been saved or decoded
- **THEN** the system SHALL render a "SAVED" section (if any saved entries exist) and a "RECENT" section (if any temporary entries exist), each listing their entries

#### Scenario: Selecting a history item decodes it
- **WHEN** the user selects an entry from either section
- **THEN** the system SHALL populate the input field with the raw token and display its decoded header and payload

#### Scenario: Empty history state
- **WHEN** no tokens have been decoded yet
- **THEN** the system SHALL display an empty state message prompting the user to paste their first JWT
