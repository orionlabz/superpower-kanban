# Instagram Carousel Builder — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code plugin with an MCP server + single-file web app for creating Instagram carousels in the editorial dark-luxury style.

**Architecture:** Hybrid mode — `.mcp.json` auto-registers 3 MCP tools for Claude Code via stdio; HTTP bridge (`localhost:3456`) is started manually to feed the web app. `mcp-server.js` detects the `--mcp` flag to decide which mode to run. The web app (`app/index.html`) is a zero-dependency single file with inline CSS and JS.

**Tech Stack:** Node.js ESM, `@anthropic-ai/sdk`, `@modelcontextprotocol/sdk`, vanilla HTML/CSS/JS, Google Fonts (Playfair Display + Inter).

---

## File Map

| File | Responsibility |
|---|---|
| `carousel-builder/.claude-plugin/plugin.json` | Plugin name + description |
| `carousel-builder/.mcp.json` | MCP server registration for Claude Code |
| `carousel-builder/server/package.json` | Node.js ESM config + dependencies |
| `carousel-builder/server/mcp-server.js` | Dual-mode: stdio MCP tools + HTTP bridge with 3 routes |
| `carousel-builder/app/index.html` | Complete web app: 4 screens, all CSS + JS inline |
| `carousel-builder/skills/carousel-builder/SKILL.md` | Usage guide for Claude Code |
| `carousel-builder/README.md` | Setup + usage instructions |

All work is done inside `/Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/`.

---

### Task 1: Plugin Scaffold

**Files:**
- Create: `carousel-builder/.claude-plugin/plugin.json`
- Create: `carousel-builder/.mcp.json`

- [ ] **Step 1: Create directory structure**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
mkdir -p carousel-builder/.claude-plugin
mkdir -p carousel-builder/server
mkdir -p carousel-builder/app
mkdir -p carousel-builder/skills/carousel-builder
```

- [ ] **Step 2: Write plugin.json**

`carousel-builder/.claude-plugin/plugin.json`:
```json
{
  "name": "carousel-builder",
  "description": "Editor visual local para criar carrosséis de Instagram no estilo editorial dark-luxury. Bridge HTTP manual, ferramentas MCP auto-registradas."
}
```

- [ ] **Step 3: Write .mcp.json**

Use the same format as `task-viewer/.mcp.json` (no `mcpServers` wrapper):

`carousel-builder/.mcp.json`:
```json
{
  "carousel-builder": {
    "command": "node",
    "args": ["${CLAUDE_PLUGIN_ROOT}/server/mcp-server.js", "--mcp"]
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add carousel-builder/.claude-plugin/plugin.json carousel-builder/.mcp.json
git commit -m "feat(carousel-builder): plugin scaffold"
```

---

### Task 2: Server — Setup + Skeleton

**Files:**
- Create: `carousel-builder/server/package.json`
- Create: `carousel-builder/server/mcp-server.js`

- [ ] **Step 1: Write package.json**

`carousel-builder/server/package.json`:
```json
{
  "name": "carousel-builder-server",
  "version": "1.0.0",
  "type": "module",
  "main": "mcp-server.js",
  "scripts": {
    "start": "node mcp-server.js",
    "mcp": "node mcp-server.js --mcp"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/carousel-builder/server
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 3: Write mcp-server.js skeleton**

`carousel-builder/server/mcp-server.js`:
```javascript
import { createServer } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';

const IS_MCP = process.argv.includes('--mcp');
const PORT = 3456;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const SYSTEM_PROMPT = `Você é estrategista de conteúdo especializado em Instagram editorial.
Crie carrosséis no estilo dark-luxury: direto, inteligente, provocativo mas refinado.
Tom editorial, em português brasileiro.
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown, sem backticks, sem texto extra.`;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, data, status = 200) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch (e) { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

// Routes added in Tasks 3 and 4
async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }
  json(res, { error: 'Not found' }, 404);
}

if (IS_MCP) {
  // MCP mode — implemented in Task 5
  process.stderr.write('MCP mode: not yet implemented\n');
  process.exit(1);
} else {
  const server = createServer(handleRequest);
  server.listen(PORT, () => {
    process.stdout.write(`Carousel Builder bridge running on http://localhost:${PORT}\n`);
  });
}
```

- [ ] **Step 4: Verify server starts**

```bash
node carousel-builder/server/mcp-server.js &
sleep 1
curl -s http://localhost:3456/anything
kill %1
```

Expected: `{"error":"Not found"}`. Server starts and responds.

- [ ] **Step 5: Commit**

```bash
git add carousel-builder/server/
git commit -m "feat(carousel-builder): server skeleton with dual-mode detection"
```

---

### Task 3: HTTP Bridge — `/generate` Route

**Files:**
- Modify: `carousel-builder/server/mcp-server.js`

- [ ] **Step 1: Add `generateCarousel` function after `readBody`**

```javascript
async function generateCarousel({ topic, audience, slideCount = 8, cta }) {
  const userPrompt = `Crie um carrossel de Instagram com ${slideCount} slides sobre: "${topic}".
Audiência: ${audience || 'geral'}.
CTA final: ${cta || 'Siga para mais conteúdo'}.

Regras obrigatórias:
- Primeiro slide: template "cover"
- Último slide: template "cta"
- Não repetir o mesmo template em sequência (exceto "dark")
- Variar entre: dark, steps, overlay, split

Templates e campos por tipo:
- cover:   { template, headline, headline_italic, body }
- split:   { template, headline, headline_italic, body }
- dark:    { template, section_number, section_title, body, list_items (array máx 4), conclusion }
- steps:   { template, section_title (pode ser null), steps (array {label,text} máx 4), call_to_action, call_to_action_italic }
- overlay: { template, section_number, section_title, headline, body }
- cta:     { template, headline, headline_italic, body, cta_text, cta_word, cta_suffix }

Retorne SOMENTE o JSON: { "slides": [...] }`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return JSON.parse(msg.content[0].text);
}
```

- [ ] **Step 2: Replace `handleRequest` to route POST /generate**

```javascript
async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (req.url === '/generate') return json(res, await generateCarousel(body));
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  json(res, { error: 'Not found' }, 404);
}
```

- [ ] **Step 3: Test with curl (requires `ANTHROPIC_API_KEY` set)**

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # set your key
node carousel-builder/server/mcp-server.js &
sleep 1
curl -s -X POST http://localhost:3456/generate \
  -H 'Content-Type: application/json' \
  -d '{"topic":"produtividade para criadores digitais","slideCount":4}' | python3 -m json.tool | head -40
kill %1
```

Expected: `{"slides":[...]}` with 4 items, first has `"template":"cover"`, last has `"template":"cta"`.

- [ ] **Step 4: Commit**

```bash
git add carousel-builder/server/mcp-server.js
git commit -m "feat(carousel-builder): /generate route with Anthropic API"
```

---

### Task 4: HTTP Bridge — `/refine` + `/brainstorm` Routes

**Files:**
- Modify: `carousel-builder/server/mcp-server.js`

- [ ] **Step 1: Add `refineSlide` function after `generateCarousel`**

```javascript
async function refineSlide({ slide, instruction }) {
  const userPrompt = `Refine este slide de Instagram mantendo o template "${slide.template}" e a estrutura dos campos.
Instrução: "${instruction}"

