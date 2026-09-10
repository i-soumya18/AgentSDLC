# Tool Policy & Least-Privilege MCP Matrix

> **Core Axiom**: Never give every agent access to your production kingdom. Provide the minimum required capability profile for each role.

---

## 1. Tool Capability Groups

| Capability Group | Purpose & Allowed Tool Operations | MCP Server Reference |
|---|---|---|
| **Source Control** | Read repo tree, create branches, open pull requests, read issues, check CI status | `mcp-github` / `mcp-git` |
| **Design** | Inspect design tokens, screen components, frame layouts, asset exports | `mcp-figma` |
| **Knowledge** | Read architecture docs, ADRs, RFCs, local documentation | `mcp-filesystem` (docs only) |
| **Database (Dev/Test)** | Read dev schema, run migrations on test DB, execute read-only queries | `mcp-postgres` / `mcp-sqlite` |
| **Cloud & Infra** | Read deployment statuses, verify container builds, check staging resources | `mcp-cloud` |
| **Observability** | Query traces, view structured logs, check metric dashboards | `mcp-opentelemetry` |
| **Browser Testing** | Headless browser automation, take screenshots, inspect DOM and a11y tree | `mcp-playwright` |

---

## 2. Agent Permission Matrix

| Agent Role | Repo Read | Repo Write | DB Read | DB Write | Deploy Staging | Deploy Prod | Secrets Access |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Product** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Spec** | ✓ | `specs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Critic** | ✓ | `specs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **UX** | ✓ | `design/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Architect** | ✓ | `docs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **API / Data** | ✓ | `contracts/` | Dev | Dev Migration | ✗ | ✗ | ✗ |
| **Planner** | ✓ | `specs/` | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Builder** | ✓ | `src/` | Dev | Dev | ✗ | ✗ | ✗ |
| **Test** | ✓ | `tests/` | Test | Test DB | ✗ | ✗ | ✗ |
| **Security** | ✓ | Reports only | ✗ | ✗ | ✗ | ✗ | Read-Only Audit |
| **AI Eval** | ✓ | `tests/evals/` | ✗ | ✗ | ✗ | ✗ | Test Keys only |
| **Release** | ✓ | `infra/`, CI | Dev/Staging | Migrations | ✓ | 🔒 Gated (Human) | 🔒 Gated (CI KMS) |
| **SRE** | ✓ | Runbooks | Read Staging | ✗ | ✗ | ✗ | ✗ |
| **Convergence**| ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## 3. High-Risk Human Gate Requirements

The following actions strictly require explicit human verification and confirmation:
1. **Production Deployment**: No agent can trigger a production deployment without human sign-off.
2. **Database Mutation**: Running irreversible migrations or raw mutations against non-ephemeral databases.
3. **Secret Rotation**: Accessing or updating production KMS or vault credentials.
4. **Constitution / Gate Override**: Modifying gate thresholds or constitutional principles.
