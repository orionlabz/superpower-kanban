# Side Panel + List View Design

## Goal

Add a persistent side panel to the task-viewer Kanban UI that shows project stats and session timeline when idle, and full task details (annotations, timeline) when a task is selected. Also add a Kanban/List view toggle so users can browse tasks in a grouped list layout.

## Context

Built on top of the existing task-viewer plugin at `task-viewer/`. The Kanban board (4 columns, WebSocket-driven, Claude brand design) was implemented in the previous sprint. This spec extends it with two independent features that share the same panel infrastructure.

---

## Architecture

### Layout

```
┌─────────────────────────────────────────────────┬──────────────┐
│  [🔲 Kanban] [☰ Lista]   filtros   tema         │  Side Panel  │
│─────────────────────────────────────────────────│  240px fixed │
│                                                 │              │
│  Kanban board OR Lista agrupada                 │  Idle:       │
│  (flex: 1, overflow-y: auto)                    │  stats +     │
│                                                 │  timeline    │
│                                                 │              │
│                                                 │  Selected:   │
│                                                 │  task detail │
└─────────────────────────────────────────────────┴──────────────┘
```

The main area (left) and the panel (right) sit inside a flex row container. The panel is always visible — it never overlays the board.

---

## Feature 1: Kanban / List View Toggle

### Toggle button

A segmented control in the toolbar (left of filters): `🔲 Kanban` and `☰ Lista`. Active view persists in `localStorage` key `task-viewer-view` (default: `kanban`).

### List view structure

Sections in order: **Backlog → To Do → In Progress → Done**. Each section is collapsible (same toggle as the Done column in Kanban — starts open except Done, which starts collapsed). Each row shows:

```
● [status badge]  Task title                    [component]  [priority]
```

Clicking a row selects the task and opens the panel (same behavior as clicking a Kanban card). Existing filters (component chip, session toggle) apply to both views.

### Implementation

- `app.js`: add `currentView` state, `renderListView()` function alongside `renderBoard()`
- `styles.css`: add `.list-view` styles (section headers, rows, collapse chevrons)
- `index.html`: add toggle buttons to toolbar

---

## Feature 2: Persistent Side Panel

### Panel states

**Idle (no task selected):**
- Header: project name + git branch (from `/api/health`)
- Stats grid (2×2): concluídas (green) / em progresso (amber) / % completion (terracotta) / nº sessões (muted)
- Section "Timeline do Projeto": list of session entries, newest first. Each entry shows: session summary text + date + session ID (short). Scrollable if tall.

**Task selected:**
- Header: task title + status badge + priority badge + `✕` close button
- Section "Detalhes": component / effort / feature / tags (chips)
- Section "Steps": parsed from the task `description` field. Any line matching `- [ ] ...` or `- [x] ...` is extracted and rendered as a checklist with checkboxes. Checked steps (`- [x]`) appear with a strikethrough style. Clicking a checkbox calls `PATCH /api/tasks/:id/steps` to toggle the step in the stored description and re-syncs the display. If the description contains no step lines, this section is hidden.
- Section "Suas Anotações": editable textarea + Save button. Saves via `POST /api/tasks/:id/notes`. Notes persist across sessions.
- Section "Anotações do Claude": read-only list of notes added by the MCP tool `task_annotate`. Each entry shows: note text + timestamp + tool name.
- Tabs **Progresso** / **Execução** (active tab persists per session in memory, not localStorage):
  - **Progresso**: chronological list of status transitions (backlog → todo → in_progress → done) with timestamps. Source: `task_events` where `type = 'status_change'`.
  - **Execução**: chronological list of tool calls captured while the task was active. Grouped by burst: consecutive tool calls within 60s are shown as one entry (e.g., `⚡ Bash×2, Edit×1 · 14:23–14:28`). Source: `task_events` where `type = 'tool_call'`.

Clicking `✕` or clicking the same task card again deselects and returns to idle state.

---

## Data Model

### New table: `task_events`

```sql
CREATE TABLE IF NOT EXISTS task_events (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id   TEXT NOT NULL,
  type      TEXT NOT NULL,  -- 'status_change' | 'tool_call' | 'claude_note' | 'user_note'
  content   TEXT NOT NULL,  -- JSON payload, schema per type
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_task_events_task_id ON task_events(task_id);
```