Slide atual:
${JSON.stringify(slide, null, 2)}

Retorne SOMENTE o JSON do slide atualizado, com os mesmos campos do template "${slide.template}".`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return JSON.parse(msg.content[0].text);
}
```

- [ ] **Step 2: Add `brainstormIdeas` function**

```javascript
async function brainstormIdeas({ niche, platform = 'Instagram', count = 5 }) {
  const userPrompt = `Sugira ${count} temas de alto engajamento para carrosséis de ${platform} no nicho: "${niche}".
Para cada tema: título provocativo, ângulo editorial único, e por que engaja.

Retorne SOMENTE o JSON: { "ideas": [{ "title": "...", "angle": "...", "why": "..." }] }`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  return JSON.parse(msg.content[0].text);
}
```

- [ ] **Step 3: Update `handleRequest` with the two new routes**

```javascript
async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (req.url === '/generate')   return json(res, await generateCarousel(body));
      if (req.url === '/refine')     return json(res, await refineSlide(body));
      if (req.url === '/brainstorm') return json(res, await brainstormIdeas(body));
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  json(res, { error: 'Not found' }, 404);
}
```

- [ ] **Step 4: Test /refine**

```bash
node carousel-builder/server/mcp-server.js &
sleep 1
curl -s -X POST http://localhost:3456/refine \
  -H 'Content-Type: application/json' \
  -d '{
    "slide": {"template":"dark","section_number":"1","section_title":"Produtividade","body":"Texto atual","list_items":["item 1"],"conclusion":"Conclusão"},
    "instruction": "torne mais direto e impactante"
  }' | python3 -m json.tool
kill %1
```

Expected: JSON with the same `dark` template fields, refined content.

- [ ] **Step 5: Commit**

```bash
git add carousel-builder/server/mcp-server.js
git commit -m "feat(carousel-builder): /refine and /brainstorm routes"
```

---

### Task 5: MCP Tools (stdio mode)

**Files:**
- Modify: `carousel-builder/server/mcp-server.js`

- [ ] **Step 1: Add MCP imports at the top of the file (after existing imports)**

```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
```

- [ ] **Step 2: Replace `if (IS_MCP) { ... }` block**

```javascript
if (IS_MCP) {
  const server = new Server(
    { name: 'carousel-builder', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'generate_carousel',
        description: 'Gera um carrossel completo de Instagram no estilo dark-luxury.',
        inputSchema: {
          type: 'object',
          properties: {
            topic:      { type: 'string', description: 'Tema ou assunto do carrossel' },
            audience:   { type: 'string', description: 'Audiência-alvo' },
            slideCount: { type: 'number', description: 'Número de slides (3–12)', default: 8 },
            cta:        { type: 'string', description: 'Chamada para ação no slide final' },
          },
          required: ['topic'],
        },
      },
      {
        name: 'refine_slide',
        description: 'Reescreve um slide mantendo o template e os campos existentes.',
        inputSchema: {
          type: 'object',
          properties: {
            slide:       { type: 'object', description: 'Objeto JSON do slide atual' },
            instruction: { type: 'string', description: 'Instrução de refinamento' },
          },
          required: ['slide', 'instruction'],
        },
      },
      {
        name: 'brainstorm_ideas',
        description: 'Sugere temas de alto engajamento para um nicho.',
        inputSchema: {
          type: 'object',
          properties: {
            niche:    { type: 'string', description: 'Nicho ou área de atuação' },
            platform: { type: 'string', description: 'Plataforma (default: Instagram)', default: 'Instagram' },
            count:    { type: 'number', description: 'Número de ideias (default: 5)', default: 5 },
          },
          required: ['niche'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      let result;
      if (name === 'generate_carousel')  result = await generateCarousel(args);
      else if (name === 'refine_slide')  result = await refineSlide(args);
      else if (name === 'brainstorm_ideas') result = await brainstormIdeas(args);
      else throw new Error(`Unknown tool: ${name}`);

      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

- [ ] **Step 3: Verify MCP mode doesn't crash**

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  timeout 3 node carousel-builder/server/mcp-server.js --mcp 2>/dev/null | head -c 400 || true
```

Expected: JSON with `tools` array listing all 3 tools (or timeout — both are acceptable since MCP server waits on stdin).

- [ ] **Step 4: Commit**

```bash
git add carousel-builder/server/mcp-server.js
git commit -m "feat(carousel-builder): MCP stdio tools (generate_carousel, refine_slide, brainstorm_ideas)"
```

---

### Task 6: Web App — Complete Single-File Application

**Files:**
- Create: `carousel-builder/app/index.html`

This single task builds the entire web app. The HTML file contains all screens, all CSS, all JS, and all 6 slide template renderers. Build it in full, then verify with mock data before integrating the real API.

