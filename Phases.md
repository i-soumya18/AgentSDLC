# AgentSDLC — Software Factory Evolution Plan

> **Status:** Master implementation roadmap  
> **Purpose:** Evolve AgentSDLC from an agent-assisted SDLC framework into a production-grade AI software production factory  
> **Primary principle:** `Intent → Discover → Contract → Design → Architect → Plan → Build → Verify → Accept → Release → Observe → Converge`

---

# 0. Mission

AgentSDLC must evolve from:

```text
User Idea
    ↓
AI Agent
    ↓
Code
```

into:

```text
                         USER
                           │
                           ▼
                     RAW IDEA
                           │
                           ▼
                 ┌──────────────────┐
                 │ DISCOVERY ENGINE  │
                 │                  │
                 │ Intent           │
                 │ Clarification    │
                 │ Requirements     │
                 │ Constraints      │
                 │ Preferences      │
                 │ Assumptions      │
                 └────────┬─────────┘
                          │
                          ▼
                 PRODUCT CONTRACT
                          │
                     USER APPROVAL
                          │
                          ▼
                PRODUCT KNOWLEDGE GRAPH
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           PRODUCT       UX      ARCHITECTURE
              │           │           │
              └───────────┼───────────┘
                          ▼
                      CONTRACTS
                          │
                          ▼
                        PLAN
                          │
                          ▼
                 FACTORY ORCHESTRATOR
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          FRONTEND      BACKEND       INFRA
             │            │            │
             └────────────┼────────────┘
                          ▼
                       TESTING
                          │
               ┌──────────┼──────────┐
               ▼          ▼          ▼
              QA       SECURITY     EVAL
               │          │          │
               └──────────┼──────────┘
                          ▼
                     INTEGRATION
                          │
                          ▼
                  USER SIMULATION
                          │
                          ▼
                    ACCEPTANCE
                     │         │
                   PASS       FAIL
                     │         │
                     ▼         ▼
                  RELEASE   CONVERGENCE
                     │         │
                     ▼         │
                  OBSERVE ◄────┘
                     │
                     ▼
                   LEARN
                     │
                     ▼
                  IMPROVE
```

The factory is complete only when the delivered software satisfies the **mutually agreed Product Contract**.

---

# 1. Core Engineering Principles

All phases MUST preserve these principles.

## 1.1 Evidence over assumptions

Never silently invent requirements, architecture, technology choices, business rules, or user preferences.

Every important statement must be classified as:

```text
FACT
INFERENCE
UNKNOWN
ASSUMPTION
DECISION
```

---

## 1.2 User intent is the source of truth

The system must optimize for:

```text
What the user actually wants
```

not:

```text
What the initial prompt literally said
```

The initial prompt is an imperfect representation of intent.

Discovery exists to recover the underlying intent.

---

## 1.3 Ask questions only when they reduce meaningful uncertainty

Do not overwhelm users with questionnaires.

The system should dynamically select the next highest-value clarification.

Conceptually:

```text
Question Value =
Impact × Uncertainty × Dependency × Risk
```

Questions should be asked only when their answer can materially affect:

- product behavior
- scope
- UX
- architecture
- technology
- security
- cost
- implementation
- acceptance

---

## 1.4 Human approval is a state transition

Approval is not conversational decoration.

It creates a durable boundary:

```text
DISCOVERY
    ↓
PRODUCT CONTRACT
    ↓
USER APPROVAL
    ↓
SCOPE LOCK
```

After approval, changes must go through Change Management.

---

## 1.5 Never silently expand scope

New requirements must become:

```text
Change Request
    ↓
Impact Analysis
    ↓
Affected Artifacts
    ↓
Affected Tasks
    ↓
Risk / Cost / Complexity
    ↓
User Approval
    ↓
Contract Revision
```

---

## 1.6 Context must be minimal but sufficient

Agents must not receive the entire repository by default.

Context should be compiled from:

```text
Organization
    +
Product
    +
System
    +
Feature
    +
Task
    +
Relevant Code
    +
Relevant Tests
    +
Relevant Decisions
```

---

## 1.7 Every agent must produce evidence

No agent may report merely:

```text
Done
```

It must report:

```text
What changed
Why
What requirements were satisfied
What tests were executed
What evidence was produced
What assumptions remain
What risks remain
```

---

## 1.8 Independent verification

The implementation agent must not be the sole authority determining whether its implementation is correct.

Implementation and verification should be logically separated.

---

## 1.9 Smallest coherent change

Agents must avoid unnecessary refactoring, dependencies, architectural rewrites, and unrelated modifications.

---

## 1.10 Backward compatibility

Existing AgentSDLC behavior must remain functional unless a phase explicitly changes it and documents the migration.

---

# 2. Target Factory State Machine

The production lifecycle SHALL become:

```text
IDEA
 ↓
DISCOVERY
 ↓
CLARIFICATION
 ↓
CONTRACT_REVIEW
 ↓
APPROVED
 ↓
DESIGN
 ↓
ARCHITECTURE
 ↓
CONTRACTS
 ↓
PLANNING
 ↓
BUILDING
 ↓
VERIFYING
 ↓
ACCEPTANCE
 ↓
RELEASED
 ↓
OBSERVING
 ↓
CONVERGING
 ↓
BUILDING
```

