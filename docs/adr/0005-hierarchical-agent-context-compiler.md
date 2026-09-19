# ADR-0005: Hierarchical Agent Context Compiler

- **Status**: Accepted
- **Date**: 2026-09-20
- **Deciders**: Lead Software Architect, Antigravity AI, Factory Orchestrator
- **Technical Story**: Phase 4 — Agent Context Compiler (`Phases.md`, `SOFTWATE_FACTORY.md`)

---

## 1. Context and Problem Statement
In naive agentic software development, agents are routinely supplied with entire repositories, noisy git histories, generated build artifacts, vendor libraries, and uncurated documentation. This causes severe prompt bloat, high model latency, increased token expense, hallucination, and context drift. Conversely, under-providing context leads to boundary violations, ignored architectural constraints, and broken contracts.

Agents require the **minimum sufficient context** necessary to make 100% correct, bounded decisions.

---

## 2. Decision Outcome
Chosen option: **Deterministic 6-Level Context Hierarchy (L0-L5) with Graph-Driven Context Compilation and Negative Filtering**.

Context is compiled through a strict pipeline:
```text
Task / Role
 ↓
Dependency Graph (ProductKnowledgeGraph)
 ↓
Relevant Artifacts (Specs, Contracts, UX)
 ↓
Relevant Source Files (Bounded to Vertical Slice)
 ↓
Relevant Tests (Unit, Contract, Evals)
 ↓
Relevant Decisions (ADRs)
 ↓
Governing Constraints (Constitution, Tool Policy)
 ↓
Context Pack (with Metrics & Explanations)
```

### Hierarchy Levels:
- **L0 Organization**: Supreme engineering constitution, quality gates, tool policies.
- **L1 Product**: Product contract, charter, business outcomes, target personas.
- **L2 System**: System architecture, C4 container boundaries, resilience matrix, ADRs.
- **L3 Feature**: Feature specifications (`spec.md`), `REQ-xxx` tags, UX interaction models.
- **L4 Task**: Granular vertical slice (`TASK-xxx`), slice dependencies, acceptance criteria.
- **L5 Execution**: Direct implementation source files, targeted tests, and fixtures.

### Positive Consequences
- **Context minimization**: Achieves over 80-90% token reduction compared to injecting entire repository workspaces.
- **Strict decision correctness**: Guarantees active contracts, constitution laws, and relevant ADRs are always present.
- **Zero semantic search drift**: Uses deterministic knowledge graph traversal rather than probabilistic vector search.
- **Explainability**: Every included artifact, file, requirement, and constraint contains a machine-verifiable `reason`.
- **Negative filtering**: Explicitly blocks vendor dependencies (`node_modules`), VCS files (`.git`), caches, and machine-generated build artifacts (`dist/`, `coverage/`, `.map`).

### Negative Consequences / Trade-offs
- Requires maintaining clean requirement-to-task-to-code mapping in `ProductKnowledgeGraph` and vertical task specifications.

---

## 3. Pros and Cons of Options Considered

### Option 1: Unstructured Repository Context Dump (Naive RAG / Monolithic Dump)
- Good: Zero upfront compilation logic needed.
- Bad: Floods model context with thousands of irrelevant tokens, introduces vendor noise, risks prompt injection from third-party code, and degrades reasoning accuracy.

### Option 2: Pure Vector / Semantic Search Retrieval
- Good: Query-based fuzzy matching.
- Bad: Non-deterministic, prone to missing mandatory architectural constraints or contract schemas if query keywords differ, and adds external vector store dependencies.

### Option 3: Deterministic Graph-Driven Context Compiler (Selected)
- Good: 100% deterministic, zero external infrastructure dependencies, fully explainable, bounded role permissions, and strictly enforces the 6-level context hierarchy.
- Bad: Requires explicit artifact metadata and graph relationships.