- [ ] **Step 1: Create `carousel-builder/app/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Carousel Builder</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0a0a0a; --bg-panel: #111; --bg-input: #1a1a1a; --border: #222;
  --text: #e8e8e8; --text-muted: #666; --text-dim: #444;
  --font-sans: 'Inter', sans-serif; --font-serif: 'Playfair Display', serif;
}
html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-sans); font-size: 14px; }

/* Screens */
.screen { display: none; height: 100vh; }
.screen.active { display: flex; flex-direction: column; }

/* Brief */
#screen-brief { align-items: center; justify-content: center; padding: 40px 20px; overflow-y: auto; }
.brief-form { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 20px; }
.brief-title { font-family: var(--font-serif); font-size: 28px; font-weight: 400; color: #fff; margin-bottom: 6px; }
.brief-sub { color: var(--text-muted); font-size: 13px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); }
.form-input, .form-textarea {
  background: var(--bg-input); border: 1px solid var(--border); color: var(--text);
  font-family: var(--font-sans); font-size: 14px; border-radius: 6px;
  padding: 10px 12px; outline: none; resize: none; transition: border-color .15s; width: 100%;
}
.form-input:focus, .form-textarea:focus { border-color: #444; }
.form-textarea { min-height: 80px; }
.counter-row { display: flex; align-items: center; gap: 12px; }
.counter-btn { width: 32px; height: 32px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text); border-radius: 6px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.counter-val { font-size: 16px; min-width: 24px; text-align: center; }
.btn-primary { background: #fff; color: #000; border: none; border-radius: 6px; padding: 12px 24px; font-family: var(--font-sans); font-size: 14px; font-weight: 500; cursor: pointer; letter-spacing: .04em; transition: opacity .15s; }
.btn-primary:hover { opacity: .85; }
.btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.bridge-badge { display: none; align-items: center; gap: 6px; font-size: 12px; color: #4caf50; }
.bridge-badge.visible { display: flex; }
.bridge-dot { width: 7px; height: 7px; background: #4caf50; border-radius: 50%; }
.apikey-toggle { font-size: 12px; color: var(--text-muted); cursor: pointer; text-decoration: underline; align-self: flex-start; }
.apikey-field { display: none; flex-direction: column; gap: 6px; }
.apikey-field.open { display: flex; }
.session-banner { display: none; align-items: center; justify-content: space-between; background: var(--bg-input); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; font-size: 12px; color: var(--text-muted); }
.session-banner.visible { display: flex; }
.session-actions { display: flex; gap: 8px; }
.btn-sm { background: transparent; border: 1px solid var(--border); color: var(--text); border-radius: 4px; padding: 4px 10px; font-size: 12px; cursor: pointer; }
.btn-sm:hover { border-color: #555; }

/* Loading */
#screen-loading { align-items: center; justify-content: center; gap: 24px; }
.loading-dots { display: flex; gap: 8px; }
.loading-dot { width: 8px; height: 8px; background: #555; border-radius: 50%; animation: pulse 1.4s ease-in-out infinite; }
.loading-dot:nth-child(2) { animation-delay: .2s; }
.loading-dot:nth-child(3) { animation-delay: .4s; }
@keyframes pulse { 0%,80%,100% { opacity:.3; transform:scale(.8); } 40% { opacity:1; transform:scale(1); } }
.loading-text { color: var(--text-muted); font-size: 14px; }

/* Editor */
#screen-editor { flex-direction: column; }
.editor-header { height: 48px; min-height: 48px; background: var(--bg-panel); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 16px; gap: 14px; }
.editor-brand { font-family: var(--font-serif); font-size: 15px; color: #fff; white-space: nowrap; }
.editor-topic { font-size: 12px; color: var(--text-muted); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.saved-dot { width: 7px; height: 7px; border-radius: 50%; background: transparent; transition: background .3s; flex-shrink: 0; }
.saved-dot.on { background: #4caf50; }
.header-btn { background: transparent; border: 1px solid var(--border); color: var(--text); border-radius: 4px; padding: 4px 10px; font-size: 12px; cursor: pointer; white-space: nowrap; }
.header-btn:hover { border-color: #555; }
.editor-body { display: flex; flex: 1; overflow: hidden; }

/* Sidebar */
.sidebar { width: 152px; min-width: 152px; background: var(--bg-panel); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; padding: 10px 8px; gap: 8px; }
.thumb-item { cursor: pointer; border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
.thumb-item.active { border-color: #fff; }
.thumb-wrap { width: 136px; height: 170px; overflow: hidden; border-radius: 4px; background: #111; }
.thumb-wrap iframe { width: 1080px; height: 1350px; transform-origin: top left; transform: scale(0.1259); pointer-events: none; border: none; display: block; }
.thumb-label { font-size: 10px; color: var(--text-muted); text-align: center; padding: 4px 0; }
.btn-add-slide { background: transparent; border: 1px dashed var(--border); color: var(--text-muted); border-radius: 6px; padding: 8px; font-size: 12px; cursor: pointer; width: 136px; align-self: center; }
.btn-add-slide:hover { border-color: #555; color: var(--text); }

/* Preview */
.preview-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 24px 16px; gap: 16px; overflow-y: auto; background: #050505; }
.preview-frame-wrap iframe { border: none; border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,.6); display: block; }
.template-pills { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.pill { background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 20px; padding: 5px 14px; font-size: 12px; cursor: pointer; font-family: var(--font-sans); transition: all .15s; }
.pill:hover { border-color: #555; color: var(--text); }
.pill.active { background: #fff; color: #000; border-color: #fff; }

/* Edit panel */
.edit-panel { width: 288px; min-width: 288px; background: var(--bg-panel); border-left: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; padding: 16px; gap: 14px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
.panel-title { font-size: 12px; color: var(--text-muted); letter-spacing: .08em; }
.btn-delete { background: transparent; border: none; color: #555; font-size: 12px; cursor: pointer; padding: 2px 6px; }
.btn-delete:hover { color: #e55; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); }
.field-input, .field-textarea {
  background: var(--bg-input); border: 1px solid var(--border); color: var(--text);
  font-family: var(--font-sans); font-size: 13px; border-radius: 5px;
  padding: 8px 10px; outline: none; resize: none; transition: border-color .15s; width: 100%;
}
.field-input:focus, .field-textarea:focus { border-color: #444; }
.field-textarea { min-height: 64px; }
.list-items-wrap, .steps-wrap { display: flex; flex-direction: column; gap: 6px; }
.list-item-row { display: flex; gap: 6px; align-items: center; }
.list-item-row .field-input { flex: 1; }
.step-row { background: #161616; border: 1px solid var(--border); border-radius: 5px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.step-row-top { display: flex; gap: 6px; align-items: center; }
.step-label-input { width: 80px !important; }
.btn-remove { background: transparent; border: none; color: #555; font-size: 14px; cursor: pointer; padding: 2px 4px; flex-shrink: 0; }
.btn-remove:hover { color: #e55; }
.btn-add-item { background: transparent; border: 1px dashed var(--border); color: var(--text-muted); border-radius: 4px; padding: 5px 10px; font-size: 11px; cursor: pointer; }
.btn-add-item:hover { border-color: #555; color: var(--text); }
.drop-zone { border: 1px dashed var(--border); border-radius: 6px; padding: 16px; text-align: center; cursor: pointer; position: relative; transition: border-color .15s; }
.drop-zone:hover { border-color: #555; }
.drop-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.drop-zone-icon { font-size: 18px; color: var(--text-muted); margin-bottom: 6px; }
.drop-zone-text { font-size: 11px; color: var(--text-muted); line-height: 1.4; }
.img-preview-wrap { display: flex; align-items: center; gap: 10px; }
.img-preview { height: 64px; border-radius: 4px; object-fit: cover; }
.btn-remove-img { background: transparent; border: none; color: var(--text-muted); font-size: 11px; cursor: pointer; text-decoration: underline; }
.refine-section { border-top: 1px solid var(--border); padding-top: 12px; }
.btn-refine { background: transparent; border: 1px solid #333; color: #888; border-radius: 5px; padding: 8px 12px; font-size: 12px; cursor: pointer; width: 100%; transition: all .15s; }
.btn-refine:hover { border-color: #555; color: var(--text); }
.refine-input-wrap { display: none; flex-direction: column; gap: 8px; margin-top: 8px; }
.refine-input-wrap.open { display: flex; }
.refine-actions { display: flex; gap: 6px; }
.btn-confirm { background: #fff; color: #000; border: none; border-radius: 4px; padding: 6px 14px; font-size: 12px; font-weight: 500; cursor: pointer; }
.btn-cancel { background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; }

/* Settings */
#screen-settings { flex-direction: column; }
.settings-header { height: 48px; min-height: 48px; background: var(--bg-panel); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; gap: 16px; }
.settings-body { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; }
.settings-form { width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 20px; }
.settings-title { font-family: var(--font-serif); font-size: 22px; font-weight: 400; }
</style>
</head>
<body>

<!-- Screen: Brief -->
<div id="screen-brief" class="screen active">
  <form class="brief-form" onsubmit="return false">
    <div>
      <div class="brief-title">Carousel Builder</div>
      <div class="brief-sub">Crie carrosséis editoriais para Instagram</div>
    </div>
    <div id="bridge-badge" class="bridge-badge">
      <div class="bridge-dot"></div> Bridge conectado
    </div>
    <div class="form-group">
      <label class="form-label">Tema / assunto</label>
      <textarea id="inp-topic" class="form-textarea" placeholder="Ex: Por que criadores digitais fracassam nos primeiros 90 dias" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Audiência</label>
      <input id="inp-audience" class="form-input" type="text" placeholder="Ex: Criadores digitais brasileiros">
    </div>
    <div class="form-group">
      <label class="form-label">Número de slides</label>
      <div class="counter-row">
        <button type="button" class="counter-btn" onclick="adjustCount(-1)">−</button>
        <span id="count-val" class="counter-val">8</span>
        <button type="button" class="counter-btn" onclick="adjustCount(1)">+</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">CTA final</label>
      <input id="inp-cta" class="form-input" type="text" placeholder="Ex: Salve este post e aplique hoje">
    </div>
    <span class="apikey-toggle" onclick="toggleApiKey()">Configurar API Key (fallback)</span>
    <div id="apikey-field" class="apikey-field">
      <label class="form-label">Anthropic API Key</label>
      <input id="inp-apikey" class="form-input" type="password" placeholder="sk-ant-...">
    </div>
    <div id="session-banner" class="session-banner">
      <span id="session-label"></span>
      <div class="session-actions">
        <button class="btn-sm" onclick="restoreSession()">Continuar</button>
        <button class="btn-sm" onclick="clearSession()">Novo</button>
      </div>
    </div>
    <button id="btn-gen" class="btn-primary" onclick="handleGenerate()">Gerar carrossel</button>
  </form>
</div>

<!-- Screen: Loading -->
<div id="screen-loading" class="screen">
  <div class="loading-dots">
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
  </div>
  <div id="loading-text" class="loading-text">Estruturando o roteiro…</div>
</div>

<!-- Screen: Editor -->
<div id="screen-editor" class="screen">
  <div class="editor-header">
    <div id="editor-brand" class="editor-brand">⬥ Marca</div>
    <div id="editor-topic" class="editor-topic"></div>
    <div id="saved-dot" class="saved-dot"></div>
    <button class="header-btn" onclick="openSettings()">⚙</button>
    <button class="header-btn" onclick="goNew()">+ Novo</button>
  </div>
  <div class="editor-body">
    <div class="sidebar" id="sidebar"></div>
    <div class="preview-col" id="preview-col">
      <div id="preview-wrap" class="preview-frame-wrap"></div>
      <div class="template-pills">
        <button class="pill" data-tpl="cover"   onclick="changeTpl('cover')">cover</button>
        <button class="pill" data-tpl="split"   onclick="changeTpl('split')">split</button>
        <button class="pill" data-tpl="dark"    onclick="changeTpl('dark')">conteúdo</button>
        <button class="pill" data-tpl="steps"   onclick="changeTpl('steps')">etapas</button>
        <button class="pill" data-tpl="overlay" onclick="changeTpl('overlay')">foto+texto</button>
        <button class="pill" data-tpl="cta"     onclick="changeTpl('cta')">cta</button>
      </div>
    </div>
    <div class="edit-panel" id="edit-panel"></div>
  </div>
</div>

<!-- Screen: Settings -->
<div id="screen-settings" class="screen">
  <div class="settings-header">
    <button class="header-btn" onclick="saveSettings()">← Salvar e voltar</button>
    <span style="font-size:13px;color:#888;">Configurações de Marca</span>
  </div>
  <div class="settings-body">
    <div class="settings-form">
      <div class="settings-title">Marca</div>
      <div class="form-group">
        <label class="form-label">Símbolo / logo</label>
        <input id="set-logo" class="form-input" type="text" placeholder="⬥">
      </div>
      <div class="form-group">
        <label class="form-label">Nome da marca</label>
        <input id="set-name" class="form-input" type="text" placeholder="Minha Marca">
      </div>
      <div class="form-group">
        <label class="form-label">Label esquerdo da nav</label>
        <input id="set-nav-left" class="form-input" type="text" placeholder="CATEGORIA">
      </div>
      <div class="form-group">
        <label class="form-label">Label direito da nav</label>
        <input id="set-nav-right" class="form-input" type="text" placeholder="SÉRIE">
      </div>
    </div>
  </div>
</div>

<script>
// ─── Constants ──────────────────────────────────────────────────────────────
const BRIDGE = 'http://localhost:3456';
const LS_KEY = 'cb-v3';
const LOADING_MSGS = ['Estruturando o roteiro…', 'Criando os slides…', 'Refinando o conteúdo…'];
const SLIDE_DEFAULTS = {
  cover:   { template:'cover', headline:'', headline_italic:'', body:'' },
  split:   { template:'split', headline:'', headline_italic:'', body:'' },
  dark:    { template:'dark', section_number:'', section_title:'', body:'', list_items:[], conclusion:'' },
  steps:   { template:'steps', section_title:null, steps:[], call_to_action:'', call_to_action_italic:'' },
  overlay: { template:'overlay', section_number:'', section_title:'', headline:'', body:'' },
  cta:     { template:'cta', headline:'', headline_italic:'', body:'', cta_text:'', cta_word:'', cta_suffix:'' },
};

// ─── State ───────────────────────────────────────────────────────────────────
const S = {
  slides: [], active: 0, slideCount: 8,
  brief: { topic:'', audience:'', slideCount:8, cta:'' },
  brand: { brand_logo:'⬥', brand_name:'Marca', nav_left:'CATEGORIA', nav_right:'SÉRIE' },
  bridgeAvailable: false,
  images: {},   // { index: dataURL } — session only, not persisted
};

// ─── Screen routing ──────────────────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
}
function goNew() { showScreen('brief'); }

// ─── Brief controls ──────────────────────────────────────────────────────────
function adjustCount(delta) {
  S.slideCount = Math.min(12, Math.max(3, S.slideCount + delta));
  document.getElementById('count-val').textContent = S.slideCount;
}
function toggleApiKey() {
  document.getElementById('apikey-field').classList.toggle('open');
}

// ─── Bridge check ─────────────────────────────────────────────────────────────
async function checkBridge() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1200);
    const r = await fetch(BRIDGE + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: '_ping', slideCount: 1 }),
      signal: ctrl.signal,
    });
    if (r.status !== 404) {
      S.bridgeAvailable = true;
      document.getElementById('bridge-badge').classList.add('visible');
    }
  } catch { /* bridge offline */ }
}

// ─── Persistence ─────────────────────────────────────────────────────────────
let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 400);
}
function persist() {
  localStorage.setItem(LS_KEY, JSON.stringify({
    brief: S.brief, brand: S.brand, slides: S.slides, active: S.active,
  }));
  const dot = document.getElementById('saved-dot');
  if (dot) { dot.classList.add('on'); setTimeout(() => dot.classList.remove('on'), 1400); }
}
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.brand) Object.assign(S.brand, saved.brand);
    if (saved.slides && saved.slides.length > 0) {
      S.slides = saved.slides;
      S.active = saved.active || 0;
      if (saved.brief) S.brief = saved.brief;
      const banner = document.getElementById('session-banner');
      document.getElementById('session-label').textContent =
        'Continuar: ' + (S.brief.topic || '').slice(0, 40) + '…';
      banner.classList.add('visible');
    }
  } catch {}
}
function restoreSession() {
  document.getElementById('session-banner').classList.remove('visible');
  document.getElementById('editor-topic').textContent = S.brief.topic;
  syncEditorBrand();
  renderAll();
  showScreen('editor');
}
function clearSession() {
  localStorage.removeItem(LS_KEY);
  document.getElementById('session-banner').classList.remove('visible');
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function openSettings() {
  document.getElementById('set-logo').value = S.brand.brand_logo;
  document.getElementById('set-name').value = S.brand.brand_name;
  document.getElementById('set-nav-left').value = S.brand.nav_left;
  document.getElementById('set-nav-right').value = S.brand.nav_right;
  showScreen('settings');
}
function saveSettings() {
  S.brand.brand_logo = document.getElementById('set-logo').value     || '⬥';
  S.brand.brand_name = document.getElementById('set-name').value     || 'Marca';
  S.brand.nav_left   = document.getElementById('set-nav-left').value  || 'CATEGORIA';
  S.brand.nav_right  = document.getElementById('set-nav-right').value || 'SÉRIE';
  syncEditorBrand();
  renderAll();
  scheduleSave();
  showScreen('editor');
}
function syncEditorBrand() {
  const el = document.getElementById('editor-brand');
  if (el) el.textContent = S.brand.brand_logo + ' ' + S.brand.brand_name;
}

// ─── Slide HTML renderers ──────────────────────────────────────────────────────
const PF  = "font-family:'Playfair Display',serif;";
const INT = "font-family:'Inter',sans-serif;";

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function navBar() {
  const { nav_left='CATEGORIA', nav_right='SÉRIE' } = S.brand;
  return `<div style="${INT}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:96px;">
    <span>${esc(nav_left)}</span>
    <div style="flex:1;height:1px;background:#1e1e1e;"></div>
    <span>${esc(nav_right)}</span>
  </div>`;
}

function footerBar() {
  const { brand_logo='⬥', brand_name='Marca' } = S.brand;
  return `<div style="${INT}display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:36px;">
    <span style="font-size:28px;color:#252525;">${esc(brand_logo)} ${esc(brand_name)}</span>
    <span style="font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${esc(brand_name.toUpperCase())}</span>
  </div>`;
}

const RENDERERS = {
  cover(slide, img) {
    const bg = img
      ? `<div style="position:absolute;inset:0;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`
      : `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>`;
    const { brand_logo='⬥', brand_name='Marca' } = S.brand;
    return `<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
      ${bg}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 60px;">
        <div style="${INT}font-size:22px;color:#fff;opacity:.9;">${esc(brand_logo)} ${esc(brand_name)}</div>
        <div style="flex:1;"></div>
        <div style="${PF}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
          ${esc(slide.headline)}<em> ${esc(slide.headline_italic)}</em>
        </div>
        <div style="${INT}font-size:27px;color:#777;line-height:1.5;">${esc(slide.body)}</div>
      </div>
    </div>`;
  },

  split(slide, img) {
    const col = img
      ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(90%) contrast(1.05);">`
      : `<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>`;
    return `<div style="width:1080px;height:1350px;display:flex;background:#000;">
      <div style="flex:0 0 52%;display:flex;flex-direction:column;padding:54px 52px 60px 76px;">
        ${navBar()}
        <div style="${PF}font-size:62px;line-height:1.1;font-weight:400;color:#fff;margin-bottom:28px;">
          ${esc(slide.headline)}<em> ${esc(slide.headline_italic)}</em>
        </div>
        <div style="${INT}font-size:27px;color:#777;line-height:1.5;margin-bottom:auto;">${esc(slide.body)}</div>
        ${footerBar()}
      </div>
      <div style="flex:0 0 48%;overflow:hidden;">${col}</div>
    </div>`;
  },

  dark(slide) {
    const items = (slide.list_items || []).map(item =>
      `<div style="display:flex;gap:16px;margin-bottom:16px;">
        <span style="${INT}color:#555;font-size:27px;flex-shrink:0;">·</span>
        <span style="${INT}font-size:27px;color:#666;line-height:1.45;">${esc(item)}</span>
       </div>`
    ).join('');
    return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
      ${navBar()}
      <div style="${INT}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:16px;">${esc(slide.section_number)}</div>
      <div style="${PF}font-size:62px;line-height:1.1;font-weight:400;color:#fff;margin-bottom:36px;">${esc(slide.section_title)}</div>
      <div style="${INT}font-size:27px;color:#666;line-height:1.5;margin-bottom:32px;">${esc(slide.body)}</div>
      <div style="margin-bottom:24px;">${items}</div>
      <div style="${INT}font-size:27px;color:#555;line-height:1.5;margin-bottom:auto;">${esc(slide.conclusion)}</div>
      ${footerBar()}
    </div>`;
  },

  steps(slide) {
    const steps = (slide.steps || []).map(s =>
      `<div style="margin-bottom:24px;">
        <span style="${INT}font-size:27px;font-weight:500;color:#fff;">${esc(s.label)}:</span>
        <span style="${INT}font-size:27px;color:#666;"> ${esc(s.text)}</span>
       </div>`
    ).join('');
    return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
      ${navBar()}
      ${slide.section_title ? `<div style="${PF}font-size:48px;font-weight:400;color:#fff;margin-bottom:36px;">${esc(slide.section_title)}</div>` : ''}
      <div style="flex:1;">${steps}</div>
      <div style="${PF}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:auto;">
        ${esc(slide.call_to_action)}<em> ${esc(slide.call_to_action_italic)}</em>
      </div>
      ${footerBar()}
    </div>`;
  },

  overlay(slide, img) {
    const photo = img
      ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;">`
      : `<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>`;
    return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:14px 14px 0;">
      <div style="height:680px;border-radius:18px;overflow:hidden;position:relative;flex-shrink:0;">
        ${photo}
        <div style="position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,#000,transparent);"></div>
      </div>
      <div style="flex:1;padding:32px 62px 60px;display:flex;flex-direction:column;">
        ${navBar()}
        <div style="${INT}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:12px;">${esc(slide.section_number)}</div>
        <div style="${PF}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:16px;">${esc(slide.section_title)}</div>
        <div style="${PF}font-size:36px;font-weight:400;font-style:italic;color:#aaa;margin-bottom:20px;">${esc(slide.headline)}</div>
        <div style="${INT}font-size:24px;color:#666;line-height:1.5;margin-bottom:auto;">${esc(slide.body)}</div>
        ${footerBar()}
      </div>
    </div>`;
  },

  cta(slide) {
    const { brand_logo='⬥', brand_name='Marca' } = S.brand;
    return `<div style="width:1080px;height:1350px;background:#000;border:1px solid #161616;display:flex;flex-direction:column;padding:54px 76px 60px;">
      <div style="${INT}font-size:22px;color:#fff;margin-bottom:auto;">${esc(brand_logo)} ${esc(brand_name)}</div>
      <div style="${PF}font-size:84px;line-height:1.05;font-weight:400;font-style:italic;color:#fff;margin-bottom:40px;">
        ${esc(slide.headline)}<em> ${esc(slide.headline_italic)}</em>
      </div>
      <div style="${INT}font-size:27px;color:#444;line-height:1.5;margin-bottom:60px;">${esc(slide.body)}</div>
      <div style="${INT}font-size:32px;color:#fff;line-height:1.4;">
        ${esc(slide.cta_text)}
        <span style="text-decoration:underline;text-underline-offset:4px;">${esc(slide.cta_word)}</span>
        ${esc(slide.cta_suffix)}
      </div>
    </div>`;
  },
};

function slideDoc(index) {
  const slide = S.slides[index];
  if (!slide) return '<html><body style="background:#111;width:1080px;height:1350px;"></body></html>';
  const fn = RENDERERS[slide.template] || RENDERERS.dark;
  const body = fn(slide, S.images[index] || null);
  return `<!DOCTYPE html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>*{margin:0;padding:0;box-sizing:border-box;}</style>
    </head><body>${body}</body></html>`;
}

// ─── Render functions ──────────────────────────────────────────────────────────
function renderAll() {
  renderSidebar();
  renderPreview();
  renderPanel();
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';
  S.slides.forEach((slide, i) => {
    const item = document.createElement('div');
    item.className = 'thumb-item' + (i === S.active ? ' active' : '');
    item.onclick = () => setActive(i);
    const wrap = document.createElement('div');
    wrap.className = 'thumb-wrap';
    const iframe = document.createElement('iframe');
    iframe.srcdoc = slideDoc(i);
    iframe.title = 'Slide ' + (i + 1);
    wrap.appendChild(iframe);
    const label = document.createElement('div');
    label.className = 'thumb-label';
    label.textContent = (i + 1) + ' · ' + slide.template;
    item.appendChild(wrap);
    item.appendChild(label);
    sidebar.appendChild(item);
  });
  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add-slide';
  addBtn.textContent = '+ Slide';
  addBtn.onclick = addSlide;
  sidebar.appendChild(addBtn);
}

function renderPreview() {
  const col = document.getElementById('preview-col');
  const wrap = document.getElementById('preview-wrap');
  const avH = col.clientHeight - 80;
  const avW = col.clientWidth - 32;
  const scale = Math.min(avH / 1350, avW / 1080, 0.50);
  const w = Math.round(1080 * scale);
  const h = Math.round(1350 * scale);
  wrap.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.style.width = w + 'px';
  iframe.style.height = h + 'px';
  iframe.srcdoc = slideDoc(S.active);
  iframe.title = 'Preview';
  wrap.appendChild(iframe);
  document.querySelectorAll('.pill').forEach(p =>
    p.classList.toggle('active', p.dataset.tpl === (S.slides[S.active] || {}).template)
  );
}

function renderPanel() {
  const panel = document.getElementById('edit-panel');
  const slide = S.slides[S.active];
  if (!slide) { panel.innerHTML = ''; return; }

  const tpl = slide.template;
  const hasImg = ['cover','split','overlay'].includes(tpl);
  const imgSrc = S.images[S.active];
  const canDel = S.slides.length > 1;

  function fText(key, label, val) {
    return `<div class="field-group"><div class="field-label">${label}</div>
      <input class="field-input" value="${esc(val||'')}" oninput="setField('${key}',this.value)"></div>`;
  }
  function fArea(key, label, val) {
    return `<div class="field-group"><div class="field-label">${label}</div>
      <textarea class="field-textarea" oninput="setField('${key}',this.value)">${esc(val||'')}</textarea></div>`;
  }

  let html = `<div class="panel-header">
    <div class="panel-title">Slide ${S.active+1} · ${tpl}</div>
    ${canDel ? '<button class="btn-delete" onclick="deleteSlide()">Excluir</button>' : ''}
  </div>`;

  if (hasImg) {
    html += `<div class="field-group"><div class="field-label">Imagem</div>
      ${imgSrc
        ? `<div class="img-preview-wrap">
             <img class="img-preview" src="${imgSrc}">
             <button class="btn-remove-img" onclick="removeImg()">Remover</button>
           </div>`
        : `<div class="drop-zone">
             <input type="file" accept="image/*" onchange="uploadImg(event)">
             <div class="drop-zone-icon">⊕</div>
             <div class="drop-zone-text">Clique para fazer upload<br>JPG · PNG · WEBP</div>
           </div>`
      }
    </div>`;
  }

  if (tpl === 'cover' || tpl === 'split') {
    html += fText('headline','Headline',slide.headline);
    html += fText('headline_italic','Headline (itálico)',slide.headline_italic);
    html += fArea('body','Corpo',slide.body);
  }
  if (tpl === 'dark') {
    html += fText('section_number','Número da seção',slide.section_number);
    html += fText('section_title','Título da seção',slide.section_title);
    html += fArea('body','Corpo',slide.body);
    html += `<div class="field-group"><div class="field-label">Itens da lista</div>
      <div class="list-items-wrap">
        ${(slide.list_items||[]).map((item,i) =>
          `<div class="list-item-row">
            <input class="field-input" value="${esc(item)}" oninput="setListItem(${i},this.value)">
            <button class="btn-remove" onclick="removeListItem(${i})">×</button>
          </div>`
        ).join('')}
      </div>
      ${(slide.list_items||[]).length < 4 ? '<button class="btn-add-item" onclick="addListItem()">+ Adicionar</button>' : ''}
    </div>`;
    html += fArea('conclusion','Conclusão',slide.conclusion);
  }
  if (tpl === 'steps') {
    html += fText('section_title','Título (opcional)',slide.section_title||'');
    html += `<div class="field-group"><div class="field-label">Etapas</div>
      <div class="steps-wrap">
        ${(slide.steps||[]).map((step,i) =>
          `<div class="step-row">
            <div class="step-row-top">
              <input class="field-input step-label-input" value="${esc(step.label)}" placeholder="Etapa ${i+1}" oninput="setStep(${i},'label',this.value)">
              <button class="btn-remove" onclick="removeStep(${i})">×</button>
            </div>
            <input class="field-input" value="${esc(step.text)}" placeholder="Texto da etapa" oninput="setStep(${i},'text',this.value)">
          </div>`
        ).join('')}
      </div>
      ${(slide.steps||[]).length < 4 ? '<button class="btn-add-item" onclick="addStep()">+ Etapa</button>' : ''}
    </div>`;
    html += fText('call_to_action','Chamada final',slide.call_to_action);
    html += fText('call_to_action_italic','Chamada final (itálico)',slide.call_to_action_italic);
  }
  if (tpl === 'overlay') {
    html += fText('section_number','Número da seção',slide.section_number);
    html += fText('section_title','Título',slide.section_title);
    html += fText('headline','Headline',slide.headline);
    html += fArea('body','Corpo',slide.body);
  }
  if (tpl === 'cta') {
    html += fText('headline','Headline',slide.headline);
    html += fText('headline_italic','Headline (itálico)',slide.headline_italic);
    html += fArea('body','Corpo',slide.body);
    html += fText('cta_text','Texto do CTA',slide.cta_text);
    html += fText('cta_word','Palavra em destaque',slide.cta_word);
    html += fText('cta_suffix','Sufixo do CTA',slide.cta_suffix);
  }

  html += `<div class="refine-section">
    <button class="btn-refine" onclick="toggleRefine()">✦ Refinar com IA</button>
    <div id="refine-wrap" class="refine-input-wrap">
      <textarea id="refine-instr" class="field-textarea" placeholder="O que você quer mudar neste slide?" rows="3"></textarea>
      <div class="refine-actions">
        <button id="btn-refine-ok" class="btn-confirm" onclick="doRefine()">Refinar</button>
        <button class="btn-cancel" onclick="toggleRefine()">Cancelar</button>
      </div>
    </div>
  </div>`;

  panel.innerHTML = html;
}

// ─── Slide mutation helpers ────────────────────────────────────────────────────
function setActive(i) { S.active = i; renderAll(); }

function setField(key, val) {
  S.slides[S.active][key] = val;
  refreshThumb(S.active);
  renderPreview();
  scheduleSave();
}
function setListItem(i, val) {
  S.slides[S.active].list_items[i] = val;
  refreshThumb(S.active); renderPreview(); scheduleSave();
}
function addListItem() {
  if ((S.slides[S.active].list_items||[]).length >= 4) return;
  S.slides[S.active].list_items = [...(S.slides[S.active].list_items||[]), ''];
  renderPanel(); renderPreview(); scheduleSave();
}
function removeListItem(i) {
  S.slides[S.active].list_items.splice(i, 1);
  renderPanel(); renderPreview(); scheduleSave();
}
function setStep(i, field, val) {
  S.slides[S.active].steps[i][field] = val;
  refreshThumb(S.active); renderPreview(); scheduleSave();
}
function addStep() {
  const steps = S.slides[S.active].steps || [];
  if (steps.length >= 4) return;
  steps.push({ label: 'Etapa ' + (steps.length+1), text: '' });
  S.slides[S.active].steps = steps;
  renderPanel(); renderPreview(); scheduleSave();
}
function removeStep(i) {
  S.slides[S.active].steps.splice(i, 1);
  renderPanel(); renderPreview(); scheduleSave();
}
function deleteSlide() {
  if (S.slides.length <= 1) return;
  S.slides.splice(S.active, 1);
  delete S.images[S.active];
  S.active = Math.min(S.active, S.slides.length - 1);
  renderAll(); scheduleSave();
}
function addSlide() {
  S.slides.splice(S.active + 1, 0, { ...SLIDE_DEFAULTS.dark });
  setActive(S.active + 1);
  scheduleSave();
}
function changeTpl(tpl) {
  S.slides[S.active] = { ...SLIDE_DEFAULTS[tpl] };
  renderAll(); scheduleSave();
}
function uploadImg(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    S.images[S.active] = e.target.result;
    renderPanel(); refreshThumb(S.active); renderPreview();
  };
  reader.readAsDataURL(file);
}
function removeImg() {
  delete S.images[S.active];
  renderPanel(); refreshThumb(S.active); renderPreview();
}
function refreshThumb(index) {
  const items = document.querySelectorAll('.thumb-item');
  const item = items[index];
  if (!item) return;
  const iframe = item.querySelector('iframe');
  if (iframe) iframe.srcdoc = slideDoc(index);
}

// ─── Refine with AI ───────────────────────────────────────────────────────────
function toggleRefine() {
  document.getElementById('refine-wrap').classList.toggle('open');
}
async function doRefine() {
  const instr = document.getElementById('refine-instr').value.trim();
  if (!instr) return;
  const btn = document.getElementById('btn-refine-ok');
  btn.textContent = '…'; btn.disabled = true;
  try {
    const refined = await callRefine(S.slides[S.active], instr);
    S.slides[S.active] = refined;
    renderAll(); scheduleSave();
  } catch (e) {
    alert('Erro ao refinar: ' + e.message);
  } finally { btn.textContent = 'Refinar'; btn.disabled = false; }
}

// ─── Loading ──────────────────────────────────────────────────────────────────
let loadingTimer = null;
function startLoading() {
  let i = 0;
  const el = document.getElementById('loading-text');
  el.textContent = LOADING_MSGS[0];
  loadingTimer = setInterval(() => {
    i = (i + 1) % LOADING_MSGS.length;
    el.textContent = LOADING_MSGS[i];
  }, 2000);
}
function stopLoading() { clearInterval(loadingTimer); }

// ─── Generate ─────────────────────────────────────────────────────────────────
async function handleGenerate() {
  const topic = document.getElementById('inp-topic').value.trim();
  if (!topic) { alert('Insira o tema do carrossel'); return; }
  S.brief = {
    topic,
    audience: document.getElementById('inp-audience').value.trim(),
    slideCount: S.slideCount,
    cta: document.getElementById('inp-cta').value.trim(),
  };
  showScreen('loading');
  startLoading();
  try {
    const result = await callGenerate(S.brief);
    S.slides = result.slides || [];
    S.active = 0;
    S.images = {};
    document.getElementById('editor-topic').textContent = topic;
    syncEditorBrand();
    renderAll();
    showScreen('editor');
    scheduleSave();
  } catch (e) {
    alert('Erro ao gerar: ' + e.message);
    showScreen('brief');
  } finally { stopLoading(); }
}

// ─── API calls ────────────────────────────────────────────────────────────────
async function callGenerate(brief) {
  if (S.bridgeAvailable) {
    const r = await fetch(BRIDGE + '/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brief),
    });
    if (!r.ok) throw new Error('Bridge error ' + r.status);
    return r.json();
  }
  const key = document.getElementById('inp-apikey').value.trim();
  if (!key) throw new Error('Bridge offline. Configure a API Key como fallback.');
  const { topic, audience, slideCount=8, cta } = brief;
  const prompt = `Crie um carrossel com ${slideCount} slides sobre: "${topic}". Audiência: ${audience||'geral'}. CTA: ${cta||'Siga para mais'}. Primeiro slide: cover. Último: cta. Retorne: { "slides": [...] }`;
  return anthropicDirect(prompt, key, 4096);
}

async function callRefine(slide, instruction) {
  if (S.bridgeAvailable) {
    const r = await fetch(BRIDGE + '/refine', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slide, instruction }),
    });
    if (!r.ok) throw new Error('Bridge error ' + r.status);
    return r.json();
  }
  const key = document.getElementById('inp-apikey').value.trim();
  if (!key) throw new Error('Bridge offline. Configure a API Key como fallback.');
  const prompt = `Refine este slide (template: ${slide.template}). Instrução: "${instruction}". Slide: ${JSON.stringify(slide)}. Retorne SOMENTE o JSON do slide.`;
  return anthropicDirect(prompt, key, 1024);
}

const SYSTEM = `Você é estrategista de conteúdo especializado em Instagram editorial.
Crie carrosséis no estilo dark-luxury: direto, inteligente, provocativo mas refinado.
Tom editorial, em português brasileiro.
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown, sem backticks, sem texto extra.`;

async function anthropicDirect(userPrompt, apiKey, maxTokens) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return JSON.parse(data.content[0].text);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
checkBridge();
loadPersistedState();
</script>
</body>
</html>
```

- [ ] **Step 2: Open and verify with mock data**

Temporarily add at the very end of `<script>`, replacing `checkBridge(); loadPersistedState();`:

```javascript
// TEMP: mock data test
S.slides = [
  { template:'cover', headline:'Por que criadores brasileiros fracassam nos', headline_italic:'primeiros 90 dias', body:'A resposta não está onde você pensa.' },
  { template:'dark', section_number:'1', section_title:'O Problema Real', body:'Não é falta de talento. É falta de sistema.', list_items:['Publicam sem consistência','Copiam formatos que não são seus','Nunca analisam o que funciona'], conclusion:'Sem sistema, criatividade vira caos.' },
  { template:'steps', section_title:null, steps:[{label:'Etapa 1',text:'Escolha 1 formato principal'},{label:'Etapa 2',text:'Publique 3x por semana'},{label:'Etapa 3',text:'Analise os 3 melhores posts'},{label:'Etapa 4',text:'Duplique o que funcionou'}], call_to_action:'Simples assim?', call_to_action_italic:'Sim.' },
  { template:'overlay', section_number:'2', section_title:'A Virada', headline:'Quando você para de criar e começa a construir.', body:'Sistema > inspiração. Sempre.' },
  { template:'cta', headline:'Em 90 dias, seu conteúdo pode mudar', headline_italic:'completamente.', body:'Mas só se você parar de improvisar.', cta_text:'Comente', cta_word:'"SISTEMA"', cta_suffix:'que te envio o guia.' },
];
S.active = 0;
S.brief.topic = 'Criadores digitais nos primeiros 90 dias';
document.getElementById('editor-topic').textContent = S.brief.topic;
syncEditorBrand();
renderAll();
showScreen('editor');
```

```bash
open carousel-builder/app/index.html
```

Verify:
- 5 thumbnails in sidebar, slide 1 (cover) selected and highlighted
- Preview shows cover slide with Playfair Display 400 weight headline, italic on second line
- Clicking each thumbnail switches preview and updates template pills
- Edit panel shows correct fields for `dark` template (section_number, section_title, body, list_items, conclusion)
- Typing in any field updates the preview in real time
- Changing the template pill switches template and refreshes the panel
- Image drop zone appears on cover, split, overlay templates; not on dark, steps, cta
- "+ Slide" button inserts a new dark slide after the active one
- "Excluir" button removes the current slide

- [ ] **Step 3: Restore init — remove the mock data block and restore**

Replace the mock block with:

```javascript
checkBridge();
loadPersistedState();
```

- [ ] **Step 4: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel-builder): complete web app — all screens, templates, edit panel, settings, persistence"
```

---

### Task 7: End-to-End Integration Test

**Files:** None — this is a verification task only.

- [ ] **Step 1: Start bridge and open app**

```bash
export ANTHROPIC_API_KEY=sk-ant-...
node carousel-builder/server/mcp-server.js &
sleep 1
open carousel-builder/app/index.html
```

- [ ] **Step 2: Verify bridge detection**

Expected: green "⬤ Bridge conectado" badge appears in Brief screen within 1.5s.

- [ ] **Step 3: Generate a carousel**

Fill in: Tema → "Produtividade para criadores digitais"; Audiência → "Criadores brasileiros"; Slides → 6. Click "Gerar carrossel".

Expected:
1. Loading screen with rotating text
2. Editor opens with 6 slides in sidebar
3. First slide is `cover`, last is `cta`
4. No two consecutive slides have the same template (except `dark`)

- [ ] **Step 4: Test persistence**

1. Edit a slide headline — preview updates immediately
2. Wait 400ms — green dot flashes
3. Close the tab, reopen `index.html`
4. Session banner "Continuar: Produtividade…" appears
5. Click "Continuar" — editor opens with same slides

- [ ] **Step 5: Test settings**

1. Click ⚙ → Settings screen opens with pre-filled values
2. Change nome to "TestBrand", nav_left to "INSIGHTS"
3. Click "← Salvar e voltar"
4. Header shows "⬥ TestBrand", all slide nav bars update

- [ ] **Step 6: Test Refinar com IA**

1. Open any slide
2. Click "✦ Refinar com IA"
3. Type "torne o headline mais provocativo"
4. Click "Refinar" — preview updates with refined content

- [ ] **Step 7: Kill bridge, commit**

```bash
kill %1
git commit --allow-empty -m "test(carousel-builder): end-to-end integration verified"
```

---

### Task 8: Skill + README

**Files:**
- Create: `carousel-builder/skills/carousel-builder/SKILL.md`
- Create: `carousel-builder/README.md`

- [ ] **Step 1: Write SKILL.md**

`carousel-builder/skills/carousel-builder/SKILL.md`:
```markdown
---
name: carousel-builder
description: Use when the user wants to create an Instagram carousel, generate slides, brainstorm carousel ideas, or refine a specific slide. Invokes MCP tools generate_carousel, refine_slide, and brainstorm_ideas.
---

