#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readFileSync, writeFileSync, unlinkSync, createWriteStream, openSync, closeSync } from 'node:fs';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, '..');
const SERVER = resolve(PLUGIN_ROOT, 'server', 'mcp-server.js');
const PORT = 37776;
const PID_FILE = '/tmp/carousel-bridge.pid';
const LOG_FILE = '/tmp/carousel-bridge.log';

const [,, cmd] = process.argv;

const COMMANDS = {
  start:  cmdStart,
  stop:   cmdStop,
  status: cmdStatus,
  logs:   cmdLogs,
};

const fn = COMMANDS[cmd];
if (!fn) {
  console.log(`carousel <start|stop|status|logs>`);
  process.exit(cmd ? 1 : 0);
}
fn();

// Command implementations (to be filled in by subsequent tasks)
function cmdStart() {
  const pid = readPid();
  if (isRunning(pid)) {
    console.log(`carousel bridge already running (PID ${pid}) on http://localhost:${PORT}`);
    return;
  }
  const logFd = openSync(LOG_FILE, 'a');
  const child = spawn('node', [SERVER], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
  });
  closeSync(logFd);
  writeFileSync(PID_FILE, String(child.pid));
  child.unref();
  console.log(`carousel bridge started (PID ${child.pid}) — http://localhost:${PORT}`);
  console.log(`logs: ${LOG_FILE}`);
  setTimeout(() => {
    spawn('open', [`http://localhost:${PORT}`], { detached: true, stdio: 'ignore' }).unref();
  }, 800);
}

function readPid() {
  try { return parseInt(readFileSync(PID_FILE, 'utf8').trim(), 10); } catch { return null; }
}

function isRunning(pid) {
  if (!pid) return false;
  try { process.kill(pid, 0); return true; } catch { return false; }
}

function cmdStop() {}
function cmdStatus() {}
function cmdLogs() {}
