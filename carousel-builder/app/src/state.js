// Global app state
export const S = {
  // Navigation
  screen: 'home',           // 'home' | 'project' | 'editor' | 'theme-editor'
  projectId: null,
  carouselId: null,
  context: null,            // 'project' when navigating to theme-editor from project screen

  // Loaded data
  project: null,
  carousel: null,
  theme: null,

  // Editor state
  slides: [],
  images: {},
  active: 0,
  slideCount: 8,
  brief: null,

  // UI flags
  bridgeAvailable: false,
};

let saveTimer = null;

export function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => persistCarousel(), 1000);
}

async function persistCarousel() {
  if (!S.carouselId) return;
  const { api } = await import('./api.js');
  await api.carousels.update(S.carouselId, {
    slides: S.slides,
    images: S.images,
  }).catch(console.error);
  const el = document.getElementById('save-indicator');
  if (el) {
    el.classList.add('on');
    clearTimeout(el._saveTimer);
    el._saveTimer = setTimeout(() => el.classList.remove('on'), 2000);
  }
}
