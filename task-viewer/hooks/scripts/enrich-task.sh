#!/bin/bash
input=$(cat 2>/dev/null || echo '{}')
task_subject=$(echo "$input" | jq -r '.tool_input.subject // empty' 2>/dev/null)
task_id=$(echo "$input" | jq -r '.tool_input.taskId // .tool_input.id // empty' 2>/dev/null)
session_id=$(echo "$input" | jq -r '.session_id // empty' 2>/dev/null)

# Only request enrichment if we have a subject to search for
if [ -n "$task_subject" ] && [ "$task_subject" != "null" ]; then
  # Use jq to safely construct JSON (handles special chars in task_subject)
  jq -n --arg subject "$task_subject" --arg sid "$session_id" --arg tid "$task_id" \
    '{systemMessage: "Task \($subject) was updated. If claude-mem is available, search for observations and context related to \($subject), then POST using: curl -s -X POST -H '\''Content-Type: application/json'\'' -d '\''{\"sessionId\": \"\($sid)\", \"taskId\": \"\($tid)\", \"claudeMem\": {\"observations\": [...results...], \"relatedContext\": [...results...]}}'\'' http://localhost:37778/api/session-context/task. If claude-mem is unavailable, skip."}'
else
  echo '{}'
fi