Content schemas:
- `status_change`: `{"from": "todo", "to": "in_progress"}`
- `tool_call`: `{"tool": "Bash", "input_summary": "npx gitnexus analyze"}`
- `claude_note`: `{"text": "Migration applied", "tool": "task_annotate"}`
- `user_note`: `{"text": "Check imports"}`

### New table: `project_sessions`

```sql
CREATE TABLE IF NOT EXISTS project_sessions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id    TEXT NOT NULL UNIQUE,
  summary       TEXT NOT NULL,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Populated by the Stop hook via MCP tool `session_summarize`.

---

## New MCP Tools

### `task_annotate`

Adds a Claude-authored note to a task.

```
Input:  { task_id: string, note: string }
Output: { ok: boolean, event_id: number }
```

Inserts a `claude_note` row into `task_events`.

### `session_summarize`

Records a session summary in the project timeline. Called by Claude at the end of a session (Stop hook invokes it via system prompt instruction or explicitly).

```
Input:  { summary: string, tasks_completed: number }
Output: { ok: boolean, session_id: string }
```

Uses the current `CLAUDE_SESSION_ID` env var (or generates UUID if absent). Upserts into `project_sessions`.

---

## New REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/tasks/:id/events` | All events for a task, ordered by `created_at` ASC |
| `POST` | `/api/tasks/:id/notes` | Add a user note (`type = 'user_note'`). Body: `{ text }` |
| `GET` | `/api/project/timeline` | All `project_sessions` rows, ordered by `created_at` DESC, limit 20 |
| `PATCH` | `/api/tasks/:id/steps` | Toggle a step's checked state. Body: `{ index: number, checked: boolean }`. Updates both the DB `description` column and the source `~/.claude/tasks/{sessionId}/{id}.json` file to survive file-watcher re-syncs. |

---

## Tool Call Capture

The existing `hooks.json` PostToolUse hook fires after every tool call. When a task is `in_progress`, the hook script calls `POST /api/tasks/:id/events` with type `tool_call` and a summary of the tool input.

The active task ID is determined by querying `GET /api/kanban` for the first task in `in_progress` state. If multiple tasks are in_progress, capture is skipped (ambiguous).

Input summary rules per tool:
- `Bash`: first 80 chars of `command`
- `Edit` / `Write`: `file_path` only
- `Read`: `file_path` only
- All others: tool name only

---

## Files to Create / Modify

| File | Action | What changes |
|------|--------|--------------|
| `hooks/server/storage.mjs` | Modify | Add `task_events` + `project_sessions` tables, CRUD functions |
| `hooks/server/server.mjs` | Modify | Add new REST endpoints |
| `hooks/server/mcp-server.mjs` | Modify | Add `task_annotate` + `session_summarize` tools |
| `hooks/server/public/index.html` | Modify | Add toggle buttons, panel HTML structure |
| `hooks/server/public/styles.css` | Modify | List view styles, panel styles |
| `hooks/server/public/app.js` | Modify | `currentView` state, list render, panel render, event fetching, steps toggle |
| `hooks/scripts/sync-task.sh` | Modify | Emit `status_change` event on status transitions |
| `hooks/hooks.json` | Modify | PostToolUse hook for tool call capture |

---

## Error Handling

- Panel data loads independently from the board — if `/api/tasks/:id/events` fails, show "Não foi possível carregar os eventos" inline, board continues working.
- `task_annotate` and `session_summarize` return `{ ok: false, error: "..." }` on failure; Claude should surface the error.
- Tool call capture hook: if server is unreachable, silently skip (non-blocking, exit 0).
- User note save: show inline error below the textarea if `POST` fails; do not clear the textarea.

---

## Non-Goals

- No drag-to-reorder in list view (status change via MCP only).
- No real-time updates to the panel via WebSocket (panel refreshes on task select/deselect and on explicit user actions).
- No pagination for `task_events` (tasks rarely exceed 100 events).
- No panel collapse/hide button (always visible; 240px is compact enough).
