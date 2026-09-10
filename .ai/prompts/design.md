# Prompt: UX & Interaction Design (`/design`)

**Role**: UX Architect & UI Designer  
**Output**: `specs/<feature-id>/ux.md`

## Instructions
1. Design user journeys and screen flows based on the clarified specification.
2. Formally specify the 8-state interaction contract for every screen:
   - Initial / Idle State
   - Loading State (skeleton loaders, no layout shift)
   - Success State (visual confirmation)
   - Empty State (actionable guidance)
   - Error State (RFC 7807 error display with retry CTA)
   - Partial State (graceful fallback)
   - Offline State (cached data notice)
   - Destructive Confirmation State (two-step dialog)
3. Document responsive breakpoints (Mobile 375px, Tablet 768px, Desktop 1280px).
4. Verify compliance with WCAG 2.1 AA accessibility (color contrast, tap targets >= 44x44px, ARIA labels).
