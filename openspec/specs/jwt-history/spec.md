### Requirement: Decoded JWT is saved to history
The system SHALL automatically save each successfully decoded JWT to a persistent local history so the user can revisit it without re-pasting.

#### Scenario: Token is saved after decode
- **WHEN** the user successfully decodes a valid JWT
- **THEN** the system SHALL store the raw token string and the decoded-at timestamp in localStorage

#### Scenario: Duplicate token is not duplicated in history
- **WHEN** the user decodes a JWT that is already present in the history
- **THEN** the system SHALL update the existing entry's timestamp rather than creating a duplicate

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

### Requirement: User can delete a saved JWT from history
The system SHALL allow the user to remove individual entries from the history.

#### Scenario: Token is deleted
- **WHEN** the user triggers the delete action on a history entry
- **THEN** the system SHALL remove that entry from localStorage and from the visible list immediately

### Requirement: History persists across sessions
The system SHALL retain saved JWTs between browser sessions without requiring any network connection.

#### Scenario: History survives page reload
- **WHEN** the user closes and reopens the app (or reloads the page)
- **THEN** the system SHALL restore all previously saved tokens from localStorage and display them in the history list

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
