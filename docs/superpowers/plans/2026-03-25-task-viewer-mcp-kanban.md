# Task-Viewer MCP + Kanban Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the task-viewer plugin with an MCP server for active task management, a 4-column Kanban UI, and a multi-project fix.

**Architecture:** PostToolUse hooks sync tasks to SQLite; a new MCP stdio server exposes 5 tools for Claude to enrich/query/move tasks; the Express server gains a `/api/kanban` endpoint and `/api/health`; the browser UI is rewritten as a 4-column Kanban board with real-time WebSocket updates.

**Tech Stack:** Node.js ESM, better-sqlite3, @modelcontextprotocol/sdk ^1.0.0, chokidar, express, ws, vanilla JS/CSS

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `task-viewer/hooks/server/storage.mjs` | Modify | Add schema migration, `listKanban()`, `enrichTask()`, `moveTask()`, `getDashboard()` |
| `task-viewer/hooks/server/server.mjs` | Modify | Add `/api/health`, `/api/kanban`; broadcast `kanban:update` |
| `task-viewer/hooks/server/watchers.mjs` | Modify | Fix `_initialTaskLoad` to scope by project; broadcast `kanban:update` |
| `task-viewer/hooks/server/mcp-server.mjs` | Create | MCP stdio server with 5 tools |
| `task-viewer/hooks/server/package.json` | Modify | Add `@modelcontextprotocol/sdk` dependency |
| `task-viewer/hooks/scripts/sync-task.sh` | Modify | Map `status` → `kanban_column` in POST payload |
| `task-viewer/hooks/scripts/start-server.sh` | Modify | Check `/api/health` for PROJECT_CWD match before early-exit |
| `task-viewer/.mcp.json` | Create | Register MCP server with `${CLAUDE_PLUGIN_ROOT}` path |
| `task-viewer/hooks/server/public/index.html` | Modify | 4-column Kanban layout, filter bar |
| `task-viewer/hooks/server/public/styles.css` | Rewrite | Kanban column styles, card styles, priority badges |
| `task-viewer/hooks/server/public/app.js` | Rewrite | Kanban rendering, WebSocket handler, filter logic |

**Working directory for all tasks:** `/Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/`

---

## Task 1: SQLite Schema Migration + Storage Layer

**Files:**
- Modify: `hooks/server/storage.mjs`

- [ ] **Step 1: Verify current schema**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/hooks/server
sqlite3 data/task-viewer.db ".schema tasks"
```
Expected: shows existing columns (id, session_id, subject, description, status, active_form, owner, blocks, blocked_by, metadata, created_at, updated_at). Confirm `kanban_column` does NOT exist yet.

- [ ] **Step 2: Add schema migration to `storage.mjs`**

Replace the existing incremental migrations block (after the `db.exec` CREATE TABLE block, around line 44) with:

```js
// Incremental migrations for existing databases
const columns = db.prepare(`PRAGMA table_info(tasks)`).all().map(c => c.name);
if (!columns.includes('owner')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN owner TEXT`);
}
if (!columns.includes('metadata')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN metadata TEXT`);
}
if (!columns.includes('kanban_column')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN kanban_column TEXT NOT NULL DEFAULT 'backlog'`);
  // Migrate existing rows: in_progress→in_progress, completed→done, pending→backlog
  db.exec(`UPDATE tasks SET kanban_column = 'in_progress' WHERE status = 'in_progress'`);
  db.exec(`UPDATE tasks SET kanban_column = 'done' WHERE status = 'completed'`);
}
if (!columns.includes('priority')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN priority TEXT`);
}
if (!columns.includes('effort')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN effort TEXT`);
}
if (!columns.includes('component')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN component TEXT`);
}
if (!columns.includes('tags')) {
  db.exec(`ALTER TABLE tasks ADD COLUMN tags TEXT`);
}

// Indexes for new columns
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_tasks_kanban ON tasks(kanban_column);
  CREATE INDEX IF NOT EXISTS idx_tasks_component ON tasks(component);
  CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
`);
```

- [ ] **Step 3: Update `upsertTask` prepared statement to include new columns**

Replace the existing `upsertTask` prepared statement in the `stmts` object:

```js
upsertTask: db.prepare(`
  INSERT INTO tasks (id, session_id, subject, description, status, active_form, owner, blocks, blocked_by, metadata, kanban_column, priority, effort, component, tags, updated_at)
  VALUES (@id, @sessionId, @subject, @description, @status, @activeForm, @owner, @blocks, @blockedBy, @metadata, @kanbanColumn, @priority, @effort, @component, @tags, datetime('now'))
  ON CONFLICT(id, session_id) DO UPDATE SET
    subject = COALESCE(NULLIF(excluded.subject, ''), tasks.subject),
    description = COALESCE(NULLIF(excluded.description, ''), tasks.description),
    status = COALESCE(NULLIF(excluded.status, ''), tasks.status),
    active_form = COALESCE(NULLIF(excluded.active_form, ''), tasks.active_form),
    owner = COALESCE(NULLIF(excluded.owner, ''), tasks.owner),
    blocks = COALESCE(NULLIF(excluded.blocks, ''), tasks.blocks),
    blocked_by = COALESCE(NULLIF(excluded.blocked_by, ''), tasks.blocked_by),
    metadata = COALESCE(NULLIF(excluded.metadata, ''), tasks.metadata),
    kanban_column = COALESCE(NULLIF(excluded.kanban_column, ''), tasks.kanban_column),
    priority = COALESCE(NULLIF(excluded.priority, ''), tasks.priority),
    effort = COALESCE(NULLIF(excluded.effort, ''), tasks.effort),
    component = COALESCE(NULLIF(excluded.component, ''), tasks.component),
    tags = COALESCE(NULLIF(excluded.tags, ''), tasks.tags),
    updated_at = datetime('now')
`),
```

- [ ] **Step 4: Update `upsertTask` function to pass new fields**

Replace the existing `upsertTask` export function:

