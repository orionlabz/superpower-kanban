# Carousel Builder — Layout Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multiple layout variants per slide template, letting users switch between them per-slide via pills in the editor.

**Architecture:** Refactor the flat `RENDERERS` object to nested `RENDERERS[template][layout]`, add a `getRenderer(slide)` helper, replace template pills with layout pills, and implement all approved variants. Steps C gets an icon picker (Lucide + upload). Single file: `carousel-builder/app/index.html`.

**Tech Stack:** Vanilla JS, inline HTML/CSS, Lucide Icons (CDN, UMD build), no build step.

---

## File Map

| File | Changes |
|------|---------|
| `carousel-builder/app/index.html` | All changes — renderers, UI, icon picker, layout pills |
| `carousel-builder/server/mcp-server.js` | Update AI prompt to emit `layout` field |

---

## Task 1: Refactor RENDERERS to nested structure

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS object + getRenderer + slideDoc

Wrap every existing renderer function inside a nested object keyed by layout `a`. Add `getRenderer` helper. Update `slideDoc` to use it.

- [ ] **Step 1: Add getRenderer helper** — find the line `const RENDERERS = {` and add the helper immediately before:

```js
function getRenderer(slide) {
  const layout = slide.layout || 'a';
  const tpl = RENDERERS[slide.template];
  return tpl?.[layout] ?? tpl?.['a'] ?? RENDERERS.dark.a;
}
```

- [ ] **Step 2: Wrap each renderer in layout `a`** — change the RENDERERS object from:

```js
const RENDERERS = {
  cover(slide, img) { ... },
  split(slide, img) { ... },
  dark(slide) { ... },
  steps(slide) { ... },
  overlay(slide, img) { ... },
  cta(slide) { ... },
};
```

to:

```js
const RENDERERS = {
  cover:   { a(slide, img) { /* existing cover body */ } },
  split:   { a(slide, img) { /* existing split body */ } },
  dark:    { a(slide)      { /* existing dark body  */ } },
  steps:   { a(slide)      { /* existing steps body */ } },
  overlay: { a(slide, img) { /* existing overlay body */ } },
  cta:     { a(slide)      { /* existing cta body   */ } },
};
```

Keep all existing function bodies exactly as-is, just move them inside the `a` key.

- [ ] **Step 3: Update slideDoc to use getRenderer** — find:

```js
const fn = RENDERERS[slide.template] || RENDERERS.dark;
const body = fn(slide, S.images[index] || null);
```

Replace with:

```js
const fn = getRenderer(slide);
const body = fn(slide, S.images[index] || null);
```

- [ ] **Step 4: Verify in browser** — open `http://localhost:37776`, generate a carousel, confirm slides still render correctly with no JS errors in console.

- [ ] **Step 5: Commit**

```bash
cd /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz
git add carousel-builder/app/index.html
git commit -m "refactor(carousel): nest RENDERERS by layout, add getRenderer helper"
```

---

## Task 2: Layout pills UI

**Files:**
- Modify: `carousel-builder/app/index.html` — HTML pills, CSS, renderPreview, changeLayout

- [ ] **Step 1: Add LAYOUT_NAMES constant** — add after the `const RENDERERS = { ... };` block:

```js
const LAYOUT_NAMES = {
  cover:   { a: 'Ancorado', b: 'Editorial', c: 'Linha de corte' },
  dark:    { a: 'Stacked',  b: 'Nº fundo',  c: '2 colunas' },
  steps:   { a: 'Lista',    b: 'Numerado',   c: 'Ícones' },
  overlay: { a: 'Foto topo', b: 'Full-bleed' },
  split:   { a: 'Padrão' },
  cta:     { a: 'Headline',  c: 'Centrado' },
};
```

- [ ] **Step 2: Replace static template pills HTML** — find:

```html
<div class="template-pills">
  <button class="pill" data-tpl="cover"   onclick="changeTpl('cover')">cover</button>
  <button class="pill" data-tpl="split"   onclick="changeTpl('split')">split</button>
  <button class="pill" data-tpl="dark"    onclick="changeTpl('dark')">conteúdo</button>
  <button class="pill" data-tpl="steps"   onclick="changeTpl('steps')">etapas</button>
  <button class="pill" data-tpl="overlay" onclick="changeTpl('overlay')">foto+texto</button>
  <button class="pill" data-tpl="cta"     onclick="changeTpl('cta')">cta</button>
</div>
```