Every transition must have explicit guards.

Example:

```text
BUILDING → VERIFYING

Requires:
- approved specification
- architecture
- contracts
- executable tasks
- implementation evidence
```

Example:

```text
VERIFYING → RELEASED

Requires:
- tests passing
- security checks passing
- acceptance scenarios passing
- deployment verified
- release gate passing
```

---

# 3. Phase Dependency Map

```text
P0 Foundation
   │
   ├── P1 Discovery
   │      │
   │      ▼
   │   P2 Product Contract
   │      │
   │      ▼
   │   P3 Product Graph
   │      │
   │      ├──────────────┐
   │      ▼              ▼
   │   P4 Context      P5 Design
   │      │              │
   │      └──────┬───────┘
   │             ▼
   │          P6 Architecture
   │             │
   │             ▼
   │          P7 Orchestrator
   │             │
   │             ▼
   │          P8 Engineering
   │             │
   │             ▼
   │          P9 Verification
   │             │
   │             ▼
   │         P10 Acceptance
   │             │
   │             ▼
   │         P11 Deployment
   │             │
   │             ▼
   │         P12 Observability
   │             │
   │             ▼
   │         P13 Autonomous Convergence
   │             │
   │             ▼
   │         P14 Factory Optimization
```

---

# PHASE 0 — FOUNDATION HARDENING

## Objective

Before adding autonomy, make the existing AgentSDLC kernel trustworthy.

The current system must become a reliable foundation for all later phases.

## Goals

- reconcile documentation and implementation
- establish canonical lifecycle states
- establish canonical artifact model
- strengthen existing gates
- make verification trustworthy
- establish stable CLI interfaces
- introduce versioning
- establish machine-readable metadata

## Deliverables

```text
.ai/
├── constitution.md
├── factory.md
├── lifecycle.md
└── schemas/

schemas/
├── artifact.schema.json
├── decision.schema.json
├── assumption.schema.json
├── evidence.schema.json
└── gate.schema.json

docs/
├── architecture/
├── decisions/
└── factory/

src/
├── core/
├── artifacts/
├── lifecycle/
├── gates/
└── verification/
```

## Required Improvements

### Lifecycle registry

Create one canonical source for lifecycle stages.

Do not duplicate stage lists across files.

### Gate registry

Create one canonical machine-readable gate registry.

Every advertised gate must either:

```text
IMPLEMENTED
```

or:

```text
EXPLICITLY_UNIMPLEMENTED
```

Never silently expose an unavailable gate.

### Artifact metadata

Every important artifact should eventually contain:

```yaml
id:
type:
version:
status:
created_at:
updated_at:
author:
parent:
dependencies:
source:
evidence:
```

## Exit Criteria

- lifecycle states have one canonical definition
- gates have one canonical registry
- existing CLI still works
- tests pass
- documentation matches implementation
- no known critical inconsistencies remain

## Implementation Prompt

```text
You are the Foundation Hardening Engineer for AgentSDLC.

Your mission is to harden the existing repository before introducing new factory capabilities.

DO NOT begin by modifying code.

FIRST perform complete reconnaissance of the repository.

Inspect:
- repository structure
- package manifests
- CLI entry points
- stage implementation
- gate implementation
- verification implementation
- drift detection
- evaluation system
- tests
- documentation
- schemas
- scripts
- configuration

Trace the actual execution path of:
init
stage
gate
status
drift
eval
verify

For every architectural statement classify it as:
FACT
INFERENCE
UNKNOWN

Identify inconsistencies between documentation and implementation.

Create a concise investigation report before implementation.

Then define the smallest coherent set of changes required to establish:

1. canonical lifecycle registry
2. canonical gate registry
3. canonical artifact metadata model
4. machine-readable schemas
5. reliable verification behavior
6. backward-compatible CLI behavior

Do not perform unrelated refactoring.

Do not add dependencies unless strictly justified.

For every change:
- explain why
- identify affected modules
- identify risks
- preserve existing behavior

After implementation run:
- unit tests
- contract tests
- relevant CLI tests
- static/syntax checks
- build checks
- verification pipeline

Then update documentation to reflect actual implementation.

Final report must contain:
- changes
- files affected
- tests executed
- evidence
- remaining risks
- assumptions
- UNKNOWN items
```

---

# PHASE 1 — PRODUCT DISCOVERY ENGINE

## Objective

Transform:

```text
raw user idea
```

into:

```text
structured product understanding
```

without forcing the user to understand software engineering terminology.

## New CLI

```bash
eos idea
eos discover
eos clarify
```

## Product discovery artifacts

```text
product/
├── intent.md
├── users.md
├── problems.md
├── outcomes.md
├── constraints.md
├── preferences.md
├── assumptions.md
├── unknowns.md
├── decisions.md
└── discovery.json
```

## Discovery state

```json
{
  "intent": {},
  "users": [],
  "problems": [],
  "desired_outcomes": [],
  "features": [],
  "constraints": [],
  "preferences": {},
  "assumptions": [],
  "unknowns": [],
  "decisions": [],
  "risks": []
}
```