```js
export function upsertTask(sessionId, taskData) {
  stmts.upsertTask.run({
    id: taskData.id,
    sessionId,
    subject: taskData.subject || '',
    description: taskData.description || '',
    status: taskData.status || '',
    activeForm: taskData.activeForm || '',
    owner: taskData.owner || '',
    blocks: taskData.blocks ? JSON.stringify(taskData.blocks) : '',
    blockedBy: taskData.blockedBy ? JSON.stringify(taskData.blockedBy) : '',
    metadata: taskData.metadata ? JSON.stringify(taskData.metadata) : '',
    kanbanColumn: taskData.kanban_column || '',
    priority: taskData.priority || '',
    effort: taskData.effort || '',
    component: taskData.component || '',
    tags: taskData.tags ? JSON.stringify(taskData.tags) : '',
  });
}
```

- [ ] **Step 5: Add `listKanban` prepared statement and export**

Add to the `stmts` object (after `allProjectTasks`):

```js
kanbanByProject: db.prepare(`
  SELECT t.*, s.project_cwd FROM tasks t
  JOIN sessions s ON s.id = t.session_id
  WHERE s.project_cwd = ?
  ORDER BY t.updated_at DESC
`),

enrichTask: db.prepare(`
  UPDATE tasks SET
    kanban_column = COALESCE(NULLIF(@kanbanColumn, ''), kanban_column),
    priority = COALESCE(NULLIF(@priority, ''), priority),
    effort = COALESCE(NULLIF(@effort, ''), effort),
    component = COALESCE(NULLIF(@component, ''), component),
    tags = COALESCE(NULLIF(@tags, ''), tags),
    metadata = COALESCE(NULLIF(@metadata, ''), metadata),
    updated_at = datetime('now')
  WHERE id = @id AND session_id = @sessionId
`),
```

Add these export functions after the existing exports:

```js
export function listKanban(projectCwd) {
  const rows = stmts.kanbanByProject.all(projectCwd);
  const columns = { backlog: [], todo: [], in_progress: [], done: [] };

  for (const row of rows) {
    const col = row.kanban_column || 'backlog';
    if (!columns[col]) columns[col] = [];
    columns[col].push({
      id: row.id,
      subject: row.subject,
      description: row.description,
      status: row.status,
      kanbanColumn: row.kanban_column,
      priority: row.priority || null,
      effort: row.effort || null,
      component: row.component || null,
      tags: row.tags ? JSON.parse(row.tags) : [],
      activeForm: row.active_form,
      owner: row.owner || null,
      blocks: row.blocks ? JSON.parse(row.blocks) : [],
      blockedBy: row.blocked_by ? JSON.parse(row.blocked_by) : [],
      metadata: row.metadata ? JSON.parse(row.metadata) : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sessionId: row.session_id,
    });
  }

  return columns;
}

export function enrichTask(taskId, sessionId, fields) {
  stmts.enrichTask.run({
    id: taskId,
    sessionId,
    kanbanColumn: fields.kanban_column || '',
    priority: fields.priority || '',
    effort: fields.effort || '',
    component: fields.component || '',
    tags: fields.tags ? JSON.stringify(fields.tags) : '',
    metadata: fields.metadata ? JSON.stringify(fields.metadata) : '',
  });
  return stmts.getSession.get(sessionId) ? getSessionTasks(sessionId).find(t => t.id === taskId) : null;
}

export function moveTask(taskId, sessionId, column) {
  db.prepare(`
    UPDATE tasks SET kanban_column = ?, updated_at = datetime('now')
    WHERE id = ? AND session_id = ?
  `).run(column, taskId, sessionId);
  return getSessionTasks(sessionId).find(t => t.id === taskId) || null;
}

export function getDashboard(projectCwd) {
  const columns = listKanban(projectCwd);
  const allTasks = [...columns.backlog, ...columns.todo, ...columns.in_progress, ...columns.done];
  const total = allTasks.length;
  const completed = columns.done.length;

  const byComponent = {};
  const byPriority = {};
  for (const t of allTasks) {
    if (t.component) byComponent[t.component] = (byComponent[t.component] || 0) + 1;
    if (t.priority) byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
  }

  return {
    projectCwd,
    columns: {
      backlog: { count: columns.backlog.length, tasks: columns.backlog },
      todo: { count: columns.todo.length, tasks: columns.todo },
      in_progress: { count: columns.in_progress.length, tasks: columns.in_progress },
      done: { count: columns.done.length, tasks: columns.done },
    },
    metrics: {
      totalTasks: total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) / 100 : 0,
      byComponent,
      byPriority,
    },
  };
}
```

- [ ] **Step 6: Update `getSessionTasks` to return new fields**

In `storage.mjs`, find the existing `getSessionTasks` export function and replace it:

```js
export function getSessionTasks(sessionId) {
  const rows = stmts.getSessionTasks.all(sessionId);
  return rows.map(row => ({
    id: row.id,
    subject: row.subject,
    description: row.description,
    status: row.status,
    kanbanColumn: row.kanban_column || 'backlog',
    priority: row.priority || null,
    effort: row.effort || null,
    component: row.component || null,
    tags: row.tags ? JSON.parse(row.tags) : [],
    activeForm: row.active_form,
    owner: row.owner || null,
    blocks: row.blocks ? JSON.parse(row.blocks) : [],
    blockedBy: row.blocked_by ? JSON.parse(row.blocked_by) : [],
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sessionId: row.session_id,
  }));
}
```

- [ ] **Step 7: Verify migration runs without error**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/hooks/server
node -e "import('./storage.mjs').then(() => console.log('OK')).catch(console.error)"
```
Expected: `OK`

- [ ] **Step 7: Verify new columns exist and existing data migrated**

```bash
sqlite3 data/task-viewer.db "SELECT id, status, kanban_column, priority FROM tasks LIMIT 5;"
```
Expected: existing tasks show correct `kanban_column` values (`in_progress` or `done` or `backlog` based on their `status`).

- [ ] **Step 8: Commit**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
git add task-viewer/hooks/server/storage.mjs
git commit -m "feat(task-viewer): add kanban_column, priority, effort, component, tags to schema"
```

---

