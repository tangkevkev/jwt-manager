## ADDED Requirements

### Requirement: Decoded JWT is saved to history
The system SHALL automatically save each successfully decoded JWT to a persistent local history so the user can revisit it without re-pasting.

#### Scenario: Token is saved after decode
- **WHEN** the user successfully decodes a valid JWT
- **THEN** the system SHALL store the raw token string and the decoded-at timestamp in localStorage

#### Scenario: Duplicate token is not duplicated in history
- **WHEN** the user decodes a JWT that is already present in the history
- **THEN** the system SHALL update the existing entry's timestamp rather than creating a duplicate

### Requirement: User can view saved JWT history
The system SHALL display a list of previously decoded JWTs so the user can select and review any past token.

#### Scenario: History list is shown
- **WHEN** at least one JWT has been saved
- **THEN** the system SHALL display a list of saved tokens, showing a label (derived from the `sub` or `iss` claim if present, otherwise a truncated token), the expiry status, and the saved-at date

#### Scenario: Selecting a history item decodes it
- **WHEN** the user selects an entry from the history list
- **THEN** the system SHALL populate the input field with the raw token and display its decoded header and payload

#### Scenario: Empty history state
- **WHEN** no tokens have been saved yet
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