## Discovery principles

The agent must:

1. understand before proposing
2. ask one coherent question group at a time
3. avoid unnecessary questions
4. detect contradictions
5. detect missing information
6. distinguish facts from assumptions
7. summarize understanding periodically
8. allow correction at every stage

## Exit Criteria

Discovery cannot finish while critical unknowns remain.

The system must produce:

```text
DISCOVERY COMPLETE
```

only when:

```text
critical ambiguity = acceptable
critical unknowns = resolved
major contradictions = resolved
user intent = sufficiently understood
```

## Implementation Prompt

```text
You are the Product Discovery Engineer.

Build the first user-facing intelligence layer of AgentSDLC.

Your job is NOT to generate a PRD immediately.

Your job is to discover what the user actually wants.

FIRST:
Perform repository reconnaissance.

Identify:
- existing CLI architecture
- artifact conventions
- stage system
- existing specification format
- agent instructions
- persistence mechanisms
- tests
- extension points

Do not modify anything during reconnaissance.

Then design the Discovery Engine.

The engine must maintain a structured state containing:

intent
users
problems
outcomes
features
constraints
preferences
assumptions
unknowns
risks
decisions
contradictions

Implement adaptive questioning.

The system must NOT ask every possible question.

For every candidate question calculate conceptually:

question value =
impact × uncertainty × dependency × risk

Prioritize questions that can materially change:
- scope
- product behavior
- UX
- architecture
- security
- technology
- cost
- acceptance

The Discovery Agent must:
- summarize current understanding
- explicitly mark UNKNOWN information
- explicitly mark INFERRED information
- identify assumptions
- detect contradictions
- request confirmation when ambiguity is material
- avoid inventing user preferences

Create deterministic schemas for discovery state.

Create tests for:
- incomplete ideas
- ambiguous ideas
- contradictory requirements
- over-specified ideas
- trivial ideas
- changing user answers
- user correction
- unknown requirements

Do not implement the downstream factory yet.

Exit only when the discovery artifact can be consumed by later phases.

Run all relevant tests and verification.

Report evidence and remaining limitations.
```

---

# PHASE 2 — PRODUCT CONTRACT & SCOPE LOCK

## Objective

Convert discovered intent into a mutually agreed machine-readable contract.

## Artifacts

```text
product/
├── product-contract.md
├── product-contract.json
├── scope.md
├── acceptance.md
└── approval.json
```

## Contract

Must define:

```text
Product
Problem
Users
Desired outcomes
MVP scope
Out-of-scope
Features
Requirements
UX preferences
Technology preferences
Constraints
Security requirements
Performance expectations
Deployment expectations
Acceptance criteria
Success criteria
Open questions
Assumptions
```

## Approval

Approval becomes a durable event:

```json
{
  "contract_version": 1,
  "approved": true,
  "approved_at": "...",
  "approved_by": "user"
}
```

## Exit Criteria

No production implementation may begin without an approved contract.

## Implementation Prompt

```text
You are the Product Contract Engineer.

Build the Product Contract layer on top of the completed Discovery Engine.

FIRST inspect:
- discovery artifacts
- existing specification system
- lifecycle system
- artifact schemas
- current gates

Do not assume the Discovery Engine behaves as documented.
Verify it.

Transform discovered intent into a canonical Product Contract.

The contract MUST distinguish:
- confirmed requirements
- assumptions
- inferred requirements
- unknowns
- explicit exclusions
- acceptance criteria

The contract must contain enough information for downstream agents to determine what is being built and what is explicitly NOT being built.

Implement:
- contract generation
- contract validation
- contract versioning
- approval state
- scope lock
- contract integrity checks

After approval:
- prevent silent requirement changes
- detect modifications
- require change requests for scope changes

Implement tests for:
- approval
- rejected contracts
- contract edits
- versioning
- scope violations
- missing acceptance criteria
- unresolved critical unknowns

Do not build the engineering orchestrator yet.

Verify all behavior.

Document the contract lifecycle.
```

---

# PHASE 3 — PRODUCT KNOWLEDGE GRAPH

## Objective

Transform isolated documents into a traceable engineering knowledge graph.

## Core entities

```text
PRODUCT
PERSONA
PROBLEM
OUTCOME
FEATURE
REQUIREMENT
UX_ARTIFACT
ARCHITECTURE
CONTRACT
TASK
TEST
EVALUATION
EVIDENCE
DECISION
ASSUMPTION
CHANGE_REQUEST
RELEASE
```

## Relationships

```text
PRODUCT
 ├── contains → FEATURE
 ├── serves → PERSONA
 └── achieves → OUTCOME

FEATURE
 └── contains → REQUIREMENT

REQUIREMENT
 ├── implemented_by → TASK
 ├── verified_by → TEST
 ├── represented_by → UX_ARTIFACT
 └── constrained_by → CONTRACT

TASK
 └── produces → EVIDENCE
```

## Goal

The system must eventually answer:

```text
Why does this code exist?
Which requirement does it satisfy?
Which user outcome does that requirement support?
What evidence proves it works?
What breaks if this requirement changes?
```

