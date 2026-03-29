import { api } from '../api.js';
import { navigate } from '../router.js';

export function mountHome() {
  document.getElementById('app').innerHTML = `
    <div class="screen-home">
      <header class="app-header">
        <span class="app-logo">Carousel Builder</span>
        <button class="btn-icon" id="btn-themes" title="Temas"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0"/><path d="M4.93 19.07a10 10 0 0 0 14.14 0"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg></button>
      </header>
      <main class="home-main">
        <div class="home-top">
          <h1 class="home-title">Projetos</h1>
          <button class="btn-primary" id="btn-new-project">+ Novo projeto</button>
        </div>
        <div id="projects-grid" class="projects-grid">
          <div class="loading-inline">Carregando</div>
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
        <button class="btn-text btn-open-project" data-id="${p.id}">Abrir</button>
        <button class="btn-icon btn-delete-project" data-id="${p.id}" title="Excluir"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
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
