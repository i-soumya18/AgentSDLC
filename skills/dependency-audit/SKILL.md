---
name: dependency-audit
description: Audits third-party packages for vulnerabilities, licensing compliance, and maintenance health.
---

# Skill: Dependency Audit

## PURPOSE
Ensure all project dependencies are safe, properly licensed, and actively maintained to prevent supply-chain attacks.

## INPUTS
- `manifest`: `package.json` or lockfiles.

## TOOLS
- `run_command` (`npm audit`)
- `view_file`

## STEPS
1. Run `npm audit --audit-level=high`.
2. Inspect new dependencies for permissive open-source licenses (MIT, Apache 2.0, BSD). Flag restrictive licenses (GPL/AGPL) if commercial proprietary distribution is planned.
3. Verify that dependencies are pinned to exact versions or safe semver ranges.
4. Check package maintenance status (avoid abandoned packages with no commits in >2 years).

## CONSTRAINTS
- Zero high or critical vulnerabilities allowed in main branch builds.
- New dependencies must have architectural justification documented in an ADR.

## FAILURE CONDITIONS
- Unpatched CVEs with published exploits in production dependency tree.

## EXPECTED OUTPUT
Dependency audit report logged in CI artifacts.

## REQUIRED EVIDENCE
- Terminal log showing `0 vulnerabilities found` from audit tools.
