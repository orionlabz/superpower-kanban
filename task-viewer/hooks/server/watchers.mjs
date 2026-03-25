import chokidar from 'chokidar';
import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  loadAllSpecs,
  loadAllPlans,
  linkSpecsAndPlans,
  discoverProjectSessions,
} from './parsers.mjs';
import { upsertSession } from './storage.mjs';

const CLAUDE_DIR = join(homedir(), '.claude');

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export class WatcherManager {
  constructor(projectCwd, onUpdate) {
    this.projectCwd = projectCwd;
    this.onUpdate = onUpdate;
    this.activeSessionId = null;
    this.watchers = [];
  }

  async start() {
    const sessions = await discoverProjectSessions(this.projectCwd);
    if (sessions.length > 0) {
      this.activeSessionId = sessions[0].sessionId;
      upsertSession(this.activeSessionId, this.projectCwd);
    }

    const specsDir = join(this.projectCwd, 'docs', 'superpowers', 'specs');
    this._watch(specsDir, '*.md', debounce(() => this._emitSpecsPlans(), 200));

    const plansDir = join(this.projectCwd, 'docs', 'superpowers', 'plans');
    this._watch(plansDir, '*.md', debounce(() => this._emitSpecsPlans(), 200));

    const sessionsDir = join(CLAUDE_DIR, 'sessions');
    this._watch(sessionsDir, '*.json', debounce(() => this._checkNewSession(), 200));

    await this._emitTasks();
    await this._emitSpecsPlans();
  }

  _watch(dir, pattern, handler) {
    const watcher = chokidar.watch(join(dir, pattern), {
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 100 },
    });
    watcher.on('add', handler).on('change', handler).on('unlink', handler);
    this.watchers.push(watcher);
    return watcher;
  }

  async _checkNewSession() {
    const sessions = await discoverProjectSessions(this.projectCwd);
    if (sessions.length === 0) return;
    const latest = sessions[0];
    if (latest.sessionId !== this.activeSessionId) {
      this.activeSessionId = latest.sessionId;
      upsertSession(this.activeSessionId, this.projectCwd);
      this.onUpdate('session:change', { sessionId: this.activeSessionId });
    }
  }

  async _emitTasks() {
    this.onUpdate('tasks:update', { tasks: [], sessionId: this.activeSessionId });
  }

  async _emitSpecsPlans() {
    const specs = await loadAllSpecs(this.projectCwd);
    const plans = await loadAllPlans(this.projectCwd);
    const linked = linkSpecsAndPlans(specs, plans);
    this.onUpdate('specs:update', { linked });
  }

  async emitCurrentState() {
    await this._emitTasks();
    await this._emitSpecsPlans();
  }

  async close() {
    await Promise.all(this.watchers.map(w => w.close()));
    this.watchers = [];
  }
}
