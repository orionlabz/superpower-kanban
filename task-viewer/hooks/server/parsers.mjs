import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CLAUDE_DIR = join(homedir(), '.claude');

// --- Session discovery (reads ~/.claude/sessions/) ---

export async function findActiveSessions(projectCwd) {
  const sessionsDir = join(CLAUDE_DIR, 'sessions');
  try {
    const files = await readdir(sessionsDir);
    const sessions = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const content = await readFile(join(sessionsDir, file), 'utf-8');
        const session = JSON.parse(content);
        if (session.cwd === projectCwd && session.sessionId) { sessions.push(session); }
      } catch { /* skip malformed */ }
    }
    return sessions;
  } catch {
    return [];
  }
}

export async function discoverProjectSessions(projectCwd) {
  const sessions = await findActiveSessions(projectCwd);
  const result = [];
  for (const session of sessions) {
    const tasksDir = join(CLAUDE_DIR, 'tasks', session.sessionId);
    let taskCount = 0;
    try {
      const files = await readdir(tasksDir);
      taskCount = files.filter(f => f.endsWith('.json') && !f.startsWith('.')).length;
    } catch { /* no tasks dir */ }
    result.push({ sessionId: session.sessionId, pid: session.pid, startedAt: session.startedAt, taskCount });
  }
  return result.sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime());
}
