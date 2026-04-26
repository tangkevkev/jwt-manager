## 1. Header

- [x] 1.1 Reduce header padding to `py-2` and font size to `text-sm` in `main.ts`

## 2. Main Panel Layout

- [x] 2.1 Restructure main content area to `grid grid-cols-1 md:grid-cols-[1fr_20rem]` with full height
- [x] 2.2 Move textarea into the right column; set `h-full` and `resize-none` so it fills the column height
- [x] 2.3 Ensure decode output occupies the left column with `overflow-y-auto`

## 3. Decode Panel Visual Hierarchy

- [x] 3.1 Payload card: increase body font to `text-base`, increase padding to `p-6`, add `border-l-2 border-blue-500` accent
- [x] 3.2 Header card: reduce body font to `text-xs`, reduce padding to `p-3`, mute card header text
- [x] 3.3 Signature card: reduce body font to `text-xs`, reduce padding to `p-3`, mute card header text

## 4. Verify

- [x] 4.1 Confirm desktop layout shows input and output side by side without scrolling
- [x] 4.2 Confirm mobile layout stacks input above output
- [x] 4.3 Run `npm test` to confirm no regressions
