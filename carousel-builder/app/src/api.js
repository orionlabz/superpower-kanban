const BASE = '';  // same origin when served by bridge; proxy in dev

async function req(method, path, body) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const r = await fetch(BASE + path, opts);
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || `HTTP ${r.status}`);
  }
  return r.json();
}

export const api = {
  // AI
  generate: (brief) => req('POST', '/generate', brief),
  refine: (slide, instruction) => req('POST', '/refine', { slide, instruction }),
  brainstorm: (niche, count) => req('POST', '/brainstorm', { niche, count }),

  // Themes
  themes: {
    list: () => req('GET', '/themes'),
    global: () => req('GET', '/themes/global'),
    get: (id) => req('GET', `/themes/${id}`),
    create: (data) => req('POST', '/themes', data),
    update: (id, data) => req('PATCH', `/themes/${id}`, data),
    delete: (id) => req('DELETE', `/themes/${id}`),
    setGlobal: (id) => req('POST', '/themes/global', { id }),
  },

  // Projects
  projects: {
    list: () => req('GET', '/projects'),
    get: (id) => req('GET', `/projects/${id}`),
    create: (name) => req('POST', '/projects', { name }),
    update: (id, data) => req('PATCH', `/projects/${id}`, data),
    delete: (id) => req('DELETE', `/projects/${id}`),
    theme: (id) => req('GET', `/projects/${id}/theme`),
  },

  // Carousels
  carousels: {
    list: (projectId) => req('GET', `/projects/${projectId}/carousels`),
    get: (id) => req('GET', `/carousels/${id}`),
    create: (projectId, title) => req('POST', `/projects/${projectId}/carousels`, { title }),
    update: (id, data) => req('PATCH', `/carousels/${id}`, data),
    delete: (id) => req('DELETE', `/carousels/${id}`),
  },

  // Uploads
  uploadBrand: async (file) => {
    const r = await fetch('/upload/brand', {
      method: 'POST',
      headers: { 'Content-Type': file.type, 'X-Filename': file.name },
      body: file,
    });
    if (!r.ok) throw new Error('Upload failed');
    return r.json();
  },
};

export async function checkBridge() {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch('/ping', { signal: ctrl.signal });
    return r.ok;
  } catch { return false; }
}