Replace with:

```html
<div id="layout-pills" class="template-pills"></div>
```

- [ ] **Step 3: Add changeLayout function** — add after the existing `changeTpl` function:

```js
function changeLayout(layout) {
  if (!S.slides[S.active]) return;
  S.slides[S.active].layout = layout;
  refreshThumb(S.active);
  renderPreview();
  renderPanel();
  scheduleSave();
}
```

- [ ] **Step 4: Update renderPreview to render layout pills** — find the `document.querySelectorAll('.pill').forEach` block at the end of `renderPreview`:

```js
document.querySelectorAll('.pill').forEach(p =>
  p.classList.toggle('active', p.dataset.tpl === (S.slides[S.active] || {}).template)
);
```

Replace with:

```js
const slide = S.slides[S.active];
const pillsEl = document.getElementById('layout-pills');
if (slide && pillsEl) {
  const variants = LAYOUT_NAMES[slide.template] || {};
  const currentLayout = slide.layout || 'a';
  pillsEl.innerHTML = Object.entries(variants).map(([key, name]) =>
    `<button class="pill${key === currentLayout ? ' active' : ''}" onclick="changeLayout('${key}')">${name}</button>`
  ).join('');
}
```

- [ ] **Step 5: Verify** — generate a carousel, open a slide, confirm layout pills appear below the preview showing only variants for that slide's template. Clicking a pill should re-render (same layout for now since only `a` exists).

- [ ] **Step 6: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): layout pills UI — per-slide variant switcher"
```

---

## Task 3: Cover — fix padding on A, add B and C

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS.cover

- [ ] **Step 1: Fix cover A bottom padding** — inside `RENDERERS.cover.a`, find `padding:54px 76px 60px` and change to `padding:54px 76px 80px`.

- [ ] **Step 2: Add cover B — Editorial centrado** — add `b` key to `RENDERERS.cover`:

```js
b(slide, img) {
  const bg = img
    ? `<div style="position:absolute;inset:0;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`
    : `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>`;
  const { brand_logo='⬥', brand_name='Marca', nav_left='CATEGORIA' } = S.brand;
  const slideNum = String((S.slides.indexOf(slide) + 1)).padStart(2, '0');
  return `<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
    ${bg}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:auto;">
        <div style="${INT}font-size:22px;color:#fff;opacity:.9;">${esc(brand_logo)} ${esc(brand_name)}</div>
        <div style="${INT}font-size:18px;letter-spacing:.18em;color:#333;text-transform:uppercase;">Nº ${esc(slideNum)}</div>
      </div>
      <div style="display:flex;flex-direction:column;">
        <div style="${INT}font-size:18px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:24px;">${esc(nav_left)}</div>
        <div style="${PF}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
          ${esc(slide.headline)}<em> ${esc(slide.headline_italic)}</em>
        </div>
        <div style="width:80px;height:1px;background:#2a2a2a;margin-bottom:28px;"></div>
        <div style="${INT}font-size:27px;color:#666;line-height:1.5;">${esc(slide.body)}</div>
      </div>
    </div>
  </div>`;
},
```

- [ ] **Step 3: Add cover C — Linha de corte** — add `c` key to `RENDERERS.cover`:

```js
c(slide, img) {
  const bg = img
    ? `<div style="position:absolute;inset:0;"><img src="${img}" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.7) 55%,rgba(0,0,0,.3) 100%);"></div></div>`
    : `<div style="position:absolute;inset:0;background:#050505;"></div>`;
  const { brand_logo='⬥', brand_name='Marca', nav_left='CATEGORIA', nav_right='SÉRIE' } = S.brand;
  const total = S.slides.length;
  const idx = S.slides.indexOf(slide) + 1;
  return `<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
    ${bg}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
        <div style="${INT}font-size:22px;color:#fff;opacity:.85;">${esc(brand_logo)} ${esc(brand_name)}</div>
        <div style="${INT}font-size:18px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;">${esc(nav_right)}</div>
      </div>
      <div style="width:100%;height:1px;background:linear-gradient(to right,#fff,transparent);margin-bottom:48px;"></div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
        <div style="${PF}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
          ${esc(slide.headline)}<em> ${esc(slide.headline_italic)}</em>
        </div>
        <div style="${INT}font-size:27px;color:#666;line-height:1.5;">${esc(slide.body)}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="${INT}font-size:18px;letter-spacing:.18em;color:#252525;text-transform:uppercase;">${esc(nav_left)}</div>
        <div style="${INT}font-size:18px;letter-spacing:.12em;color:#252525;">${idx} / ${total}</div>
      </div>
    </div>
  </div>`;
},
```

- [ ] **Step 4: Verify** — switch a cover slide to layouts B and C via pills, confirm rendering matches the approved mockups.

- [ ] **Step 5: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): cover layout variants A (padding fix), B (editorial), C (linha de corte)"
```

