## ADDED Requirements

### Requirement: User can search history by payload content or name
The system SHALL provide a search input in the history sidebar that filters all history entries (SAVED and RECENT) by matching the query against the entry's payload JSON and name/label. Matching SHALL be case-insensitive substring matching.

#### Scenario: Search input is always visible
- **WHEN** the history sidebar is displayed
- **THEN** the system SHALL show a search input at the top of the sidebar

#### Scenario: Typing a query shows matching results
- **WHEN** the user types a non-empty query into the search input
- **THEN** the system SHALL replace the main panel content with a results view listing all history entries whose payload JSON or name/label contains the query string (case-insensitive)

#### Scenario: No matches found
- **WHEN** the user types a query that matches no history entries
- **THEN** the system SHALL display an empty state message in the results view indicating no results were found

#### Scenario: Clearing the search restores the main panel
- **WHEN** the user clears the search input
- **THEN** the system SHALL restore the main panel to its previous state (decoded token view if a token is loaded, or empty)

### Requirement: Search results show a match preview
Each result in the results view SHALL display the entry's name/label and a text snippet showing the surrounding context of the first match within the payload, with the matched term visually highlighted.

#### Scenario: Result shows name and snippet
- **WHEN** a history entry matches the search query
- **THEN** the system SHALL display the entry's name or label and a snippet of the payload JSON with the matched text highlighted

#### Scenario: Clicking a result loads the full token
- **WHEN** the user clicks a search result
- **THEN** the system SHALL load the corresponding JWT and display the full decoded view in the main panel, and clear the search input
