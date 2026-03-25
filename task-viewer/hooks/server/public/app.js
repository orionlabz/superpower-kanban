// === State ===
let ws = null;
let reconnectDelay = 1000;
const MAX_RECONNECT = 30000;
let currentSessionId = null;
let currentPlanTasks = []; // plan tasks mapped to kanban format
let currentClaudeTasks = []; // claude code tasks
let claudeMemByTask = {}; // taskId -> { observations, relatedContext, timeline }
let sessionClaudeMem = null; // session-level claude-mem data

// === DOM refs ===
const $ = (id) => document.getElementById(id);
const banner = $('connection-banner');
const statusDot = $('status-dot');
const sessionIdEl = $('session-id');
const kanbanEl = $('kanban');
const kanbanNoSession = $('kanban-no-session');
const kanbanNoTasks = $('kanban-no-tasks');
const specsSection = $('specs-section');
const specsList = $('specs-list');
const historyEmpty = $('history-empty');
const historyList = $('history-list');

// === WebSocket ===
function connect() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${location.host}`);

  ws.onopen = () => {
    reconnectDelay = 1000;
    banner.classList.add('hidden');
    statusDot.className = 'status-dot online';
  };

  ws.onclose = () => {
    statusDot.className = 'status-dot offline';
    banner.classList.remove('hidden');
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT);
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    switch (msg.type) {
      case 'tasks:update': handleTasks(msg.data); break;
      case 'specs:update': handleSpecs(msg.data); break;
      case 'session:change': handleSessionChange(msg.data); break;
      case 'claudemem:update': handleClaudeMemUpdate(msg.data); break;
      case 'heartbeat': break;
    }
  };
}

// === Task Handlers ===
function handleTasks({ tasks, sessionId }) {
  currentSessionId = sessionId;
  currentClaudeTasks = tasks || [];
  sessionIdEl.textContent = sessionId
    ? `Session: ${sessionId.slice(0, 8)}...`
    : 'No active session';
  refreshKanban();
}

function handleSessionChange({ sessionId }) {
  currentSessionId = sessionId;
  sessionIdEl.textContent = `Session: ${sessionId.slice(0, 8)}...`;
}

function handleClaudeMemUpdate({ sessionId, taskId, claudeMem }) {
  if (taskId) {
    claudeMemByTask[taskId] = { ...(claudeMemByTask[taskId] || {}), ...claudeMem };
    // Re-render if this task's card is currently expanded
    const expandedCard = document.querySelector('.task-card.expanded');
    if (expandedCard) {
      const cardId = expandedCard.querySelector('.task-id')?.textContent?.replace('#', '');
      if (cardId === String(taskId)) {
        refreshKanban();
      }
    }
  } else {
    // Session-level claude-mem update
    sessionClaudeMem = { ...(sessionClaudeMem || {}), ...claudeMem };
  }
}

function refreshKanban() {
  // Combine: claude tasks take priority, plan tasks fill the board
  const allTasks = [...currentClaudeTasks];

  // Add plan tasks mapped to kanban format (if any plans exist)
  for (const pt of currentPlanTasks) {
    // Don't duplicate if claude has a task with same subject
    const isDuplicate = allTasks.some(t =>
      t.subject && pt.subject && t.subject.toLowerCase().includes(pt.subject.toLowerCase().slice(0, 20))
    );
    if (!isDuplicate) allTasks.push(pt);
  }

  if (allTasks.length === 0) {
    kanbanNoSession.classList.add('hidden');
    kanbanNoTasks.classList.remove('hidden');
    kanbanEl.classList.add('hidden');
    return;
  }

  kanbanNoSession.classList.add('hidden');
  kanbanNoTasks.classList.add('hidden');
  kanbanEl.classList.remove('hidden');
  renderKanban(allTasks);
}

// === Kanban Renderer ===
function renderKanban(tasks) {
  const groups = { pending: [], in_progress: [], completed: [] };
  for (const task of tasks) {
    if (groups[task.status]) groups[task.status].push(task);
  }

  for (const [status, items] of Object.entries(groups)) {
    const col = $(`col-${status}`);
    const count = $(`count-${status}`);
    count.textContent = items.length;
    col.innerHTML = '';
    for (const task of items) {
      col.appendChild(createTaskCard(task, status));
    }
  }
}

function createTaskCard(task, status) {
  const card = document.createElement('div');
  card.className = `task-card ${status === 'in_progress' ? 'in-progress' : status}`;

  let html = `
    <div class="task-card-header">
      <span class="task-subject">${esc(task.subject)}</span>
      <span class="task-id">#${task.id}</span>
    </div>`;

  if (task.description) {
    html += `<div class="task-desc">${esc(task.description)}</div>`;
  }

  if (status === 'in_progress' && task.activeForm) {
    html += `<span class="task-active-form">${esc(task.activeForm)}</span>`;
  }

  const deps = [];
  if (task.blocks?.length) deps.push(`blocks: ${task.blocks.map(b => '#' + b).join(', ')}`);
  if (task.blockedBy?.length) deps.push(`blocked by: ${task.blockedBy.map(b => '#' + b).join(', ')}`);
  if (deps.length) {
    html += `<div class="task-deps">${deps.join(' | ')}</div>`;
  }

  // Detail panel (hidden by default)
  html += `<div class="task-detail hidden" data-detail>`;
  html += `<div class="task-detail-label">Status</div>`;
  html += `<div class="task-detail-value"><span class="task-detail-status ${task.status}">${task.status.replace('_', ' ')}</span></div>`;

  // Plan task: show steps as subtasks
  if (task._planTask && task._planTask.steps.length > 0) {
    const pt = task._planTask;
    const done = pt.steps.filter(s => s.done).length;
    html += `<div class="task-detail-label">Steps (${done}/${pt.steps.length})</div>`;
    html += `<div class="task-detail-steps">`;
    for (const step of pt.steps) {
      html += `<div class="plan-step">
        <span class="plan-step-check ${step.done ? 'done' : ''}">${step.done ? '\u2713' : ''}</span>
        <span>${esc(step.title)}</span>
      </div>`;
    }
    html += `</div>`;
  }

  if (task.description) {
    html += `<div class="task-detail-label">Description</div>`;
    html += `<div class="task-detail-value">${esc(task.description)}</div>`;
  }
  if (task.activeForm) {
    html += `<div class="task-detail-label">Active Form</div>`;
    html += `<div class="task-detail-value">${esc(task.activeForm)}</div>`;
  }
  if (task.blocks?.length) {
    html += `<div class="task-detail-label">Blocks</div>`;
    html += `<div class="task-detail-value">${task.blocks.map(b => '#' + b).join(', ')}</div>`;
  }
  if (task.blockedBy?.length) {
    html += `<div class="task-detail-label">Blocked By</div>`;
    html += `<div class="task-detail-value">${task.blockedBy.map(b => '#' + b).join(', ')}</div>`;
  }

  // claude-mem enrichment sections
  const cm = claudeMemByTask[task.id];
  if (cm) {
    if (cm.timeline?.length) {
      html += `<div class="cm-section">
        <div class="cm-section-header" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('hidden')">
          <span class="cm-icon">&#128340;</span> Timeline <span class="cm-count">${cm.timeline.length}</span>
        </div>
        <div class="cm-section-body hidden">
          ${cm.timeline.map(t => `<div class="cm-timeline-entry">
            <span class="cm-time">${esc(t.timestamp || '')}</span>
            <span>${esc(t.action || t.text || '')}</span>
          </div>`).join('')}
        </div>
      </div>`;
    }
    if (cm.observations?.length) {
      html += `<div class="cm-section">
        <div class="cm-section-header" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('hidden')">
          <span class="cm-icon">&#128161;</span> Observations <span class="cm-count">${cm.observations.length}</span>
        </div>
        <div class="cm-section-body hidden">
          ${cm.observations.map(o => `<div class="cm-observation">${esc(typeof o === 'string' ? o : o.text || '')}</div>`).join('')}
        </div>
      </div>`;
    }
    if (cm.relatedContext?.length) {
      html += `<div class="cm-section">
        <div class="cm-section-header" onclick="event.stopPropagation(); this.nextElementSibling.classList.toggle('hidden')">
          <span class="cm-icon">&#128279;</span> Related Context <span class="cm-count">${cm.relatedContext.length}</span>
        </div>
        <div class="cm-section-body hidden">
          ${cm.relatedContext.map(c => `<div class="cm-context">
            <span>${esc(typeof c === 'string' ? c : c.text || '')}</span>
            ${c.source ? `<span class="cm-source">${esc(c.source)}</span>` : ''}
          </div>`).join('')}
        </div>
      </div>`;
    }
  }

  html += `</div>`;

  card.innerHTML = html;

  // Click to expand/collapse
  card.addEventListener('click', () => {
    const detail = card.querySelector('[data-detail]');
    const isExpanded = card.classList.contains('expanded');
    // Collapse all other cards
    document.querySelectorAll('.task-card.expanded').forEach(c => {
      if (c !== card) {
        c.classList.remove('expanded');
        c.querySelector('[data-detail]')?.classList.add('hidden');
      }
    });
    card.classList.toggle('expanded', !isExpanded);
    detail.classList.toggle('hidden', isExpanded);
  });

  return card;
}

// === Specs & Plans Renderer ===
function handleSpecs({ linked }) {
  // Extract plan tasks for kanban
  currentPlanTasks = [];
  if (linked) {
    for (const item of linked) {
      if (item.plan && item.plan.tasks) {
        const planName = item.plan.title;
        for (const task of item.plan.tasks) {
          const status = task.progress === 100 ? 'completed'
            : task.progress > 0 ? 'in_progress' : 'pending';
          const stepsDone = task.steps.filter(s => s.done).length;
          const stepsTotal = task.steps.length;
          currentPlanTasks.push({
            id: `P${task.id}`,
            subject: task.title,
            description: `${planName} — ${stepsDone}/${stepsTotal} steps`,
            status,
            activeForm: status === 'in_progress' ? `${task.progress}% complete` : null,
            _planTask: task, // keep reference for detail rendering
          });
        }
      }
    }
  }

  // Refresh kanban with new plan data
  refreshKanban();

  if (!linked || linked.length === 0) {
    specsSection.classList.add('hidden');
    return;
  }

  specsSection.classList.remove('hidden');
  specsList.innerHTML = '';

  for (const item of linked) {
    specsList.appendChild(createSpecGroup(item));
  }
}

function createSpecGroup({ spec, plan }) {
  const group = document.createElement('div');
  group.className = 'spec-group';

  // Determine what to show
  const hasSpec = !!spec;
  const hasPlan = !!plan;
  const title = hasSpec ? spec.title : plan.title;
  const date = hasSpec ? spec.date : plan.date;

  // Progress summary
  let progressHtml = '';
  if (hasPlan) {
    const doneCount = plan.tasks.filter(t => t.progress === 100).length;
    progressHtml = `
      <div class="spec-progress">
        <div class="spec-progress-bar">
          <div class="progress-fill ${plan.progress === 100 ? 'complete' : ''}" style="width: ${plan.progress}%"></div>
        </div>
        <span class="spec-progress-text">${plan.progress}%</span>
        <span class="spec-progress-detail">${doneCount}/${plan.tasks.length} tasks</span>
      </div>`;
  }

  // Status badge
  let statusBadge = '';
  if (hasSpec && !hasPlan) {
    statusBadge = '<span class="spec-badge spec-badge-pending">Awaiting Plan</span>';
  } else if (hasPlan && plan.progress === 100) {
    statusBadge = '<span class="spec-badge spec-badge-done">Complete</span>';
  } else if (hasPlan && plan.progress > 0) {
    statusBadge = '<span class="spec-badge spec-badge-active">In Progress</span>';
  } else if (hasPlan) {
    statusBadge = '<span class="spec-badge spec-badge-pending">Not Started</span>';
  }

  // Type indicator
  const typeLabel = hasSpec ? 'SPEC' : 'PLAN';
  const typeClass = hasSpec ? 'spec-type-spec' : 'spec-type-plan';

  let html = `
    <div class="spec-card-header" onclick="this.parentElement.querySelector('.spec-card-body')?.classList.toggle('hidden')">
      <div class="spec-card-top">
        <span class="spec-type ${typeClass}">${typeLabel}</span>
        <span class="spec-card-date">${date}</span>
        ${statusBadge}
      </div>
      <h3 class="spec-card-title">${esc(title)}</h3>
      ${progressHtml}
    </div>`;

  // Expandable body with plan tasks
  if (hasPlan && plan.tasks.length > 0) {
    html += `<div class="spec-card-body hidden">`;
    for (const task of plan.tasks) {
      const stepsDone = task.steps.filter(s => s.done).length;
      const stepsTotal = task.steps.length;
      html += `
        <div class="spec-task" onclick="event.stopPropagation(); this.querySelector('.spec-task-steps')?.classList.toggle('hidden')">
          <div class="spec-task-header">
            <span class="spec-task-num">${task.progress === 100 ? '\u2713' : task.id}</span>
            <span class="spec-task-title">${esc(task.title)}</span>
            <span class="spec-task-meta">${stepsDone}/${stepsTotal}</span>
            <div class="progress-bar spec-task-bar">
              <div class="progress-fill ${task.progress === 100 ? 'complete' : ''}" style="width: ${task.progress}%"></div>
            </div>
          </div>
          <div class="spec-task-steps hidden">
            ${task.steps.map(s => `
              <div class="plan-step">
                <span class="plan-step-check ${s.done ? 'done' : ''}">${s.done ? '\u2713' : ''}</span>
                <span>${esc(s.title)}</span>
              </div>
            `).join('')}
          </div>
        </div>`;
    }
    html += `</div>`;
  }

  group.innerHTML = html;
  return group;
}

// === History ===
async function loadHistory() {
  try {
    const res = await fetch('/api/sessions');
    const sessions = await res.json();
    renderHistory(sessions);
  } catch { /* ignore */ }
}

function renderHistory(sessions) {
  if (!sessions || sessions.length === 0) {
    historyEmpty.classList.remove('hidden');
    historyList.classList.add('hidden');
    return;
  }

  historyEmpty.classList.add('hidden');
  historyList.classList.remove('hidden');
  historyList.innerHTML = '';

  for (const session of sessions) {
    if (session.sessionId === currentSessionId) continue;

    const item = document.createElement('div');
    item.className = 'history-item';

    const date = session.startedAt
      ? new Date(session.startedAt).toLocaleString()
      : 'Unknown date';

    const summaryHtml = session.summary
      ? `<div class="history-summary">${esc(session.summary)}</div>`
      : '';

    const memBadge = session.hasClaudeMem
      ? '<span class="cm-badge">&#128161; mem</span>'
      : '';

    item.innerHTML = `
      <div class="history-header" onclick="toggleHistory(this, '${session.sessionId}')">
        <div>
          <span class="history-chevron">&#9656;</span>
          <span class="history-date">${date}</span>
          <span class="history-task-count">${session.taskCount} tasks</span>
          ${memBadge}
        </div>
        <span class="history-meta">${session.sessionId.slice(0, 8)}...</span>
      </div>
      ${summaryHtml}
      <div class="history-body hidden" id="history-${session.sessionId}"></div>`;

    historyList.appendChild(item);
  }
}

async function toggleHistory(header, sessionId) {
  const chevron = header.querySelector('.history-chevron');
  const body = $(`history-${sessionId}`);
  const isOpen = !body.classList.contains('hidden');

  if (isOpen) {
    body.classList.add('hidden');
    chevron.classList.remove('open');
    return;
  }

  chevron.classList.add('open');
  body.classList.remove('hidden');

  if (!body.dataset.loaded) {
    body.innerHTML = '<p style="color: var(--muted); font-size: 12px; padding: 8px;">Loading...</p>';
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const session = await res.json();
      const tasks = session.tasks || [];
      body.innerHTML = renderHistoryKanban(tasks) + renderHistoryClaudeMem(session);
      body.dataset.loaded = 'true';
    } catch {
      body.innerHTML = '<p style="color: var(--destructive); font-size: 12px;">Failed to load</p>';
    }
  }
}
window.toggleHistory = toggleHistory;

function renderHistoryClaudeMem(session) {
  if (!session.claudeMem) return '';
  const { timeline, observations } = session.claudeMem;
  if (!timeline?.length && !observations?.length) return '';

  let html = '<div class="history-cm">';
  if (timeline?.length) {
    html += `<div class="cm-section">
      <div class="cm-section-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span class="cm-icon">&#128340;</span> Session Timeline <span class="cm-count">${timeline.length}</span>
      </div>
      <div class="cm-section-body hidden">
        ${timeline.map(t => `<div class="cm-timeline-entry">
          <span class="cm-time">${esc(t.timestamp || '')}</span>
          <span>${esc(t.action || t.text || '')}</span>
        </div>`).join('')}
      </div>
    </div>`;
  }
  if (observations?.length) {
    html += `<div class="cm-section">
      <div class="cm-section-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span class="cm-icon">&#128161;</span> Observations <span class="cm-count">${observations.length}</span>
      </div>
      <div class="cm-section-body hidden">
        ${observations.map(o => `<div class="cm-observation">${esc(typeof o === 'string' ? o : o.text || '')}</div>`).join('')}
      </div>
    </div>`;
  }
  html += '</div>';
  return html;
}

function renderHistoryKanban(tasks) {
  const groups = { pending: [], in_progress: [], completed: [] };
  for (const task of tasks) {
    if (groups[task.status]) groups[task.status].push(task);
  }

  let html = '<div class="history-kanban">';
  for (const [status, items] of Object.entries(groups)) {
    const label = status.replace('_', ' ');
    html += `<div>
      <div class="history-col-title">${label} (${items.length})</div>
      ${items.map(t => `<div class="history-task">${esc(t.subject)}</div>`).join('')}
    </div>`;
  }
  return html + '</div>';
}

// === Helpers ===
function esc(str) {
  if (!str) return '';
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

// === Theme Toggle ===
function initTheme() {
  const saved = localStorage.getItem('task-viewer-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('task-viewer-theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = $('theme-toggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '\u2600' : '\u263E';
}

$('theme-toggle')?.addEventListener('click', toggleTheme);

// === Init ===
initTheme();
connect();
loadHistory();
