// === State ===
let ws = null;
let reconnectDelay = 1000;
const MAX_RECONNECT = 30000;
let allColumns = { backlog: [], todo: [], in_progress: [], done: [] };
let currentSessionId = null;
let activeComponents = new Set();
let sessionFilter = false;
let currentView = localStorage.getItem('task-viewer-view') || 'kanban';
let selectedTask = null;

// === DOM ===
const $ = id => document.getElementById(id);

// === Helpers ===
function esc(str) {
  if (!str) return '';
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function shortSession(id) {
  return id ? id.slice(0, 8) + '…' : '—';
}

// === WebSocket ===
function connect() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${location.host}`);

  ws.onopen = () => {
    reconnectDelay = 1000;
    $('connection-banner').classList.add('hidden');
    $('status-dot').className = 'status-dot online';
  };

  ws.onclose = () => {
    $('status-dot').className = 'status-dot';
    $('connection-banner').classList.remove('hidden');
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT);
  };

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'kanban:update') handleKanbanUpdate(msg.data.columns);
    if (msg.type === 'session:change') handleSessionChange(msg.data);
  };
}

// === Handlers ===
function handleSessionChange({ sessionId }) {
  currentSessionId = sessionId;
  $('session-id').textContent = 'Session: ' + shortSession(sessionId);
}

function handleKanbanUpdate(columns) {
  allColumns = columns;
  updateComponentFilters(columns);
  renderBoard();
}

// === Filters ===
function updateComponentFilters(columns) {
  const allTasks = [...(columns.backlog||[]), ...(columns.todo||[]), ...(columns.in_progress||[]), ...(columns.done||[])];
  const components = [...new Set(allTasks.map(t => t.component).filter(Boolean))].sort();

  const container = $('component-filters');
  const existing = new Set([...container.querySelectorAll('.component-chip')].map(c => c.dataset.comp));
  const updated = new Set(components);

  // Add new chips
  for (const comp of components) {
    if (!existing.has(comp)) {
      const chip = document.createElement('button');
      chip.className = 'component-chip' + (activeComponents.has(comp) ? ' active' : '');
      chip.dataset.comp = comp;
      chip.textContent = comp;
      chip.addEventListener('click', () => toggleComponent(comp, chip));
      container.appendChild(chip);
    }
  }
  // Remove stale chips
  for (const chip of container.querySelectorAll('.component-chip')) {
    if (!updated.has(chip.dataset.comp)) chip.remove();
  }
}

function toggleComponent(comp, chipEl) {
  if (activeComponents.has(comp)) {
    activeComponents.delete(comp);
    chipEl.classList.remove('active');
  } else {
    activeComponents.add(comp);
    chipEl.classList.add('active');
  }
  renderBoard();
}

function filterTasks(tasks) {
  let result = tasks;
  if (sessionFilter && currentSessionId) {
    result = result.filter(t => t.sessionId === currentSessionId);
  }
  if (activeComponents.size > 0) {
    result = result.filter(t => activeComponents.has(t.component));
  }
  return result;
}

// === Board Rendering ===
function renderBoard() {
  if (currentView === 'list') {
    renderListView();
  } else {
    const cols = ['backlog', 'todo', 'in_progress', 'done'];
    for (const col of cols) {
      const tasks = filterTasks(allColumns[col] || []);
      $('count-' + col).textContent = tasks.length;
      renderColumn(col, tasks);
    }
  }
}

function renderColumn(col, tasks) {
  const body = $('cards-' + col);
  body.innerHTML = '';
  if (tasks.length === 0) {
    body.innerHTML = '<div class="empty-state">No tasks here</div>';
    return;
  }
  for (const task of tasks) {
    body.appendChild(createCard(task));
  }
}

const LIST_COLS = [
  { id: 'backlog',     label: 'Backlog',      startCollapsed: false },
  { id: 'todo',        label: 'Todo',         startCollapsed: false },
  { id: 'in_progress', label: 'In Progress',  startCollapsed: false },
  { id: 'done',        label: 'Done',         startCollapsed: true  },
];

function renderListView() {
  const container = $('list-view');
  container.innerHTML = '';

  for (const { id, label, startCollapsed } of LIST_COLS) {
    const tasks = filterTasks(allColumns[id] || []);
    const section = document.createElement('div');
    section.className = 'list-section' + (startCollapsed ? ' collapsed' : '');
    section.dataset.col = id;

    const header = document.createElement('div');
    header.className = 'list-section-header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.innerHTML = `
      <span>${esc(label)}</span>
      <span class="list-section-count">${tasks.length}</span>
      <span class="list-section-chevron">▶</span>
    `;
    header.addEventListener('click', () => {
      const collapsed = section.classList.toggle('collapsed');
      rows.classList.toggle('hidden', collapsed);
    });

    const rows = document.createElement('div');
    rows.className = 'list-rows' + (startCollapsed ? ' hidden' : '');

    for (const task of tasks) {
      const row = document.createElement('div');
      row.className = 'list-row' + (selectedTask?.id === task.id && selectedTask?.sessionId === task.sessionId ? ' selected' : '');
      const priorityHtml = task.priority
        ? `<span class="list-row-priority priority-${esc(task.priority)}">${esc(task.priority)}</span>`
        : '';
      row.innerHTML = `
        <span class="list-row-title">${esc(task.subject)}</span>
        ${task.component ? `<span class="list-row-comp">${esc(task.component)}</span>` : ''}
        ${priorityHtml}
      `;
      row.addEventListener('click', () => selectTask(task));
      rows.appendChild(row);
    }

    if (tasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'list-row';
      empty.style.cssText = 'color:var(--text3);font-size:11px;font-style:italic;cursor:default';
      empty.textContent = 'Sem tasks';
      rows.appendChild(empty);
    }

    section.appendChild(header);
    section.appendChild(rows);
    container.appendChild(section);
  }
}

function createCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';

  const priorityClass = task.priority ? 'priority-' + task.priority : '';
  const priorityHtml = task.priority
    ? `<span class="priority-badge ${priorityClass}">${esc(task.priority)}</span>`
    : '';
  const componentHtml = task.component
    ? `<span class="component-tag">${esc(task.component)}</span>`
    : '';
  const effortHtml = task.effort
    ? `<span class="effort-chip">${esc(task.effort)}</span>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-subject">${esc(task.subject)}</span>
      <span class="card-id">#${esc(task.id)}</span>
    </div>
    ${(task.priority || task.component || task.effort) ? `<div class="card-meta">${priorityHtml}${componentHtml}${effortHtml}</div>` : ''}
    <div class="card-detail hidden">
      ${task.description ? `<div class="detail-field"><span class="detail-label">Description</span><span class="detail-value">${esc(task.description)}</span></div>` : ''}
      ${task.activeForm ? `<div class="detail-field"><span class="detail-label">Active</span><span class="active-form">${esc(task.activeForm)}</span></div>` : ''}
      ${task.metadata?.feature ? `<div class="detail-field"><span class="detail-label">Feature</span><span class="detail-value">${esc(task.metadata.feature)}</span></div>` : ''}
      ${task.tags?.length ? `<div class="detail-field"><span class="detail-label">Tags</span><span class="detail-value">${task.tags.map(t => esc(t)).join(', ')}</span></div>` : ''}
      <div class="detail-field"><span class="detail-label">Session</span><span class="detail-value" style="font-family:monospace;font-size:11px">${esc(shortSession(task.sessionId))}</span></div>
      <div class="detail-field"><span class="detail-label">Updated</span><span class="detail-value">${task.updatedAt ? new Date(task.updatedAt + ' UTC').toLocaleString() : '—'}</span></div>
    </div>
  `;

  card.addEventListener('click', () => {
    const detail = card.querySelector('.card-detail');
    const expanded = !detail.classList.contains('hidden');
    detail.classList.toggle('hidden', expanded);
    card.classList.toggle('expanded', !expanded);
  });

  return card;
}

// === Init ===
async function loadInitialState() {
  try {
    // Load project info
    const health = await fetch('/api/health').then(r => r.json());
    const name = health.projectCwd ? health.projectCwd.split('/').pop() : '—';
    $('project-name').textContent = name;

    // Load kanban data
    const columns = await fetch('/api/kanban').then(r => r.json());
    handleKanbanUpdate(columns);
  } catch { /* server may not be ready yet */ }
}

// === Done column collapse ===
function initDoneCollapse() {
  const header = $('done-header');
  const body = $('cards-done');
  const col = $('col-done');

  header.addEventListener('click', () => {
    const isCollapsed = col.classList.contains('collapsed');
    col.classList.toggle('collapsed', !isCollapsed);
    body.classList.toggle('hidden', !isCollapsed);
    header.setAttribute('aria-expanded', String(isCollapsed));
  });

  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
  });
}

// === View Toggle ===
function initViewToggle() {
  const kanbanBtn = $('view-kanban');
  const listBtn   = $('view-list');
  const board     = $('board');
  const listView  = $('list-view');

  function applyView(view) {
    currentView = view;
    localStorage.setItem('task-viewer-view', view);
    kanbanBtn.classList.toggle('active', view === 'kanban');
    listBtn.classList.toggle('active', view === 'list');
    kanbanBtn.setAttribute('aria-pressed', String(view === 'kanban'));
    listBtn.setAttribute('aria-pressed', String(view === 'list'));
    board.classList.toggle('hidden', view === 'list');
    listView.classList.toggle('hidden', view === 'kanban');
    renderBoard();
  }

  kanbanBtn.addEventListener('click', () => applyView('kanban'));
  listBtn.addEventListener('click', () => applyView('list'));

  // Apply saved view on init
  applyView(currentView);
}

// === Theme ===
function updateThemeIcon() {
  const btn = $('theme-toggle');
  if (btn) btn.textContent = document.body.classList.contains('light') ? '☽' : '☀';
}
function initTheme() {
  const saved = localStorage.getItem('task-viewer-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (saved === 'light' || (!saved && prefersLight)) document.body.classList.add('light');
  updateThemeIcon();
  $('current-session-only').addEventListener('change', e => {
    sessionFilter = e.target.checked;
    renderBoard();
  });
  $('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('task-viewer-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
  });
}

// === Boot ===
initTheme();
initDoneCollapse();
initViewToggle();
connect();
loadInitialState();
