# Security Policy

The **Agentic AI SDLC OS (`engineering-os` / `eos`)** community takes security seriously. As a project focused on governing autonomous AI coding agents and production software pipelines, maintaining rock-solid security and defense against both traditional software vulnerabilities and GenAI threats is foundational.

---

## 🛡️ Supported Versions

We actively provide security patches for the following versions:

| Version | Supported          | Security Level |
| ------- | ------------------ | -------------- |
| 1.0.x   | :white_check_mark: | Full Support   |
| < 1.0   | :x:                | Deprecated     |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, prompt injection exploit, or secret leakage issue within this project, please **do NOT** disclose it publicly via GitHub issues, discussions, or social media.

Instead, please report vulnerabilities via one of the following responsible disclosure paths:

1. **GitHub Security Advisory (Preferred)**:
   Navigate to the repository's **Security** tab and select [Report a vulnerability](https://github.com/i-soumya18/AgentSDLC/security/advisories/new).
2. **Direct Email**:
   Email our security maintainers at [security@engineering-os.org](mailto:security@engineering-os.org) with the subject line `[SECURITY] Potential Vulnerability in AgentSDLC`.

### What to Include in Your Report:
- A detailed description of the vulnerability.
- Steps to reproduce or a Proof of Concept (PoC) script/prompt.
- Affected components (e.g. CLI commands, evaluation harness, prompt guardrails, or quality gate validators).
- Potential impact and severity assessment.
- Any suggested mitigations or patches.

### Our Response SLA:
- **Initial Acknowledgment**: Within 24 hours of receipt.
- **Triage & Severity Assessment**: Within 48 hours.
- **Fix & Disclosure Timeline**: Critical patches will be prioritized and released within 7 calendar days, followed by a coordinated public advisory.

---

## 🔒 Two-Track Security Architecture

This repository enforces strict adherence to two independent security tracks:

### Track A: Traditional Web & API Security (OWASP Top 10)
- **Zero Committed Secrets**: Strict pre-commit and CI scans prevent API keys, tokens, or credentials from entering git history.
- **SQL & Parameter Injection Prevention**: Parameterized queries and prepared statements exclusively.
- **RFC 7807 Error Sanitization**: Error responses never disclose stack traces, database schema details, or environment configurations to clients.
- **Dependency Audits**: Zero high or critical vulnerabilities allowed (`npm audit` / Dependabot).

### Track B: GenAI & Agentic Systems Security (OWASP GenAI Top 10)
- **Prompt Injection Defense (LLM01)**: Delimiter isolation and structural wrapping prevent user inputs from modifying system prompts or escaping instructions.
- **Sensitive Information Disclosure (LLM02)**: Strict prompt sanitation and output filtering for PII, tokens, and internal architecture secrets.
- **Excessive Agency & Privilege Escalation (LLM06)**: Bounded autonomy strictly enforced via MCP capability profiles. Autonomous agents cannot execute destructive file or database modifications without explicit human authorization.
- **System Prompt & Tool Hijacking Defense (LLM07)**: Automated adversarial evaluations (`tests/evals/adversarial.jsonl`) verify resistance against jailbreaks and system prompt extraction attacks before code can pass CI.
