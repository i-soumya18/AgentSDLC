# Screen Specifications & Traceability

## SCREEN-TASK-DASHBOARD: AI Task Copilot Dashboard
- **Route:** `/tasks`
- **Layout Archetype:** `dashboard`
- **Mapped Requirements:** `REQ-001.1`, `REQ-001.2`
- **User Flow Step:** FLOW-CREATE-TASK: Step 1 & 2
- **Contained Components:** `COMP-TASK-CREATOR`, `COMP-TASK-LIST`, `COMP-STATUS-BADGE`

### Wireframe Structure
- **Header:** Top navigation bar with workspace switcher and SDLC health indicator
- **Sidebar:** Filter by tags, status (todo, in-progress, completed), and assigned agent
- **Main Content:** Task creation form followed by responsive task grid cards
- **Footer:** System status bar displaying contract verification hash and active gates

### Error & Edge State Handling
- **Network Failure:** Displays persistent offline banner with cached task access
- **Validation Error:** Inline red banner mapping RFC 7807 error detail to input field
- **Empty State:** Renders empty state illustration with single CTA to create first task

## SCREEN-TASK-DETAILS: Task Decomposition & Evidence Inspector
- **Route:** `/tasks/:id`
- **Layout Archetype:** `master-detail`
- **Mapped Requirements:** `REQ-001.3`
- **User Flow Step:** FLOW-REVIEW-EVIDENCE: Step 1 & 2
- **Contained Components:** `COMP-EVAL-CARD`, `COMP-STATUS-BADGE`, `COMP-DELETE-MODAL`

### Wireframe Structure
- **Header:** Breadcrumbs navigation with back-to-dashboard CTA and status pill
- **Main Content:** Split panel: left side shows task specification; right side shows verification evidence
- **Footer:** Execution toolbar with rollback button, re-verify CTA, and delete action

### Error & Edge State Handling
- **Network Failure:** Retry button with exponential backoff indicator
- **Validation Error:** Detailed RFC 7807 dialog with stack trace and spec cross-reference
- **Empty State:** Placeholder card: "No AI evaluation benchmark recorded yet."

