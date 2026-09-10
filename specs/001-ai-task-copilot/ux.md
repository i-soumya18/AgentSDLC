# UX Contract: AI Task Copilot

**Feature ID:** `UX-001` (maps to `SPEC-001`)  
**Designer:** UX Architect  

---

## 8-State Interaction Contract
1. **Initial / Idle**: Clean task creation input form with placeholder "Describe feature to decompose...".
2. **Loading / Pending**: Animated skeleton cards indicating AI generation in-flight.
3. **Success**: Toast notification "Task slice created" and visual update of task list.
4. **Empty State**: Empty board illustration with "No tasks yet. Create one above."
5. **Error State**: Red-bordered input with RFC 7807 problem details and "Retry" CTA.
6. **Partial State**: Saved tasks render normally; failed remote AI decomposition shows offline badge.
7. **Offline State**: Read-only access to cached tasks with offline warning banner.
8. **Destructive Action**: Task deletion requires modal confirmation with explicit "Delete Task" button.
