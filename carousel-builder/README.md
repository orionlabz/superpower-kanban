# carousel-builder

Editor visual local para criar carrosséis de Instagram no estilo editorial dark-luxury.

## Componentes

| Componente | Descrição |
|---|---|
| MCP tools | `generate_carousel`, `refine_slide`, `brainstorm_ideas` — auto-registrados no Claude Code |
| HTTP bridge | `localhost:3456` — alimenta o web app visual (start manual) |
| Web app | `app/index.html` — editor de slides com preview em tempo real |

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

O plugin registra automaticamente o MCP server via `.mcp.json` ao ser instalado.

Para registrar manualmente:
```bash
claude mcp add carousel-builder -s user -- node /caminho/absoluto/server/mcp-server.js --mcp
```

Ferramentas disponíveis: `generate_carousel`, `refine_slide`, `brainstorm_ideas`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ANTHROPIC_API_KEY` | Sim | Usada pelo bridge HTTP e pelo MCP server |

## Templates de slide

| Template | Uso | Tem foto |
|---|---|---|
| `cover` | Primeiro slide (sempre) | ✅ |
| `split` | Introdução/contexto com foto | ✅ |
| `dark` | Conteúdo puro — pilares, seções | ❌ |
| `steps` | Etapas sequenciais | ❌ |
| `overlay` | Seção com foto de impacto | ✅ |
| `cta` | Último slide (sempre) | ❌ |
