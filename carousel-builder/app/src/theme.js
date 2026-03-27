// Build the <style> block injected into every slide srcdoc
export function themeStyleBlock(theme) {
  if (!theme) theme = defaultTheme();
  const displayFont = theme.font_display || 'Playfair Display';
  const bodyFont = theme.font_body || 'Inter';
  const fontUrl = buildGoogleFontsUrl(displayFont, bodyFont);

  return `<style>
@import url('${fontUrl}');
:root {
  --t-bg: ${theme.color_bg || '#000'};
  --t-text: ${theme.color_text || '#e8e8e8'};
  --t-emphasis: ${theme.color_emphasis || '#CCFF00'};
  --t-secondary: ${theme.color_secondary || '#666'};
  --t-detail: ${theme.color_detail || '#2a2a2a'};
  --t-border: ${theme.color_border || '#1e1e1e'};
  --t-font-display: '${displayFont}';
  --t-font-body: '${bodyFont}';
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--t-bg); }
em { font-style: italic; }
strong { font-weight: 700; }
.accent { color: var(--t-emphasis); }
</style>`;
}

export function buildGoogleFontsUrl(display, body) {
  const families = [];
  const toParam = (f) => f.replace(/ /g, '+');
  if (display) families.push(`family=${toParam(display)}:ital,wght@0,400;0,500;1,400;1,500`);
  if (body && body !== display) families.push(`family=${toParam(body)}:wght@300;400;500;600`);
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export function defaultTheme() {
  return {
    font_display: 'Playfair Display',
    font_body: 'Inter',
    color_bg: '#000000',
    color_text: '#e8e8e8',
    color_emphasis: '#CCFF00',
    color_secondary: '#666666',
    color_detail: '#2a2a2a',
    color_border: '#1e1e1e',
    brand_name: 'Marca',
    brand_symbol: '⬥',
    nav_left: 'CATEGORIA',
    nav_right: 'SÉRIE',
  };
}

// Resolve brand logo: returns <img> tag or symbol text
export function brandLogoHTML(theme, variant = 'dark') {
  const path = variant === 'light' ? theme?.brand_logo_light : theme?.brand_logo_dark;
  if (path) return `<img src="${path}" style="height:22px;object-fit:contain;" alt="">`;
  return `${esc(theme?.brand_symbol || '⬥')} ${esc(theme?.brand_name || 'Marca')}`;
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
