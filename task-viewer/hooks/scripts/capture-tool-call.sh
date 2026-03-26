#!/bin/bash
input=$(cat 2>/dev/null || echo '{}')

session_id=$(echo "$input" | jq -r '.session_id // empty')
tool_name=$(echo "$input" | jq -r '.tool_name // empty')

# Skip if missing session
if [ -z "$session_id" ] || [ -z "$tool_name" ]; then
  echo '{}'; exit 0
fi

# Find first in_progress task for this session
in_progress=$(curl -s "http://localhost:37778/api/kanban" 2>/dev/null \
  | jq -r --arg sid "$session_id" \
    '.in_progress // [] | map(select(.sessionId == $sid)) | .[0] | .id // empty')

if [ -z "$in_progress" ]; then
  echo '{}'; exit 0
fi

# Build input summary per tool type
case "$tool_name" in
  Bash)  summary=$(echo "$input" | jq -r '.tool_input.command // "" | .[:80]') ;;
  Edit)  summary=$(echo "$input" | jq -r '.tool_input.file_path // ""') ;;
  Write) summary=$(echo "$input" | jq -r '.tool_input.file_path // ""') ;;
  Read)  summary=$(echo "$input" | jq -r '.tool_input.file_path // ""') ;;
  *)     summary="$tool_name" ;;
esac

payload=$(jq -n \
  --arg tid "$in_progress" \
  --arg sid "$session_id" \
  --arg tool "$tool_name" \
  --arg summary "$summary" \
  '{taskId: $tid, sessionId: $sid, tool: $tool, inputSummary: $summary}')

curl -s -X POST -H 'Content-Type: application/json' \
  -d "$payload" http://localhost:37778/api/events/tool-call 2>/dev/null || true

echo '{}'