---

## Task 4: Dark — add variants B and C

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS.dark

- [ ] **Step 1: Add dark B — Número gigante de fundo** — add `b` key to `RENDERERS.dark`:

```js
b(slide) {
  const items = (slide.list_items || []).map(item =>
    `<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
      <div style="width:20px;height:1px;background:#2a2a2a;flex-shrink:0;margin-top:14px;"></div>
      <span style="${INT}font-size:27px;color:#3a3a3a;line-height:1.45;">${esc(item)}</span>
     </div>`
  ).join('');
  return `<div style="width:1080px;height:1350px;background:#060606;display:flex;flex-direction:column;padding:54px 76px 80px;position:relative;overflow:hidden;">
    <div style="${PF}position:absolute;top:-20px;right:40px;font-size:480px;color:#111;line-height:1;user-select:none;pointer-events:none;letter-spacing:-.02em;">${esc(slide.section_number||'')}</div>
    <div style="display:flex;align-items:center;gap:22px;font-size:0;padding-bottom:40px;position:relative;">
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_left||'CATEGORIA')}</span>
      <div style="flex:1;height:1px;background:#1e1e1e;"></div>
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_right||'SÉRIE')}</span>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;position:relative;">
      <div style="${INT}font-size:18px;letter-spacing:.22em;color:#2e2e2e;text-transform:uppercase;margin-bottom:24px;">Seção ${esc(slide.section_number||'')}</div>
      <div style="${PF}font-size:72px;line-height:1.05;font-weight:400;color:#e8e8e8;margin-bottom:40px;">${esc(slide.section_title)}</div>
      <div style="${INT}font-size:27px;color:#505050;line-height:1.6;margin-bottom:48px;">${esc(slide.body)}</div>
      <div style="margin-bottom:0;">${items}</div>
      <div style="margin-top:auto;padding-top:32px;">
        <div style="${PF}font-size:27px;color:#2e2e2e;line-height:1.5;font-style:italic;">${esc(slide.conclusion)}</div>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
      <span style="${INT}font-size:22px;color:#1e1e1e;">${esc(S.brand.brand_logo||'⬥')} ${esc(S.brand.brand_name||'Marca')}</span>
      <span style="${INT}font-size:18px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${esc(S.brand.brand_name||'Marca')}</span>
    </div>
  </div>`;
},
```

- [ ] **Step 2: Add dark C — Header duas colunas** — add `c` key to `RENDERERS.dark`:

```js
c(slide) {
  const items = (slide.list_items || []).map(item =>
    `<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
      <span style="${INT}color:#555;font-size:27px;flex-shrink:0;">·</span>
      <span style="${INT}font-size:27px;color:#666;line-height:1.45;">${esc(item)}</span>
     </div>`
  ).join('');
  return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
    <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_left||'CATEGORIA')}</span>
      <div style="flex:1;height:1px;background:#1e1e1e;"></div>
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_right||'SÉRIE')}</span>
    </div>
    <div style="display:flex;gap:52px;align-items:flex-start;margin-bottom:52px;border-top:1px solid #1a1a1a;padding-top:36px;">
      <div style="flex:0 0 160px;">
        <div style="${INT}font-size:14px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;margin-bottom:8px;">Seção</div>
        <div style="${PF}font-size:120px;color:#161616;line-height:1;letter-spacing:-.02em;">${esc(slide.section_number||'')}</div>
      </div>
      <div style="flex:1;padding-top:8px;">
        <div style="${PF}font-size:62px;line-height:1.1;font-weight:400;color:#fff;">${esc(slide.section_title)}</div>
      </div>
    </div>
    <div style="${INT}font-size:27px;color:#666;line-height:1.5;margin-bottom:32px;">${esc(slide.body)}</div>
    <div style="margin-bottom:24px;">${items}</div>
    <div style="${INT}font-size:27px;color:#3a3a3a;line-height:1.5;margin-bottom:auto;">${esc(slide.conclusion)}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
      <span style="${INT}font-size:22px;color:#252525;">${esc(S.brand.brand_logo||'⬥')} ${esc(S.brand.brand_name||'Marca')}</span>
      <span style="${INT}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${esc(S.brand.brand_name||'Marca')}</span>
    </div>
  </div>`;
},
```

- [ ] **Step 3: Verify** — switch a dark slide to B and C, confirm rendering is correct.

- [ ] **Step 4: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): dark layout variants B (número fundo) and C (2 colunas)"
```

