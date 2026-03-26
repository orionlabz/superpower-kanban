# Instagram Carousel Builder — Design Spec

**Data:** 2026-03-26
**Status:** Aprovado

---

## Visão Geral

Plugin para o marketplace OrionLabz que fornece um editor visual local para criar carrosséis de Instagram no estilo **editorial dark-luxury**. Opera em modo híbrido: ferramentas MCP disponíveis automaticamente no Claude Code via stdio, bridge HTTP iniciado manualmente para uso do web app visual.

---

## Estrutura do Plugin

```
carousel-builder/
├── .claude-plugin/
│   └── plugin.json          # nome + descrição do plugin
├── .mcp.json                # registra MCP via stdio (--mcp flag)
├── server/
│   ├── mcp-server.js        # dual-mode: stdio MCP ou HTTP bridge :3456
│   └── package.json
├── app/
│   └── index.html           # single-file web app (zero deps externas)
├── skills/
│   └── carousel-builder/
│       └── SKILL.md         # guia de uso para o Claude Code
└── README.md
```

---

## Arquitetura

### Modo Híbrido

| Componente | Como ativa | Função |
|---|---|---|
| MCP stdio | `.mcp.json` → Claude Code auto-registra | Ferramentas Claude Code |
| HTTP bridge | `node mcp-server.js` (manual) | Alimenta o web app visual |
| Web app | `open app/index.html` (manual) | Editor visual |

O `mcp-server.js` detecta o flag `--mcp` na linha de comando:
- **Com `--mcp`:** inicia MCP server via stdio (para Claude Code)
- **Sem flag:** inicia HTTP bridge em `localhost:3456` (para o web app)

### Ferramentas MCP

```
generate_carousel(topic, audience, slideCount, cta)
  → Gera carrossel completo, retorna JSON de slides

refine_slide(slide, instruction)
  → Reescreve um slide mantendo template e estrutura

brainstorm_ideas(niche, platform, count)
  → Sugere temas de alto engajamento para o nicho
```

### Rotas HTTP Bridge

```
POST /generate   { topic, audience, slideCount, cta, brand }  → { slides: [...] }
POST /refine     { slide, instruction }                        → { slide atualizado }
POST /brainstorm { niche, platform, count }                    → { ideas: [...] }
```

**Runtime:** Node.js ESM (`"type": "module"`)
**Dependências:** `@anthropic-ai/sdk`, `@modelcontextprotocol/sdk`
**Autenticação:** herda `ANTHROPIC_API_KEY` do ambiente
**CORS:** `Access-Control-Allow-Origin: *` em todas as respostas
**Modelo:** `claude-sonnet-4-6`, `max_tokens: 4096`

### System Prompt da API

```
Você é estrategista de conteúdo especializado em Instagram editorial.
Crie carrosséis no estilo dark-luxury: direto, inteligente, provocativo mas refinado.
Tom editorial, em português brasileiro.
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown, sem backticks, sem texto extra.
```

---

## Web App (`app/index.html`)

Single HTML file com CSS e JS inline. Única dependência externa: Google Fonts (`Playfair Display` + `Inter`).

### Quatro Telas

**Tela 1 — Brief**
Formulário: tema (textarea), audiência (input), número de slides (counter 3–12, default 8), CTA final (input). Badge "⬤ Bridge conectado" quando bridge disponível. Campo de API key colapsável (fallback). Botão "Gerar carrossel". Banner de sessão salva na parte inferior se houver estado no localStorage.

**Tela 2 — Loading**
Três dots com pulse sequencial. Textos rotativos: "Estruturando o roteiro…" / "Criando os slides…" / "Refinando o conteúdo…".

**Tela 3 — Editor**
Layout três colunas com header fixo (48px).

