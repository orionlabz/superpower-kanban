import { S } from '../state.js';
import { api } from '../api.js';
import { navigate } from '../router.js';

export function mountProject() {
  document.getElementById('app').innerHTML = `
    <div class="screen-project">
      <header class="app-header">
        <button class="btn-text" id="btn-back">← Projetos</button>
        <span id="project-name-header" class="project-header-name"></span>
        <button class="btn-text" id="btn-project-settings">Tema ▾</button>
      </header>
      <main class="project-main">
        <div class="project-top">
          <h2 id="project-title" class="home-title"></h2>
          <button class="btn-primary" id="btn-new-carousel">+ Novo carrossel</button>
        </div>
        <div id="carousels-grid" class="projects-grid">
          <div class="loading-inline">Carregando…</div>
        </div>
      </main>
    </div>`;

  document.getElementById('project-title').textContent = S.project?.name || '';
  document.getElementById('project-name-header').textContent = S.project?.name || '';
  document.getElementById('btn-back').onclick = () => navigate('home');
  document.getElementById('btn-new-carousel').onclick = newCarousel;
  document.getElementById('btn-project-settings').onclick = () => navigate('theme-editor', { context: 'project' });

  loadCarousels();
}

async function loadCarousels() {
  const carousels = await api.carousels.list(S.projectId);
  const grid = document.getElementById('carousels-grid');
  if (!carousels.length) {
    grid.innerHTML = `<div class="empty-state">Nenhum carrossel ainda. Crie o primeiro!</div>`;
    return;
  }
  grid.innerHTML = carousels.map(c => `
    <div class="project-card" data-id="${c.id}">
      <div class="project-card-body">
        ${c.thumbnail_path ? `<img src="${c.thumbnail_path}" class="carousel-thumb" alt="">` : '<div class="carousel-thumb-placeholder"></div>'}
        <div class="project-name" style="margin-top:12px;">${escHtml(c.title)}</div>
        <div class="project-meta">${formatDate(c.updated_at)}</div>
      </div>
      <div class="project-card-footer">
        <button class="btn-text btn-open-carousel" data-id="${c.id}">Editar →</button>
        <button class="btn-icon btn-delete-carousel" data-id="${c.id}" title="Excluir">✕</button>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.btn-open-carousel').forEach(btn =>
    btn.onclick = () => navigate('editor', { projectId: S.projectId, carouselId: Number(btn.dataset.id) }));
  grid.querySelectorAll('.btn-delete-carousel').forEach(btn =>
    btn.onclick = () => deleteCarousel(Number(btn.dataset.id)));
}

async function newCarousel() {
  const { showNewCarouselModal } = await import('./editor.js');
  showNewCarouselModal();
}

async function deleteCarousel(id) {
  if (!confirm('Excluir este carrossel?')) return;
  await api.carousels.delete(id);
  loadCarousels();
}

function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function formatDate(iso) { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); }

export function unmountProject() {}
