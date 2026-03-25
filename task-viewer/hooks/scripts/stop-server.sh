#!/bin/bash
set -euo pipefail

# 1. Tell server to finalize (snapshot current state, set endedAt)
curl -s -X POST -H 'Content-Type: application/json' \
  -d '{}' http://localhost:37778/api/session-context/finalize 2>/dev/null || true

# 2. Graceful kill via PID file
if [ -f /tmp/task-viewer.pid ]; then
  PID=$(cat /tmp/task-viewer.pid)
  kill "$PID" 2>/dev/null || true
  rm -f /tmp/task-viewer.pid
  # Wait up to 3s for graceful shutdown
  for i in 1 2 3; do
    kill -0 "$PID" 2>/dev/null || break
    sleep 1
  done
fi

# 3. Fallback: force kill by port
lsof -ti:37778 | xargs kill -9 2>/dev/null || true

# 4. Clear browser flag so it opens on next session
rm -f /tmp/task-viewer-browser-opened
