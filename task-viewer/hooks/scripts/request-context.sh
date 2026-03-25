#!/bin/bash
input=$(cat /dev/stdin 2>/dev/null || echo '{}')
SESSION_ID=$(echo "$input" | jq -r '.session_id // empty' 2>/dev/null)

# Fallback: discover session ID from ~/.claude/sessions/
if [ -z "$SESSION_ID" ] || [ "$SESSION_ID" = "null" ]; then
  PROJECT_CWD="$(pwd)"
  SESSION_ID=$(ls -t ~/.claude/sessions/*.json 2>/dev/null | head -5 | while read f; do
    cwd=$(jq -r '.cwd // empty' "$f" 2>/dev/null)
    if [ "$cwd" = "$PROJECT_CWD" ]; then
      jq -r '.sessionId' "$f" 2>/dev/null
      break
    fi
  done)
fi

# Only emit systemMessage if we have a session ID
if [ -n "$SESSION_ID" ] && [ "$SESSION_ID" != "null" ]; then
  cat <<HOOKEOF
{
  "systemMessage": "Task Viewer is running at http://localhost:37778. If the claude-mem MCP server is available, please run smart_search for this project's recent context and timeline, then POST the results using: curl -s -X POST -H 'Content-Type: application/json' -d '{\"sessionId\": \"${SESSION_ID}\", \"projectCwd\": \"$(pwd)\", \"claudeMem\": {\"timeline\": [...results...], \"observations\": [...results...]}}' http://localhost:37778/api/session-context. If claude-mem is not available, skip this step silently."
}
HOOKEOF
else
  echo '{}'
fi
