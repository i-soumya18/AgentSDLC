# Data Model Specification

**Feature ID:** `DATA-XXX` (maps to `SPEC-XXX`)  
**Storage Engine:** PostgreSQL / SQLite  

---

## 1. Schema Definitions & DDL

```sql
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
```

---

## 2. Migration & Rollback Strategy
- **Expand**: Table created with defaults.
- **Contract**: N/A for initial table creation.
- **Rollback SQL**: `DROP TABLE IF EXISTS resources;`
