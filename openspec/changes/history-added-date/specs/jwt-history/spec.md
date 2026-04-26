## MODIFIED Requirements

### Requirement: Decoded JWT is saved to history
The system SHALL automatically save each successfully decoded JWT to a persistent local history so the user can revisit it without re-pasting. Each entry SHALL record both an immutable first-added timestamp (`addedAt`) and a last-seen timestamp (`savedAt`).

#### Scenario: Token is saved after decode
- **WHEN** the user successfully decodes a valid JWT
- **THEN** the system SHALL store the raw token string, a `savedAt` timestamp (last seen), and an `addedAt` timestamp (first added) in localStorage

#### Scenario: Duplicate token is not duplicated in history
- **WHEN** the user decodes a JWT that is already present in the history
- **THEN** the system SHALL update `savedAt` to the current time but SHALL NOT change `addedAt`

## ADDED Requirements

### Requirement: History entries display first-added date with full context
The system SHALL display each history entry's first-added date (`addedAt`) including weekday, day, month, year, and time, so the user can place tokens in time at a glance.

#### Scenario: Full date is shown in history entry
- **WHEN** a history entry is rendered in the sidebar
- **THEN** the system SHALL display the `addedAt` date in a format that includes weekday, day, month, year, and time (e.g. "Mon, Apr 26 2026 · 14:32")

#### Scenario: Fallback for entries without addedAt
- **WHEN** an existing history entry has no `addedAt` field (created before this feature)
- **THEN** the system SHALL fall back to displaying `savedAt` as the added date