- **Header:** logo da marca, tema truncado, dot de salvo (verde, pisca ao salvar), ícone ⚙ → Configurações, botão "+ Novo"
- **Coluna esquerda (152px):** thumbnails clicáveis (136×170px, escala 136/1080 ≈ 0.1259), borda branca no ativo, número + label de template, botão "+ Slide"
- **Coluna central:** preview em escala proporcional (max-scale 0.50), pills de template abaixo (6 opções: cover / split / conteúdo / etapas / foto+texto / cta)
- **Coluna direita (288px):** painel de edição dinâmico conforme template. Campos de imagem com drop zone. Inputs com atualização em tempo real. Botão "✦ Refinar com IA" que abre input inline para instrução e chama `/refine`

**Tela 4 — Configurações de Marca**
Campos: símbolo/logo (default "⬥"), nome da marca (default "Marca"), label esquerdo da nav (default "CATEGORIA"), label direito da nav (default "SÉRIE"). Botão "Salvar e voltar" reflete mudanças em todos os slides imediatamente.

### Lógica de Conexão Bridge/API

1. Ao carregar o app, tenta `POST /generate` com payload mínimo (timeout 1.2s)
2. Se responder: `bridgeAvailable = true`, exibe badge verde
3. Ao gerar/refinar: usa bridge se disponível, senão API Anthropic diretamente com a key fornecida

### Persistência (`localStorage`, chave `cb-v3`)

Salva com debounce 400ms: `brief`, `brand`, `slides` (sem imagens — base64 pesa demais), `active` (índice do slide ativo). Imagens ficam apenas em memória de sessão.

---

## Design System

### Paleta

| Variável | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#000000` | Fundo dos slides de conteúdo |
| `--bg-dark` | `#0d0d0d` | Variação de fundo |
| `--bg-cover` | `#2a3540` | Fallback de capa sem foto |
| `--text-primary` | `#FFFFFF` | Headlines |
| `--text-secondary` | `#8a8a8a` | Body text |
| `--text-muted` | `#555555` | Labels, dots de lista |
| `--text-ghost` | `#303030` | Nav bar |

### Tipografia

- **Display:** `Playfair Display` weight 400 (nunca bold — o refinamento vem da leveza). Italic em `<em>` dentro de headlines cria o efeito editorial.
- **Body/UI:** `Inter`

**Escala (slides 1080px):**
- Headline cover: 84px / weight 400
- Headline seção: 62–66px / weight 400
- Body text: 27–28px / color #555–#777
- Label nav: 22px / letter-spacing .18em / uppercase / color #303030
- Footer: 28px / color #252525

### Elementos Fixos dos Slides de Conteúdo (slides 2–N-1)

```
Header nav: "[nav_left] ——— [nav_right]"   (flex, valores configuráveis)
Footer:     "[brand_logo] [brand_name]"    (esq) + "[BRAND_NAME uppercase]" (dir)
Padding:    54px top / 76px lateral / 60px bottom
```

---

## Templates de Slides

Dimensões: **1080 × 1350 px** (4:5 portrait)

### Regras de Sequência
- Primeiro slide: sempre `cover`
- Último slide: sempre `cta`
- Não repetir o mesmo template em sequência (exceto `dark`)
- Variar entre: `dark`, `steps`, `overlay`, `split`

### `cover`
Foto full-bleed com filtro `saturate(0.6)`. Gradiente `to top` de `rgba(0,0,0,.97)` a `transparent`. Logo no canto superior esquerdo. Headline + italic na parte inferior. Body centralizado abaixo.

**Campos:** `headline`, `headline_italic`, `body`

### `split`
Coluna esquerda (52%): fundo preto, texto alinhado. Coluna direita (48%): foto `grayscale(90%) contrast(1.05)`.

**Campos:** `headline`, `headline_italic`, `body`

### `dark`
Slide de conteúdo puro. Header nav + fundo preto. Número + título como h2 grande. Body em cinza. Lista com "·" como marcador. Conclusão em cinza. Footer.

**Campos:** `section_number`, `section_title`, `body`, `list_items` (array, max 4), `conclusion`

### `steps`
Etapas sequenciais. Header nav. Título opcional. Etapas: "Label:" em branco + texto em cinza. CTA final em Playfair italic grande. Footer.