---

## Task 5: Steps — add variant B

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS.steps

- [ ] **Step 1: Add steps B — Número Playfair grande por etapa** — add `b` key to `RENDERERS.steps`:

```js
b(slide) {
  const steps = (slide.steps || []).map(s =>
    `<div style="display:flex;align-items:baseline;gap:36px;margin-bottom:32px;">
      <span style="${PF}font-size:100px;color:#161616;line-height:1;flex-shrink:0;width:100px;">${esc(s.label.match(/\d+/)?.[0] || '')}</span>
      <div style="flex:1;">
        <div style="${INT}font-size:22px;font-weight:500;color:#aaa;letter-spacing:.06em;margin-bottom:6px;">${esc(s.label.replace(/^\d+[:,.]?\s*/,''))}</div>
        <div style="${INT}font-size:24px;color:#444;line-height:1.5;">${esc(s.text)}</div>
      </div>
    </div>`
  ).join('');
  return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
    <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_left||'CATEGORIA')}</span>
      <div style="flex:1;height:1px;background:#1e1e1e;"></div>
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_right||'SÉRIE')}</span>
    </div>
    ${slide.section_title ? `<div style="${INT}font-size:18px;letter-spacing:.2em;color:#2a2a2a;text-transform:uppercase;margin-bottom:48px;">${esc(slide.section_title)}</div>` : ''}
    <div style="flex:1;">${steps}</div>
    <div style="${PF}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:auto;padding-top:24px;">
      ${esc(slide.call_to_action)}<em> ${esc(slide.call_to_action_italic)}</em>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
      <span style="${INT}font-size:22px;color:#252525;">${esc(S.brand.brand_logo||'⬥')} ${esc(S.brand.brand_name||'Marca')}</span>
      <span style="${INT}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${esc(S.brand.brand_name||'Marca')}</span>
    </div>
  </div>`;
},
```

- [ ] **Step 2: Verify** — switch a steps slide to layout B, confirm each step shows large Playfair number left + label + text right.

- [ ] **Step 3: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): steps layout B — número Playfair grande por etapa"
```

---

## Task 6: Steps — add variant C (grid com ícones)

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS.steps.c + Lucide script tag

Steps C renders each step card with an icon. Icon data lives in `step.icon`: `{ type: 'lucide', name: 'layers', svg: '<svg>...</svg>' }` or `{ type: 'upload', src: 'data:image/...' }`. If no icon, renders a placeholder circle.

- [ ] **Step 1: Load Lucide in main app** — add inside `<head>` before the closing `</head>` tag:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

- [ ] **Step 2: Add getLucideSVG helper** — add after the `esc()` function:

```js
function getLucideSVG(name, size = 48, color = '#333') {
  if (!window.lucide || !lucide.icons[name]) return null;
  const [, attrs, children] = lucide.icons[name];
  const childSVG = children.map(([tag, a]) => {
    const attrStr = Object.entries(a).map(([k,v]) => `${k}="${v}"`).join(' ');
    return `<${tag} ${attrStr}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${childSVG}</svg>`;
}
```

- [ ] **Step 3: Add steps C renderer** — add `c` key to `RENDERERS.steps`:

