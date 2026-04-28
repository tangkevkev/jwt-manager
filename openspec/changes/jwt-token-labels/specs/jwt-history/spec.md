## MODIFIED Requirements

### Requirement: User can view saved JWT history
The system SHALL display history in two visually separated sections: **Saved** (permanent entries) above **Recent** (temporary entries). Section headers SHALL be omitted when a section is empty. Each entry SHALL display its label chips inline. The "valid" badge SHALL NOT be shown on history entries.

#### Scenario: History list is shown with two sections
- **WHEN** at least one JWT has been saved or decoded
- **THEN** the system SHALL render a "SAVED" section (if any saved entries exist) and a "RECENT" section (if any temporary entries exist), each listing their entries

#### Scenario: Selecting a history item decodes it
- **WHEN** the user selects an entry from either section
- **THEN** the system SHALL populate the input field with the raw token and display its decoded header and payload

#### Scenario: Empty history state
- **WHEN** no tokens have been decoded yet
- **THEN** the system SHALL display an empty state message prompting the user to paste their first JWT

#### Scenario: Label chips are shown on history entries
- **WHEN** a history entry has one or more labels
- **THEN** the system SHALL render each label as a colored chip on that entry row in the history list

#### Scenario: Entry with no labels shows no chips
- **WHEN** a history entry has no labels
- **THEN** the system SHALL render the entry row without any label chips

## ADDED Requirements

### Requirement: User can filter history by label
The system SHALL allow the user to filter the history list to entries that have a specific label by clicking any label chip in the history panel.

#### Scenario: Clicking a label chip activates the filter
- **WHEN** the user clicks a label chip on a history entry
- **THEN** the system SHALL filter both the Saved and Recent sections to show only entries that include that label, and SHALL highlight the active filter label

#### Scenario: Active filter is shown with a clear control
- **WHEN** a label filter is active
- **THEN** the system SHALL display the active label name with a control to clear the filter

#### Scenario: Clearing the filter restores full history
- **WHEN** the user clicks the clear control on the active filter
- **THEN** the system SHALL remove the filter and restore the full history list

#### Scenario: Filter is not persisted across sessions
- **WHEN** the user reloads the page
- **THEN** the system SHALL display the full unfiltered history list with no active filter
