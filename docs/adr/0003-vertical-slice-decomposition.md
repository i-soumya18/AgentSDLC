# ADR-0003: Vertical Slice Architecture Over Horizontal Layering

- **Status**: Accepted
- **Date**: 2026-09-11
- **Deciders**: Principal Architect & Tech Lead

---

## 1. Context and Problem Statement
When coding agents work in horizontal layers (e.g., building all frontend screens, then all backend routes, then all database tables), integration occurs at the very end. This leads to massive integration failures, mismatched interfaces, and difficulty in verifying partial progress.

---

## 2. Decision Outcome
Chosen Option: Mandate **Vertical Slice Decomposition**:
- Features must be broken down into cross-cutting vertical slices delivering end-to-end functionality:
  `UI → API → DB → AI → Test → Telemetry`.
- Each slice must be independently verifiable and mergeable.

### Positive Consequences
- Rapid feedback loop: each slice is provably working end-to-end.
- Easier rollback and reduced blast radius of bugs.