## Task 2: Multi-Project Fix — `/api/health` + `start-server.sh`

**Files:**
- Modify: `hooks/server/server.mjs`
- Modify: `hooks/scripts/start-server.sh`

- [ ] **Step 1: Add `/api/health` to server.mjs**

Add after the `app.use(express.json())` line (before the first route):

```js
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', projectCwd: PROJECT_CWD, port: PORT });
});
```

- [ ] **Step 2: Verify health endpoint**

```bash
# First check if server is running; start if needed
curl -sf http://localhost:37778/api/health
```
Expected:
```json
{"status":"ok","projectCwd":"/Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz","port":37778}
```

- [ ] **Step 3: Update `start-server.sh` to check project identity**

Replace the entire content of `hooks/scripts/start-server.sh`:

```bash
#!/bin/bash
set -euo pipefail

PROJECT_CWD="$PWD"
BROWSER_FLAG="/tmp/task-viewer-browser-opened"

# 1. If server is healthy AND watching the same project, nothing to do
RUNNING_CWD=$(curl -sf http://localhost:37778/api/health | jq -r '.projectCwd // ""' 2>/dev/null || echo "")
if [ "$RUNNING_CWD" = "$PROJECT_CWD" ]; then
  exit 0
fi

# 2. Server is either down or watching a different project — kill it
if [ -f /tmp/task-viewer.pid ]; then
  PID=$(cat /tmp/task-viewer.pid)
  kill "$PID" 2>/dev/null || true
  sleep 1
  kill -9 "$PID" 2>/dev/null || true
  rm -f /tmp/task-viewer.pid
fi
lsof -ti:37778 | xargs kill -9 2>/dev/null || true
sleep 1

# 3. Install deps if needed
cd "${CLAUDE_PLUGIN_ROOT}/hooks/server"
[ -d node_modules ] || npm install --silent

# 4. Start server with correct PROJECT_CWD
PROJECT_CWD="$PROJECT_CWD" nohup node server.mjs > /tmp/task-viewer.log 2>&1 &
echo $! > /tmp/task-viewer.pid

# 5. Wait for server to be ready
for i in 1 2 3 4 5; do
  curl -sf http://localhost:37778/api/health > /dev/null 2>&1 && break
  sleep 1
done

# 6. Open browser only once per server lifecycle (flag cleared on reboot via /tmp)
if [ ! -f "$BROWSER_FLAG" ]; then
  open "http://localhost:37778" 2>/dev/null || xdg-open "http://localhost:37778" 2>/dev/null || true
  touch "$BROWSER_FLAG"
fi
```

- [ ] **Step 4: Verify start-server.sh logic manually**

```bash
# Simulate: run from a different directory
cd /tmp
CLAUDE_PLUGIN_ROOT=/Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer \
  bash /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/hooks/scripts/start-server.sh
```
Expected: server restarts with `PROJECT_CWD=/tmp` (check `/tmp/task-viewer.log`).

Then restart from the correct dir:
```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
CLAUDE_PLUGIN_ROOT=/Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer \
  bash task-viewer/hooks/scripts/start-server.sh
```
Expected: server restarts with correct CWD.

- [ ] **Step 5: Commit**

```bash
git add task-viewer/hooks/server/server.mjs task-viewer/hooks/scripts/start-server.sh
git commit -m "fix(task-viewer): add /api/health endpoint, restart server on project change"
```

---

## Task 3: Multi-Project Fix — `watchers.mjs` Scoped to Project

**Files:**
- Modify: `hooks/server/watchers.mjs`
- Modify: `hooks/server/server.mjs` (update broadcast event name + import)

- [ ] **Step 1: Update imports in `watchers.mjs`**

Replace the import line at the top:

```js
import { upsertSession, upsertTask, listKanban } from './storage.mjs';
```

(Remove the old `listFeatures` import.)

- [ ] **Step 2: Replace `_initialTaskLoad` in `watchers.mjs`**

Replace the entire `_initialTaskLoad` method:

```js
async _initialTaskLoad() {
  // Only sync sessions that belong to this project — never steal sessions from other projects
  const sessions = await discoverProjectSessions(this.projectCwd);
  if (sessions.length === 0) {
    this.onUpdate('kanban:update', { columns: { backlog: [], todo: [], in_progress: [], done: [] } });
    return;
  }
  this.activeSessionId = sessions[0].sessionId;
  upsertSession(this.activeSessionId, this.projectCwd);
  for (const s of sessions) {
    await this._syncTasksFromDisk(s.sessionId);
  }
}
```

- [ ] **Step 3: Update `_syncTasksFromDisk` to broadcast `kanban:update`**

At the end of `_syncTasksFromDisk`, replace:

```js
const features = listFeatures(this.projectCwd);
this.onUpdate('features:update', { features });
```

with:

```js
const columns = listKanban(this.projectCwd);
this.onUpdate('kanban:update', { columns });
```

- [ ] **Step 4: Update `server.mjs` imports and broadcast**

In `server.mjs`, update the import from storage:

```js
import {
  upsertSession,
  upsertTask,
  getSession,
  getSessionTasks,
  listSessions,
  listKanban,
  enrichTask,
  moveTask,
  getDashboard,
  finalizeSession,
} from './storage.mjs';
```

Replace the existing `POST /api/tasks` broadcast:

```js
const columns = listKanban(PROJECT_CWD);
broadcast('kanban:update', { columns });
```

- [ ] **Step 5: Add `/api/kanban` endpoint to `server.mjs`**

Add after the existing `/api/features` route:

```js
app.get('/api/kanban', (_req, res) => {
  try {
    const columns = listKanban(PROJECT_CWD);
    res.json(columns);
  } catch (err) {
    console.error('GET /api/kanban error:', err);
    res.status(500).json({ error: 'failed to list kanban' });
  }
});
```

- [ ] **Step 6: Verify scoped load — start server from correct project, check `/api/kanban`**

```bash
curl -s http://localhost:37778/api/kanban | jq 'keys'
```
Expected: `["backlog","done","in_progress","todo"]`

- [ ] **Step 7: Commit**