## Implementation Prompt

```text
You are the Product Knowledge Graph Engineer.

Your mission is to make AgentSDLC's artifacts computationally traceable.

FIRST perform reconnaissance of all existing artifact types and relationships.

Do not immediately introduce a database.

Determine whether the existing filesystem/artifact model can support the required graph semantics.

Design a canonical artifact identity model.

Every artifact must have:
- stable ID
- type
- version
- status
- parent
- dependencies
- references
- evidence
- timestamps

Implement graph relationships without unnecessarily replacing the existing storage architecture.

Support queries such as:

- requirement → tasks
- requirement → tests
- feature → requirements
- task → evidence
- decision → affected artifacts
- artifact → dependents
- change → affected artifacts

Build consistency checks for orphaned artifacts and broken references.

Do not introduce a graph database unless the existing architecture demonstrably requires it.

Test:
- creation
- references
- dependency traversal
- versioning
- broken references
- change propagation

Maintain backward compatibility.
```

---

# PHASE 4 — AGENT CONTEXT COMPILER

## Objective

Give each agent the **minimum sufficient context** required for reliable execution.

## Context hierarchy

```text
L0 Organization
L1 Product
L2 System
L3 Feature
L4 Task
L5 Execution
```

## Context Pack

```json
{
  "mission": {},
  "role": {},
  "constraints": [],
  "requirements": [],
  "relevant_artifacts": [],
  "relevant_files": [],
  "relevant_tests": [],
  "decisions": [],
  "assumptions": [],
  "known_risks": [],
  "forbidden_actions": []
}
```

## Context compiler pipeline

```text
TASK
 ↓
Dependency graph
 ↓
Relevant artifacts
 ↓
Relevant source files
 ↓
Relevant tests
 ↓
Relevant decisions
 ↓
Relevant constraints
 ↓
CONTEXT PACK
```

## Implementation Prompt

```text
You are the Agent Context Compiler Engineer.

Your objective is to minimize unnecessary model context while preserving decision correctness.

FIRST investigate:
- current agent instructions
- context files
- project documentation
- task structure
- artifact relationships
- source code layout
- existing agent bootstrap mechanisms

Do not implement retrieval blindly.

Define what information an agent needs for each role.

Implement a context compilation pipeline:

task
→ dependencies
→ relevant artifacts
→ relevant code
→ relevant tests
→ decisions
→ assumptions
→ constraints
→ context pack

The compiler must prefer:
- direct dependencies
- task-specific files
- relevant tests
- governing decisions
- active contracts

It must avoid injecting:
- unrelated source files
- generated files
- caches
- vendor code
- irrelevant historical documents

Implement context size and relevance metrics.

Every generated context pack must be explainable:
for every included item provide a reason.

Test context generation for multiple task types.

Do not build semantic search infrastructure unless evidence shows it is necessary.
```

---

# PHASE 5 — DESIGN FACTORY

## Objective

Turn product requirements into implementation-ready UX and UI specifications.

## Pipeline

```text
Product
 ↓
UX Research
 ↓
Personas
 ↓
User Journeys
 ↓
Information Architecture
 ↓
User Flows
 ↓
Wireframes
 ↓
Visual Design
 ↓
Design System
 ↓
Screen Specifications
```

## Design preferences

Capture:

```text
visual style
color system
typography
spacing
density
radius
motion
accessibility
platform
responsive behavior
reference products
brand
restrictions
```

## Design → Code contract

Each component should define:

```text
states
dimensions
behavior
interaction
accessibility
responsive behavior
tokens
```

## Implementation Prompt

```text
You are the UX and Design Factory Engineer.

Build the design-production layer.

FIRST inspect the product contract and knowledge graph.

Do not begin by generating UI code.

Convert product intent into:
- personas
- journeys
- information architecture
- user flows
- screen requirements
- design system requirements
- component specifications

Explicitly preserve user-provided design preferences.

If design information is missing:
- identify the gap
- ask the user when necessary
- otherwise record a clearly labeled design assumption

Create machine-readable design artifacts.

Every important screen must trace back to product requirements.

Every important component must define:
- visual properties
- interaction states
- behavior
- accessibility
- responsive behavior

Implement validation ensuring:
requirement → UX → screen/component

Do not yet implement production UI unless the existing project architecture explicitly requires it.

Create tests for broken traceability and missing required design information.
```

---

# PHASE 6 — ARCHITECTURE & TECHNOLOGY DECISION ENGINE

## Objective

Convert approved requirements and UX into an evidence-based technical architecture.

## Inputs

```text
Product Contract
Design System
Requirements
Constraints
User Technology Preferences
Scale
Security
Budget
Deployment
Performance
Team Capability
```

## Outputs

```text
architecture/
├── system.md
├── components.md
├── data.md
├── integrations.md
├── deployment.md
├── security.md
└── decisions/
```

## Technology selection

The engine should optimize for:

```text
requirements fit
+
simplicity
+
maintainability
+
user preference
+
ecosystem maturity
+
security
+
performance
+
cost
+
deployment fit
```

## Implementation Prompt

