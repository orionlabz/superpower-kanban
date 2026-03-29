function n(i){return String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function r(i){return i||""}function k(i){const o=i.layout||"a",e=z[i.template];return(e==null?void 0:e[o])??(e==null?void 0:e.a)??z.dark.a}const j={cover:{a:"Ancorado",b:"Editorial",c:"Linha de corte"},dark:{a:"Stacked",b:"Nº fundo",c:"2 colunas"},steps:{a:"Lista",b:"Numerado",c:"Ícones"},overlay:{a:"Foto topo",b:"Full-bleed",c:"Foto topo + fundo blur"},split:{a:"Padrão"},cta:{a:"Headline",c:"Centrado"}},d=i=>`font-family:'${(i==null?void 0:i.font_display)||"Playfair Display"}',serif;`,g=i=>`font-family:'${(i==null?void 0:i.font_body)||"Inter"}',sans-serif;`,t=i=>`font-family:'${(i==null?void 0:i.font_ui)||"JetBrains Mono"}',monospace;`,h=(i,o)=>Math.round((+(i==null?void 0:i.font_size_headline)||72)*o/72),x=(i,o)=>Math.round((+(i==null?void 0:i.font_size_body)||36)*o/36),m=i=>+(i==null?void 0:i.line_height_headline)||1.05,f=i=>+(i==null?void 0:i.line_height_body)||1.5;function b(i){const o=i.img_position;if(!o)return"";const e=o.x??50,l=o.y??50,a=o.scale??1;return`object-position:${e}% ${l}%;transform:scale(${a});transform-origin:${e}% ${l}%;`}function _(i){const o=(i==null?void 0:i.nav_left)||"CATEGORIA",e=(i==null?void 0:i.nav_right)||"SÉRIE";return`<div style="${t(i)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:96px;">
    <span>${n(o)}</span>
    <div style="flex:1;height:1px;background:#1e1e1e;"></div>
    <span>${n(e)}</span>
  </div>`}function u(i){const e=((i==null?void 0:i.footer_logo_variant)||"dark")==="light"?i==null?void 0:i.brand_logo_light:i==null?void 0:i.brand_logo_dark,l=e?`<img src="${e}" style="height:22px;object-fit:contain;opacity:.5;" alt="">`:"",a=i!=null&&i.username?n(i.username.toLowerCase()):"";return`<div style="${t(i)}display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:36px;">
    <div>${l}</div>
    <span style="font-size:22px;letter-spacing:.08em;color:#252525;">${a}</span>
  </div>`}const z={cover:{a(i,o,e){const l=o?`<div style="position:absolute;inset:0;"><img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',a=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),v=r(i.body_html||n(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${l}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="${t(e)}font-size:22px;color:#fff;opacity:.9;">${n(a)} ${n(s)}</div>
          <div style="flex:1;"></div>
          <div style="${d(e)}font-size:${h(e,84)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:28px;">
            ${c}
          </div>
          <div style="${g(e)}font-size:${x(e,36)}px;color:#777;line-height:${f(e)};">${v}</div>
        </div>
      </div>`},b(i,o,e){const l=o?`<div style="position:absolute;inset:0;"><img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',a=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",v=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),p=r(i.body_html||n(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${l}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:auto;">
            <div style="${t(e)}font-size:22px;color:#fff;opacity:.9;">${n(a)} ${n(s)}</div>
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:24px;">${n(c)}</div>
            <div style="${d(e)}font-size:${h(e,84)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:28px;">
              ${v}
            </div>
            <div style="width:80px;height:1px;background:#2a2a2a;margin-bottom:28px;"></div>
            <div style="${g(e)}font-size:${x(e,36)}px;color:#666;line-height:${f(e)};">${p}</div>
          </div>
        </div>
      </div>`},c(i,o,e){const l=o?`<div style="position:absolute;inset:0;"><img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.7) 55%,rgba(0,0,0,.3) 100%);"></div></div>`:'<div style="position:absolute;inset:0;background:#050505;"></div>',a=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",v=(e==null?void 0:e.nav_right)||"SÉRIE",p=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),y=r(i.body_html||n(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${l}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
            <div style="${t(e)}font-size:22px;color:#fff;opacity:.85;">${n(a)} ${n(s)}</div>
            <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;">${n(v)}</div>
          </div>
          <div style="width:100%;height:1px;background:linear-gradient(to right,#fff,transparent);margin-bottom:48px;"></div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="${d(e)}font-size:${h(e,84)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:28px;">
              ${p}
            </div>
            <div style="${g(e)}font-size:${x(e,36)}px;color:#666;line-height:${f(e)};">${y}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#252525;text-transform:uppercase;">${n(c)}</div>
          </div>
        </div>
      </div>`}},split:{a(i,o,e){const l=o?`<img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:grayscale(90%) contrast(1.05);">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',a=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),s=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;display:flex;background:#000;">
        <div style="flex:0 0 52%;display:flex;flex-direction:column;padding:54px 52px 60px 76px;">
          ${_(e)}
          <div style="${d(e)}font-size:${h(e,62)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:28px;">
            ${a}
          </div>
          <div style="${g(e)}font-size:${x(e,36)}px;color:#777;line-height:${f(e)};margin-bottom:auto;">${s}</div>
          ${u(e)}
        </div>
        <div style="flex:0 0 48%;overflow:hidden;">${l}</div>
      </div>`}},dark:{a(i,o,e){const a=`<svg width="11" height="11" viewBox="0 0 11 11" fill="${(e==null?void 0:e.color_emphasis)||"#CCFF00"}" style="flex-shrink:0;"><rect width="11" height="11"/></svg>`,s=(i.list_items||[]).map((p,y,$)=>`<div style="display:flex;gap:28px;margin-bottom:${y===$.length-1?8:32}px;align-items:center;">
          ${a}
          <span style="${g(e)}font-size:${x(e,34)}px;color:#777;line-height:${f(e)};">${n(p)}</span>
        </div>`).join(""),c=r(i.body_html||n(i.body||"")),v=r(i.conclusion_html||n(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        <div style="${t(e)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:60px;">
          <span>${n((e==null?void 0:e.nav_left)||"CATEGORIA")}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span>${n((e==null?void 0:e.nav_right)||"SÉRIE")}</span>
        </div>
        <div style="${t(e)}font-size:22px;letter-spacing:.18em;color:#2e2e2e;text-transform:uppercase;margin-bottom:16px;">${n(i.section_number)}</div>
        <div style="${d(e)}font-size:${h(e,76)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:44px;">${n(i.section_title)}</div>
        <div style="${g(e)}font-size:${x(e,34)}px;color:#555;line-height:${f(e)};margin-bottom:64px;">${c}</div>
        <div style="margin-bottom:auto;padding-left:48px;">${s}</div>
        ${v?`<div style="${d(e)}font-size:${h(e,36)}px;color:#444;line-height:${m(e)};font-style:italic;padding-top:16px;border-top:1px solid #1a1a1a;">${v}</div>`:""}
        ${u(e)}
      </div>`},b(i,o,e){const l=(i.list_items||[]).map($=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <div style="width:20px;height:1px;background:#2a2a2a;flex-shrink:0;margin-top:14px;"></div>
          <span style="${g(e)}font-size:${x(e,36)}px;color:#3a3a3a;line-height:${f(e)};">${n($)}</span>
         </div>`).join(""),a=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",v=(e==null?void 0:e.brand_name)||"Marca",p=r(i.body_html||n(i.body||"")),y=r(i.conclusion_html||n(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#060606;display:flex;flex-direction:column;padding:54px 76px 80px;position:relative;overflow:hidden;">
        <div style="${d(e)}position:absolute;top:-20px;right:40px;font-size:480px;color:#111;line-height:1;user-select:none;pointer-events:none;letter-spacing:-.02em;">${n(i.section_number||"")}</div>
        <div style="display:flex;align-items:center;gap:22px;font-size:0;padding-bottom:40px;position:relative;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(a)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;position:relative;">
          <div style="${t(e)}font-size:18px;letter-spacing:.22em;color:#2e2e2e;text-transform:uppercase;margin-bottom:24px;">Seção ${n(i.section_number||"")}</div>
          <div style="${d(e)}font-size:${h(e,72)}px;line-height:${m(e)};font-weight:400;color:#e8e8e8;margin-bottom:40px;">${n(i.section_title)}</div>
          <div style="${g(e)}font-size:${x(e,36)}px;color:#505050;line-height:${f(e)};margin-bottom:48px;">${p}</div>
          <div style="margin-bottom:0;">${l}</div>
          <div style="margin-top:auto;padding-top:32px;">
            <div style="${d(e)}font-size:${x(e,36)}px;color:#2e2e2e;line-height:${f(e)};font-style:italic;">${y}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${t(e)}font-size:22px;color:#1e1e1e;">${n(c)} ${n(v)}</span>
          <span style="${t(e)}font-size:18px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${n(v)}</span>
        </div>
      </div>`},c(i,o,e){const l=(e==null?void 0:e.color_emphasis)||"#CCFF00",a=(i.list_items||[]).map(w=>`<div style="display:flex;gap:20px;margin-bottom:22px;align-items:center;">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="${l}" style="flex-shrink:0;"><rect width="8" height="8"/></svg>
          <span style="${g(e)}font-size:${x(e,36)}px;color:#666;line-height:${f(e)};">${n(w)}</span>
         </div>`).join(""),s=(e==null?void 0:e.nav_left)||"CATEGORIA",c=(e==null?void 0:e.nav_right)||"SÉRIE",v=(e==null?void 0:e.brand_symbol)||"⬥",p=(e==null?void 0:e.brand_name)||"Marca",y=r(i.body_html||n(i.body||"")),$=r(i.conclusion_html||n(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(c)}</span>
        </div>
        <div style="display:flex;gap:52px;align-items:flex-start;margin-bottom:52px;border-top:1px solid #1a1a1a;padding-top:36px;">
          <div style="flex:0 0 160px;">
            <div style="${t(e)}font-size:14px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;margin-bottom:8px;">Seção</div>
            <div style="${d(e)}font-size:120px;color:#161616;line-height:1;letter-spacing:-.02em;">${n(i.section_number||"")}</div>
          </div>
          <div style="flex:1;padding-top:8px;">
            <div style="${d(e)}font-size:${h(e,62)}px;line-height:${m(e)};font-weight:400;color:#fff;">${n(i.section_title)}</div>
          </div>
        </div>
        <div style="${g(e)}font-size:${x(e,36)}px;color:#666;line-height:${f(e)};margin-bottom:32px;">${y}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${g(e)}font-size:${x(e,36)}px;color:#3a3a3a;line-height:${f(e)};margin-bottom:auto;">${$}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${t(e)}font-size:22px;color:#252525;">${n(v)} ${n(p)}</span>
          <span style="${t(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(p)}</span>
        </div>
      </div>`}},steps:{a(i,o,e){const l=(i.steps||[]).map(s=>`<div style="margin-bottom:24px;">
          <span style="${g(e)}font-size:${x(e,36)}px;font-weight:500;color:#fff;">${n(s.label)}:</span>
          <span style="${g(e)}font-size:${x(e,36)}px;color:#666;"> ${r(s.text_html||n(s.text||""))}</span>
         </div>`).join(""),a=r(i.call_to_action_html||(i.call_to_action?n(i.call_to_action)+(i.call_to_action_italic?" <em>"+n(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${_(e)}
        ${i.section_title?`<div style="${d(e)}font-size:${h(e,48)}px;font-weight:400;color:#fff;margin-bottom:36px;">${n(i.section_title)}</div>`:""}
        <div style="flex:1;">${l}</div>
        <div style="${d(e)}font-size:${h(e,62)}px;font-weight:400;color:#fff;line-height:${m(e)};margin-bottom:auto;">
          ${a}
        </div>
        ${u(e)}
      </div>`},b(i,o,e){const l=(i.steps||[]).map(y=>{var $;return`<div style="display:flex;align-items:baseline;gap:36px;margin-bottom:32px;">
          <span style="${d(e)}font-size:100px;color:#161616;line-height:1;flex-shrink:0;width:100px;">${n((($=y.label.match(/\d+/))==null?void 0:$[0])||"")}</span>
          <div style="flex:1;">
            <div style="${t(e)}font-size:22px;font-weight:500;color:#aaa;letter-spacing:.06em;margin-bottom:6px;">${n(y.label.replace(/^\d+[:,.]?\s*/,""))}</div>
            <div style="${g(e)}font-size:${x(e,32)}px;color:#444;line-height:${f(e)};">${r(y.text_html||n(y.text||""))}</div>
          </div>
        </div>`}).join(""),a=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",v=(e==null?void 0:e.brand_name)||"Marca",p=r(i.call_to_action_html||(i.call_to_action?n(i.call_to_action)+(i.call_to_action_italic?" <em>"+n(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(a)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        ${i.section_title?`<div style="${t(e)}font-size:18px;letter-spacing:.2em;color:#2a2a2a;text-transform:uppercase;margin-bottom:48px;">${n(i.section_title)}</div>`:""}
        <div style="flex:1;">${l}</div>
        <div style="${d(e)}font-size:${h(e,62)}px;font-weight:400;color:#fff;line-height:${m(e)};margin-bottom:auto;padding-top:24px;">
          ${p}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${t(e)}font-size:22px;color:#252525;">${n(c)} ${n(v)}</span>
          <span style="${t(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(v)}</span>
        </div>
      </div>`},c(i,o,e){const l=i.steps||[],a=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=l.slice(0,4).map(p=>{let y='<div style="width:48px;height:48px;border-radius:50%;border:1px solid #1e1e1e;margin-bottom:20px;"></div>';return p.icon&&(p.icon.type==="lucide"&&p.icon.svg?y=`<div style="margin-bottom:20px;">${p.icon.svg}</div>`:p.icon.type==="upload"&&p.icon.src&&(y=`<img src="${n(p.icon.src)}" style="width:48px;height:48px;object-fit:contain;margin-bottom:20px;">`)),`<div style="background:#0d0d0d;border-radius:12px;padding:40px 36px;display:flex;flex-direction:column;">
          ${y}
          <div style="${t(e)}font-size:20px;color:#888;font-weight:500;letter-spacing:.04em;margin-bottom:12px;">${n(p.label.replace(/^\d+[:,.]?\s*/,""))}</div>
          <div style="${g(e)}font-size:${x(e,30)}px;color:#3a3a3a;line-height:${f(e)};">${r(p.text_html||n(p.text||""))}</div>
        </div>`}).join(""),v=r(i.call_to_action_html||(i.call_to_action?n(i.call_to_action)+(i.call_to_action_italic?" <em>"+n(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(a)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        <div style="${d(e)}font-size:${h(e,52)}px;font-weight:400;color:#fff;line-height:${m(e)};margin-bottom:40px;">${n(i.section_title||"")}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;">${c}</div>
        <div style="${d(e)}font-size:${h(e,48)}px;font-weight:400;color:#fff;line-height:${m(e)};padding-top:32px;">
          ${v}
        </div>
      </div>`}},overlay:{a(i,o,e){const l=o?`<img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',a=r(i.headline_html||n(i.headline||"")),s=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;position:relative;">
        <div style="height:680px;overflow:hidden;flex-shrink:0;">
          ${l}
        </div>
        <div style="position:absolute;left:0;right:0;top:296px;height:400px;background:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.5) 45%,rgba(0,0,0,.85) 72%,#000 100%);pointer-events:none;z-index:1;"></div>
        <div style="flex:1;padding:32px 62px 60px;display:flex;flex-direction:column;position:relative;z-index:2;">
          <div style="${t(e)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:36px;">
            <span>${n(i.section_number)}</span>
            <div style="flex:1;height:1px;background:#1e1e1e;"></div>
            <span>${n((e==null?void 0:e.nav_right)||"SÉRIE")}</span>
          </div>
          <div style="${t(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:12px;">${n((e==null?void 0:e.nav_left)||"CATEGORIA")}</div>
          <div style="${d(e)}font-size:${h(e,62)}px;font-weight:400;color:#fff;line-height:${m(e)};margin-bottom:24px;">${n(i.section_title)}</div>
          ${a?`<div style="${d(e)}font-size:${h(e,42)}px;font-weight:400;font-style:italic;color:#aaa;line-height:${m(e)};margin-bottom:40px;">${a}</div>`:""}
          <div style="${g(e)}font-size:${x(e,32)}px;color:#666;line-height:${f(e)};margin-bottom:auto;">${s}</div>
          ${u(e)}
        </div>
      </div>`},b(i,o,e){const l=o?`<img src="${o}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;${b(i)}">`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',a=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",v=(e==null?void 0:e.nav_right)||"SÉRIE",p=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),y=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;position:relative;overflow:hidden;">
        ${l}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.75) 40%,rgba(0,0,0,.2) 70%,transparent 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;align-items:center;gap:22px;">
            <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${n(c)}</span>
            <div style="flex:1;height:1px;background:rgba(255,255,255,.06);"></div>
            <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${n(v)}</span>
          </div>
          <div style="flex:1;"></div>
          <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#3a3a3a;text-transform:uppercase;margin-bottom:20px;">${n(i.section_number)} — ${n(i.section_title)}</div>
          <div style="${d(e)}font-size:${h(e,72)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:28px;">
            ${p}
          </div>
          <div style="${g(e)}font-size:${x(e,36)}px;color:#666;line-height:${f(e)};margin-bottom:36px;">${y}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="${t(e)}font-size:22px;color:#1e1e1e;">${n(a)} ${n(s)}</span>
            <span style="${t(e)}font-size:22px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${n(s)}</span>
          </div>
        </div>
      </div>`},c(i,o,e){const l=i.bg_blur_disabled?"":o?`<img src="${o}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(18px);opacity:0.22;transform:scale(1.06);transform-origin:center;">`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#1a2228,#0d1418);"></div>',a=o?`<img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',s=r(i.headline_html||n(i.headline||"")),c=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:14px 14px 0;position:relative;">
        <div style="position:absolute;inset:0;overflow:hidden;">
          ${l}
        </div>
        <div style="height:680px;border-radius:18px;overflow:hidden;flex-shrink:0;position:relative;z-index:1;">
          ${a}
        </div>
        <div style="flex:1;padding:32px 62px 60px;display:flex;flex-direction:column;position:relative;z-index:2;">
          <div style="${t(e)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:36px;">
            <span>${n(i.section_number)}</span>
            <div style="flex:1;height:1px;background:#1e1e1e;"></div>
            <span>${n((e==null?void 0:e.nav_right)||"SÉRIE")}</span>
          </div>
          <div style="${t(e)}font-size:22px;letter-spacing:.18em;color:#444;text-transform:uppercase;margin-bottom:12px;">${n((e==null?void 0:e.nav_left)||"CATEGORIA")}</div>
          <div style="${d(e)}font-size:${h(e,62)}px;font-weight:400;color:#fff;line-height:${m(e)};margin-bottom:24px;">${n(i.section_title)}</div>
          ${s?`<div style="${d(e)}font-size:${h(e,42)}px;font-weight:400;font-style:italic;color:#aaa;line-height:${m(e)};margin-bottom:40px;">${s}</div>`:""}
          <div style="${g(e)}font-size:${x(e,32)}px;color:#666;line-height:${f(e)};margin-bottom:auto;">${c}</div>
          ${u(e)}
        </div>
      </div>`}},cta:{a(i,o,e){const l=(e==null?void 0:e.brand_symbol)||"⬥",a=(e==null?void 0:e.brand_name)||"Marca",s=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),c=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;border:1px solid #161616;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="${t(e)}font-size:22px;color:#fff;margin-bottom:auto;">${n(l)} ${n(a)}</div>
        <div style="${d(e)}font-size:${h(e,84)}px;line-height:${m(e)};font-weight:400;font-style:italic;color:#fff;margin-bottom:40px;">
          ${s}
        </div>
        <div style="${g(e)}font-size:${x(e,36)}px;color:#444;line-height:${f(e)};margin-bottom:60px;">${c}</div>
        <div style="${g(e)}font-size:${x(e,36)}px;color:#fff;line-height:${f(e)};">
          ${n(i.cta_text)}
          <span style="text-decoration:underline;text-underline-offset:4px;">${n(i.cta_word)}</span>
          ${n(i.cta_suffix)}
        </div>
      </div>`},c(i,o,e){const l=(e==null?void 0:e.brand_symbol)||"⬥",a=(e==null?void 0:e.brand_name)||"Marca",s=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),c=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 96px;text-align:center;">
        <div style="${t(e)}font-size:22px;color:#252525;letter-spacing:.18em;margin-bottom:60px;">${n(l)} ${n(a)}</div>
        <div style="${d(e)}font-size:${h(e,84)}px;line-height:${m(e)};font-weight:400;color:#fff;margin-bottom:36px;">
          ${s}
        </div>
        <div style="width:80px;height:1px;background:#1c1c1c;margin-bottom:36px;"></div>
        <div style="${g(e)}font-size:${x(e,36)}px;color:#3a3a3a;line-height:${f(e)};margin-bottom:60px;">${c}</div>
        <div style="border:1px solid #2a2a2a;border-radius:9999px;padding:24px 60px;display:inline-block;">
          <div style="${g(e)}font-size:${x(e,30)}px;color:#555;letter-spacing:.04em;line-height:${f(e)};">
            ${n(i.cta_text)} <span style="color:#fff;font-weight:500;">${n(i.cta_word)}</span> ${n(i.cta_suffix)}
          </div>
        </div>
      </div>`}}};export{j as LAYOUT_NAMES,z as RENDERERS,k as getRenderer};
