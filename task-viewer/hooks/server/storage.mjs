import { readFile, writeFile, readdir, rename, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data', 'sessions');

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readSession(sessionId) {
  try {
    const content = await readFile(join(DATA_DIR, `${sessionId}.json`), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function writeSession(sessionId, data) {
  await ensureDir();
  const target = join(DATA_DIR, `${sessionId}.json`);
  const tmp = `${target}.${randomBytes(4).toString('hex')}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await rename(tmp, target);
}

export async function listSessions() {
  await ensureDir();
  try {
    const files = await readdir(DATA_DIR);
    const sessions = [];
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      try {
        const content = await readFile(join(DATA_DIR, f), 'utf-8');
        const session = JSON.parse(content);
        sessions.push(session);
      } catch { /* skip malformed */ }
    }
    return sessions.sort((a, b) => {
      const ta = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const tb = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return tb - ta;
    });
  } catch {
    return [];
  }
}

export async function getOrCreateSession(sessionId, defaults = {}) {
  let session = await readSession(sessionId);
  if (!session) {
    session = {
      sessionId,
      projectCwd: defaults.projectCwd || null,
      startedAt: defaults.startedAt || new Date().toISOString(),
      endedAt: null,
      summary: null,
      tasks: [],
      claudeMem: { timeline: [], observations: [] },
    };
    await writeSession(sessionId, session);
  }
  return session;
}

export async function updateSessionTasks(sessionId, tasks, projectCwd) {
  const session = await getOrCreateSession(sessionId, { projectCwd });
  const existingByKey = new Map();
  for (const t of session.tasks) {
    existingByKey.set(String(t.id), t);
  }
  session.tasks = tasks.map(t => {
    const existing = existingByKey.get(String(t.id));
    return { ...t, claudeMem: existing?.claudeMem || null };
  });
  await writeSession(sessionId, session);
  return session;
}

export async function updateTaskClaudeMem(sessionId, taskId, claudeMem) {
  const session = await readSession(sessionId);
  if (!session) return null;
  const task = session.tasks.find(t => String(t.id) === String(taskId));
  if (task) {
    task.claudeMem = { ...(task.claudeMem || {}), ...claudeMem };
  }
  await writeSession(sessionId, session);
  return session;
}

export async function updateSessionClaudeMem(sessionId, projectCwd, claudeMem) {
  const session = await getOrCreateSession(sessionId, { projectCwd });
  session.claudeMem = { ...(session.claudeMem || {}), ...claudeMem };
  if (projectCwd) session.projectCwd = projectCwd;
  await writeSession(sessionId, session);
  return session;
}

export async function finalizeSession(sessionId, summary) {
  const session = await readSession(sessionId);
  if (!session) return null;
  if (!session.endedAt) {
    session.endedAt = new Date().toISOString();
  }
  if (summary) session.summary = summary;
  await writeSession(sessionId, session);
  return session;
}
