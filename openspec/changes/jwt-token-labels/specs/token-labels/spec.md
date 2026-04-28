## ADDED Requirements

### Requirement: User can add labels to a JWT entry
The system SHALL allow the user to attach one or more text labels to any history entry via an inline label editor in the token detail view.

#### Scenario: Label editor is shown in detail view
- **WHEN** the user opens a JWT entry
- **THEN** the system SHALL display an inline label editor showing the entry's current labels and an input for adding new ones

#### Scenario: Label is added on Enter or comma
- **WHEN** the user types a label name and presses Enter or comma
- **THEN** the system SHALL add the label to the entry and persist it to localStorage

#### Scenario: Duplicate label is ignored
- **WHEN** the user enters a label name that already exists on the entry
- **THEN** the system SHALL not add a duplicate and SHALL clear the input

### Requirement: User can remove labels from a JWT entry
The system SHALL allow the user to remove individual labels from an entry.

#### Scenario: Label is removed via chip dismiss
- **WHEN** the user clicks the dismiss control on a label chip in the detail view
- **THEN** the system SHALL remove that label from the entry and persist the change to localStorage

### Requirement: Label input suggests existing labels
The system SHALL show autocomplete suggestions when the user is typing a label, listing all labels currently in use across all history entries, sorted by frequency of use descending then alphabetically.

#### Scenario: Suggestions appear on input focus
- **WHEN** the user focuses the label input
- **THEN** the system SHALL display a dropdown of existing labels sorted by frequency

#### Scenario: Suggestions are filtered as the user types
- **WHEN** the user types characters in the label input
- **THEN** the system SHALL filter the suggestion list to labels that include the typed substring (case-insensitive)

#### Scenario: Selecting a suggestion adds the label
- **WHEN** the user selects a suggestion from the dropdown
- **THEN** the system SHALL add that label to the entry and close the dropdown

### Requirement: Each label has a consistent auto-derived color
The system SHALL assign a color to each label deterministically based on the label's text, using a fixed palette of at least 10 visually distinct colors, so that the same label always appears in the same color throughout the app.

#### Scenario: Same label always has the same color
- **WHEN** the same label string appears on multiple entries or in different views
- **THEN** the system SHALL render it with the same color chip every time

#### Scenario: Different labels get different colors where possible
- **WHEN** multiple distinct labels are in use
- **THEN** the system SHALL render them with different colors unless the palette is exhausted
