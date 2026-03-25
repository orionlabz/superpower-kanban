import { readFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const CLAUDE_DIR = join(homedir(), '.claude');

export async function parseTask(jsonPath) {
  try {
    const content = await readFile(jsonPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function loadSessionTasks(sessionId) {
  const dir = join(CLAUDE_DIR, 'tasks', sessionId);
  try {
    const files = await readdir(dir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));
    const tasks = await Promise.all(
      jsonFiles.map(f => parseTask(join(dir, f)))
    );
    return tasks.filter(t => t !== null && t.status !== 'deleted');
  } catch {
    return [];
  }
}

export async function parseSpec(mdPath) {
  try {
    const content = await readFile(mdPath, 'utf-8');
    const filename = basename(mdPath);
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+?)-design\.md$/);
    if (!match) return null;
    const [, date, topic] = match;
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;
    return { filename, date, topic, title, path: mdPath };
  } catch {
    return null;
  }
}

export async function parsePlan(mdPath) {
  try {
    const content = await readFile(mdPath, 'utf-8');
    const filename = basename(mdPath);
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (!match) return null;
    const [, date, topic] = match;
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;
    const tasks = [];
    let currentTask = null;
    for (const line of content.split('\n')) {
      const taskMatch = line.match(/^###\s+Task\s+(\d+):\s*(.+)/);
      if (taskMatch) {
        currentTask = { id: parseInt(taskMatch[1]), title: taskMatch[2].trim(), steps: [] };
        tasks.push(currentTask);
        continue;
      }
      if (currentTask) {
        const stepMatch = line.match(/^- \[([ x])\]\s+\*\*Step\s+\d+:\s*(.+?)\*\*/);
        if (stepMatch) {
          currentTask.steps.push({ done: stepMatch[1] === 'x', title: stepMatch[2].trim() });
        }
      }
    }
    for (const task of tasks) {
      const total = task.steps.length;
      const done = task.steps.filter(s => s.done).length;
      task.progress = total > 0 ? Math.round((done / total) * 100) : 0;
    }
    const allSteps = tasks.flatMap(t => t.steps);
    const totalSteps = allSteps.length;
    const doneSteps = allSteps.filter(s => s.done).length;
    const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
    return { filename, date, topic, title, tasks, progress, path: mdPath };
  } catch {
    return null;
  }
}

export function linkSpecsAndPlans(specs, plans) {
  const plansByTopic = new Map();
  for (const plan of plans) { plansByTopic.set(plan.topic, plan); }
  const linked = [];
  const usedPlanTopics = new Set();
  for (const spec of specs) {
    const plan = plansByTopic.get(spec.topic) || null;
    if (plan) usedPlanTopics.add(spec.topic);
    linked.push({ spec, plan });
  }
  for (const plan of plans) {
    if (!usedPlanTopics.has(plan.topic)) { linked.push({ spec: null, plan }); }
  }
  return linked;
}

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
  return result.sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
}

export async function loadAllSpecs(projectCwd) {
  const dir = join(projectCwd, 'docs', 'superpowers', 'specs');
  try {
    const files = await readdir(dir);
    const specs = await Promise.all(files.filter(f => f.endsWith('.md')).map(f => parseSpec(join(dir, f))));
    return specs.filter(s => s !== null);
  } catch {
    return [];
  }
}

export async function loadAllPlans(projectCwd) {
  const dir = join(projectCwd, 'docs', 'superpowers', 'plans');
  try {
    const files = await readdir(dir);
    const plans = await Promise.all(files.filter(f => f.endsWith('.md')).map(f => parsePlan(join(dir, f))));
    return plans.filter(p => p !== null);
  } catch {
    return [];
  }
}
