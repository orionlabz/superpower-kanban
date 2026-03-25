import Database from 'better-sqlite3';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(join(DATA_DIR, 'task-viewer.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Migrations ---
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    project_cwd TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    ended_at TEXT,
    summary TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_cwd);

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT NOT NULL,
    session_id TEXT NOT NULL REFERENCES sessions(id),
    subject TEXT NOT NULL DEFAULT '',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    active_form TEXT,
    blocks TEXT,
    blocked_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (id, session_id)
  );
  CREATE INDEX IF NOT EXISTS idx_tasks_session ON tasks(session_id);
`);

// --- Prepared statements ---
const stmts = {
  upsertSession: db.prepare(`
    INSERT INTO sessions (id, project_cwd, started_at)
    VALUES (@id, @projectCwd, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      project_cwd = COALESCE(NULLIF(@projectCwd, ''), sessions.project_cwd)
  `),

  upsertTask: db.prepare(`
    INSERT INTO tasks (id, session_id, subject, description, status, active_form, blocks, blocked_by, updated_at)
    VALUES (@id, @sessionId, @subject, @description, @status, @activeForm, @blocks, @blockedBy, datetime('now'))
    ON CONFLICT(id, session_id) DO UPDATE SET
      subject = COALESCE(NULLIF(excluded.subject, ''), tasks.subject),
      description = COALESCE(NULLIF(excluded.description, ''), tasks.description),
      status = COALESCE(NULLIF(excluded.status, ''), tasks.status),
      active_form = COALESCE(NULLIF(excluded.active_form, ''), tasks.active_form),
      blocks = COALESCE(NULLIF(excluded.blocks, ''), tasks.blocks),
      blocked_by = COALESCE(NULLIF(excluded.blocked_by, ''), tasks.blocked_by),
      updated_at = datetime('now')
  `),

  getSession: db.prepare(`SELECT * FROM sessions WHERE id = ?`),

  getSessionTasks: db.prepare(`SELECT * FROM tasks WHERE session_id = ? ORDER BY CAST(id AS INTEGER)`),

  listSessions: db.prepare(`
    SELECT s.*, COUNT(t.id) as task_count
    FROM sessions s
    LEFT JOIN tasks t ON t.session_id = s.id
    WHERE s.project_cwd = ?
    GROUP BY s.id
    ORDER BY s.started_at DESC
  `),

  finalizeSession: db.prepare(`
    UPDATE sessions SET ended_at = datetime('now'), summary = COALESCE(@summary, sessions.summary)
    WHERE id = @id
  `),

  latestSession: db.prepare(`
    SELECT id FROM sessions WHERE project_cwd = ? ORDER BY started_at DESC LIMIT 1
  `),
};

// --- Public API ---

export function upsertSession(id, projectCwd) {
  stmts.upsertSession.run({ id, projectCwd: projectCwd || '' });
  return stmts.getSession.get(id);
}

export function upsertTask(sessionId, taskData) {
  stmts.upsertTask.run({
    id: taskData.id,
    sessionId,
    subject: taskData.subject || '',
    description: taskData.description || '',
    status: taskData.status || '',
    activeForm: taskData.activeForm || '',
    blocks: taskData.blocks ? JSON.stringify(taskData.blocks) : '',
    blockedBy: taskData.blockedBy ? JSON.stringify(taskData.blockedBy) : '',
  });
}

export function getSession(id) {
  const session = stmts.getSession.get(id);
  if (!session) return null;
  const tasks = getSessionTasks(id);
  return { ...session, tasks };
}

export function getSessionTasks(sessionId) {
  const rows = stmts.getSessionTasks.all(sessionId);
  return rows.map(row => ({
    ...row,
    blocks: row.blocks ? JSON.parse(row.blocks) : [],
    blockedBy: row.blocked_by ? JSON.parse(row.blocked_by) : [],
    activeForm: row.active_form,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sessionId: row.session_id,
  }));
}

export function listSessions(projectCwd) {
  return stmts.listSessions.all(projectCwd).map(row => ({
    sessionId: row.id,
    projectCwd: row.project_cwd,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    summary: row.summary,
    taskCount: row.task_count,
  }));
}

export function finalizeSession(id, summary, projectCwd) {
  let sessionId = id;
  if (!sessionId && projectCwd) {
    const latest = stmts.latestSession.get(projectCwd);
    if (latest) sessionId = latest.id;
  }
  if (!sessionId) return null;
  stmts.finalizeSession.run({ id: sessionId, summary: summary || null });
  return stmts.getSession.get(sessionId);
}