```bash
git add task-viewer/hooks/server/watchers.mjs task-viewer/hooks/server/server.mjs
git commit -m "fix(task-viewer): scope _initialTaskLoad to project, broadcast kanban:update"
```

---

## Task 4: Hook Update — `sync-task.sh` Maps Status → `kanban_column`

**Files:**
- Modify: `hooks/scripts/sync-task.sh`

- [ ] **Step 1: Replace `sync-task.sh` with kanban_column mapping**

Replace the entire file:

```bash
#!/bin/bash
input=$(cat 2>/dev/null || echo '{}')

session_id=$(echo "$input" | jq -r '.session_id // empty')
tool_name=$(echo "$input" | jq -r '.tool_name // empty')

# Extract task fields
task_id=$(echo "$input" | jq -r '.tool_output.id // .tool_input.taskId // empty')
subject=$(echo "$input" | jq -r '.tool_output.subject // .tool_input.subject // empty')
description=$(echo "$input" | jq -r '.tool_input.description // empty')
status=$(echo "$input" | jq -r '.tool_output.status // .tool_input.status // empty')
active_form=$(echo "$input" | jq -r '.tool_input.activeForm // empty')

# Skip if missing required fields
if [ -z "$session_id" ] || [ -z "$task_id" ]; then
  echo '{}'
  exit 0
fi

# Map status → kanban_column
# pending → backlog (new tasks start in backlog)
# in_progress → in_progress
# completed → done
# (todo column is set manually via MCP task_move/task_enrich)
case "$status" in
  in_progress) kanban_column="in_progress" ;;
  completed)   kanban_column="done" ;;
  *)           kanban_column="backlog" ;;
esac

# Build JSON payload
payload=$(jq -n \
  --arg sid "$session_id" \
  --arg tid "$task_id" \
  --arg tool "$tool_name" \
  --arg subject "$subject" \
  --arg description "$description" \
  --arg status "$status" \
  --arg active_form "$active_form" \
  --arg kanban_column "$kanban_column" \
  '{sessionId: $sid, taskId: $tid, toolName: $tool, subject: $subject, description: $description, status: $status, activeForm: $active_form, kanban_column: $kanban_column}')

curl -s -X POST -H 'Content-Type: application/json' \
  -d "$payload" http://localhost:37778/api/tasks 2>/dev/null || true

echo '{}'
```

- [ ] **Step 2: Update `/api/tasks` in `server.mjs` to accept `kanban_column`**

In the `POST /api/tasks` handler, update the destructure and upsertTask call:

```js
app.post('/api/tasks', (req, res) => {
  try {
    const { sessionId, taskId, toolName, subject, description, status, activeForm, kanban_column } = req.body;
    if (!sessionId || !taskId) return res.status(400).json({ error: 'sessionId and taskId required' });

    upsertSession(sessionId, PROJECT_CWD);
    upsertTask(sessionId, { id: taskId, subject, description, status, activeForm, kanban_column });

    const columns = listKanban(PROJECT_CWD);
    broadcast('kanban:update', { columns });

    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/tasks error:', err);
    res.status(500).json({ error: 'failed to sync task' });
  }
});
```

- [ ] **Step 3: Verify the hook mapping manually**

```bash
# Simulate a TaskCreate hook call
echo '{"session_id":"test-session","tool_name":"TaskCreate","tool_input":{"subject":"Test task","description":"Desc","status":"pending"},"tool_output":{"id":"99","subject":"Test task","status":"pending"}}' \
  | bash /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/hooks/scripts/sync-task.sh
```
Expected: `{}` (no error), and the task appears in `/api/kanban` backlog column:
```bash
curl -s http://localhost:37778/api/kanban | jq '.backlog | map(.id)'
```

- [ ] **Step 4: Commit**

```bash
git add task-viewer/hooks/scripts/sync-task.sh task-viewer/hooks/server/server.mjs
git commit -m "feat(task-viewer): map status→kanban_column in sync hook, accept in POST /api/tasks"
```

---

## Task 5: MCP Server

**Files:**
- Create: `hooks/server/mcp-server.mjs`
- Modify: `hooks/server/package.json`

- [ ] **Step 1: Install MCP SDK**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/hooks/server
npm install @modelcontextprotocol/sdk
```
Expected: package installed, `node_modules/@modelcontextprotocol/sdk` exists.

- [ ] **Step 2: Update `package.json` to record the dependency**

In `hooks/server/package.json`, add to dependencies:

```json
"@modelcontextprotocol/sdk": "^1.0.0"
```

- [ ] **Step 3: Create `hooks/server/mcp-server.mjs`**

```js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  enrichTask,
  moveTask,
  getDashboard,
  listKanban,
  upsertTask,
  upsertSession,
  getSessionTasks,
} from './storage.mjs';

// Discover projectCwd from the running Express server
async function getProjectCwd() {
  try {
    const res = await fetch('http://localhost:37778/api/health');
    const data = await res.json();
    return data.projectCwd || process.cwd();
  } catch {
    return process.cwd();
  }
}