```text
You are the Architecture and Technology Decision Engineer.

FIRST perform complete architectural reconnaissance.

Understand:
- product requirements
- UX requirements
- constraints
- existing technology
- repository conventions
- deployment environment
- security boundaries

Do not choose technologies based on popularity alone.

For every major architectural decision evaluate:
- requirement fit
- complexity
- operational cost
- security
- performance
- maintainability
- ecosystem maturity
- user preference
- existing project compatibility

When the user has explicitly selected a technology, preserve that preference unless there is a concrete technical conflict.

For every significant decision create an ADR containing:
- decision
- alternatives
- rationale
- consequences
- assumptions
- evidence

Generate:
- component architecture
- data architecture
- API architecture
- deployment architecture
- security boundaries
- integration boundaries

Do not implement the system.

Validate that every major architecture decision traces to one or more requirements or constraints.
```

---

# PHASE 7 — FACTORY ORCHESTRATOR

## Objective

Create the actual production control plane.

The orchestrator becomes the central brain.

## Responsibilities

```text
task scheduling
dependency resolution
agent assignment
context compilation
state management
retry
failure handling
escalation
approval
gates
evidence
parallel execution
resource management
```

## Architecture

```text
                    ORCHESTRATOR
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Product        UX     Architecture
             │           │           │
             └───────────┼───────────┘
                         ▼
                      Contracts
                         ▼
                       Plan
                         ▼
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Frontend   Backend      Infra
              │          │          │
              └──────────┼──────────┘
                         ▼
                      Verify
```

## Implementation Prompt

```text
You are the Factory Orchestrator Engineer.

This is a high-risk architectural phase.

DO NOT modify the repository until you have reconstructed the existing execution model.

FIRST:
- inspect all current CLI commands
- inspect agent/skill definitions
- inspect stage system
- inspect gates
- inspect artifacts
- inspect tests
- inspect configuration
- inspect lifecycle

Produce an execution model.

Then design the orchestrator around:
- explicit state
- deterministic transitions
- task dependencies
- bounded autonomy
- context compilation
- evidence collection
- retry policies
- failure handling
- escalation
- human approval

Do NOT build a generic autonomous agent loop.

The orchestrator must operate against explicit artifacts and state.

Every transition must have:
- preconditions
- action
- postconditions
- evidence
- failure state

Support parallel execution only when dependency analysis proves tasks are independent.

Never allow concurrent modifications to the same protected artifact without coordination.

Implement:
- task scheduler
- dependency resolver
- worker assignment
- lifecycle manager
- retry policy
- escalation mechanism
- execution journal

Do not introduce distributed infrastructure prematurely.

Start with the simplest architecture capable of reliable local execution.

Add integration tests for:
- dependency ordering
- parallel tasks
- failure
- retry
- escalation
- cancellation
- state recovery
```

---

# PHASE 8 — ENGINEERING FACTORY

## Objective

Turn approved plans into production software.

## Agent domains

```text
Frontend
Backend
Database
Infrastructure
Integration
Documentation
```

## Task execution contract

Every implementation agent receives:

```text
Product Contract
Feature
Requirement
Task
Architecture
Relevant Design
Relevant Contracts
Context Pack
Constraints
Acceptance Criteria
```

## Output

```text
Implementation
+
Tests
+
Evidence
+
Documentation
```

## Implementation Prompt

```text
You are an Engineering Factory Agent.

You must implement only the assigned task.

FIRST:
Perform targeted reconnaissance.

Trace:

entry point
→ relevant controller/interface
→ business logic
→ data layer
→ external systems
→ output

Identify existing patterns that should be reused.

Do not redesign architecture unless the task explicitly requires it.

Do not introduce dependencies without justification.

Do not modify unrelated files.

Before implementation:
- identify affected modules
- identify tests
- identify contracts
- identify potential side effects

During implementation:
- follow repository conventions
- make the smallest coherent change
- preserve existing behavior outside scope

After implementation:
- run relevant tests
- run static checks
- run build
- run integration checks where applicable

Produce evidence:

task
requirements satisfied
files changed
tests executed
tests passed
artifacts created
assumptions
risks
remaining work

Never report success without evidence.
```

---

# PHASE 9 — VERIFICATION FACTORY

## Objective

Create independent verification across the entire product.

## Verifiers

```text
Requirement Verifier
Code Verifier
UX Verifier
Contract Verifier
Security Verifier
Performance Verifier
E2E Verifier
AI Evaluator
```

## Verification model

```text
Requirement
    ↓
Expected Behavior
    ↓
Test / Evaluation
    ↓
Observed Behavior
    ↓
Evidence
    ↓
Gate
```

## Implementation Prompt

```text
You are the Independent Verification Engineer.

Your role is to determine whether the implementation satisfies the approved Product Contract.

You are NOT the implementation agent.

Do not trust implementation claims.

Inspect:
- product contract
- requirements
- acceptance criteria
- architecture
- contracts
- implementation
- tests
- runtime behavior
- evidence

For every requirement determine:

EXPECTED
OBSERVED
EVIDENCE
STATUS

Use:

PASS
FAIL
BLOCKED
UNKNOWN

Never convert UNKNOWN into PASS.

Verify:
- functional behavior
- API contracts
- data integrity
- UX requirements
- security
- performance
- error handling
- acceptance scenarios

Where possible, test actual behavior rather than source-code intent.

Produce an evidence report.

A release gate may only pass when all mandatory requirements have verified evidence.
```

