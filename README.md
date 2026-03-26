# OrionLabz — Claude Code Plugin Marketplace

Custom Claude Code plugins by OrionLabz.

## Plugins

### task-viewer

Real-time Kanban dashboard for Claude Code sessions with SQLite persistence and plan tracking.

- Live task board (Pending / In Progress / Completed) updated via WebSocket
- Superpowers spec & plan visualization with progress tracking
- Session history with summaries persisted in SQLite
- Dark/Light Aurora theme
- Auto-starts on `localhost:37778` with Claude Code sessions

**Install:**

```bash
claude plugins add-marketplace orionlabz/task-viewer
claude plugins enable task-viewer@orionlabz
```

### carousel-builder

Local visual editor for creating dark-luxury editorial Instagram carousels — the aesthetic of Monocle magazine adapted to Instagram.

- 6 editorial slide templates: cover, split, content, steps, photo+text, cta
- Visual editor with real-time preview, image upload, and brand settings (logo, nav labels)
- MCP tools: `generate_carousel`, `refine_slide`, `brainstorm_ideas`
- Manual HTTP bridge + MCP tools auto-registered via `.mcp.json`
- Session persistence via localStorage (brand settings + slides)

**Install:**

```bash
claude plugins add-marketplace orionlabz/carousel-builder
claude plugins enable carousel-builder@orionlabz
```

**Requires:** `ANTHROPIC_API_KEY` in environment.

## License

MIT
