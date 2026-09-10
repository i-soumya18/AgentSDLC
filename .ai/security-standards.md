# Universal Security Standards

This repository enforces a two-track security model: **Traditional Web/API Security** and **GenAI/Agent Security**.

---

## Track A: Traditional Web & API Security (OWASP Top 10)
1. **Broken Object Level Authorization (BOLA)**: Always verify that the authenticated user owns or has explicit permission to access the target object ID.
2. **Broken Authentication**: Use signed JWTs with short expiry (e.g. 15 minutes) and HTTP-only, secure cookies for refresh tokens.
3. **Injection**: All SQL must use parameterized queries or trusted ORM methods. Never concatenate user strings into database queries.
4. **Security Misconfiguration**: Enforce CORS, Content Security Policy (CSP), and HSTS headers. Disable debug mode and stack traces in production.
5. **Vulnerable Dependencies**: Keep dependencies audited with `npm audit` or Dependabot. Zero high or critical vulnerabilities allowed in main.

---

## Track B: GenAI & Agentic System Security (OWASP GenAI Top 10)
1. **LLM01: Prompt Injection**: Never concatenate unvalidated user inputs directly into system prompts without delimiters and guardrail wrappers.
2. **LLM02: Sensitive Information Disclosure**: Sanitize prompts and responses to prevent leaking proprietary instructions, secrets, or PII.
3. **LLM06: Excessive Agency**: Never grant an LLM autonomous capability to execute irreversible actions (e.g. deleting users, executing arbitrary shell code) without human-in-the-loop authorization.
4. **LLM07: System Prompt Leakage**: System prompts must include defense instructions refusing requests to repeat or print their instructions.
5. **LLM08: Vector & Data Poisoning**: Validate and isolate external RAG sources before embedding into context.
