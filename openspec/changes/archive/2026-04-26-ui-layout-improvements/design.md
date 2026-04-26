## Context

The current layout has three problems: (1) the app header is tall and wastes vertical space, (2) the JWT input textarea is short and full-width, meaning the user has to scroll down to see the decoded output, and (3) all three decode panels (header, payload, signature) look identical, giving no visual hierarchy to the most useful one (payload).

The existing layout is a flex column inside `main`: header bar → textarea → decode output. This change restructures the main area into a two-column split so input and output are visible simultaneously.

## Goals / Non-Goals

**Goals:**
- Compact header: minimum height, title + icon only
- Side-by-side layout on desktop: tall input column (right) + decode output (left/center)
- Payload panel visually prominent: larger font, more padding, blue left-border accent
- Header and Signature panels visually de-emphasized: smaller/muted styling
- Mobile: input stacks above decode output (single column, same as before)

**Non-Goals:**
- Collapsible panels
- Resizable column split
- Any logic or data changes

## Decisions

### Two-column split via CSS Grid inside `main`
The main content area becomes `grid grid-cols-[1fr_20rem]` on desktop — output on the left, input column on the right. Both columns fill the full available height.
- Alternative considered: flexbox row — rejected because grid makes it easier to fix the input column width while the output column fills remaining space.

### Input column is fixed-width, textarea fills height
The right column is `w-80` (20rem). The textarea uses `h-full` and `resize-none` so it grows to fill the column rather than being a fixed short box.
- Alternative considered: percentage width — rejected because a fixed width keeps the input comfortable to use at any viewport size.

### Payload prominence via left border + size, not color background
A `border-l-2 border-blue-500` accent plus `text-base` font size makes the payload card stand out without adding a loud background color that clashes with the dark theme.
- Alternative considered: highlighted background — rejected as too visually noisy in a dark theme.

### Header/Signature de-emphasis via `text-xs` body font and reduced padding
No structural change needed — just tighter padding (`p-3`) and smaller pre text (`text-xs`) in the header and signature cards.

## Risks / Trade-offs

- **Mobile UX regression** → On small screens the two-column grid collapses to single column (`grid-cols-1`), input on top. Same as current behaviour so no regression.
- **Very long JWTs** → The fixed-width input column will word-wrap long tokens. `break-all` on the textarea ensures it doesn't overflow.
