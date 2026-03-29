import{S as n,a as v,n as _,_ as k}from"./index-DBV3ng3O.js";function S({value:a="#000000",label:r="",onChange:l}={}){const i=document.createElement("div");i.className="color-picker-wrap",i.innerHTML=`
    <div class="color-picker-row">
      <label class="field-label" style="flex:1;">${E(r)}</label>
      <div class="color-swatch-wrap">
        <input type="color" class="color-native" value="${a}" title="${E(r)}">
        <div class="color-swatch" style="background:${a};"></div>
      </div>
      <input type="text" class="field-input color-hex" value="${a}" maxlength="7" style="width:80px;">
    </div>`;const s=i.querySelector(".color-native"),c=i.querySelector(".color-swatch"),d=i.querySelector(".color-hex");function m(t){/^#[0-9a-f]{6}$/i.test(t)&&(s.value=t,c.style.background=t,d.value=t,l==null||l(t))}return s.addEventListener("input",()=>m(s.value)),d.addEventListener("input",()=>m(d.value)),d.addEventListener("blur",()=>{/^#[0-9a-f]{6}$/i.test(d.value)||(d.value=a)}),{el:i,getValue:()=>d.value,setValue:t=>m(t)}}function E(a){return String(a||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const $=["Playfair Display","Cormorant Garamond","Libre Baskerville","Merriweather","Lora","Abril Fatface","DM Serif Display","Bodoni Moda","Fraunces","Spectral"],w=["Inter","DM Sans","Plus Jakarta Sans","Outfit","Nunito Sans","Source Sans 3","Karla","Mulish","Work Sans","Jost"],j=["JetBrains Mono","DM Mono","IBM Plex Mono","Space Mono","Fira Code","Roboto Mono","Space Grotesk","Syne","Barlow Condensed","Oswald"];function b({value:a="",fonts:r=w,label:l="",onChange:i}={}){const s=document.createElement("div");s.className="font-picker-wrap",s.innerHTML=`
    <div class="field-label">${String(l).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
    <div class="font-picker-list"></div>`;const c=s.querySelector(".font-picker-list");function d(t){const o="gf-"+t.replace(/ /g,"-");if(!document.getElementById(o)){const p=document.createElement("link");p.id=o,p.rel="stylesheet",p.href=`https://fonts.googleapis.com/css2?family=${t.replace(/ /g,"+")}:wght@400;500&display=swap`,document.head.appendChild(p)}}function m(t){c.innerHTML=r.map(o=>`
      <button type="button" class="font-option ${o===t?"active":""}" data-font="${o}">
        <span class="font-preview" style="font-family:'${o}',serif;">${o}</span>
      </button>`).join(""),r.forEach(d),c.querySelectorAll(".font-option").forEach(o=>o.onclick=()=>{m(o.dataset.font),i==null||i(o.dataset.font)})}return m(a),{el:s,getValue:()=>{var t;return((t=c.querySelector(".active"))==null?void 0:t.dataset.font)||a}}}let e=null,y="home",x={},h={};async function z(){var m;y=n.screen==="project"?"project":"home",n.context==="project"&&n.projectId?e={...await v.projects.theme(n.projectId)}:e={...await v.themes.global()};const a=t=>String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");document.getElementById("app").innerHTML=`
    <div class="screen-theme">
      <header class="app-header">
        <button class="btn-text" id="btn-back-theme"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> Voltar</button>
        <span class="app-logo">Tema</span>
        <div style="display:flex;gap:8px;align-items:center;">
          ${n.context==="project"?'<button class="btn-text" id="btn-use-global">Usar tema global</button>':""}
          <button class="btn-primary" id="btn-save-theme">Salvar</button>
        </div>
      </header>
      <main class="theme-main">
        <div class="theme-columns">
          <div class="theme-col">
            <section class="theme-section">
              <h3 class="theme-section-title">Identidade da marca</h3>
              <div class="form-group">
                <label class="form-label">Nome da marca</label>
                <input class="form-input" id="t-brand-name" value="${a(e.brand_name||"")}">
              </div>
              <div class="form-group">
                <label class="form-label">Símbolo (emoji/char)</label>
                <input class="form-input" id="t-brand-symbol" value="${a(e.brand_symbol||"⬥")}" style="width:80px;">
              </div>
              <div class="form-group">
                <label class="form-label">Logotipo escuro (PNG/SVG)</label>
                <div class="brand-upload-row">
                  ${e.brand_logo_dark?`<img src="${e.brand_logo_dark}" class="brand-preview" alt="Logo escuro">`:'<div class="brand-preview-empty">sem logo</div>'}
                  <input type="file" accept="image/png,image/svg+xml" id="upload-logo-dark" class="upload-input">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Logotipo claro (PNG/SVG)</label>
                <div class="brand-upload-row">
                  ${e.brand_logo_light?`<img src="${e.brand_logo_light}" class="brand-preview brand-preview-dark" alt="Logo claro">`:'<div class="brand-preview-empty">sem logo</div>'}
                  <input type="file" accept="image/png,image/svg+xml" id="upload-logo-light" class="upload-input">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Username (rodapé)</label>
                <input class="form-input" id="t-username" value="${a(e.username||"")}" placeholder="@seuusuario">
              </div>
              <div class="form-group">
                <label class="form-label">Logo no rodapé</label>
                <div style="display:flex;gap:8px;">
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--text-muted);">
                    <input type="radio" name="footer-logo" id="footer-logo-dark" value="dark" ${(e.footer_logo_variant||"dark")==="dark"?"checked":""}> Escura
                  </label>
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--text-muted);">
                    <input type="radio" name="footer-logo" id="footer-logo-light" value="light" ${e.footer_logo_variant==="light"?"checked":""}> Clara
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Nav esquerdo</label>
                <input class="form-input" id="t-nav-left" value="${a(e.nav_left||"CATEGORIA")}">
              </div>
              <div class="form-group">
                <label class="form-label">Nav direito</label>
                <input class="form-input" id="t-nav-right" value="${a(e.nav_right||"SÉRIE")}">
              </div>
            </section>
          </div>

          <div class="theme-col">
            <section class="theme-section">
              <h3 class="theme-section-title">Fontes</h3>
              <div class="form-group" id="picker-font-display"></div>
              <div class="form-group" id="picker-font-body"></div>
              <div class="form-group" id="picker-font-ui"></div>
            </section>
            <section class="theme-section">
              <h3 class="theme-section-title">Tamanhos de texto</h3>
              <div class="form-group">
                <label class="form-label">Tamanho dos títulos (px)</label>
                <input class="form-input" type="number" id="t-font-size-headline" min="40" max="120" step="2" value="${e.font_size_headline??72}">
              </div>
              <div class="form-group">
                <label class="form-label">Tamanho do corpo (px)</label>
                <input class="form-input" type="number" id="t-font-size-body" min="18" max="60" step="1" value="${e.font_size_body??36}">
              </div>
              <div class="form-group">
                <label class="form-label">Line-height títulos</label>
                <input class="form-input" type="number" id="t-line-height-headline" min="0.9" max="1.8" step="0.05" value="${e.line_height_headline??1.05}">
              </div>
              <div class="form-group">
                <label class="form-label">Line-height corpo</label>
                <input class="form-input" type="number" id="t-line-height-body" min="1.2" max="2.2" step="0.05" value="${e.line_height_body??1.5}">
              </div>
            </section>
            <section class="theme-section">
              <h3 class="theme-section-title">Cores</h3>
              <div id="color-pickers" class="color-pickers-grid"></div>
            </section>
          </div>

          <div class="theme-col theme-preview-col">
            <section class="theme-section">
              <h3 class="theme-section-title">Prévia</h3>
              <iframe id="theme-preview-frame" class="theme-preview-frame"></iframe>
            </section>
          </div>
        </div>
      </main>
    </div>`;const r=b({value:e.font_display,fonts:$,label:"Fonte de títulos",onChange:t=>{e.font_display=t,u()}});document.getElementById("picker-font-display").appendChild(r.el),h.display=r;const l=b({value:e.font_body,fonts:w,label:"Fonte do corpo",onChange:t=>{e.font_body=t,u()}});document.getElementById("picker-font-body").appendChild(l.el),h.body=l;const i=b({value:e.font_ui||"JetBrains Mono",fonts:j,label:"Fonte UI (marca · nav · números)",onChange:t=>{e.font_ui=t,u()}});document.getElementById("picker-font-ui").appendChild(i.el),h.ui=i;const s=[{key:"color_bg",label:"Fundo"},{key:"color_text",label:"Texto principal"},{key:"color_emphasis",label:"Cor de destaque"},{key:"color_secondary",label:"Texto secundário"},{key:"color_detail",label:"Detalhes"},{key:"color_border",label:"Bordas"}],c=document.getElementById("color-pickers");s.forEach(({key:t,label:o})=>{const p=S({value:e[t]||"#000000",label:o,onChange:g=>{e[t]=g,u()}});c.appendChild(p.el),x[t]=p}),[{id:"t-font-size-headline",key:"font_size_headline",parse:Number},{id:"t-font-size-body",key:"font_size_body",parse:Number},{id:"t-line-height-headline",key:"line_height_headline",parse:Number},{id:"t-line-height-body",key:"line_height_body",parse:Number}].forEach(({id:t,key:o,parse:p})=>{var g;(g=document.getElementById(t))==null||g.addEventListener("input",B=>{const f=p(B.target.value);!isNaN(f)&&f>0&&(e[o]=f,u())})}),document.getElementById("t-username").addEventListener("input",t=>{e.username=t.target.value.toLowerCase(),t.target.value=e.username,u()}),document.querySelectorAll('input[name="footer-logo"]').forEach(t=>{t.addEventListener("change",o=>{e.footer_logo_variant=o.target.value,u()})}),document.getElementById("upload-logo-dark").onchange=t=>I(t.target.files[0],"dark"),document.getElementById("upload-logo-light").onchange=t=>I(t.target.files[0],"light"),document.getElementById("btn-back-theme").onclick=()=>_(y,n.projectId?{projectId:n.projectId}:{}),document.getElementById("btn-save-theme").onclick=L,(m=document.getElementById("btn-use-global"))==null||m.addEventListener("click",N),u()}async function I(a,r){if(a)try{const{url:l}=await v.uploadBrand(a);r==="dark"?e.brand_logo_dark=l:e.brand_logo_light=l,u()}catch(l){alert("Erro ao fazer upload: "+l.message)}}async function u(){const a=document.getElementById("theme-preview-frame");if(!a)return;const[{themeStyleBlock:r},{RENDERERS:l}]=await Promise.all([k(()=>import("./theme-C330BZ3F.js"),[]),k(()=>import("./renderers-CBJ70iTW.js"),[])]),i={template:"dark",layout:"a",section_number:"01",section_title:"Prévia do tema",body_html:"Assim ficará o conteúdo dos seus slides.",list_items:["Item um","Item dois"],conclusion_html:"Sua conclusão aqui."},s=l.dark.a,c=s(i,null,e);a.srcdoc=`<!DOCTYPE html><html><head>${r(e)}</head><body style="margin:0;overflow:hidden;">${c}</body></html>`}async function L(){e.brand_name=document.getElementById("t-brand-name").value.trim(),e.brand_symbol=document.getElementById("t-brand-symbol").value.trim(),e.nav_left=document.getElementById("t-nav-left").value.trim(),e.nav_right=document.getElementById("t-nav-right").value.trim(),e.font_size_headline=Number(document.getElementById("t-font-size-headline").value)||72,e.font_size_body=Number(document.getElementById("t-font-size-body").value)||36,e.line_height_headline=Number(document.getElementById("t-line-height-headline").value)||1.05,e.line_height_body=Number(document.getElementById("t-line-height-body").value)||1.5;try{await v.themes.update(e.id,e),n.context==="project"&&n.projectId&&await v.projects.update(n.projectId,{theme_id:e.id}),_(y,n.projectId?{projectId:n.projectId}:{})}catch(a){alert("Erro ao salvar tema: "+a.message)}}async function N(){confirm("Remover tema personalizado do projeto e usar o tema global?")&&(await v.projects.update(n.projectId,{theme_id:null}),_("project",{projectId:n.projectId}))}function P(){x={},h={},e=null}export{z as mountThemeEditor,P as unmountThemeEditor};