---

# PHASE 10 — USER ACCEPTANCE SIMULATION

## Objective

Validate the application as a real user would experience it.

## Pipeline

```text
Persona
 ↓
Goal
 ↓
Scenario
 ↓
User Actions
 ↓
Application
 ↓
Observed Outcome
 ↓
Expected Outcome
 ↓
Acceptance
```

## Example

```text
Persona:
Pharmacy cashier

Goal:
Create a sale

Actions:
Login
Search product
Add quantity
Select customer
Accept payment
Generate invoice

Expected:
Inventory decreases
Sale recorded
Invoice generated
```

## Implementation Prompt

```text
You are the User Acceptance Simulation Engineer.

Your mission is to determine whether the finished application actually delivers the outcomes defined in the Product Contract.

Do not test implementation details first.

Start from:
- personas
- user goals
- user journeys
- acceptance criteria

Construct realistic end-to-end scenarios.

For each scenario:
1. establish initial state
2. execute user actions
3. observe system behavior
4. compare against expected outcome
5. record evidence
6. classify PASS / FAIL / BLOCKED

Prioritize critical user journeys.

Test happy paths and important failure paths.

Do not invent business expectations not present in the contract.

If a behavior is ambiguous, classify it UNKNOWN and escalate rather than deciding silently.

Produce a user acceptance report.
```

---

# PHASE 11 — CHANGE IMPACT & CONVERGENCE ENGINE

## Objective

Allow the factory to safely evolve when requirements change or verification fails.

## Change pipeline

```text
Change Request
 ↓
Requirement Diff
 ↓
Dependency Graph
 ↓
Affected Artifacts
 ↓
Affected Tasks
 ↓
Architecture Impact
 ↓
Security Impact
 ↓
Test Impact
 ↓
Risk
 ↓
User Approval
 ↓
Contract Revision
```

## Implementation Prompt

```text
You are the Change Impact and Convergence Engineer.

Build a system that determines what must change when:
- a user changes a requirement
- a test fails
- production reveals a defect
- architecture becomes invalid
- an assumption is disproven

FIRST reconstruct the artifact dependency graph.

Never estimate impact using filenames alone.

Trace actual relationships.

For every change calculate:
- affected requirements
- affected UX
- affected architecture
- affected contracts
- affected tasks
- affected tests
- affected security controls
- affected deployment
- invalidated decisions
- invalidated assumptions

Generate an impact report.

No scope-changing request may automatically enter implementation without required approval.

When verification fails, determine whether the failure requires:
- implementation correction
- requirement clarification
- contract change
- architecture change
- test correction
- environmental correction

Never automatically change the requirement merely to make the test pass.
```

---

# PHASE 12 — DEPLOYMENT FACTORY

## Objective

Automate the path:

```text
Source
 ↓
Build
 ↓
Artifact
 ↓
Staging
 ↓
Verification
 ↓
Production
 ↓
Health Check
 ↓
Rollback if required
```

## Requirements

- reproducible builds
- environment separation
- secret management
- deployment verification
- health checks
- rollback
- release evidence

## Implementation Prompt

```text
You are the Deployment Factory Engineer.

FIRST inspect the existing deployment infrastructure.

Identify:
- build commands
- environments
- configuration
- secrets
- containers
- CI/CD
- startup commands
- health checks
- rollback mechanisms

Do not assume production infrastructure exists.

Separate:
FACT
INTENDED
SCAFFOLDED
UNKNOWN

Design the smallest reliable deployment pipeline compatible with the project.

Every deployment must produce evidence:
- source revision
- build result
- artifact
- environment
- verification result
- health status

Never expose secrets.

Never deploy directly to production without the configured release gate.

Implement rollback capability before autonomous production deployment.
```

---

# PHASE 13 — OBSERVABILITY & AUTONOMOUS MAINTENANCE

## Objective

Transform the factory from:

```text
Idea → MVP
```

into:

```text
Idea → Product → Operate → Learn → Improve
```

## Observation inputs

```text
errors
logs
latency
usage
cost
security events
user feedback
failed workflows
deployment health
```

## Maintenance pipeline

```text
Observation
 ↓
Anomaly / Issue
 ↓
Diagnosis
 ↓
Change Proposal
 ↓
Impact Analysis
 ↓
Approval / Autonomy Gate
 ↓
Implementation
 ↓
Verification
 ↓
Deployment
```

## Implementation Prompt

```text
You are the Autonomous Maintenance Engineer.

Build the production feedback loop.

FIRST determine what observability infrastructure actually exists.

Do not invent telemetry.

Define normalized observation events.

Classify events as:
- informational
- warning
- anomaly
- incident
- security
- product feedback

For every actionable observation:
- identify affected component
- identify likely root cause
- identify evidence
- identify confidence
- identify possible remediation
- identify blast radius

Never automatically modify production software based solely on weak evidence.

All proposed changes must pass through:
observation
→ diagnosis
→ impact analysis
→ policy check
→ implementation
→ verification
→ deployment gate

Implement safe escalation paths.

Autonomous maintenance must respect the project's autonomy level and approval policy.
```

