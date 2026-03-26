---
name: carousel-builder
description: >
  Use this skill when the user wants to create an Instagram carousel, generate
  slides for a topic, brainstorm carousel ideas for a niche, or refine a
  specific slide. Invokes MCP tools generate_carousel, refine_slide, and
  brainstorm_ideas.

  <example>
  user: "Cria um carrossel sobre produtividade para criadores digitais"
  assistant: uses generate_carousel to generate the full slide deck
  </example>

  <example>
  user: "Gera 8 slides sobre marketing de conteúdo para pequenas empresas"
  assistant: uses generate_carousel with slideCount=8
  </example>

  <example>
  user: "Brainstorm ideias de carrossel para o nicho de finanças pessoais"
  assistant: uses brainstorm_ideas to suggest high-engagement carousel topics
  </example>

  <example>
  user: "Refine esse slide — quero mais direto e provocativo"
  assistant: uses refine_slide with the current slide JSON and the instruction
  </example>

  <example>
  user: "Make me an Instagram post series about remote work"
  assistant: uses generate_carousel to create a carousel on remote work
  </example>
---

# Carousel Builder

Creates editorial dark-luxury Instagram carousels via Claude API. Uses three MCP tools auto-registered by the plugin.

## When to use

- User asks to create an Instagram carousel, post series, or slide deck
- User wants topic ideas for a niche ("brainstorm carousel ideas for marketing")
- User wants to rewrite or improve a specific slide ("refine this slide to be more direct")

## Tools

### generate_carousel

Generates a complete carousel with 3–12 slides, always starting with a `cover` slide and ending with a `cta` slide.

```
generate_carousel(
  topic:      string,  // required — subject of the carousel
  audience?:  string,  // target audience description
  slideCount?: number, // 3–12, default 8
  cta?:       string   // call-to-action text for the final slide
)
```

Returns `{ "slides": [...] }` — array of slide objects each with a `template` field.

**Available templates:** `cover`, `split`, `dark`, `steps`, `overlay`, `cta`

**Example:**
```
generate_carousel("produtividade para criadores digitais", "Criadores brasileiros", 6, "Siga para mais")
```

### refine_slide

Rewrites a single slide following an instruction, preserving its template and field structure.

```
refine_slide(
  slide:       object, // required — full slide JSON
  instruction: string  // required — what to change
)
```

Returns the refined slide object (same template, updated content).

**Example:**
```
refine_slide({ "template": "dark", "section_title": "Produtividade", ... }, "torne mais direto e impactante")
```

### brainstorm_ideas

Suggests high-engagement carousel topics for a niche with title, editorial angle, and engagement reasoning.

```
brainstorm_ideas(
  niche:     string,  // required — e.g. "marketing digital"
  platform?: string,  // default "Instagram"
  count?:    number   // default 5
)
```

Returns `{ "ideas": [{ "title": "...", "angle": "...", "why": "..." }] }`.

## Visual editor

To use the web editor, start the HTTP bridge in a dedicated terminal:

```bash
cd /path/to/carousel-builder/server && node mcp-server.js
```

Then open `app/index.html` in your browser. The editor detects the bridge automatically.

## Slide JSON examples

**cover:**
```json
{ "template": "cover", "headline": "Por que criadores brasileiros fracassam nos", "headline_italic": "primeiros 90 dias", "body": "A resposta não está onde você pensa." }
```

**dark:**
```json
{ "template": "dark", "section_number": "1", "section_title": "O Problema Real", "body": "Não é falta de talento.", "list_items": ["Publicam sem consistência", "Nunca analisam o que funciona"], "conclusion": "Sem sistema, criatividade vira caos." }
```

**cta:**
```json
{ "template": "cta", "headline": "Em 90 dias, seu conteúdo pode mudar", "headline_italic": "completamente.", "body": "Mas só se você parar de improvisar.", "cta_text": "Comente", "cta_word": "\"SISTEMA\"", "cta_suffix": "que te envio o guia." }
```
