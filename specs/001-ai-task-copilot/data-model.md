# Data Model: AI Task Copilot

**Feature ID:** `DATA-001` (maps to `SPEC-001`)  

---

## 1. Schema (SQLite / PostgreSQL)

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'todo',
  tags TEXT DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
```

---

## 2. Backward-Compatible Rollback SQL
```sql
DROP TABLE IF EXISTS tasks;
```