---

# PHASE 14 — AUTONOMY ENGINE

## Objective

Control how much authority each agent has.

## Autonomy levels

```text
L0 — Suggest only

L1 — Execute after approval

L2 — Execute bounded tasks

L3 — Execute feature autonomously

L4 — Execute MVP autonomously

L5 — Continuous software operation
```

## Example policy

```text
Formatting:
L4

Unit tests:
L4

Feature implementation:
L3

New dependency:
L2

Database schema:
L2

Authentication:
L1

Production deployment:
L1/L2

Product scope:
L0

Business requirement:
L0
```

## Implementation Prompt

```text
You are the Autonomy Governance Engineer.

Build bounded autonomy into AgentSDLC.

Do not create a single global autonomous=true switch.

Autonomy must be determined by:
- task type
- risk
- affected system
- data sensitivity
- blast radius
- environment
- agent role
- current lifecycle state

Every action must have:
- required autonomy level
- granted autonomy level
- authorization decision
- evidence

High-risk actions must require explicit approval.

The system must fail closed.

If authorization cannot be determined:
BLOCK the action.

Test:
- low-risk automation
- high-risk blocking
- unauthorized tool access
- production restrictions
- scope changes
- escalation
```

---

# PHASE 15 — FACTORY OPTIMIZATION

## Objective

Optimize the factory scientifically rather than merely adding more agents.

## Metrics

Track:

```text
time to contract
time to MVP
clarification rounds
requirements changed after approval
first-pass verification rate
rework rate
agent failure rate
context size
context relevance
token cost
execution cost
human intervention count
defect escape rate
deployment failure rate
rollback rate
user acceptance rate
```

## Optimization loop

```text
Measure
 ↓
Identify bottleneck
 ↓
Form hypothesis
 ↓
Change one variable
 ↓
Run evaluation
 ↓
Compare
 ↓
Adopt / Reject
```

## Implementation Prompt

```text
You are the Factory Optimization Engineer.

Do not optimize based on intuition.

First establish baseline measurements.

Measure:
- task duration
- context size
- token consumption
- retries
- human interventions
- failures
- rework
- verification failures
- escaped defects

Identify the highest-cost or highest-risk bottlenecks.

Form explicit optimization hypotheses.

Change one meaningful variable at a time where practical.

Compare before/after measurements.

Do not optimize for raw speed at the expense of:
- correctness
- security
- maintainability
- user satisfaction
- traceability

Prefer optimization that improves:
quality per unit cost
and
correctness per unit context.
```

---

# 4. Universal Agent Prompt Protocol

Every implementation agent in AgentSDLC should follow this protocol.

```text
ROLE
You are a senior engineer operating inside AgentSDLC.

MISSION
Complete the assigned task while preserving project intent,
architecture, conventions, contracts, and invariants.

PHASE 1 — RECONNAISSANCE

Before modifying anything:
- inspect relevant repository structure
- inspect relevant files
- inspect relevant tests
- inspect governing documentation
- inspect relevant decisions
- inspect contracts
- trace the execution path

Do not modify files during reconnaissance.

PHASE 2 — KNOWLEDGE MODEL

Explicitly identify:

FACT:
...

INFERENCE:
...

UNKNOWN:
...

ASSUMPTIONS:
...

RISKS:
...

PHASE 3 — IMPACT ANALYSIS

Identify:
- affected modules
- affected artifacts
- affected APIs
- affected data
- affected tests
- affected external systems
- possible side effects

PHASE 4 — PLAN

Produce a concise implementation plan.

Use existing abstractions where appropriate.

Prefer the smallest coherent change.

PHASE 5 — IMPLEMENT

Modify only what is necessary.

Do not:
- perform unrelated refactors
- introduce unnecessary dependencies
- bypass gates
- weaken tests
- silently alter requirements
- change architecture without justification

PHASE 6 — VERIFY

Run relevant:
- unit tests
- integration tests
- contract tests
- static checks
- lint
- build
- runtime checks

PHASE 7 — EVIDENCE

Report:

TASK
REQUIREMENTS
FILES CHANGED
TESTS
EVIDENCE
ASSUMPTIONS
RISKS
UNKNOWN
REMAINING WORK

Never claim completion without evidence.
```

---

# 5. Factory-Level Artifact Graph

The completed factory should maintain:

```text
PRODUCT
 │
 ├── INTENT
 ├── PERSONAS
 ├── PROBLEMS
 ├── OUTCOMES
 │
 ├── FEATURES
 │     │
 │     └── REQUIREMENTS
 │            │
 │            ├── UX
 │            ├── API
 │            ├── DATA
 │            ├── ARCHITECTURE
 │            ├── TASKS
 │            ├── TESTS
 │            ├── EVALUATIONS
 │            └── EVIDENCE
 │
 ├── DECISIONS
 │
 ├── ASSUMPTIONS
 │
 ├── CHANGE REQUESTS
 │
 ├── RELEASES
 │
 └── OBSERVATIONS
```