**Campos:** `section_title`, `steps` (array `{label, text}`, max 4), `call_to_action`, `call_to_action_italic`

### `overlay`
Foto arredondada no topo (altura 680px, border-radius 18px, dentro de padding 14px) com gradiente de dissolução. Número de seção em label caps. Título grande. Headline italic. Body em cinza.

**Campos:** `section_number`, `section_title`, `headline`, `body`

### `cta`
Fundo preto com borda `#161616`. Logo da marca no topo. Headline grande em Playfair italic. Body em `#444`. CTA com palavra em destaque sublinhada.

**Campos:** `headline`, `headline_italic`, `body`, `cta_text`, `cta_word`, `cta_suffix`

---

## Exemplos de JSON

### `cover`
```json
{
  "template": "cover",
  "headline": "Por que os criadores brasileiros adoram",
  "headline_italic": "esse método de conteúdo?",
  "body": "Simples: ele transforma 2 horas de trabalho semanal em presença consistente em todas as plataformas."
}
```

### `dark`
```json
{
  "template": "dark",
  "section_number": "1",
  "section_title": "Sistema Circular de Conteúdo",
  "body": "A ideia central é simples: um único conteúdo-base alimenta todas as plataformas.",
  "list_items": [
    "Escreva 1 peça central por semana",
    "Essa peça vira o roteiro do vídeo longo",
    "Extraia ideias para posts sociais",
    "Adapte para X, Instagram, LinkedIn e YouTube Shorts"
  ],
  "conclusion": "Resultado: 2 horas de trabalho geram conteúdo para a semana inteira."
}
```

### `steps`
```json
{
  "template": "steps",
  "section_title": null,
  "steps": [
    { "label": "Etapa 1", "text": "Escolha 3 posts que você considera referência" },
    { "label": "Etapa 2", "text": "Peça para a IA analisar estrutura e psicologia de cada um" },
    { "label": "Etapa 3", "text": "Combine as 3 análises em um guia com sua voz" },
    { "label": "Etapa 4", "text": "Use esse guia como prompt-base para variações futuras" }
  ],
  "call_to_action": "Como aplicar isso na prática?",
  "call_to_action_italic": "Veja a seguir."
}
```

### `cta`
```json
{
  "template": "cta",
  "headline": "Este sistema foi desenhado para funcionar dentro do",
  "headline_italic": "seu negócio.",
  "body": "Em 90 dias você terá um processo de conteúdo que gera autoridade sem depender de inspiração diária.",
  "cta_text": "Quer aplicar isso? Comente",
  "cta_word": "\"QUERO\"",
  "cta_suffix": "aqui e entro em contato."
}
```

---

## Checklist de Qualidade Visual

- [ ] Headlines em Playfair Display weight 400 (não bold)
- [ ] Italic no `<em>` dentro do headline
- [ ] Body text em #555–#777 (nunca branco puro)
- [ ] Nav bar com labels configuráveis nos slides de conteúdo
- [ ] Footer com nome da marca configurável em todos os slides de conteúdo
- [ ] Thumbnails na sidebar escalam corretamente (136/1080 ≈ 0.1259)
- [ ] Preview central escala proporcionalmente ao espaço disponível
- [ ] Upload de imagem funciona nos 3 templates com foto (cover, split, overlay)
- [ ] Sem foto: fallback `linear-gradient(160deg,#2a3540,#1a2228)`
- [ ] Tela de configurações persiste e reflete em todos os slides

---

## README do Projeto

```bash
# Setup
cd carousel-builder/server && npm install

# Iniciar bridge HTTP (terminal dedicado)
node mcp-server.js

# Abrir web app
open ../app/index.html

# Registrar MCP no Claude Code (feito automaticamente via .mcp.json ao instalar o plugin)
# Ou manualmente:
claude mcp add carousel-builder -s user -- node /caminho/absoluto/server/mcp-server.js --mcp
```
