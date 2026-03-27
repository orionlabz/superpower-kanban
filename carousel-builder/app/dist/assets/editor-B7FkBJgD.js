import{a as A,S as i,n as B,s as p}from"./index-UI1DXCfM.js";import{themeStyleBlock as V}from"./theme-DPp7_AaX.js";import{LAYOUT_NAMES as Y,getRenderer as J}from"./renderers-C_NC_ncQ.js";function Q({value:t="",onChange:e,placeholder:a=""}={}){const s=document.createElement("div");s.className="rt-toolbar",s.innerHTML=`
    <button type="button" class="rt-btn" data-cmd="bold" title="Negrito (Ctrl+B)"><strong>B</strong></button>
    <button type="button" class="rt-btn" data-cmd="italic" title="Itálico (Ctrl+I)"><em>I</em></button>
    <button type="button" class="rt-btn rt-btn-accent" data-cmd="accent" title="Cor de destaque">A</button>`;const n=document.createElement("div");n.className="rt-editor field-input",n.contentEditable="true",n.setAttribute("data-placeholder",a),n.innerHTML=x(t);const d=document.createElement("div");d.className="rt-wrap",d.appendChild(s),d.appendChild(n);function r(o){n.focus(),o==="bold"?document.execCommand("bold",!1):o==="italic"?document.execCommand("italic",!1):o==="accent"&&l(),v(),e==null||e(u())}function l(){var k;const o=window.getSelection();if(!o.rangeCount||o.isCollapsed)return;const y=o.getRangeAt(0),L=(k=o.anchorNode)==null?void 0:k.parentElement;if(L!=null&&L.classList.contains("accent")){const E=L,T=document.createDocumentFragment();for(;E.firstChild;)T.appendChild(E.firstChild);E.replaceWith(T)}else{const E=document.createElement("span");E.className="accent";try{y.surroundContents(E)}catch{}}}function v(){n.innerHTML=n.innerHTML.replace(/<b>/gi,"<strong>").replace(/<\/b>/gi,"</strong>").replace(/<i>/gi,"<em>").replace(/<\/i>/gi,"</em>")}function u(){return x(n.innerHTML)}function h(o){n.innerHTML=x(o)}function x(o){return(o||"").replace(/<(?!\/?(?:em|strong|span)[^>]*>)[^>]+>/gi,"").replace(/<span(?!\s+class="accent")[^>]*>/gi,'<span class="accent">')}return s.addEventListener("mousedown",o=>{const y=o.target.closest("[data-cmd]");y&&(o.preventDefault(),r(y.dataset.cmd))}),n.addEventListener("input",()=>e==null?void 0:e(u())),n.addEventListener("keydown",o=>{(o.ctrlKey||o.metaKey)&&o.key==="b"&&(o.preventDefault(),r("bold")),(o.ctrlKey||o.metaKey)&&o.key==="i"&&(o.preventDefault(),r("italic"))}),{el:d,getValue:u,setValue:h}}function X(t,e){var n;const a=d=>String(d??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),s={headline_html:()=>t.headline?a(t.headline)+(t.headline_italic?" <em>"+a(t.headline_italic)+"</em>":""):"",body_html:()=>a(t.body||""),conclusion_html:()=>a(t.conclusion||""),call_to_action_html:()=>t.call_to_action?a(t.call_to_action)+(t.call_to_action_italic?" <em>"+a(t.call_to_action_italic)+"</em>":""):""};return((n=s[e])==null?void 0:n.call(s))||""}function H(t,e,a,s){const n=document.createElement("div");n.className="form-group";const d=document.createElement("div");d.className="field-label",d.textContent=a,n.appendChild(d);const r=Q({value:t[e]||X(t,e)||"",placeholder:a,onChange:l=>{t[e]=l,s()}});return n.appendChild(r.el),n}const Z={dark:{template:"dark",layout:"a",section_number:"",section_title:"",body:"",list_items:[],conclusion:""}};let j=[],I=null,D=0;function ee(t){clearInterval(I),D=0,document.getElementById("app").innerHTML=`
    <div class="generating-screen">
      <div class="generating-inner">
        <div class="generating-label">Gerando carrossel</div>
        <div class="generating-topic">${f(t)}</div>
        <div class="gen-bar-wrap"><div id="gen-bar" class="gen-bar"></div></div>
        <div id="gen-log" class="gen-log"></div>
        <div id="gen-elapsed" class="gen-elapsed">0s</div>
      </div>
    </div>`;let e=0;I=setInterval(()=>{e++;const a=document.getElementById("gen-elapsed");a&&(a.textContent=e+"s")},1e3)}function w(t,e="pending"){const a=document.getElementById("gen-log");if(!a)return null;const s="ge"+D++,n=document.createElement("div");return n.className=`gen-entry gen-${e}`,n.id=s,n.innerHTML=`<span class="gen-dot"></span><span class="gen-msg">${f(t)}</span>`,a.appendChild(n),requestAnimationFrame(()=>requestAnimationFrame(()=>n.classList.add("in"))),a.scrollTop=a.scrollHeight,s}function R(t){var e;(e=document.getElementById(t))==null||e.classList.replace("gen-pending","gen-done")}function b(t){const e=document.getElementById("gen-bar");e&&(e.style.width=t+"%")}function P(){clearInterval(I),I=null}function f(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function N(t){const e=i.slides[t];if(!e)return'<!DOCTYPE html><html><body style="background:#111;width:1080px;height:1350px;"></body></html>';const s=J(e)(e,i.images[t]||null,i.theme);return`<!DOCTYPE html><html><head><meta charset="UTF-8">${V(i.theme)}</head><body style="margin:0;overflow:hidden;">${s}</body></html>`}function te(){j.forEach(e=>{clearInterval(e),clearTimeout(e)}),j=[];const t=document.getElementById("canvas-loading");t&&t.classList.add("hidden")}function C(){ie(),g(),_()}function ie(){const t=document.getElementById("sidebar");if(!t)return;t.innerHTML="",i.slides.forEach((a,s)=>{const n=document.createElement("div");n.className="thumb-item"+(s===i.active?" active":""),n.onclick=()=>F(s);const d=document.createElement("div");d.className="thumb-wrap";const r=document.createElement("iframe");r.srcdoc=N(s),r.title="Slide "+(s+1),d.appendChild(r);const l=document.createElement("div");l.className="thumb-label",l.textContent=s+1+" · "+a.template,n.appendChild(d),n.appendChild(l),t.appendChild(n)});const e=document.createElement("button");e.className="btn-add-slide",e.textContent="+ Slide",e.onclick=be,t.appendChild(e)}function g(){const t=document.getElementById("preview-col"),e=document.getElementById("preview-wrap");if(!t||!e)return;const a=t.clientHeight-80,s=t.clientWidth-32,n=Math.min(a/1350,s/1080,1),d=Math.round(1080*n),r=Math.round(1350*n);e.style.width=d+"px",e.style.height=r+"px",e.style.overflow="hidden",e.style.flexShrink="0",e.innerHTML="";const l=document.createElement("iframe");l.style.width="1080px",l.style.height="1350px",l.style.transformOrigin="top left",l.style.transform=`scale(${n})`,l.style.border="none",l.style.display="block",l.srcdoc=N(i.active),l.title="Preview",e.appendChild(l);const v=i.slides[i.active],u=document.getElementById("layout-pills");if(v&&u){const h=Y[v.template]||{},x=v.layout||"a";u.innerHTML=Object.entries(h).map(([o,y])=>`<button class="pill${o===x?" active":""}" data-layout="${f(o)}">${f(y)}</button>`).join(""),u.querySelectorAll(".pill").forEach(o=>{o.onclick=()=>he(o.dataset.layout)})}}function _(){const t=document.getElementById("edit-panel");if(!t)return;const e=i.slides[i.active];if(!e){t.innerHTML="";return}const a=e.template,s=["cover","split","overlay"].includes(a),n=i.images[i.active],d=i.slides.length>1;function r(c,m,q){return`<div class="field-group"><div class="field-label">${f(m)}</div>
      <input class="field-input" value="${f(q||"")}" data-key="${f(c)}"></div>`}let l=`<div class="panel-header">
    <div class="panel-title">Slide ${i.active+1} · ${f(a)}</div>
    ${d?'<button class="btn-delete" id="btn-delete-slide">Excluir</button>':""}
  </div>`;s&&(l+=`<div class="field-group"><div class="field-label">Imagem</div>
      ${n?`<div class="img-preview-wrap">
             <img class="img-preview" src="${n}">
             <button class="btn-remove-img" id="btn-remove-img">Remover</button>
           </div>`:`<div class="drop-zone">
             <input type="file" accept="image/*" id="inp-img">
             <div class="drop-zone-icon">⊕</div>
             <div class="drop-zone-text">Clique para fazer upload<br>JPG · PNG · WEBP</div>
           </div>`}
    </div>`),(a==="cover"||a==="split")&&(l+='<div data-rich="headline_html"></div>',l+='<div data-rich="body_html"></div>'),a==="dark"&&(l+=r("section_number","Número da seção",e.section_number),l+=r("section_title","Título da seção",e.section_title),l+='<div data-rich="body_html"></div>',l+=`<div class="field-group"><div class="field-label">Itens da lista</div>
      <div class="list-items-wrap" id="list-items-wrap">
        ${(e.list_items||[]).map((c,m)=>`<div class="list-item-row">
            <input class="field-input" value="${f(c)}" data-list-idx="${m}">
            <button class="btn-remove" data-list-remove="${m}">×</button>
          </div>`).join("")}
      </div>
      ${(e.list_items||[]).length<4?'<button class="btn-add-item" id="btn-add-list-item">+ Adicionar</button>':""}
    </div>`,l+='<div data-rich="conclusion_html"></div>'),a==="steps"&&(l+=r("section_title","Título (opcional)",e.section_title||""),l+=`<div class="field-group"><div class="field-label">Etapas</div>
      <div class="steps-wrap" id="steps-wrap">
        ${(e.steps||[]).map((c,m)=>`<div class="step-row">
            <div class="step-row-top">
              <input class="field-input step-label-input" value="${f(c.label)}" placeholder="Etapa ${m+1}" data-step-idx="${m}" data-step-field="label">
              <button class="btn-remove" data-step-remove="${m}">×</button>
            </div>
            <div data-rich="step_text_html_${m}"></div>
            ${e.layout==="c"?ne(m,(e.steps[m]||{}).icon):""}
          </div>`).join("")}
      </div>
      ${(e.steps||[]).length<4?'<button class="btn-add-item" id="btn-add-step">+ Etapa</button>':""}
    </div>`,l+='<div data-rich="call_to_action_html"></div>'),a==="overlay"&&(l+=r("section_number","Número da seção",e.section_number),l+=r("section_title","Título",e.section_title),l+='<div data-rich="headline_html"></div>',l+='<div data-rich="body_html"></div>'),a==="cta"&&(l+='<div data-rich="headline_html"></div>',l+='<div data-rich="body_html"></div>',l+=r("cta_text","Texto do CTA",e.cta_text),l+=r("cta_word","Palavra em destaque",e.cta_word),l+=r("cta_suffix","Sufixo do CTA",e.cta_suffix)),l+=`<div class="refine-section">
    <button class="btn-refine" id="btn-refine-toggle">✦ Refinar com IA</button>
    <div id="refine-wrap" class="refine-input-wrap">
      <textarea id="refine-instr" class="field-textarea" placeholder="O que você quer mudar neste slide?" rows="3"></textarea>
      <div class="refine-actions">
        <button id="btn-refine-ok" class="btn-confirm">Refinar</button>
        <button id="btn-refine-cancel" class="btn-cancel">Cancelar</button>
      </div>
    </div>
  </div>`,t.innerHTML=l;const v=()=>{S(i.active),g(),p()},u={headline_html:"Headline",body_html:"Corpo",conclusion_html:"Conclusão",call_to_action_html:"Chamada final"};t.querySelectorAll("[data-rich]").forEach(c=>{var M;const m=c.dataset.rich,q=m.match(/^step_text_html_(\d+)$/);if(q){const W=Number(q[1]),$=(M=e.steps)==null?void 0:M[W];if(!$)return;!$.text_html&&$.text&&($.text_html=String($.text).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"));const K=H($,"text_html","Texto da etapa",v);c.replaceWith(K);return}const U=u[m]||m,z=H(e,m,U,v);c.replaceWith(z)}),t.querySelectorAll("input[data-key], textarea[data-key]").forEach(c=>{c.addEventListener("input",()=>de(c.dataset.key,c.value))});const h=t.querySelector("#btn-delete-slide");h&&(h.onclick=ge);const x=t.querySelector("#btn-remove-img");x&&(x.onclick=Ee);const o=t.querySelector("#inp-img");o&&(o.onchange=c=>ye(c)),t.querySelectorAll("input[data-list-idx]").forEach(c=>{c.addEventListener("input",()=>re(Number(c.dataset.listIdx),c.value))}),t.querySelectorAll("[data-list-remove]").forEach(c=>{c.onclick=()=>me(Number(c.dataset.listRemove))});const y=t.querySelector("#btn-add-list-item");y&&(y.onclick=ue),t.querySelectorAll("input[data-step-idx]").forEach(c=>{c.addEventListener("input",()=>pe(Number(c.dataset.stepIdx),c.dataset.stepField,c.value))}),t.querySelectorAll("[data-step-remove]").forEach(c=>{c.onclick=()=>fe(Number(c.dataset.stepRemove))});const L=t.querySelector("#btn-add-step");L&&(L.onclick=ve);const k=t.querySelector("#btn-refine-toggle");k&&(k.onclick=()=>{const c=document.getElementById("refine-wrap");c&&c.classList.toggle("open")});const E=t.querySelector("#btn-refine-ok");E&&(E.onclick=we);const T=t.querySelector("#btn-refine-cancel");T&&(T.onclick=()=>{const c=document.getElementById("refine-wrap");c&&c.classList.remove("open")}),se()}function G(t,e=48,a="#333"){if(!window.lucide||!lucide.icons[t])return null;const[,,s]=lucide.icons[t],n=s.map(([d,r])=>{const l=Object.entries(r).map(([v,u])=>`${v}="${u}"`).join(" ");return`<${d} ${l}/>`}).join("");return`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="${a}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`}function ae(t){return window.lucide?Object.keys(lucide.icons).filter(e=>e.includes(t.toLowerCase().replace(/\s+/g,"-"))).slice(0,30):[]}function ne(t,e){const a=(e==null?void 0:e.type)==="lucide"&&e.svg?e.svg:null,s=(e==null?void 0:e.type)==="upload"?e.src:null,n=a||(s?`<img src="${s}" style="width:18px;height:18px;object-fit:contain;">`:'<div style="width:18px;height:18px;border:1px dashed #333;border-radius:3px;"></div>');return`<div class="icon-picker" id="icon-picker-${t}">
    <div class="field-label">Ícone</div>
    <div class="icon-current">${n}<span style="font-size:11px;color:#555;">${f((e==null?void 0:e.name)||"nenhum")}</span></div>
    <div class="icon-search-wrap">
      <input class="field-input icon-search-input" placeholder="buscar ícone…" data-icon-search="${t}">
    </div>
    <div id="icon-grid-${t}" class="icon-grid"></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span class="field-label" style="margin:0;">ou upload</span>
      <input type="file" accept="image/png,image/svg+xml" style="font-size:11px;color:#666;flex:1;" data-icon-upload="${t}">
    </div>
  </div>`}function se(){const t=document.getElementById("edit-panel");t&&(t.querySelectorAll("[data-icon-search]").forEach(e=>{const a=Number(e.dataset.iconSearch);e.addEventListener("input",()=>le(a,e.value))}),t.querySelectorAll("[data-icon-upload]").forEach(e=>{const a=Number(e.dataset.iconUpload);e.onchange=()=>oe(a,e)}))}function le(t,e){var r,l,v;const a=document.getElementById("icon-grid-"+t);if(!a||!e){a&&(a.innerHTML="");return}const s=ae(e),n=i.slides[i.active],d=(v=(l=(r=n==null?void 0:n.steps)==null?void 0:r[t])==null?void 0:l.icon)==null?void 0:v.name;a.innerHTML=s.map(u=>{const h=G(u,14,"#888");return h?`<button class="icon-btn${u===d?" selected":""}" title="${f(u)}" data-icon-name="${f(u)}" data-step-idx="${t}">${h}</button>`:""}).join(""),a.querySelectorAll(".icon-btn").forEach(u=>{u.onclick=()=>ce(Number(u.dataset.stepIdx),u.dataset.iconName)})}function ce(t,e){const a=G(e,48,"#333");a&&O(t,{type:"lucide",name:e,svg:a})}function oe(t,e){const a=e.files[0];if(!a||!["image/png","image/svg+xml"].includes(a.type))return;const s=new FileReader;s.onload=n=>{let d=n.target.result;a.type==="image/svg+xml"&&(d="data:image/svg+xml;base64,"+btoa(atob(d.split(",")[1]).replace(/<script[\s\S]*?<\/script>/gi,""))),O(t,{type:"upload",src:d})},s.readAsDataURL(a)}function O(t,e){const a=i.slides[i.active];!a||!a.steps||!a.steps[t]||(a.steps[t].icon=e,S(i.active),g(),_(),p())}function F(t){i.active=t,C()}function de(t,e){i.slides[i.active][t]=e,S(i.active),g(),p()}function re(t,e){i.slides[i.active].list_items[t]=e,S(i.active),g(),p()}function ue(){(i.slides[i.active].list_items||[]).length>=4||(i.slides[i.active].list_items=[...i.slides[i.active].list_items||[],""],_(),g(),p())}function me(t){i.slides[i.active].list_items.splice(t,1),_(),g(),p()}function pe(t,e,a){i.slides[i.active].steps[t][e]=a,S(i.active),g(),p()}function ve(){const t=i.slides[i.active].steps||[];t.length>=4||(t.push({label:"Etapa "+(t.length+1),text:""}),i.slides[i.active].steps=t,_(),g(),p())}function fe(t){i.slides[i.active].steps.splice(t,1),_(),g(),p()}function ge(){if(i.slides.length<=1)return;i.slides.splice(i.active,1);const t={};Object.keys(i.images).forEach(e=>{const a=Number(e);a<i.active?t[a]=i.images[a]:a>i.active&&(t[a-1]=i.images[a])}),i.images=t,i.active=Math.min(i.active,i.slides.length-1),C(),p()}function be(){i.slides.splice(i.active+1,0,{...Z.dark}),F(i.active+1),p()}function he(t){i.slides[i.active]&&(i.slides[i.active].layout=t,S(i.active),g(),_(),p())}function ye(t){const e=t.target.files[0];if(!e)return;const a=new FileReader;a.onload=s=>{i.images[i.active]=s.target.result,_(),S(i.active),g(),p()},a.readAsDataURL(e)}function Ee(){delete i.images[i.active],_(),S(i.active),g(),p()}function S(t){const a=document.querySelectorAll(".thumb-item")[t];if(!a)return;const s=a.querySelector("iframe");s&&(s.srcdoc=N(t))}async function we(){const t=document.getElementById("refine-instr"),e=t==null?void 0:t.value.trim();if(!e)return;const a=document.getElementById("btn-refine-ok");a&&(a.textContent="…",a.disabled=!0);try{const s=await A.refine(i.slides[i.active],e),n=i.slides[i.active].layout;i.slides[i.active]=s,n&&!i.slides[i.active].layout&&(i.slides[i.active].layout=n),C(),p()}catch(s){alert("Erro ao refinar: "+s.message)}finally{a&&(a.textContent="Refinar",a.disabled=!1)}}function $e(){const t=document.getElementById("app");t&&(t.innerHTML=`
    <div class="screen-editor">
      <header class="editor-header">
        <button class="header-btn" id="btn-back">← Projetos</button>
        <div id="editor-topic" class="editor-topic"></div>
        <div id="saved-dot" class="saved-dot"></div>
      </header>
      <div class="editor-body">
        <div class="sidebar" id="sidebar"></div>
        <div class="preview-col" id="preview-col">
          <div id="canvas-loading" class="canvas-loading hidden">
            <div class="loading-card">
              <div class="loading-header">
                <div class="loading-title">Gerando carrossel</div>
                <div id="loading-topic" class="loading-topic"></div>
              </div>
              <div class="loading-bar-wrap">
                <div id="loading-bar" class="loading-bar"></div>
              </div>
              <div class="loading-steps">
                <div class="loading-step" id="step-0"><div class="step-icon"></div><div class="step-label">Analisando tema</div></div>
                <div class="loading-step" id="step-1"><div class="step-icon"></div><div class="step-label">Estruturando narrativa</div></div>
                <div class="loading-step" id="step-2"><div class="step-icon"></div><div class="step-label">Criando os slides</div></div>
                <div class="loading-step" id="step-3"><div class="step-icon"></div><div class="step-label">Refinando conteúdo</div></div>
              </div>
              <div id="loading-elapsed" class="loading-elapsed">0s</div>
            </div>
          </div>
          <div id="preview-wrap" class="preview-frame-wrap"></div>
          <div id="layout-pills" class="template-pills"></div>
        </div>
        <div class="edit-panel" id="edit-panel"></div>
      </div>
    </div>`,document.getElementById("btn-back").onclick=()=>B("project",{projectId:i.projectId}),i.carousel&&(document.getElementById("editor-topic").textContent=i.carousel.title||""),i.slides.length>0&&C())}function ke(){te()}function Te(){var a;(a=document.getElementById("new-carousel-modal"))==null||a.remove();let t=8;const e=document.createElement("div");e.className="modal-overlay",e.id="new-carousel-modal",e.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">Novo carrossel</div>
        <button class="header-btn" id="modal-close">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Tema / assunto</label>
          <input id="modal-topic" class="form-input" type="text" placeholder="Ex: Por que criadores digitais fracassam nos primeiros 90 dias">
        </div>
        <div class="form-group">
          <label class="form-label">Audiência</label>
          <input id="modal-audience" class="form-input" type="text" placeholder="Ex: Criadores digitais brasileiros">
        </div>
        <div class="form-group">
          <label class="form-label">CTA final</label>
          <input id="modal-cta" class="form-input" type="text" placeholder="Ex: Salve este post e aplique hoje">
        </div>
        <div class="form-group">
          <label class="form-label">Número de slides</label>
          <div class="counter-row">
            <button type="button" class="counter-btn" id="modal-count-dec">−</button>
            <span id="modal-count-val" class="counter-val">${t}</span>
            <button type="button" class="counter-btn" id="modal-count-inc">+</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-primary" id="modal-submit">Gerar carrossel</button>
      </div>
    </div>`,document.body.appendChild(e),e.querySelector("#modal-close").onclick=()=>e.remove(),e.addEventListener("click",s=>{s.target===e&&e.remove()}),e.querySelector("#modal-count-dec").onclick=()=>{t=Math.max(3,t-1),e.querySelector("#modal-count-val").textContent=t},e.querySelector("#modal-count-inc").onclick=()=>{t=Math.min(15,t+1),e.querySelector("#modal-count-val").textContent=t},e.querySelector("#modal-submit").onclick=async()=>{const s=e.querySelector("#modal-topic").value.trim();if(!s){e.querySelector("#modal-topic").focus();return}const n={topic:s,audience:e.querySelector("#modal-audience").value.trim(),cta:e.querySelector("#modal-cta").value.trim(),slideCount:t};e.remove(),await _e(n)}}async function _e(t){var a;ee(t.topic),b(5);const e=[];try{const s=w("Criando carrossel…"),n=await A.carousels.create(i.projectId,t.topic);i.carouselId=n.id,R(s),b(15);const d=w("Conectando ao Claude…");b(18),e.push(setTimeout(()=>{R(d),w("Analisando tema…"),b(30)},3e3)),e.push(setTimeout(()=>{w("Estruturando narrativa…"),b(45)},9e3)),e.push(setTimeout(()=>{w("Criando os slides…"),b(60)},2e4)),e.push(setTimeout(()=>{w("Refinando conteúdo…"),b(72)},35e3));const r=await A.generate(t);e.forEach(clearTimeout),b(85),w(`${((a=r.slides)==null?void 0:a.length)||0} slides gerados`,"done"),w("Carregando editor…"),b(92);const l=r.slides||[];i.slides=l,i.images={},await B("editor",{projectId:i.projectId,carouselId:n.id}),i.slides=l,i.images={},P(),b(100),C(),p()}catch(s){e.forEach(clearTimeout),w("Erro: "+s.message,"error"),P(),setTimeout(()=>B("project",{projectId:i.projectId}),2500)}}export{_e as generateAndOpen,$e as mountEditor,Te as showNewCarouselModal,ke as unmountEditor};