```js
c(slide) {
  const steps = slide.steps || [];
  const cards = steps.slice(0, 4).map(s => {
    let iconHTML = `<div style="width:48px;height:48px;border-radius:50%;border:1px solid #1e1e1e;margin-bottom:20px;"></div>`;
    if (s.icon) {
      if (s.icon.type === 'lucide' && s.icon.svg) {
        iconHTML = `<div style="margin-bottom:20px;">${s.icon.svg}</div>`;
      } else if (s.icon.type === 'upload' && s.icon.src) {
        iconHTML = `<img src="${esc(s.icon.src)}" style="width:48px;height:48px;object-fit:contain;margin-bottom:20px;">`;
      }
    }
    return `<div style="background:#0d0d0d;border-radius:12px;padding:40px 36px;display:flex;flex-direction:column;">
      ${iconHTML}
      <div style="${INT}font-size:20px;color:#888;font-weight:500;letter-spacing:.04em;margin-bottom:12px;">${esc(s.label.replace(/^\d+[:,.]?\s*/,''))}</div>
      <div style="${INT}font-size:22px;color:#3a3a3a;line-height:1.5;">${esc(s.text)}</div>
    </div>`;
  }).join('');
  return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
    <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_left||'CATEGORIA')}</span>
      <div style="flex:1;height:1px;background:#1e1e1e;"></div>
      <span style="${INT}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${esc(S.brand.nav_right||'SÉRIE')}</span>
    </div>
    <div style="${PF}font-size:52px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:40px;">${esc(slide.section_title||'')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;">${cards}</div>
    <div style="${PF}font-size:48px;font-weight:400;color:#fff;line-height:1.1;padding-top:32px;">
      ${esc(slide.call_to_action)}<em> ${esc(slide.call_to_action_italic)}</em>
    </div>
  </div>`;
},
```

- [ ] **Step 4: Verify** — switch a steps slide to layout C, confirm 2×2 grid renders with placeholder circles for icons.

- [ ] **Step 5: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): steps layout C — grid 2x2 with icon support"
```

---

## Task 7: Icon picker in edit panel (Steps C)

**Files:**
- Modify: `carousel-builder/app/index.html` — renderPanel, CSS

When `template === 'steps'` and `layout === 'c'`, each step in the edit panel gets an icon control below its label/text fields.

- [ ] **Step 1: Add icon picker CSS** — add inside `<style>` after `.refine-input-wrap.open { display: flex; }`:

```css
.icon-picker { display: flex; flex-direction: column; gap: 6px; }
.icon-search-wrap { display: flex; gap: 6px; align-items: center; }
.icon-search-input { flex: 1; }
.icon-grid { display: flex; flex-wrap: wrap; gap: 4px; max-height: 80px; overflow-y: auto; }
.icon-btn { width: 28px; height: 28px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; }
.icon-btn:hover { border-color: #555; }
.icon-btn.selected { border-color: #fff; }
.icon-btn svg { width: 14px; height: 14px; }
.icon-current { display: flex; align-items: center; gap: 8px; }
.icon-current svg, .icon-current img { width: 18px; height: 18px; }
```

- [ ] **Step 2: Add icon picker functions** — add after the `getLucideSVG` function:

```js
function searchLucideIcons(query) {
  if (!window.lucide) return [];
  return Object.keys(lucide.icons)
    .filter(n => n.includes(query.toLowerCase().replace(/\s+/g, '-')))
    .slice(0, 30);
}

function setStepIcon(stepIdx, iconData) {
  const slide = S.slides[S.active];
  if (!slide || !slide.steps) return;
  if (!slide.steps[stepIdx]) return;
  slide.steps[stepIdx].icon = iconData;
  refreshThumb(S.active);
  renderPreview();
  renderPanel();
  scheduleSave();
}

function renderIconPicker(stepIdx, currentIcon) {
  const svg = currentIcon?.type === 'lucide' && currentIcon.svg
    ? currentIcon.svg : null;
  const uploadSrc = currentIcon?.type === 'upload' ? currentIcon.src : null;
  const previewHTML = svg
    ? svg
    : uploadSrc
      ? `<img src="${uploadSrc}" style="width:18px;height:18px;object-fit:contain;">`
      : `<div style="width:18px;height:18px;border:1px dashed #333;border-radius:3px;"></div>`;

  return `<div class="icon-picker" id="icon-picker-${stepIdx}">
    <div class="field-label">Ícone</div>
    <div class="icon-current">${previewHTML}<span style="font-size:11px;color:#555;">${currentIcon?.name || 'nenhum'}</span></div>
    <div class="icon-search-wrap">
      <input class="field-input icon-search-input" placeholder="buscar ícone…" oninput="renderIconGrid(${stepIdx}, this.value)">
    </div>
    <div id="icon-grid-${stepIdx}" class="icon-grid"></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span class="field-label" style="margin:0;">ou upload</span>
      <input type="file" accept="image/png,image/svg+xml" style="font-size:11px;color:#666;flex:1;"
        onchange="handleIconUpload(${stepIdx}, this)">
    </div>
  </div>`;
}

function renderIconGrid(stepIdx, query) {
  const grid = document.getElementById('icon-grid-' + stepIdx);
  if (!grid || !query) { if (grid) grid.innerHTML = ''; return; }
  const names = searchLucideIcons(query);
  const slide = S.slides[S.active];
  const current = slide?.steps?.[stepIdx]?.icon?.name;
  grid.innerHTML = names.map(name => {
    const svg = getLucideSVG(name, 14, '#888');
    if (!svg) return '';
    return `<button class="icon-btn${name === current ? ' selected' : ''}" title="${name}"
      onclick="pickLucideIcon(${stepIdx},'${name}')">${svg}</button>`;
  }).join('');
}

function pickLucideIcon(stepIdx, name) {
  const svg = getLucideSVG(name, 48, '#333');
  if (!svg) return;
  setStepIcon(stepIdx, { type: 'lucide', name, svg });
}

function handleIconUpload(stepIdx, input) {
  const file = input.files[0];
  if (!file) return;
  if (!['image/png', 'image/svg+xml'].includes(file.type)) return;
  const reader = new FileReader();
  reader.onload = e => {
    let src = e.target.result;
    // Strip script tags from SVG for safety
    if (file.type === 'image/svg+xml') {
      src = 'data:image/svg+xml;base64,' + btoa(
        atob(src.split(',')[1]).replace(/<script[\s\S]*?<\/script>/gi, '')
      );
    }
    setStepIcon(stepIdx, { type: 'upload', src });
  };
  reader.readAsDataURL(file);
}
```

