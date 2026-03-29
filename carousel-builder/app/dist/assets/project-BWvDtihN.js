const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/editor-DgzWJO2T.js","assets/index-DBV3ng3O.js","assets/index-BURr1bvh.css","assets/theme-C330BZ3F.js","assets/renderers-CBJ70iTW.js"])))=>i.map(i=>d[i]);
import{S as n,n as r,_ as s,a}from"./index-DBV3ng3O.js";function m(){var e,o;document.getElementById("app").innerHTML=`
    <div class="screen-project">
      <header class="app-header">
        <button class="btn-text" id="btn-back"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> Projetos</button>
        <span id="project-name-header" class="project-header-name"></span>
        <button class="btn-text" id="btn-project-settings">Tema <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>
      </header>
      <main class="project-main">
        <div class="project-top">
          <h2 id="project-title" class="home-title"></h2>
          <button class="btn-primary" id="btn-new-carousel">+ Novo carrossel</button>
        </div>
        <div id="carousels-grid" class="projects-grid">
          <div class="loading-inline">Carregando</div>
        </div>
      </main>
    </div>`,document.getElementById("project-title").textContent=((e=n.project)==null?void 0:e.name)||"",document.getElementById("project-name-header").textContent=((o=n.project)==null?void 0:o.name)||"",document.getElementById("btn-back").onclick=()=>r("home"),document.getElementById("btn-new-carousel").onclick=c,document.getElementById("btn-project-settings").onclick=()=>r("theme-editor",{context:"project"}),i()}async function i(){const e=await a.carousels.list(n.projectId),o=document.getElementById("carousels-grid");if(!e.length){o.innerHTML='<div class="empty-state">Nenhum carrossel ainda. Crie o primeiro!</div>';return}o.innerHTML=e.map(t=>`
    <div class="project-card" data-id="${t.id}">
      <div class="project-card-body">
        ${t.thumbnail_path?`<img src="${t.thumbnail_path}" class="carousel-thumb" alt="">`:'<div class="carousel-thumb-placeholder"></div>'}
        <div class="project-name" style="margin-top:12px;">${l(t.title)}</div>
        <div class="project-meta">${u(t.updated_at)}</div>
      </div>
      <div class="project-card-footer">
        <button class="btn-text btn-open-carousel" data-id="${t.id}">Editar</button>
        <button class="btn-icon btn-delete-carousel" data-id="${t.id}" title="Excluir"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
    </div>`).join(""),o.querySelectorAll(".btn-open-carousel").forEach(t=>t.onclick=()=>r("editor",{projectId:n.projectId,carouselId:Number(t.dataset.id)})),o.querySelectorAll(".btn-delete-carousel").forEach(t=>t.onclick=()=>d(Number(t.dataset.id)))}async function c(){const{showNewCarouselModal:e}=await s(async()=>{const{showNewCarouselModal:o}=await import("./editor-DgzWJO2T.js");return{showNewCarouselModal:o}},__vite__mapDeps([0,1,2,3,4]));e()}async function d(e){confirm("Excluir este carrossel?")&&(await a.carousels.delete(e),i())}function l(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function u(e){return new Date(e).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"})}function h(){}export{m as mountProject,h as unmountProject};
