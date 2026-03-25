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

# 5. Wait for server to be ready (using /api/health not /)
for i in 1 2 3 4 5; do
  curl -sf http://localhost:37778/api/health > /dev/null 2>&1 && break
  sleep 1
done

# 6. Open browser only once per server lifecycle (flag cleared on reboot via /tmp)
if [ ! -f "$BROWSER_FLAG" ]; then
  open "http://localhost:37778" 2>/dev/null || xdg-open "http://localhost:37778" 2>/dev/null || true
  touch "$BROWSER_FLAG"
fi
