# Universal Coding Standards

## 1. Vertical Slice Architecture
Code must be structured into independent vertical feature slices. Rather than clustering all controllers together and all models together, group by domain feature whenever possible:
```text
src/
└── features/
    └── task-management/
        ├── task.controller.js
        ├── task.service.js
        ├── task.repository.js
        ├── task.schema.js
        └── task.test.js
```

## 2. Defensive Programming & Error Handling
- Never swallow exceptions silently.
- Always catch errors at the boundary and translate them into RFC 7807 problem details.
- Avoid null references: favor explicit `Optional` types, null checks, or fallback defaults.
- Validate all incoming network input using schema parsers before touching domain logic.

## 3. Immutability & Clean State
- Favor pure functions without hidden side-effects.
- Avoid global mutable variables or singleton state caches that interfere with parallel test execution.
- Maintain deterministic behavior in unit-testable modules.