# Carousel Builder

## When to use

- User asks to create an Instagram carousel or post series
- User wants slide ideas for a niche
- User wants to refine or rewrite a specific slide

## Tools

### generate_carousel

Generates a complete carousel (3–12 slides) in the editorial dark-luxury style.

**Parameters:**
- `topic` (required): subject of the carousel
- `audience`: target audience description
- `slideCount`: number of slides, 3–12 (default: 8)
- `cta`: final call-to-action text

Returns `{ slides: [...] }` — array of slide objects each with a `template` field.

**Templates:** `cover`, `split`, `dark`, `steps`, `overlay`, `cta`

### refine_slide

Rewrites a single slide following an instruction, preserving its template.

**Parameters:**
- `slide` (required): full slide JSON object
- `instruction` (required): what to change

Returns the refined slide object.

### brainstorm_ideas

Suggests high-engagement carousel topics for a niche.

**Parameters:**
- `niche` (required): e.g. "marketing digital"
- `platform`: default "Instagram"
- `count`: number of ideas, default 5

Returns `{ ideas: [{ title, angle, why }] }`.

## Visual editor

Start the HTTP bridge (separate terminal):

```bash
cd /path/to/carousel-builder/server
node mcp-server.js
```

Then open `app/index.html` in your browser.
```

- [ ] **Step 2: Write README.md**

`carousel-builder/README.md`:
```markdown
# carousel-builder

