# Frontend Path-Specific Instructions

> Applies to: `frontend/`, `src/client/`, `components/`, `design/`

## 1. 8-State UI Interaction Contract
Never implement a component or screen that only renders the happy path. Every interactive flow must explicitly define and handle 8 core states:
1. **Initial / Idle**: Clean default un-triggered state.
2. **Loading / Pending**: Skeleton loaders or subtle micro-animations (avoid layout shifts).
3. **Success**: Clear confirmation and clean transition to the loaded state.
4. **Empty State**: Informative guidance with actionable call-to-action when zero items exist.
5. **Error State**: Actionable, human-readable error messages with retry options.
6. **Partial State**: Graceful degradation when secondary data fails to load.
7. **Offline / Disconnected**: Cached offline view with reconnection indicator.
8. **Destructive Action Confirmation**: Two-step confirmation or undo toast for destructive operations.

## 2. Design System & Tokens
- Consume design tokens from `docs/design/design-system.md` (colors, typography, spacing, shadows).
- Never hardcode arbitrary hex codes or magic margins in components.
- Ensure all interactive elements have accessible tap targets (minimum 44x44px) and proper ARIA labels.

## 3. Performance & A11y
- Aim for Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Ensure keyboard navigability (visible focus indicators, tab-order).
