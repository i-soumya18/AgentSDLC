# Deployment Topology & Environments

```mermaid
flowchart LR
    Dev["Local Dev Environment\n(Developer / Builder Agent)\n- Local SQLite / Docker DB\n- Mock AI Providers\n- Unit & Contract Tests"]
    Staging["Staging Environment\n- Full Integration\n- Synthetic Smoke Tests\n- Pre-migration dry-run\n- Rollback verification"]
    Prod["Production Environment\n- Gated Human Authorization\n- Live DB with Backups\n- OpenTelemetry Telemetry\n- Active SLO Alerts"]

    Dev -->|PR Merge to develop| Staging
    Staging -->|Tag v* + Human Signoff| Prod
```

### Environment Isolation Rules
- **Development**: Isolated mock or local container datastores; zero production credentials.
- **Staging**: Complete mirror of production architecture; automated smoke tests executed via `scripts/smoke-test.sh`.
- **Production**: Strictly protected; accessible only via authorized CI/CD runners with KMS-managed secrets and mandatory human signoff.