const server = new Server(
  { name: 'task-viewer', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'task_enrich',
      description: 'Add or update metadata on an existing task (priority, effort, component, tags, kanban_column, feature). Use after TaskCreate to classify the task.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'Task ID (e.g. "7")' },
          sessionId: { type: 'string', description: 'Session ID from the task' },
          kanban_column: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'done'], description: 'Move task to this kanban column' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          effort: { type: 'string', enum: ['trivial', 'small', 'medium', 'large', 'epic'] },
          component: { type: 'string', description: 'System component or area (e.g. "auth", "ui")' },
          tags: { type: 'array', items: { type: 'string' } },
          feature: { type: 'string', description: 'Feature group name' },
        },
        required: ['taskId', 'sessionId'],
      },
    },
    {
      name: 'task_query',
      description: 'Query tasks with filters. Returns tasks from the current project matching all provided criteria.',
      inputSchema: {
        type: 'object',
        properties: {
          column: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'done'] },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
          component: { type: 'string' },
          priority: { type: 'string' },
          feature: { type: 'string' },
          limit: { type: 'number', default: 50 },
        },
      },
    },
    {
      name: 'task_move',
      description: 'Move a task to a specific kanban column. Use to promote backlog→todo when planning to work on a task.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          sessionId: { type: 'string' },
          column: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'done'] },
        },
        required: ['taskId', 'sessionId', 'column'],
      },
    },
    {
      name: 'task_dashboard',
      description: 'Returns a full project snapshot: task counts per column, completion rate, breakdown by component and priority.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'task_bulk_classify',
      description: 'Classify multiple tasks at once. Efficient for batch enrichment at session start/end.',
      inputSchema: {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                taskId: { type: 'string' },
                sessionId: { type: 'string' },
                kanban_column: { type: 'string', enum: ['backlog', 'todo', 'in_progress', 'done'] },
                priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                effort: { type: 'string', enum: ['trivial', 'small', 'medium', 'large', 'epic'] },
                component: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                feature: { type: 'string' },
              },
              required: ['taskId', 'sessionId'],
            },
          },
        },
        required: ['tasks'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'task_enrich') {
      const { taskId, sessionId, ...fields } = args;
      const updated = enrichTask(taskId, sessionId, fields);
      // Notify Express server to broadcast kanban update
      fetch('http://localhost:37778/api/kanban-notify', { method: 'POST' }).catch(() => {});
      return { content: [{ type: 'text', text: JSON.stringify(updated || { taskId, sessionId, ...fields, updated: true }) }] };
    }

    if (name === 'task_query') {
      const projectCwd = await getProjectCwd();
      const columns = listKanban(projectCwd);
      const allTasks = [...columns.backlog, ...columns.todo, ...columns.in_progress, ...columns.done];
      let results = allTasks;
      if (args.column) results = results.filter(t => t.kanbanColumn === args.column);
      if (args.status) results = results.filter(t => t.status === args.status);
      if (args.component) results = results.filter(t => t.component === args.component);
      if (args.priority) results = results.filter(t => t.priority === args.priority);
      if (args.feature) results = results.filter(t => t.metadata?.feature === args.feature);
      results = results.slice(0, args.limit || 50);
      return { content: [{ type: 'text', text: JSON.stringify(results) }] };
    }

    if (name === 'task_move') {
      const { taskId, sessionId, column } = args;
      const updated = moveTask(taskId, sessionId, column);
      fetch('http://localhost:37778/api/kanban-notify', { method: 'POST' }).catch(() => {});
      return { content: [{ type: 'text', text: JSON.stringify(updated || { taskId, sessionId, column, moved: true }) }] };
    }

    if (name === 'task_dashboard') {
      const projectCwd = await getProjectCwd();
      const dashboard = getDashboard(projectCwd);
      return { content: [{ type: 'text', text: JSON.stringify(dashboard) }] };
    }

    if (name === 'task_bulk_classify') {
      const results = [];
      for (const task of args.tasks) {
        const { taskId, sessionId, ...fields } = task;
        const updated = enrichTask(taskId, sessionId, fields);
        results.push(updated || { taskId, sessionId, updated: true });
      }
      fetch('http://localhost:37778/api/kanban-notify', { method: 'POST' }).catch(() => {});
      return { content: [{ type: 'text', text: JSON.stringify(results) }] };
    }

    return { content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }], isError: true };
  } catch (err) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: err.message }) }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

- [ ] **Step 4: Add `/api/kanban-notify` endpoint to `server.mjs`**

This endpoint allows the MCP server to trigger a WebSocket broadcast after enrichment:

```js
app.post('/api/kanban-notify', (_req, res) => {
  try {
    const columns = listKanban(PROJECT_CWD);
    broadcast('kanban:update', { columns });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'notify failed' });
  }
});
```

- [ ] **Step 5: Verify MCP server starts without error**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/task-viewer/hooks/server
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node mcp-server.mjs
```
Expected: JSON response listing all 5 tools.

- [ ] **Step 6: Commit**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
git add task-viewer/hooks/server/mcp-server.mjs task-viewer/hooks/server/package.json task-viewer/hooks/server/server.mjs
git commit -m "feat(task-viewer): add MCP stdio server with task_enrich, task_query, task_move, task_dashboard, task_bulk_classify"
```

---

## Task 6: MCP Registration

**Files:**
- Create: `task-viewer/.mcp.json`

- [ ] **Step 1: Create `.mcp.json`**

```json
{
  "task-viewer": {
    "command": "node",
    "args": ["${CLAUDE_PLUGIN_ROOT}/hooks/server/mcp-server.mjs"]
  }
}
```

- [ ] **Step 2: Verify MCP server appears after reload**

Run `/reload-plugins` in Claude Code. Then run `/mcp` and verify `task-viewer` server appears with 5 tools listed:
- `mcp__plugin_task-viewer_task-viewer__task_enrich`
- `mcp__plugin_task-viewer_task-viewer__task_query`
- `mcp__plugin_task-viewer_task-viewer__task_move`
- `mcp__plugin_task-viewer_task-viewer__task_dashboard`
- `mcp__plugin_task-viewer_task-viewer__task_bulk_classify`

