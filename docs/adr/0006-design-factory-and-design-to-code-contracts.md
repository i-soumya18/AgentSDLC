# ADR-0006: Design Factory and Design-to-Code Contracts

- **Status**: Accepted
- **Date**: 2026-09-20
- **Deciders**: Lead Software Architect, UX Architect, Factory Orchestrator
- **Technical Story**: Phase 5 — Design Factory (`Phases.md`, `SOFTWATE_FACTORY.md`)

---

## 1. Context and Problem Statement
Historically in AI-driven software generation, agents leap directly from raw text prompts to generating ad-hoc UI code. This results in chaotic design, lack of coherent design systems, missing critical states (e.g. empty, error, offline, loading), broken accessibility, and zero traceability between user requirements and UI components.

Coding agents must not invent UI on the fly; they must implement strict, implementation-ready design specifications.

---

## 2. Decision Outcome
Chosen option: **Deterministic Design Factory Pipeline with Explicit Design-to-Code Contracts and Full `requirement → UX → screen/component` Traceability**.

The pipeline executes before UI implementation:
```text
Product Contract & Knowledge Graph
 ↓
UX Research & Personas
 ↓
User Journeys
 ↓
Information Architecture
 ↓
User Flows
 ↓
Design System Tokens (HSL Palette, Typography, Spacing, Radius, Motion)
 ↓
Screen Specifications (with Wireframe Trees)
 ↓
Component Specifications (8-State Interaction Matrices)
 ↓
Design Traceability & Completeness Gate
```

### Component Contract Invariants:
Every UI component must define:
1. **8 Interaction States**: Initial, Loading, Success, Empty, Error, Partial, Offline, Destructive.
2. **Visual Properties & Token Bindings**: Color system tokens, 8px spacing grid, radius tokens.
3. **Accessibility**: ARIA role, ARIA label, keyboard navigation contract, focus indicators.
4. **Behavior & Dimensions**: Mount behaviors, error handling, validation, minimum height, padding.
5. **Responsive Behavior**: Mobile, tablet, and desktop adaptations.

### Traceability Invariants:
- `Requirement → Screen`: Every requirement (`REQ-xxx`) must map to at least one screen.
- `Screen → Component`: Every screen must declare its contained component contracts.
- No orphaned components: Every component must have a valid parent screen association.

### Positive Consequences
- **Eliminates UI hallucination**: Coding agents implement pre-specified contracts with exact tokens and states.
- **Robust reliability**: Guarantees offline, error, empty, and partial states are designed before coding.
- **Accessibility by default**: Mandates ARIA roles, labels, and keyboard navigation.
- **Explainability**: Preserves user design preferences and records labeled design assumptions for any missing parameters.

### Negative Consequences / Trade-offs
- Upfront design specification step required before implementing frontend code.

---

## 3. Pros and Cons of Options Considered

### Option 1: Ad-hoc Code Generation by LLM
- Good: Fast first draft.
- Bad: Inconsistent styling, missing error/offline states, inaccessible UI, zero requirement traceability.

### Option 2: Visual Wireframe Image Generation Only
- Good: Visual appeal.
- Bad: Not machine-actionable by coding agents; does not define interaction states, validation rules, or accessibility semantics.

### Option 3: Machine-Readable Design-to-Code Contracts (Selected)
- Good: 100% deterministic, machine-verifiable, covers all 8 interaction states, fully traceable to requirements, and provides both JSON and human-readable Markdown.
- Bad: Requires structured schema governance.
