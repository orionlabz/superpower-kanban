/**
 * Mini rich-text editor component.
 *
 * Usage:
 *   const rt = createRichText({ value: '<em>hello</em>', onChange: (html) => ... });
 *   container.appendChild(rt.el);
 *   rt.setValue('<strong>new</strong>');
 *   rt.getValue(); // returns clean HTML
 *
 * Allowed tags: <em>, <strong>, <span class="accent">
 * Toolbar: B (bold), I (italic), A (accent color toggle)
 */
export function createRichText({ value = '', onChange, placeholder = '' } = {}) {
  const toolbar = document.createElement('div');
  toolbar.className = 'rt-toolbar';
  toolbar.innerHTML = `
    <button type="button" class="rt-btn" data-cmd="bold" title="Negrito (Ctrl+B)"><strong>B</strong></button>
    <button type="button" class="rt-btn" data-cmd="italic" title="Itálico (Ctrl+I)"><em>I</em></button>
    <button type="button" class="rt-btn rt-btn-accent" data-cmd="accent" title="Cor de destaque">A</button>`;

  const editor = document.createElement('div');
  editor.className = 'rt-editor field-input';
  editor.contentEditable = 'true';
  editor.setAttribute('data-placeholder', placeholder);
  editor.innerHTML = sanitize(value);

  const wrap = document.createElement('div');
  wrap.className = 'rt-wrap';
  wrap.appendChild(toolbar);
  wrap.appendChild(editor);

  function execCmd(cmd) {
    editor.focus();
    if (cmd === 'bold') document.execCommand('bold', false);
    else if (cmd === 'italic') document.execCommand('italic', false);
    else if (cmd === 'accent') toggleAccent();
    cleanAfterExec();
    onChange?.(getValue());
  }

  function toggleAccent() {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    // Check if already wrapped in .accent span
    const parent = sel.anchorNode?.parentElement;
    if (parent?.classList.contains('accent')) {
      // Unwrap
      const span = parent;
      const frag = document.createDocumentFragment();
      while (span.firstChild) frag.appendChild(span.firstChild);
      span.replaceWith(frag);
    } else {
      const span = document.createElement('span');
      span.className = 'accent';
      try { range.surroundContents(span); } catch { /* partial selection */ }
    }
  }

  // Replace browser bold/italic tags with semantic tags
  function cleanAfterExec() {
    editor.innerHTML = editor.innerHTML
      .replace(/<b>/gi, '<strong>').replace(/<\/b>/gi, '</strong>')
      .replace(/<i>/gi, '<em>').replace(/<\/i>/gi, '</em>');
  }

  function getValue() {
    return sanitize(editor.innerHTML);
  }

  function setValue(html) {
    editor.innerHTML = sanitize(html);
  }

  function sanitize(html) {
    // Only allow <em>, <strong>, <span class="accent">
    return (html || '')
      .replace(/<(?!\/?(?:em|strong|span)[^>]*>)[^>]+>/gi, '') // strip other tags
      .replace(/<span(?!\s+class="accent")[^>]*>/gi, '<span class="accent">'); // normalize spans
  }

  toolbar.addEventListener('mousedown', e => {
    const btn = e.target.closest('[data-cmd]');
    if (!btn) return;
    e.preventDefault(); // don't blur editor
    execCmd(btn.dataset.cmd);
  });

  editor.addEventListener('input', () => onChange?.(getValue()));

  editor.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); execCmd('bold'); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); execCmd('italic'); }
  });

  return { el: wrap, getValue, setValue };
}