- [ ] **Step 3: Inject icon picker into edit panel for Steps C** — inside `renderPanel`, find where steps fields are rendered. After the step rows loop add a condition to inject the icon picker. Locate the section that renders step fields (inside the `steps` template case) and add after each step's label/text fields:

```js
// After the existing step fields for each step index `i`:
if (slide.layout === 'c') {
  fieldsHTML += renderIconPicker(i, (slide.steps[i] || {}).icon);
}
```

Find the existing steps rendering in `renderPanel` — it renders `fText` calls for each step's label and text. Add the icon picker call immediately after those fields for each step when layout is `c`.

- [ ] **Step 4: Verify** — switch a steps slide to layout C, open a step in the edit panel, confirm: search input appears, typing shows Lucide icon grid, clicking an icon updates the slide preview, upload input accepts PNG/SVG.

- [ ] **Step 5: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): icon picker for steps layout C — Lucide search + PNG/SVG upload"
```

---

## Task 8: Overlay — add variant B (full-bleed)

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS.overlay

- [ ] **Step 1: Add overlay B — Full-bleed** — add `b` key to `RENDERERS.overlay`:

```js
b(slide, img) {
  const photo = img
    ? `<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`
    : `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>`;
  const { brand_logo='⬥', brand_name='Marca', nav_left='CATEGORIA', nav_right='SÉRIE' } = S.brand;
  return `<div style="width:1080px;height:1350px;background:#000;position:relative;overflow:hidden;">
    ${photo}
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.75) 40%,rgba(0,0,0,.2) 70%,transparent 100%);"></div>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
      <div style="display:flex;align-items:center;gap:22px;">
        <span style="${INT}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${esc(nav_left)}</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,.06);"></div>
        <span style="${INT}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${esc(nav_right)}</span>
      </div>
      <div style="flex:1;"></div>
      <div style="${INT}font-size:18px;letter-spacing:.18em;color:#3a3a3a;text-transform:uppercase;margin-bottom:20px;">${esc(slide.section_number)} — ${esc(slide.section_title)}</div>
      <div style="${PF}font-size:72px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
        ${esc(slide.headline)}<em> ${esc(slide.headline_italic||'')}</em>
      </div>
      <div style="${INT}font-size:27px;color:#666;line-height:1.5;margin-bottom:36px;">${esc(slide.body)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="${INT}font-size:22px;color:#1e1e1e;">${esc(brand_logo)} ${esc(brand_name)}</span>
        <span style="${INT}font-size:22px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${esc(brand_name)}</span>
      </div>
    </div>
  </div>`;
},
```

- [ ] **Step 2: Verify** — switch an overlay slide to layout B, confirm photo fills slide with heavy bottom gradient and text anchored at bottom.

- [ ] **Step 3: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): overlay layout B — full-bleed photo with bottom gradient"
```

---

## Task 9: CTA — fix padding on A, add variant C

**Files:**
- Modify: `carousel-builder/app/index.html` — RENDERERS.cta

