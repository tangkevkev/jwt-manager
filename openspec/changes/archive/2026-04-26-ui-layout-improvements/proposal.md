## Why

The current layout wastes vertical space on the app header and spreads the JWT input across the full width, burying the most useful panel (the payload) below the fold. Improving space efficiency makes the tool faster to use — the decoded content is visible immediately without scrolling.

## What Changes

- Compact app header: reduced padding and font size — title and icon only, no wasted vertical space
- JWT input becomes a tall narrow column pinned to the right side of the main panel; input grows to fill available height rather than a fixed short textarea
- Decoded output panels (header, payload, signature) occupy the left/center area alongside the input
- Payload panel is visually dominant: larger font, more internal padding, and a blue left-border accent
- Header and Signature panels use smaller/muted styling to recede visually
- On mobile: input column stacks above the decode output panels

## Capabilities

### New Capabilities

<!-- None — this is a pure UI layout change with no new user-facing capabilities -->

### Modified Capabilities

- `jwt-decode`: Display requirements change — payload MUST be visually dominant; input and output MUST be side-by-side on desktop; signature notice display updated

## Impact

- `src/main.ts` — layout HTML restructured
- `src/ui/decode-view.ts` — card styles updated for payload prominence and header/signature de-emphasis
- No logic changes, no new dependencies
