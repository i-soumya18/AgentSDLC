# Infrastructure Path-Specific Instructions

> Applies to: `infra/`, `docker/`, `terraform/`, `k8s/`

## 1. Immutable & Reproducible Deployments
- Container images must be pinned to specific SHA256 digests or semantic tags, never `:latest`.
- Base images must be minimal, hardened distributions (e.g., Alpine or Distroless).
- Never run containers as root user (`USER node` / `USER app`).

## 2. Infrastructure as Code (IaC) Standards
- All cloud resources must be provisioned via Terraform/OpenTofu or CloudFormation. Manual console clicks are forbidden.
- Follow least privilege: IAM roles must be scoped to specific resource ARNs with minimal action permissions.
- Enable deletion protection and automated point-in-time backups for stateful datastores.