- [ ] **Step 3: Commit**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
git add task-viewer/.mcp.json
git commit -m "feat(task-viewer): register MCP server via .mcp.json"
```

---

## Task 7: Kanban UI — HTML Structure

**Files:**
- Modify: `hooks/server/public/index.html`

- [ ] **Step 1: Replace `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Viewer</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app">
    <header class="toolbar">
      <div class="toolbar-left">
        <span class="app-title">Task Viewer</span>
        <span class="project-badge" id="project-name">—</span>
        <span class="session-badge" id="session-id">—</span>
      </div>
      <div class="toolbar-center" id="component-filters">
        <!-- component filter chips populated by JS -->
      </div>
      <div class="toolbar-right">
        <label class="session-toggle">
          <input type="checkbox" id="current-session-only">
          <span>This session</span>
        </label>
        <span class="status-dot" id="status-dot" title="Disconnected"></span>
        <button class="theme-btn" id="theme-toggle">☽</button>
      </div>
    </header>

    <div class="connection-banner hidden" id="connection-banner">
      Reconnecting to Task Viewer…
    </div>

    <main class="board">
      <div class="column" id="col-backlog">
        <div class="column-header">
          <span class="column-title">Backlog</span>
          <span class="column-count" id="count-backlog">0</span>
        </div>
        <div class="column-body" id="cards-backlog">
          <div class="empty-state">No tasks here</div>
        </div>
      </div>

      <div class="column" id="col-todo">
        <div class="column-header">
          <span class="column-title">Todo</span>
          <span class="column-count" id="count-todo">0</span>
        </div>
        <div class="column-body" id="cards-todo">
          <div class="empty-state">No tasks here</div>
        </div>
      </div>

      <div class="column" id="col-in_progress">
        <div class="column-header">
          <span class="column-title">In Progress</span>
          <span class="column-count" id="count-in_progress">0</span>
        </div>
        <div class="column-body" id="cards-in_progress">
          <div class="empty-state">No tasks here</div>
        </div>
      </div>

      <div class="column collapsed" id="col-done">
        <div class="column-header" id="done-header" role="button" tabindex="0" aria-expanded="false">
          <span class="column-title">Done</span>
          <span class="column-count" id="count-done">0</span>
          <span class="collapse-chevron">▶</span>
        </div>
        <div class="column-body hidden" id="cards-done">
          <div class="empty-state">No tasks here</div>
        </div>
      </div>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML loads in browser**

```bash
open http://localhost:37778
```
Expected: page loads with 4 column headers visible (no JS errors in console).

- [ ] **Step 3: Commit**

```bash
git add task-viewer/hooks/server/public/index.html
git commit -m "feat(task-viewer): add 4-column kanban HTML layout"
```

---

## Task 8: Kanban UI — CSS

**Files:**
- Rewrite: `hooks/server/public/styles.css`

- [ ] **Step 1: Replace `styles.css`**

```css
/* === Reset & Variables === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f4f5f7;
  --surface: #ffffff;
  --surface2: #f0f1f3;
  --border: #dfe1e6;
  --text: #172b4d;
  --text2: #5e6c84;
  --accent: #0052cc;

  --priority-critical: #de350b;
  --priority-high: #ff5630;
  --priority-medium: #0065ff;
  --priority-low: #6b778c;

  --col-backlog: #6b778c;
  --col-todo: #0052cc;
  --col-in_progress: #ff991f;
  --col-done: #00875a;

  --radius: 6px;
  --shadow: 0 1px 3px rgba(0,0,0,.12);
}

body.dark {
  --bg: #1d2125;
  --surface: #22272b;
  --surface2: #2c333a;
  --border: #3b4149;
  --text: #c7d1db;
  --text2: #8c96a3;
}

body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); height: 100vh; overflow: hidden; }

/* === Toolbar === */
.toolbar {
  display: flex; align-items: center; gap: 12px; padding: 8px 16px;
  background: var(--surface); border-bottom: 1px solid var(--border);
  height: 48px; flex-shrink: 0;
}
.toolbar-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
.app-title { font-weight: 700; font-size: 14px; white-space: nowrap; }
.project-badge { font-size: 11px; background: var(--surface2); color: var(--text2); padding: 2px 8px; border-radius: 10px; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
.session-badge { font-size: 11px; color: var(--text2); font-family: monospace; white-space: nowrap; }
.toolbar-center { flex: 1; display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.toolbar-center::-webkit-scrollbar { display: none; }
.toolbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.session-toggle { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text2); cursor: pointer; white-space: nowrap; }
.session-toggle input { cursor: pointer; }
.component-chip { font-size: 11px; padding: 2px 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text2); cursor: pointer; white-space: nowrap; transition: all .15s; }
.component-chip.active { background: var(--accent); color: #fff; border-color: var(--accent); }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #de350b; transition: background .3s; }
.status-dot.online { background: #00875a; }
.theme-btn { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text2); padding: 4px; }

/* === Connection Banner === */
.connection-banner { background: #ff5630; color: #fff; text-align: center; font-size: 12px; padding: 4px; }
.hidden { display: none !important; }

/* === Board === */
.app { display: flex; flex-direction: column; height: 100vh; }
.board { display: flex; flex: 1; gap: 12px; padding: 12px; overflow: hidden; }

/* === Column === */
.column { display: flex; flex-direction: column; flex: 1; min-width: 220px; max-width: 320px; background: var(--surface2); border-radius: var(--radius); overflow: hidden; }
.column.collapsed { flex: 0 0 auto; width: 48px; min-width: 48px; }

.column-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 12px;
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  color: var(--text2); flex-shrink: 0; user-select: none;
}
#col-backlog .column-header { border-top: 3px solid var(--col-backlog); }
#col-todo .column-header { border-top: 3px solid var(--col-todo); }
#col-in_progress .column-header { border-top: 3px solid var(--col-in_progress); }
#col-done .column-header { border-top: 3px solid var(--col-done); }

.column-count { background: var(--border); border-radius: 10px; padding: 1px 7px; font-size: 11px; font-weight: 600; }
.collapse-chevron { margin-left: auto; font-size: 10px; transition: transform .2s; }
#col-done:not(.collapsed) .collapse-chevron { transform: rotate(90deg); }
#done-header { cursor: pointer; }

.column.collapsed .column-header { flex-direction: column; padding: 12px 4px; writing-mode: vertical-rl; text-orientation: mixed; gap: 6px; height: 100%; }
.column.collapsed .collapse-chevron { writing-mode: horizontal-tb; transform: rotate(90deg); }
.column.collapsed:not(.collapsed) .collapse-chevron { transform: rotate(270deg); }

.column-body { flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 8px; }
.empty-state { text-align: center; color: var(--text2); font-size: 12px; padding: 20px 8px; }

/* === Task Card === */
.task-card {
  background: var(--surface); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 10px 12px;
  cursor: pointer; transition: box-shadow .15s; border: 1px solid var(--border);
}
.task-card:hover { box-shadow: 0 3px 8px rgba(0,0,0,.15); }
.task-card.expanded { border-color: var(--accent); }

.card-header { display: flex; align-items: flex-start; gap: 6px; }
.card-subject { font-size: 13px; font-weight: 500; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-id { font-size: 11px; color: var(--text2); font-family: monospace; flex-shrink: 0; margin-top: 1px; }

.card-meta { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 7px; }
.priority-badge { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 3px; color: #fff; }
.priority-critical { background: var(--priority-critical); }
.priority-high { background: var(--priority-high); }
.priority-medium { background: var(--priority-medium); }
.priority-low { background: var(--priority-low); color: var(--text); }
.component-tag { font-size: 10px; padding: 1px 6px; border-radius: 3px; background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
.effort-chip { font-size: 10px; padding: 1px 6px; border-radius: 3px; background: var(--surface2); color: var(--text2); font-style: italic; }

.card-detail { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
.detail-field { display: flex; flex-direction: column; gap: 2px; }
.detail-label { font-size: 10px; font-weight: 600; text-transform: uppercase; color: var(--text2); letter-spacing: .4px; }
.detail-value { font-size: 12px; color: var(--text); }
.active-form { font-size: 12px; color: var(--col-in_progress); font-style: italic; }

/* === Scrollbar === */
.column-body::-webkit-scrollbar { width: 4px; }
.column-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
```

