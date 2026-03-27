import { S } from './state.js';
import { api } from './api.js';

const screens = {};

export function registerScreen(name, { mount, unmount }) {
  screens[name] = { mount, unmount };
}

export async function navigate(screen, params = {}) {
  // Unmount current
  screens[S.screen]?.unmount?.();

  S.screen = screen;
  Object.assign(S, params);

  // Load context data
  if (screen === 'project' && params.projectId) {
    S.project = await api.projects.get(params.projectId);
    S.theme = await api.projects.theme(params.projectId);
  }
  if (screen === 'editor' && params.carouselId) {
    const carousel = await api.carousels.get(params.carouselId);
    S.carousel = carousel;
    S.carouselId = carousel.id;
    S.slides = JSON.parse(carousel.slides_json || '[]');
    S.images = JSON.parse(carousel.images_json || '{}');
    S.active = 0;
    if (!S.theme) S.theme = await api.projects.theme(carousel.project_id);
  }

  // Mount new screen
  screens[screen]?.mount?.();
}