- [ ] **Step 1: Fix CTA A bottom padding** — inside `RENDERERS.cta.a`, find `padding:54px 76px 60px` and change to `padding:54px 76px 80px`.

- [ ] **Step 2: Add CTA C — Centralizado com pill** — add `c` key to `RENDERERS.cta`:

```js
c(slide) {
  const { brand_logo='⬥', brand_name='Marca' } = S.brand;
  return `<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 96px;text-align:center;">
    <div style="${INT}font-size:22px;color:#252525;letter-spacing:.18em;margin-bottom:60px;">${esc(brand_logo)} ${esc(brand_name)}</div>
    <div style="${PF}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:36px;">
      ${esc(slide.headline)}<em> ${esc(slide.headline_italic)}</em>
    </div>
    <div style="width:80px;height:1px;background:#1c1c1c;margin-bottom:36px;"></div>
    <div style="${INT}font-size:27px;color:#3a3a3a;line-height:1.6;margin-bottom:60px;">${esc(slide.body)}</div>
    <div style="border:1px solid #2a2a2a;border-radius:9999px;padding:24px 60px;display:inline-block;">
      <div style="${INT}font-size:30px;color:#555;letter-spacing:.04em;line-height:1.4;">
        ${esc(slide.cta_text)} <span style="color:#fff;font-weight:500;">${esc(slide.cta_word)}</span> ${esc(slide.cta_suffix)}
      </div>
    </div>
  </div>`;
},
```

- [ ] **Step 3: Verify** — switch a CTA slide to layout C, confirm centered layout with pill.

- [ ] **Step 4: Commit**

```bash
git add carousel-builder/app/index.html
git commit -m "feat(carousel): CTA layout A (padding fix) and C (centrado com pill)"
```

---

## Task 10: Update AI prompt to emit layout field

**Files:**
- Modify: `carousel-builder/server/mcp-server.js` — generateCarousel prompt

- [ ] **Step 1: Update generateCarousel prompt** — find the `Retorne SOMENTE o JSON: { "slides": [...] }` line in `generateCarousel` and replace the entire return instruction with:

```js
`Retorne SOMENTE o JSON: { "slides": [...] }

Cada slide DEVE incluir o campo "layout" com valor "a" (padrão).
Exemplo de slide:
{ "template": "dark", "layout": "a", "section_number": "01", "section_title": "...", ... }`
```

- [ ] **Step 2: Restart bridge and verify** — kill the running bridge and restart:

```bash
kill $(lsof -ti:37776) 2>/dev/null
nohup node /Users/paulojalowyj/.claude/plugins/marketplaces/orionlabz/carousel-builder/server/mcp-server.js > /tmp/carousel-bridge.log 2>&1 &
```

Generate a new carousel, open browser console, confirm each slide in `S.slides` has `layout: "a"`.

- [ ] **Step 3: Commit**

```bash
git add carousel-builder/server/mcp-server.js
git commit -m "feat(carousel): AI generation includes layout field defaulting to 'a'"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Cover A/B/C — Tasks 3
- ✅ Dark A/B/C — Task 4 (A already existed as task 1)
- ✅ Steps A/B/C — Tasks 5, 6, 7
- ✅ Overlay A/B — Task 8 (A already existed)
- ✅ Split A — unchanged, Task 1 wraps it
- ✅ CTA A/C — Task 9
- ✅ Layout pills UI — Task 2
- ✅ Icon picker (Lucide + upload) — Task 7
- ✅ AI prompt update — Task 10
- ✅ Backwards compatibility (layout defaults to `a`) — getRenderer in Task 1
- ✅ SVG upload script-tag stripping — Task 7 step 2

**Type consistency:**
- `getRenderer(slide)` defined Task 1, used in `slideDoc` Task 1 — ✅
- `LAYOUT_NAMES` defined Task 2, used in `renderPreview` Task 2 — ✅
- `changeLayout(layout)` defined Task 2, referenced in pills HTML Task 2 — ✅
- `getLucideSVG(name, size, color)` defined Task 6, used in `renderIconPicker` and `pickLucideIcon` Task 7 — ✅
- `setStepIcon(stepIdx, iconData)` defined Task 7, called from `pickLucideIcon` and `handleIconUpload` Task 7 — ✅
- `step.icon` shape `{ type, name?, svg?, src? }` consistent across Task 6 renderer and Task 7 picker — ✅