- [ ] **Step 2: Verify styles in browser**

Reload `http://localhost:37778`. Expected: 4 columns visible with color-coded top borders; Done column collapses to 48px wide.

- [ ] **Step 3: Commit**

```bash
git add task-viewer/hooks/server/public/styles.css
git commit -m "feat(task-viewer): kanban CSS — 4-column layout, task cards, priority badges"
```

---

## Task 9: Kanban UI — Client JavaScript

**Files:**
- Rewrite: `hooks/server/public/app.js`

- [ ] **Step 1: Replace `app.js`**

```js
// === State ===
let ws = null;
let reconnectDelay = 1000;
const MAX_RECONNECT = 30000;
let allColumns = { backlog: [], todo: [], in_progress: [], done: [] };
let currentSessionId = null;
let activeComponents = new Set();
let sessionFilter = false;

// === DOM ===
const $ = id => document.getElementById(id);

// === Helpers ===
function esc(str) {
  if (!str) return '';
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function shortSession(id) {
  return id ? id.slice(0, 8) + '…' : '—';
}

// === WebSocket ===
function connect() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${location.host}`);

  ws.onopen = () => {
    reconnectDelay = 1000;
    $('connection-banner').classList.add('hidden');
    $('status-dot').className = 'status-dot online';
  };

  ws.onclose = () => {
    $('status-dot').className = 'status-dot';
    $('connection-banner').classList.remove('hidden');
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT);
  };

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'kanban:update') handleKanbanUpdate(msg.data.columns);
    if (msg.type === 'session:change') handleSessionChange(msg.data);
  };
}

// === Handlers ===
function handleSessionChange({ sessionId }) {
  currentSessionId = sessionId;
  $('session-id').textContent = 'Session: ' + shortSession(sessionId);
}

function handleKanbanUpdate(columns) {
  allColumns = columns;
  updateComponentFilters(columns);
  renderBoard();
}

// === Filters ===
function updateComponentFilters(columns) {
  const allTasks = [...(columns.backlog||[]), ...(columns.todo||[]), ...(columns.in_progress||[]), ...(columns.done||[])];
  const components = [...new Set(allTasks.map(t => t.component).filter(Boolean))].sort();

  const container = $('component-filters');
  const existing = new Set([...container.querySelectorAll('.component-chip')].map(c => c.dataset.comp));
  const updated = new Set(components);

  // Add new chips
  for (const comp of components) {
    if (!existing.has(comp)) {
      const chip = document.createElement('button');
      chip.className = 'component-chip' + (activeComponents.has(comp) ? ' active' : '');
      chip.dataset.comp = comp;
      chip.textContent = comp;
      chip.addEventListener('click', () => toggleComponent(comp, chip));
      container.appendChild(chip);
    }
  }
  // Remove stale chips
  for (const chip of container.querySelectorAll('.component-chip')) {
    if (!updated.has(chip.dataset.comp)) chip.remove();
  }
}

function toggleComponent(comp, chipEl) {
  if (activeComponents.has(comp)) {
    activeComponents.delete(comp);
    chipEl.classList.remove('active');
  } else {
    activeComponents.add(comp);
    chipEl.classList.add('active');
  }
  renderBoard();
}

function filterTasks(tasks) {
  let result = tasks;
  if (sessionFilter && currentSessionId) {
    result = result.filter(t => t.sessionId === currentSessionId);
  }
  if (activeComponents.size > 0) {
    result = result.filter(t => activeComponents.has(t.component));
  }
  return result;
}

// === Board Rendering ===
function renderBoard() {
  const cols = ['backlog', 'todo', 'in_progress', 'done'];
  for (const col of cols) {
    const tasks = filterTasks(allColumns[col] || []);
    $('count-' + col).textContent = tasks.length;
    renderColumn(col, tasks);
  }
}

function renderColumn(col, tasks) {
  const body = $('cards-' + col);
  body.innerHTML = '';
  if (tasks.length === 0) {
    body.innerHTML = '<div class="empty-state">No tasks here</div>';
    return;
  }
  for (const task of tasks) {
    body.appendChild(createCard(task));
  }
}

function createCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';

  const priorityClass = task.priority ? 'priority-' + task.priority : '';
  const priorityHtml = task.priority
    ? `<span class="priority-badge ${priorityClass}">${esc(task.priority)}</span>`
    : '';
  const componentHtml = task.component
    ? `<span class="component-tag">${esc(task.component)}</span>`
    : '';
  const effortHtml = task.effort
    ? `<span class="effort-chip">${esc(task.effort)}</span>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-subject">${esc(task.subject)}</span>
      <span class="card-id">#${esc(task.id)}</span>
    </div>
    ${(task.priority || task.component || task.effort) ? `<div class="card-meta">${priorityHtml}${componentHtml}${effortHtml}</div>` : ''}
    <div class="card-detail hidden">
      ${task.description ? `<div class="detail-field"><span class="detail-label">Description</span><span class="detail-value">${esc(task.description)}</span></div>` : ''}
      ${task.activeForm ? `<div class="detail-field"><span class="detail-label">Active</span><span class="active-form">${esc(task.activeForm)}</span></div>` : ''}
      ${task.metadata?.feature ? `<div class="detail-field"><span class="detail-label">Feature</span><span class="detail-value">${esc(task.metadata.feature)}</span></div>` : ''}
      ${task.tags?.length ? `<div class="detail-field"><span class="detail-label">Tags</span><span class="detail-value">${task.tags.map(t => esc(t)).join(', ')}</span></div>` : ''}
      <div class="detail-field"><span class="detail-label">Session</span><span class="detail-value" style="font-family:monospace;font-size:11px">${shortSession(task.sessionId)}</span></div>
      <div class="detail-field"><span class="detail-label">Updated</span><span class="detail-value">${task.updatedAt ? new Date(task.updatedAt + ' UTC').toLocaleString() : '—'}</span></div>
    </div>
  `;

  card.addEventListener('click', () => {
    const detail = card.querySelector('.card-detail');
    const expanded = !detail.classList.contains('hidden');
    detail.classList.toggle('hidden', expanded);
    card.classList.toggle('expanded', !expanded);
  });

  return card;
}

// === Init ===
async function loadInitialState() {
  try {
    // Load project info
    const health = await fetch('/api/health').then(r => r.json());
    const name = health.projectCwd ? health.projectCwd.split('/').pop() : '—';
    $('project-name').textContent = name;

    // Load kanban data
    const columns = await fetch('/api/kanban').then(r => r.json());
    handleKanbanUpdate(columns);
  } catch { /* server may not be ready yet */ }
}

// === Done column collapse ===
function initDoneCollapse() {
  const header = $('done-header');
  const body = $('cards-done');
  const col = $('col-done');

  header.addEventListener('click', () => {
    const isCollapsed = col.classList.contains('collapsed');
    col.classList.toggle('collapsed', !isCollapsed);
    body.classList.toggle('hidden', !isCollapsed);
    header.setAttribute('aria-expanded', String(isCollapsed));
  });

  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
  });
}

// === Session filter toggle ===
$('current-session-only').addEventListener('change', e => {
  sessionFilter = e.target.checked;
  renderBoard();
});

// === Theme ===
function initTheme() {
  const saved = localStorage.getItem('task-viewer-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) document.body.classList.add('dark');
  updateThemeIcon();
}
function updateThemeIcon() {
  const btn = $('theme-toggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '☀' : '☽';
}
$('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('task-viewer-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeIcon();
});

// === Boot ===
initTheme();
initDoneCollapse();
connect();
loadInitialState();
```

- [ ] **Step 2: Verify full Kanban UI in browser**

```bash
open http://localhost:37778
```
Expected:
- Project name shown in toolbar (basename of projectCwd)
- Tasks from SQLite appear in correct columns
- Click on a task card expands/collapses details
- Done column is collapsed by default; click to expand
- Dark/light theme toggle works
- "This session" checkbox filters to current session's tasks

- [ ] **Step 3: End-to-end test via the API**

```bash
# Add a task via the hook API and verify it appears in the correct column
curl -s -X POST -H 'Content-Type: application/json' \
  -d '{"sessionId":"test-e2e","taskId":"101","subject":"E2E test task","status":"pending","kanban_column":"todo"}' \
  http://localhost:37778/api/tasks

# Verify it shows in 'todo' column
curl -s http://localhost:37778/api/kanban | jq '.todo | map(select(.id=="101")) | .[0].subject'
```
Expected: `"E2E test task"`

- [ ] **Step 4: Commit**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
git add task-viewer/hooks/server/public/app.js
git commit -m "feat(task-viewer): rewrite Kanban UI with 4 columns, filters, card expand, session toggle"
```

---

## Task 10: Final Integration Check + GitNexus Re-index

- [ ] **Step 1: Restart server and verify full stack**

```bash
# Kill running server
kill $(cat /tmp/task-viewer.pid 2>/dev/null) 2>/dev/null || true
lsof -ti:37778 | xargs kill -9 2>/dev/null || true

# Start fresh from correct project
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
CLAUDE_PLUGIN_ROOT=$(pwd)/task-viewer \
  bash task-viewer/hooks/scripts/start-server.sh
```

- [ ] **Step 2: Verify all endpoints**

```bash
curl -s http://localhost:37778/api/health | jq .
curl -s http://localhost:37778/api/kanban | jq 'to_entries | map({col: .key, count: (.value | length)})'
```
Expected: health returns correct projectCwd; kanban returns 4 column keys.

- [ ] **Step 3: Verify MCP server tools via /mcp in Claude Code**

Run `/reload-plugins` then `/mcp`. Verify `task-viewer` server is listed with 5 tools.

- [ ] **Step 4: Re-index GitNexus**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
npx gitnexus analyze --embeddings
```

- [ ] **Step 5: Final commit (if any loose changes)**

```bash
git status
# If clean, done. If any stragglers:
git add -p
git commit -m "chore(task-viewer): final integration cleanup"
```

---

## Success Criteria Verification

After Task 10, confirm each spec criterion:

| # | Criterion | How to verify |
|---|---|---|
| 1 | Tasks appear in correct Kanban column in real-time | Create a task via TaskCreate, watch browser update |
| 2 | `task_enrich` and `task_move` update UI via WebSocket | Call tool via MCP, watch kanban:update in browser |
| 3 | `task_dashboard` returns accurate counts | Call `task_dashboard` tool, compare with `/api/kanban` counts |
| 4 | Different project restarts server cleanly | Run start-server.sh from /tmp, verify health returns /tmp |
| 5 | Done column collapsed by default | Open browser — Done column is narrow strip |
| 6 | Existing tasks preserved through migration | Check existing tasks appear in board after server restart |
