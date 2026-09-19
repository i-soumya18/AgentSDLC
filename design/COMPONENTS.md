# Component Specifications (Design → Code Contracts)

## COMP-TASK-CREATOR: Task Creator Input Form
> **Category:** `input` | **Parent Screen:** `SCREEN-TASK-DASHBOARD`

Primary input component for creating and decomposing new tasks

### 8-State Interaction Matrix
| State | Specification & Behavior |
|---|---|
| **initial** | Input field idle with placeholder "Describe feature to decompose..." |
| **loading** | Disabled submit button with animated spinner; opacity 0.7 |
| **success** | Green highlight ring, input cleared, toast notification displayed |
| **empty** | Default placeholder rendered; validation message hidden |
| **error** | Red border (status.error), RFC 7807 error detail displayed below input |
| **partial** | Title validated locally; remote AI tags pending background fetch |
| **offline** | Offline warning badge; input disabled with "Offline mode" notice |
| **destructive** | Clear form warning dialog if dirty state exists |

### Accessibility & Dimensions
- **ARIA Role:** `form`
- **ARIA Label:** `Create new task form`
- **Keyboard Navigation:** Tab accessible, Enter submits, Esc clears current input
- **Focus Indicator:** `2px solid hsl(215, 80%, 48%) with 2px offset`
- **Min Height:** `44px`
- **Padding:** `8px 16px`

## COMP-TASK-LIST: Task Card Grid
> **Category:** `display` | **Parent Screen:** `SCREEN-TASK-DASHBOARD`

Interactive list and card grid rendering active task slices

### 8-State Interaction Matrix
| State | Specification & Behavior |
|---|---|
| **initial** | Renders cached task items in chronological order |
| **loading** | 3 animated skeleton cards with pulse animation |
| **success** | Renders complete list of task cards with green status badges |
| **empty** | Empty state illustration with text: "No tasks yet. Create one above." |
| **error** | Error banner with "Failed to load tasks" and retry button |
| **partial** | Cached tasks rendered with top banner indicating sync in progress |
| **offline** | Read-only view of cached tasks with offline notice banner |
| **destructive** | Task deletion animates card fade-out and slide-up |

### Accessibility & Dimensions
- **ARIA Role:** `list`
- **ARIA Label:** `Decomposed task list`
- **Keyboard Navigation:** Arrow up/down to navigate tasks; Enter opens details
- **Focus Indicator:** `2px solid hsl(215, 80%, 48%) with 2px offset`
- **Min Height:** `200px`
- **Padding:** `16px`

## COMP-STATUS-BADGE: Task Status Pill
> **Category:** `feedback` | **Parent Screen:** `SCREEN-TASK-DASHBOARD`

Visual indicator displaying lifecycle status (todo, in_progress, completed)

### 8-State Interaction Matrix
| State | Specification & Behavior |
|---|---|
| **initial** | Gray neutral pill for "todo" state |
| **loading** | Pulsing blue pill indicating task execution active |
| **success** | Solid green pill indicating passing tests and verified evidence |
| **empty** | Muted outline pill |
| **error** | Red pill indicating quality gate failure or contract drift |
| **partial** | Amber pill indicating partially verified vertical slice |
| **offline** | Dashed border pill indicating offline status |
| **destructive** | Red outline pill with delete icon |

### Accessibility & Dimensions
- **ARIA Role:** `status`
- **ARIA Label:** `Task lifecycle status`
- **Keyboard Navigation:** Non-interactive or focusable with tooltip description
- **Focus Indicator:** `none`
- **Min Height:** `24px`
- **Padding:** `2px 8px`

## COMP-EVAL-CARD: AI Evaluation Benchmark Card
> **Category:** `display` | **Parent Screen:** `SCREEN-TASK-DETAILS`

Inspects AI tool decomposition benchmarks, accuracy score, and latency

### 8-State Interaction Matrix
| State | Specification & Behavior |
|---|---|
| **initial** | Renders baseline benchmark scorecards |
| **loading** | Progress bar simulating live evaluation dataset execution |
| **success** | Pass badge with score > threshold (e.g. 95% pass rate) |
| **empty** | Notice: "No evaluation runs recorded for this task" |
| **error** | Red scorecard with failing prompts highlighted |
| **partial** | Warning badge: "Evaluation completed with warnings" |
| **offline** | Cached evaluation metrics with timestamp |
| **destructive** | Purge benchmark dataset confirmation dialog |

### Accessibility & Dimensions
- **ARIA Role:** `region`
- **ARIA Label:** `AI benchmark results`
- **Keyboard Navigation:** Tab to inspect individual prompt details
- **Focus Indicator:** `2px solid hsl(215, 80%, 48%) with 2px offset`
- **Min Height:** `180px`
- **Padding:** `16px`

## COMP-DELETE-MODAL: Destructive Confirmation Modal
> **Category:** `overlay` | **Parent Screen:** `SCREEN-TASK-DETAILS`

Modal barrier preventing accidental task deletion or scope alteration

### 8-State Interaction Matrix
| State | Specification & Behavior |
|---|---|
| **initial** | Hidden / closed state (display: none) |
| **loading** | Delete button disabled with spinner during HTTP DELETE |
| **success** | Modal closes, toast confirms deletion |
| **empty** | Standard confirmation prompt displayed |
| **error** | Error message within modal if delete request fails |
| **partial** | Disabled if user lacks deletion authority |
| **offline** | Blocked with notice: "Cannot delete tasks in offline mode" |
| **destructive** | Prominent red "Delete Permanently" button with double confirmation |

### Accessibility & Dimensions
- **ARIA Role:** `alertdialog`
- **ARIA Label:** `Confirm task deletion`
- **Keyboard Navigation:** Focus trapped; Esc dismisses; Tab cycles Cancel and Delete buttons
- **Focus Indicator:** `2px solid hsl(215, 80%, 48%) with 2px offset`
- **Min Height:** `220px`
- **Padding:** `24px`

