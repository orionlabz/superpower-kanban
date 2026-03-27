import { api } from '../api.js';
import { navigate } from '../router.js';

export function mountHome() {
  document.getElementById('app').innerHTML = `
    <div class="screen-home">
      <header class="app-header">
        <span class="app-logo">Carousel Builder</span>
        <button class="btn-icon" id="btn-themes" title="Temas">⚙</button>
      </header>
      <main class="home-main">
        <div class="home-top">
          <h1 class="home-title">Projetos</h1>
          <button class="btn-primary" id="btn-new-project">+ Novo projeto</button>
        </div>
        <div id="projects-grid" class="projects-grid">
          <div class="loading-inline">Carregando…</div>
        </div>
      </main>
    </div>`;

  document.getElementById('btn-new-project').onclick = createProject;
  document.getElementById('btn-themes').onclick = () => navigate('theme-editor');
  loadProjects();
}

async function loadProjects() {
  const projects = await api.projects.list();
  const grid = document.getElementById('projects-grid');
  if (!projects.length) {
    grid.innerHTML = `<div class="empty-state">Nenhum projeto ainda.<br>Crie seu primeiro projeto para começar.</div>`;
    return;
  }
  grid.innerHTML = projects.map(p => `
    <div class="project-card" data-id="${p.id}">
      <div class="project-card-body">
        <div class="project-name">${escHtml(p.name)}</div>
        <div class="project-meta">${p.carousel_count} carrossel${p.carousel_count !== 1 ? 's' : ''}</div>
      </div>
      <div class="project-card-footer">
        <button class="btn-text btn-open-project" data-id="${p.id}">Abrir →</button>
        <button class="btn-icon btn-delete-project" data-id="${p.id}" title="Excluir">✕</button>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.btn-open-project').forEach(btn =>
    btn.onclick = () => navigate('project', { projectId: Number(btn.dataset.id) }));
  grid.querySelectorAll('.btn-delete-project').forEach(btn =>
    btn.onclick = () => deleteProject(Number(btn.dataset.id)));
}

async function createProject() {
  const name = prompt('Nome do projeto:');
  if (!name?.trim()) return;
  await api.projects.create(name.trim());
  loadProjects();
}

async function deleteProject(id) {
  if (!confirm('Excluir projeto e todos os carrosséis?')) return;
  await api.projects.delete(id);
  loadProjects();
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

export function unmountHome() {}
