## ADDED Requirements

### Requirement: User can paste and decode a JWT
The system SHALL accept a raw JWT string input and decode its header and payload, displaying both as formatted JSON without requiring an internet connection or server call.

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

### Requirement: JWT signature section is displayed but not verified
The system SHALL display the signature portion of the JWT as an unverified opaque string and SHALL show a notice that signature verification is not performed.

#### Scenario: Signature notice is visible
- **WHEN** a JWT has been decoded and displayed
- **THEN** the system SHALL show a visible notice that the signature has not been verified