Every node must be traceable.

---

# 6. Definition of Factory Completion

AgentSDLC can be considered a genuine Software Production Factory only when it can perform the following lifecycle:

```text
1. Receive raw idea

2. Understand user intent

3. Identify ambiguity

4. Ask adaptive clarification questions

5. Capture requirements

6. Capture user preferences

7. Capture constraints

8. Identify assumptions

9. Produce Product Contract

10. Obtain user approval

11. Lock scope

12. Generate UX

13. Generate architecture

14. Select technology rationally

15. Generate contracts

16. Generate implementation plan

17. Generate dependency-aware tasks

18. Compile minimal agent context

19. Execute agents

20. Run parallel work safely

21. Collect evidence

22. Verify independently

23. Run end-to-end acceptance scenarios

24. Detect deviations

25. Converge failures

26. Obtain release approval where required

27. Build deployment artifact

28. Deploy

29. Verify production

30. Observe production

31. Detect problems

32. Propose changes

33. Assess impact

34. Implement bounded changes

35. Verify again

36. Continuously improve
```

---

# 7. Final Factory Definition of Done

The factory itself is considered production-ready only when all of the following are true:

```text
[ ] Raw ideas can enter the system

[ ] Discovery is adaptive

[ ] Ambiguity is explicitly represented

[ ] Facts and assumptions are separated

[ ] Product Contract is generated

[ ] User approval is persisted

[ ] Scope is enforceable

[ ] Requirements are traceable

[ ] Product artifacts form a dependency graph

[ ] UX is generated from requirements

[ ] Architecture is derived from requirements

[ ] Technology choices are explainable

[ ] Agents receive compiled context

[ ] Agents operate with bounded authority

[ ] Work can execute in dependency-aware parallelism

[ ] Every agent produces evidence

[ ] Independent verification exists

[ ] User acceptance simulation exists

[ ] Change impact analysis exists

[ ] Failed work can converge automatically

[ ] Deployment is reproducible

[ ] Rollback exists

[ ] Production health can be observed

[ ] Autonomous maintenance exists

[ ] High-risk actions require appropriate approval

[ ] No silent scope expansion occurs

[ ] No UNKNOWN state is silently treated as PASS

[ ] Product requirements remain traceable to evidence

[ ] Documentation reflects actual implementation

[ ] The entire system is testable

[ ] The entire system is recoverable after failure
```

---

# 8. Critical Design Principle

Do **not** measure the success of AgentSDLC by:

```text
number of agents
number of prompts
number of tools
lines of code
```

Measure it by:

```text
Intent fidelity
+
Engineering correctness
+
Verification confidence
+
Delivery reliability
+
Cost efficiency
+
Human intervention efficiency
```

The ultimate objective is:

```text
             RAW USER INTENT
                    │
                    ▼
              UNDERSTANDING
                    │
                    ▼
             AGREED CONTRACT
                    │
                    ▼
                SOFTWARE
                    │
                    ▼
              VERIFIED RESULT
                    │
                    ▼
             USER ACCEPTANCE
                    │
                    ▼
              PRODUCTION MVP
```

while minimizing:

```text
ambiguity
unnecessary questions
context waste
agent hallucination
rework
scope drift
human intervention
deployment risk
```

---

# 9. North Star

The final AgentSDLC experience should feel like this:

### User

> I want a platform for independent pharmacies to manage inventory, billing and customers. It should feel modern and extremely fast.

### AgentSDLC

> I understand the initial goal. I need a few decisions before I can define the MVP.

> **1. Who will primarily use it?**  
> Pharmacists, cashiers, owners, or all three?

> **2. Should it work without an internet connection?**

> **3. Single pharmacy or multiple branches?**

> **4. Do you already have a preferred technology stack?**

> **5. For the UI, do you have an existing product you want the experience to feel similar to?**

The user answers.

AgentSDLC continues:

> Here's what I understand...

Then:

```text
PRODUCT CONTRACT v1
```

The user approves.

The system proceeds:

```text
UX
 ↓
ARCHITECTURE
 ↓
CONTRACTS
 ↓
PLAN
 ↓
BUILD
 ↓
TEST
 ↓
VERIFY
 ↓
SIMULATE
 ↓
ACCEPT
 ↓
DEPLOY
```

The user should **not need to orchestrate agents**.

The user should **not need to understand the SDLC**.

The user should **not need to know which agent performs which task**.

They should primarily provide:

```text
Intent
Preferences
Decisions
Feedback
Approval
```

Everything else should be progressively automated behind a system of:

```text
DISCOVERY
→
CONTRACT
→
TRACEABILITY
→
BOUNDED AUTONOMY
→
EXECUTION
→
EVIDENCE
→
VERIFICATION
→
CONVERGENCE
```

**That is the actual north star for AgentSDLC:**

> **A software production system that transforms human intent into verified, deployable software with the minimum necessary human intervention — while never losing track of what was requested, why it was requested, what was changed, and what evidence proves the result is correct.**