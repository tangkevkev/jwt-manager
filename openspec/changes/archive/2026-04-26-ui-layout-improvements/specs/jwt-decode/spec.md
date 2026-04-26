## MODIFIED Requirements

### Requirement: User can paste and decode a JWT
The system SHALL accept a raw JWT string input and decode its header and payload, displaying both as formatted JSON without requiring an internet connection or server call. On desktop, the input field and decoded output panels SHALL be displayed side by side. The payload panel SHALL be visually dominant over the header and signature panels.

#### Scenario: Valid JWT is decoded
- **WHEN** the user pastes a valid JWT string (three base64url-encoded segments separated by dots)
- **THEN** the system SHALL display the decoded header and payload each as pretty-printed JSON

#### Scenario: Invalid input shows an error
- **WHEN** the user inputs a string that is not a valid JWT (missing segments, malformed base64url, non-JSON payload)
- **THEN** the system SHALL display a clear error message indicating the token is invalid

#### Scenario: Expiry is highlighted
- **WHEN** a decoded JWT payload contains an `exp` claim
- **THEN** the system SHALL display a human-readable expiry date/time alongside the raw timestamp value

#### Scenario: Input is cleared
- **WHEN** the user clears the input field
- **THEN** the decoded view SHALL be cleared or hidden

#### Scenario: Input and output are side by side on desktop
- **WHEN** the viewport is desktop width (md breakpoint and above)
- **THEN** the system SHALL display the JWT input column and the decoded output panels simultaneously without requiring the user to scroll

#### Scenario: Layout stacks on mobile
- **WHEN** the viewport is below the md breakpoint
- **THEN** the system SHALL display the JWT input above the decoded output panels in a single column

### Requirement: JWT signature section is displayed but not verified
The system SHALL display the signature portion of the JWT as an unverified opaque string and SHALL show a notice that signature verification is not performed.

#### Scenario: Signature notice is visible
- **WHEN** a JWT has been decoded and displayed
- **THEN** the system SHALL show a visible notice that the signature has not been verified
