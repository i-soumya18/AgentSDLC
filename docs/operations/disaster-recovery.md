# Disaster Recovery Plan

## 1. Targets & Recovery Objectives
- **RPO (Recovery Point Objective)**: < 15 minutes (maximum permissible data loss via WAL streaming).
- **RTO (Recovery Time Objective)**: < 30 minutes (maximum permissible downtime to restore service).

## 2. Backup Strategy
- Automated daily full snapshot of primary datastores with 30-day retention.
- Continuous Write-Ahead Log (WAL) archiving to secondary geo-replicated object storage.
- Automated backup restoration dry-run performed weekly in an isolated staging environment.

## 3. Failover Procedure
1. Declare disaster scenario (e.g. primary cloud region unavailable).
2. Promote read-replica in secondary region to primary writable database.
3. Update DNS routing records / Cloudflare endpoints to point to secondary region.
4. Execute smoke tests (`scripts/smoke-test.sh`).
5. Open communications with stakeholders via status page.
