---
name: ux-flow-review
description: Validates user experience flows against the mandatory 8-state interaction contract and accessibility baselines.
---

# Skill: UX Flow Review

## PURPOSE
Ensure that every user-facing interaction flow covers all edge states (loading, empty, error, destructive, offline) and adheres to accessibility standards.

## INPUTS
- `uxPath`: Path to `specs/<feature-id>/ux.md`.
- `designTokens`: `docs/design/design-system.md`.

## TOOLS
- `view_file`
- `write_to_file`

## STEPS
1. Inspect `specs/<feature-id>/ux.md` against the 8-state contract:
   - [ ] Initial / Idle
   - [ ] Loading / Pending
   - [ ] Success
   - [ ] Empty
   - [ ] Error (with RFC 7807 problem details display)
   - [ ] Partial / Degraded
   - [ ] Offline / Disconnected
   - [ ] Destructive confirmation
2. Audit WCAG 2.1 AA compliance:
   - Color contrast ratio >= 4.5:1 for normal text.
   - Interactive touch/tap targets >= 44x44px.
   - Visible keyboard focus indicators and logical tab order.
3. Validate responsive behavior at mobile (375px), tablet (768px), and desktop (1280px).

## CONSTRAINTS
- A UI flow with only a happy-path design is an automatic failure.
- Avoid layout shifts during data loading (CLS < 0.1).

## FAILURE CONDITIONS
- Missing empty states or generic "An error occurred" messages without recovery actions.

## EXPECTED OUTPUT
UX QA signoff section in `specs/<feature-id>/ux.md`.

## REQUIRED EVIDENCE
- Checkbox verification table proving all 8 states are defined with wireframes or detailed layout descriptions.