Editor visual local para criar carrosséis de Instagram no estilo editorial dark-luxury.

## Setup

```bash
cd server && npm install
```

## Usar o web app (editor visual)

**Terminal 1 — bridge HTTP:**
```bash
cd server && node mcp-server.js
```

**Terminal 2 (ou duplo-clique no Finder):**
```bash
open app/index.html
```

O app detecta o bridge automaticamente (badge verde "⬤ Bridge conectado"). Se o bridge não estiver rodando, configure a API Key diretamente no formulário como fallback.

## Usar as ferramentas no Claude Code

O plugin registra automaticamente o MCP server via `.mcp.json`.

Para registrar manualmente:
```bash
claude mcp add carousel-builder -s user -- node /caminho/absoluto/server/mcp-server.js --mcp
```

Ferramentas disponíveis: `generate_carousel`, `refine_slide`, `brainstorm_ideas`.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `ANTHROPIC_API_KEY` | Obrigatória para o bridge HTTP e o MCP server |
```

- [ ] **Step 3: Commit**

```bash
git add carousel-builder/skills/ carousel-builder/README.md
git commit -m "docs(carousel-builder): SKILL.md and README"
```

---

### Task 9: Marketplace Registration

**Files:**
- Modify: `README.md` (marketplace root)

- [ ] **Step 1: Add carousel-builder entry to the marketplace README**

Open `/Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/README.md` and add after the `task-viewer` section:

```markdown
### carousel-builder

Editor visual local para criar carrosséis de Instagram no estilo editorial dark-luxury — design inspirado em revistas como Monocle e WSJ Magazine.

- Geração via Claude API com 6 templates editoriais (cover, split, conteúdo, etapas, foto+texto, cta)
- Editor com preview em tempo real, upload de imagens, e configurações de marca (logo, nav labels)
- Ferramentas MCP: `generate_carousel`, `refine_slide`, `brainstorm_ideas`
- Bridge HTTP manual + ferramentas MCP auto-registradas via `.mcp.json`

**Install:**

```bash
claude plugins add-marketplace orionlabz/carousel-builder
claude plugins enable carousel-builder@orionlabz
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(marketplace): register carousel-builder plugin"
```
