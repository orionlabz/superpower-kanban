---
name: open
description: >
  Use this skill when the user wants to open, start, or launch the carousel
  builder editor or HTTP bridge. Triggers on: "open carousel builder",
  "start carousel builder", "abrir carousel builder", "iniciar carousel builder",
  "open the editor", "launch carousel", "/open".

  <example>
  user: "open carousel builder"
  assistant: starts the HTTP bridge and opens the web editor
  </example>

  <example>
  user: "abrir o carousel builder"
  assistant: inicia o bridge HTTP e abre o editor
  </example>

  <example>
  user: "iniciar carousel builder"
  assistant: inicia o bridge HTTP e abre o editor no navegador
  </example>
argument-hint: "[stop]"
allowed-tools: [Bash]
---

# Open Carousel Builder

Start the HTTP bridge and open the web editor.

## Steps

1. If `stop` was passed as argument:
   ```bash
   carousel stop
   ```
   Report result and exit.

2. Start the bridge:
   ```bash
   carousel start
   ```

3. Report: "Carousel Builder aberto em `localhost:37776`."
   Mention that MCP tools remain always available in Claude Code regardless of the bridge.
