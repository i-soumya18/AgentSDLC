# ADR-0001: Enforce Role-Based Least-Privilege MCP Tool Access

- **Status**: Accepted
- **Date**: 2026-09-11
- **Deciders**: Security Council & Tech Lead
- **Technical Story**: Safe tool-access boundary for AI agents

---

## 1. Context and Problem Statement
Granting AI agents unrestricted tools (shell execution, database write access, cloud deployment permissions) exposes the system to catastrophic failure if an agent hallucinates, suffers a prompt injection, or executes an unintended command.

---

## 2. Decision Outcome
Chosen Option: Implement **Role-Based Least-Privilege MCP Profiles**.
- Research and Planner agents receive read-only filesystem and documentation tools.
- Builder agents receive local development filesystem and dev database tools.
- Production deployment and destructive database operations are isolated and require explicit human-in-the-loop authorization.

### Positive Consequences
- Prevents accidental data deletion or secret exfiltration.
- Provides audit trails of which agent accessed which capability.
