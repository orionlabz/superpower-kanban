function n(i){return String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function r(i){return i||""}function w(i){const o=i.layout||"a",e=z[i.template];return(e==null?void 0:e[o])??(e==null?void 0:e.a)??z.dark.a}const k={cover:{a:"Ancorado",b:"Editorial",c:"Linha de corte"},dark:{a:"Stacked",b:"Nº fundo",c:"2 colunas"},steps:{a:"Lista",b:"Numerado",c:"Ícones"},overlay:{a:"Foto topo",b:"Full-bleed"},split:{a:"Padrão"},cta:{a:"Headline",c:"Centrado"}},g=i=>`font-family:'${(i==null?void 0:i.font_display)||"Playfair Display"}',serif;`,d=i=>`font-family:'${(i==null?void 0:i.font_body)||"Inter"}',sans-serif;`,t=i=>`font-family:'${(i==null?void 0:i.font_ui)||"JetBrains Mono"}',monospace;`,v=(i,o)=>Math.round((+(i==null?void 0:i.font_size_headline)||72)*o/72),p=(i,o)=>Math.round((+(i==null?void 0:i.font_size_body)||36)*o/36),y=i=>+(i==null?void 0:i.line_height_headline)||1.05,f=i=>+(i==null?void 0:i.line_height_body)||1.5;function b(i){const o=i.img_position;if(!o)return"";const e=o.x??50,a=o.y??50,l=o.scale??1;return`object-position:${e}% ${a}%;transform:scale(${l});transform-origin:${e}% ${a}%;`}function _(i){const o=(i==null?void 0:i.nav_left)||"CATEGORIA",e=(i==null?void 0:i.nav_right)||"SÉRIE";return`<div style="${t(i)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:96px;">
    <span>${n(o)}</span>
    <div style="flex:1;height:1px;background:#1e1e1e;"></div>
    <span>${n(e)}</span>
  </div>`}function u(i){const o=(i==null?void 0:i.brand_symbol)||"⬥",e=(i==null?void 0:i.brand_name)||"Marca";return`<div style="${t(i)}display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:36px;">
    <span style="font-size:28px;color:#252525;">${n(o)} ${n(e)}</span>
    <span style="font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(e.toUpperCase())}</span>
  </div>`}const z={cover:{a(i,o,e){const a=o?`<div style="position:absolute;inset:0;"><img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",x=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),m=r(i.body_html||n(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="${t(e)}font-size:22px;color:#fff;opacity:.9;">${n(l)} ${n(s)}</div>
          <div style="flex:1;"></div>
          <div style="${g(e)}font-size:${v(e,84)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:28px;">
            ${x}
          </div>
          <div style="${d(e)}font-size:${p(e,36)}px;color:#777;line-height:${f(e)};">${m}</div>
        </div>
      </div>`},b(i,o,e){const a=o?`<div style="position:absolute;inset:0;"><img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",x=(e==null?void 0:e.nav_left)||"CATEGORIA",m=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),c=r(i.body_html||n(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:auto;">
            <div style="${t(e)}font-size:22px;color:#fff;opacity:.9;">${n(l)} ${n(s)}</div>
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:24px;">${n(x)}</div>
            <div style="${g(e)}font-size:${v(e,84)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:28px;">
              ${m}
            </div>
            <div style="width:80px;height:1px;background:#2a2a2a;margin-bottom:28px;"></div>
            <div style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};">${c}</div>
          </div>
        </div>
      </div>`},c(i,o,e){const a=o?`<div style="position:absolute;inset:0;"><img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.7) 55%,rgba(0,0,0,.3) 100%);"></div></div>`:'<div style="position:absolute;inset:0;background:#050505;"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",x=(e==null?void 0:e.nav_left)||"CATEGORIA",m=(e==null?void 0:e.nav_right)||"SÉRIE",c=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),h=r(i.body_html||n(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
            <div style="${t(e)}font-size:22px;color:#fff;opacity:.85;">${n(l)} ${n(s)}</div>
            <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;">${n(m)}</div>
          </div>
          <div style="width:100%;height:1px;background:linear-gradient(to right,#fff,transparent);margin-bottom:48px;"></div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="${g(e)}font-size:${v(e,84)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:28px;">
              ${c}
            </div>
            <div style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};">${h}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#252525;text-transform:uppercase;">${n(x)}</div>
          </div>
        </div>
      </div>`}},split:{a(i,o,e){const a=o?`<img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}filter:grayscale(90%) contrast(1.05);">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),s=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;display:flex;background:#000;">
        <div style="flex:0 0 52%;display:flex;flex-direction:column;padding:54px 52px 60px 76px;">
          ${_(e)}
          <div style="${g(e)}font-size:${v(e,62)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:28px;">
            ${l}
          </div>
          <div style="${d(e)}font-size:${p(e,36)}px;color:#777;line-height:${f(e)};margin-bottom:auto;">${s}</div>
          ${u(e)}
        </div>
        <div style="flex:0 0 48%;overflow:hidden;">${a}</div>
      </div>`}},dark:{a(i,o,e){const a=(i.list_items||[]).map(x=>`<div style="display:flex;gap:16px;margin-bottom:16px;">
          <span style="${d(e)}color:#555;font-size:${p(e,36)}px;flex-shrink:0;">·</span>
          <span style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};">${n(x)}</span>
         </div>`).join(""),l=r(i.body_html||n(i.body||"")),s=r(i.conclusion_html||n(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${_(e)}
        <div style="${t(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:16px;">${n(i.section_number)}</div>
        <div style="${g(e)}font-size:${v(e,62)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:36px;">${n(i.section_title)}</div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};margin-bottom:32px;">${l}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#555;line-height:${f(e)};margin-bottom:auto;">${s}</div>
        ${u(e)}
      </div>`},b(i,o,e){const a=(i.list_items||[]).map($=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <div style="width:20px;height:1px;background:#2a2a2a;flex-shrink:0;margin-top:14px;"></div>
          <span style="${d(e)}font-size:${p(e,36)}px;color:#3a3a3a;line-height:${f(e)};">${n($)}</span>
         </div>`).join(""),l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",x=(e==null?void 0:e.brand_symbol)||"⬥",m=(e==null?void 0:e.brand_name)||"Marca",c=r(i.body_html||n(i.body||"")),h=r(i.conclusion_html||n(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#060606;display:flex;flex-direction:column;padding:54px 76px 80px;position:relative;overflow:hidden;">
        <div style="${g(e)}position:absolute;top:-20px;right:40px;font-size:480px;color:#111;line-height:1;user-select:none;pointer-events:none;letter-spacing:-.02em;">${n(i.section_number||"")}</div>
        <div style="display:flex;align-items:center;gap:22px;font-size:0;padding-bottom:40px;position:relative;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;position:relative;">
          <div style="${t(e)}font-size:18px;letter-spacing:.22em;color:#2e2e2e;text-transform:uppercase;margin-bottom:24px;">Seção ${n(i.section_number||"")}</div>
          <div style="${g(e)}font-size:${v(e,72)}px;line-height:${y(e)};font-weight:400;color:#e8e8e8;margin-bottom:40px;">${n(i.section_title)}</div>
          <div style="${d(e)}font-size:${p(e,36)}px;color:#505050;line-height:${f(e)};margin-bottom:48px;">${c}</div>
          <div style="margin-bottom:0;">${a}</div>
          <div style="margin-top:auto;padding-top:32px;">
            <div style="${g(e)}font-size:${p(e,36)}px;color:#2e2e2e;line-height:${f(e)};font-style:italic;">${h}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${t(e)}font-size:22px;color:#1e1e1e;">${n(x)} ${n(m)}</span>
          <span style="${t(e)}font-size:18px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${n(m)}</span>
        </div>
      </div>`},c(i,o,e){const a=(i.list_items||[]).map($=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <span style="${d(e)}color:#555;font-size:${p(e,36)}px;flex-shrink:0;">·</span>
          <span style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};">${n($)}</span>
         </div>`).join(""),l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",x=(e==null?void 0:e.brand_symbol)||"⬥",m=(e==null?void 0:e.brand_name)||"Marca",c=r(i.body_html||n(i.body||"")),h=r(i.conclusion_html||n(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        <div style="display:flex;gap:52px;align-items:flex-start;margin-bottom:52px;border-top:1px solid #1a1a1a;padding-top:36px;">
          <div style="flex:0 0 160px;">
            <div style="${t(e)}font-size:14px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;margin-bottom:8px;">Seção</div>
            <div style="${g(e)}font-size:120px;color:#161616;line-height:1;letter-spacing:-.02em;">${n(i.section_number||"")}</div>
          </div>
          <div style="flex:1;padding-top:8px;">
            <div style="${g(e)}font-size:${v(e,62)}px;line-height:${y(e)};font-weight:400;color:#fff;">${n(i.section_title)}</div>
          </div>
        </div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};margin-bottom:32px;">${c}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#3a3a3a;line-height:${f(e)};margin-bottom:auto;">${h}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${t(e)}font-size:22px;color:#252525;">${n(x)} ${n(m)}</span>
          <span style="${t(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(m)}</span>
        </div>
      </div>`}},steps:{a(i,o,e){const a=(i.steps||[]).map(s=>`<div style="margin-bottom:24px;">
          <span style="${d(e)}font-size:${p(e,36)}px;font-weight:500;color:#fff;">${n(s.label)}:</span>
          <span style="${d(e)}font-size:${p(e,36)}px;color:#666;"> ${r(s.text_html||n(s.text||""))}</span>
         </div>`).join(""),l=r(i.call_to_action_html||(i.call_to_action?n(i.call_to_action)+(i.call_to_action_italic?" <em>"+n(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${_(e)}
        ${i.section_title?`<div style="${g(e)}font-size:${v(e,48)}px;font-weight:400;color:#fff;margin-bottom:36px;">${n(i.section_title)}</div>`:""}
        <div style="flex:1;">${a}</div>
        <div style="${g(e)}font-size:${v(e,62)}px;font-weight:400;color:#fff;line-height:${y(e)};margin-bottom:auto;">
          ${l}
        </div>
        ${u(e)}
      </div>`},b(i,o,e){const a=(i.steps||[]).map(h=>{var $;return`<div style="display:flex;align-items:baseline;gap:36px;margin-bottom:32px;">
          <span style="${g(e)}font-size:100px;color:#161616;line-height:1;flex-shrink:0;width:100px;">${n((($=h.label.match(/\d+/))==null?void 0:$[0])||"")}</span>
          <div style="flex:1;">
            <div style="${t(e)}font-size:22px;font-weight:500;color:#aaa;letter-spacing:.06em;margin-bottom:6px;">${n(h.label.replace(/^\d+[:,.]?\s*/,""))}</div>
            <div style="${d(e)}font-size:${p(e,32)}px;color:#444;line-height:${f(e)};">${r(h.text_html||n(h.text||""))}</div>
          </div>
        </div>`}).join(""),l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",x=(e==null?void 0:e.brand_symbol)||"⬥",m=(e==null?void 0:e.brand_name)||"Marca",c=r(i.call_to_action_html||(i.call_to_action?n(i.call_to_action)+(i.call_to_action_italic?" <em>"+n(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        ${i.section_title?`<div style="${t(e)}font-size:18px;letter-spacing:.2em;color:#2a2a2a;text-transform:uppercase;margin-bottom:48px;">${n(i.section_title)}</div>`:""}
        <div style="flex:1;">${a}</div>
        <div style="${g(e)}font-size:${v(e,62)}px;font-weight:400;color:#fff;line-height:${y(e)};margin-bottom:auto;padding-top:24px;">
          ${c}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${t(e)}font-size:22px;color:#252525;">${n(x)} ${n(m)}</span>
          <span style="${t(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(m)}</span>
        </div>
      </div>`},c(i,o,e){const a=i.steps||[],l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",x=a.slice(0,4).map(c=>{let h='<div style="width:48px;height:48px;border-radius:50%;border:1px solid #1e1e1e;margin-bottom:20px;"></div>';return c.icon&&(c.icon.type==="lucide"&&c.icon.svg?h=`<div style="margin-bottom:20px;">${c.icon.svg}</div>`:c.icon.type==="upload"&&c.icon.src&&(h=`<img src="${n(c.icon.src)}" style="width:48px;height:48px;object-fit:contain;margin-bottom:20px;">`)),`<div style="background:#0d0d0d;border-radius:12px;padding:40px 36px;display:flex;flex-direction:column;">
          ${h}
          <div style="${t(e)}font-size:20px;color:#888;font-weight:500;letter-spacing:.04em;margin-bottom:12px;">${n(c.label.replace(/^\d+[:,.]?\s*/,""))}</div>
          <div style="${d(e)}font-size:${p(e,30)}px;color:#3a3a3a;line-height:${f(e)};">${r(c.text_html||n(c.text||""))}</div>
        </div>`}).join(""),m=r(i.call_to_action_html||(i.call_to_action?n(i.call_to_action)+(i.call_to_action_italic?" <em>"+n(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
        </div>
        <div style="${g(e)}font-size:${v(e,52)}px;font-weight:400;color:#fff;line-height:${y(e)};margin-bottom:40px;">${n(i.section_title||"")}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;">${x}</div>
        <div style="${g(e)}font-size:${v(e,48)}px;font-weight:400;color:#fff;line-height:${y(e)};padding-top:32px;">
          ${m}
        </div>
      </div>`}},overlay:{a(i,o,e){const a=o?`<img src="${o}" style="width:100%;height:100%;object-fit:cover;${b(i)}">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=r(i.headline_html||n(i.headline||"")),s=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:14px 14px 0;">
        <div style="height:680px;border-radius:18px;overflow:hidden;position:relative;flex-shrink:0;">
          ${a}
          <div style="position:absolute;bottom:0;left:0;right:0;height:420px;background:linear-gradient(to top,#000 0%,rgba(0,0,0,.96) 10%,rgba(0,0,0,.88) 20%,rgba(0,0,0,.76) 32%,rgba(0,0,0,.6) 46%,rgba(0,0,0,.42) 60%,rgba(0,0,0,.24) 74%,rgba(0,0,0,.1) 87%,transparent 100%);"></div>
        </div>
        <div style="flex:1;padding:32px 62px 60px;display:flex;flex-direction:column;">
          <div style="${t(e)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:36px;">
            <span>${n(i.section_number)}</span>
            <div style="flex:1;height:1px;background:#1e1e1e;"></div>
            <span>${n((e==null?void 0:e.nav_right)||"SÉRIE")}</span>
          </div>
          <div style="${t(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:12px;">${n((e==null?void 0:e.nav_left)||"CATEGORIA")}</div>
          <div style="${g(e)}font-size:${v(e,62)}px;font-weight:400;color:#fff;line-height:${y(e)};margin-bottom:12px;">${n(i.section_title)}</div>
          ${l?`<div style="${g(e)}font-size:${v(e,42)}px;font-weight:400;font-style:italic;color:#aaa;line-height:${y(e)};margin-bottom:40px;">${l}</div>`:""}
          <div style="${d(e)}font-size:${p(e,32)}px;color:#666;line-height:${f(e)};margin-bottom:auto;">${s}</div>
          ${u(e)}
        </div>
      </div>`},b(i,o,e){const a=o?`<img src="${o}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;${b(i)}">`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",x=(e==null?void 0:e.nav_left)||"CATEGORIA",m=(e==null?void 0:e.nav_right)||"SÉRIE",c=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),h=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;position:relative;overflow:hidden;">
        ${a}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.75) 40%,rgba(0,0,0,.2) 70%,transparent 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;align-items:center;gap:22px;">
            <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${n(x)}</span>
            <div style="flex:1;height:1px;background:rgba(255,255,255,.06);"></div>
            <span style="${t(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${n(m)}</span>
          </div>
          <div style="flex:1;"></div>
          <div style="${t(e)}font-size:18px;letter-spacing:.18em;color:#3a3a3a;text-transform:uppercase;margin-bottom:20px;">${n(i.section_number)} — ${n(i.section_title)}</div>
          <div style="${g(e)}font-size:${v(e,72)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:28px;">
            ${c}
          </div>
          <div style="${d(e)}font-size:${p(e,36)}px;color:#666;line-height:${f(e)};margin-bottom:36px;">${h}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="${t(e)}font-size:22px;color:#1e1e1e;">${n(l)} ${n(s)}</span>
            <span style="${t(e)}font-size:22px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${n(s)}</span>
          </div>
        </div>
      </div>`}},cta:{a(i,o,e){const a=(e==null?void 0:e.brand_symbol)||"⬥",l=(e==null?void 0:e.brand_name)||"Marca",s=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),x=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;border:1px solid #161616;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="${t(e)}font-size:22px;color:#fff;margin-bottom:auto;">${n(a)} ${n(l)}</div>
        <div style="${g(e)}font-size:${v(e,84)}px;line-height:${y(e)};font-weight:400;font-style:italic;color:#fff;margin-bottom:40px;">
          ${s}
        </div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#444;line-height:${f(e)};margin-bottom:60px;">${x}</div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#fff;line-height:${f(e)};">
          ${n(i.cta_text)}
          <span style="text-decoration:underline;text-underline-offset:4px;">${n(i.cta_word)}</span>
          ${n(i.cta_suffix)}
        </div>
      </div>`},c(i,o,e){const a=(e==null?void 0:e.brand_symbol)||"⬥",l=(e==null?void 0:e.brand_name)||"Marca",s=r(i.headline_html||(i.headline?n(i.headline)+(i.headline_italic?" <em>"+n(i.headline_italic)+"</em>":""):"")),x=r(i.body_html||n(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 96px;text-align:center;">
        <div style="${t(e)}font-size:22px;color:#252525;letter-spacing:.18em;margin-bottom:60px;">${n(a)} ${n(l)}</div>
        <div style="${g(e)}font-size:${v(e,84)}px;line-height:${y(e)};font-weight:400;color:#fff;margin-bottom:36px;">
          ${s}
        </div>
        <div style="width:80px;height:1px;background:#1c1c1c;margin-bottom:36px;"></div>
        <div style="${d(e)}font-size:${p(e,36)}px;color:#3a3a3a;line-height:${f(e)};margin-bottom:60px;">${x}</div>
        <div style="border:1px solid #2a2a2a;border-radius:9999px;padding:24px 60px;display:inline-block;">
          <div style="${d(e)}font-size:${p(e,30)}px;color:#555;letter-spacing:.04em;line-height:${f(e)};">
            ${n(i.cta_text)} <span style="color:#fff;font-weight:500;">${n(i.cta_word)}</span> ${n(i.cta_suffix)}
          </div>
        </div>
      </div>`}}};export{k as LAYOUT_NAMES,z as RENDERERS,w as getRenderer};
