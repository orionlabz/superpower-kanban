# Carousel Builder — Layout Variants per Template

**Date:** 2026-03-26
**Status:** Approved

---

## Overview

Add multiple layout variants per slide template to the Carousel Builder. Users can switch between layouts for each individual slide via pills in the editor. All variants share the same Playfair Display / Inter theme and dark-luxury aesthetic — only the composition changes.

---

## Architecture

### Data model change

Each slide gains an optional `layout` field (defaults to `"a"` for backwards compatibility):

```json
{ "template": "dark", "layout": "b", "section_title": "...", ... }
```

### Renderer change

`RENDERERS[template]` becomes `RENDERERS[template][layout]`. A helper resolves the correct renderer:

```js
function getRenderer(slide) {
  const layout = slide.layout || 'a';
  const tpl = RENDERERS[slide.template];
  return (tpl?.[layout] ?? tpl?.['a'] ?? RENDERERS.dark.a);
}
```

### UI change

The existing template pills row becomes a **layout pills row** showing only the variants available for the current slide's template. Selecting a pill sets `slide.layout` and re-renders.

---

## Layout Inventory

### Cover — 3 variants

**A — Bottom-anchored (current, padding fix)**
- Brand top-left
- Headline Playfair 84px bottom, italic part on same line
- Body text below headline
- Fix: increase bottom padding from 60px → 80px

**B — Editorial centrado**
- Brand top-left + issue number top-right (`Nº 01`)
- Category tag above headline
- Headline centered vertically
- Short rule below headline, body text below rule

**C — Linha de corte**
- Brand top-left + series tag top-right
- Full-width horizontal rule separates brand from content
- Headline + body in center zone
- Folio (category | slide number) in footer

---

### Dark — 3 variants

**A — Stacked (current)**
- Nav bar → section number small → title → body → list (bullet dots) → conclusion → footer

**B — Número gigante de fundo (refined)**
- Section number as large decorative background element (top-right, very low opacity `#111`)
- 3 zones: Nav bar (with rule) → Content (flex:1) → Footer
- Content: "Seção 01" tag → title Playfair → body → list (dash markers `—`) → conclusion in italic Playfair
- No separator lines except inside nav bar
- Hierarchy via spacing and color alone

**C — Header duas colunas**
- Nav bar
- Two-column header: section number left (large Playfair, muted), title right — separated by top border line
- Body → list → conclusion → footer

---

### Steps — 3 variants

**A — Stacked numerado (current)**
- Title → steps as `Label: text` inline → CTA Playfair at bottom

**B — Número Playfair grande por etapa**
- Section tag (small caps)
- Each step: large Playfair number left + label + text right, aligned by baseline
- CTA Playfair at bottom

**C — Grid 2×2 com ícones**
- Title Playfair above grid
- 4 cards in 2×2 grid, each with: icon (top-left) + label + text
- CTA Playfair below grid
- **Icon source (per card):** Lucide Icons picker (search by name) OR user upload (PNG/SVG)
- Icon stored as: `{ type: "lucide", name: "layers" }` or `{ type: "upload", src: "data:..." }`
- Edit panel shows icon selector for each card when layout C is active

---

### Overlay — 2 variants

**A — Foto topo (current)**
- Photo in top ~50% (rounded card, with bottom gradient fade)
- Nav bar below photo
- Section tag → title → subtitle italic → body → footer

**B — Full-bleed**
- Photo covers entire slide background
- Heavy gradient: opaque black at bottom, transparent at top
- Nav bar at top (text semi-transparent over photo)
- Content anchored to bottom: section tag → title → body → footer

---

### Split — 1 variant

**A — Texto esquerda, foto direita (current)**
- Text column 52% left: nav bar → headline → body → footer
- Photo column 48% right

No additional variants approved.

---

### CTA — 2 variants

**A — Headline + CTA texto (current, padding fix)**
- Brand top-left
- Headline Playfair large italic, anchored to vertical center
- Body text below
- CTA text with underlined keyword at bottom
- Fix: increase bottom padding from 60px → 80px

**C — Centralizado com pill**
- Everything centered (flex column, align center)
- Brand mark at top
- Headline Playfair centered
- Short horizontal rule
- Body text centered
- CTA in pill: `border: 1px solid #2a2a2a`, rounded, inline keyword in white

---

## Editor UX

### Layout picker

- Shown below the slide preview, replacing the current template pills
- Pills labeled with layout names (e.g. "Ancorado", "Editorial", "Linha de corte")
- Only variants for current template are shown
- Active variant highlighted

### Icon picker (Steps C only)

When layout C is active, the edit panel shows per-card icon controls:
1. **Search Lucide** — text input, filters icon names, shows SVG previews
2. **Upload** — accepts PNG or SVG via file input; stored as base64 data URI

### AI generation

`generate_carousel` prompt updated to include `layout` field. Default: `"a"` for all templates.
`refine_slide` preserves the `layout` field.

---

## Implementation Notes

- Backwards compatible: slides without `layout` field render as `"a"`
- `RENDERERS` object refactored from flat `{ cover, dark, ... }` to nested `{ cover: { a, b, c }, dark: { a, b, c }, ... }`
- Lucide icons loaded via CDN in the slide iframe (`<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js">`) or inlined as SVG strings
- SVG upload: validate MIME type, strip `<script>` tags before storing
