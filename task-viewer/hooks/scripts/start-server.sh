#!/bin/bash
set -euo pipefail

PROJECT_CWD="$PWD"

# 1. Kill any existing task-viewer on port 37778 (SIGTERM first)
lsof -ti:37778 | xargs kill 2>/dev/null || true
sleep 1
lsof -ti:37778 | xargs kill -9 2>/dev/null || true

# 2. Clean stale PID files
rm -f /tmp/task-viewer.pid

# 3. Install deps if needed
cd "${CLAUDE_PLUGIN_ROOT}/hooks/server"
[ -d node_modules ] || npm install --silent

# 4. Start server
PROJECT_CWD="$PROJECT_CWD" nohup node server.mjs > /tmp/task-viewer.log 2>&1 &
echo $! > /tmp/task-viewer.pid

# 5. Wait for server to be ready, then open browser
for i in 1 2 3 4 5; do
  curl -s http://localhost:37778 > /dev/null 2>&1 && break
  sleep 1
done
open "http://localhost:37778" 2>/dev/null || xdg-open "http://localhost:37778" 2>/dev/null || true
