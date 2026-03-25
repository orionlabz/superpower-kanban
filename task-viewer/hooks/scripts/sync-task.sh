#!/bin/bash
input=$(cat 2>/dev/null || echo '{}')

session_id=$(echo "$input" | jq -r '.session_id // empty')
tool_name=$(echo "$input" | jq -r '.tool_name // empty')

# Extract task fields
task_id=$(echo "$input" | jq -r '.tool_output.id // .tool_input.taskId // empty')
subject=$(echo "$input" | jq -r '.tool_output.subject // .tool_input.subject // empty')
description=$(echo "$input" | jq -r '.tool_input.description // empty')
status=$(echo "$input" | jq -r '.tool_output.status // .tool_input.status // empty')
active_form=$(echo "$input" | jq -r '.tool_input.activeForm // empty')

# Skip if missing required fields
if [ -z "$session_id" ] || [ -z "$task_id" ]; then
  echo '{}'
  exit 0
fi

# Map status → kanban_column
# pending → backlog (new tasks start in backlog)
# in_progress → in_progress
# completed → done
# (todo column is set manually via MCP task_move/task_enrich)
case "$status" in
  in_progress) kanban_column="in_progress" ;;
  completed)   kanban_column="done" ;;
  *)           kanban_column="backlog" ;;
esac

# Build JSON payload
payload=$(jq -n \
  --arg sid "$session_id" \
  --arg tid "$task_id" \
  --arg tool "$tool_name" \
  --arg subject "$subject" \
  --arg description "$description" \
  --arg status "$status" \
  --arg active_form "$active_form" \
  --arg kanban_column "$kanban_column" \
  '{sessionId: $sid, taskId: $tid, toolName: $tool, subject: $subject, description: $description, status: $status, activeForm: $active_form, kanban_column: $kanban_column}')

curl -s -X POST -H 'Content-Type: application/json' \
  -d "$payload" http://localhost:37778/api/tasks 2>/dev/null || true

echo '{}'
