function t(i){return String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function r(i){return i||""}function $(i){const n=i.layout||"a",e=b[i.template];return(e==null?void 0:e[n])??(e==null?void 0:e.a)??b.dark.a}const u={cover:{a:"Ancorado",b:"Editorial",c:"Linha de corte"},dark:{a:"Stacked",b:"Nº fundo",c:"2 colunas"},steps:{a:"Lista",b:"Numerado",c:"Ícones"},overlay:{a:"Foto topo",b:"Full-bleed"},split:{a:"Padrão"},cta:{a:"Headline",c:"Centrado"}},x=i=>`font-family:'${(i==null?void 0:i.font_display)||"Playfair Display"}',serif;`,p=i=>`font-family:'${(i==null?void 0:i.font_body)||"Inter"}',sans-serif;`,o=i=>`font-family:'${(i==null?void 0:i.font_ui)||"JetBrains Mono"}',monospace;`;function v(i){const n=i.img_position;if(!n)return"";const e=n.x??50,a=n.y??50,l=n.scale??1;return`object-position:${e}% ${a}%;transform:scale(${l});transform-origin:${e}% ${a}%;`}function h(i){const n=(i==null?void 0:i.nav_left)||"CATEGORIA",e=(i==null?void 0:i.nav_right)||"SÉRIE";return`<div style="${o(i)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:96px;">
    <span>${t(n)}</span>
    <div style="flex:1;height:1px;background:#1e1e1e;"></div>
    <span>${t(e)}</span>
  </div>`}function y(i){const n=(i==null?void 0:i.brand_symbol)||"⬥",e=(i==null?void 0:i.brand_name)||"Marca";return`<div style="${o(i)}display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:36px;">
    <span style="font-size:28px;color:#252525;">${t(n)} ${t(e)}</span>
    <span style="font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${t(e.toUpperCase())}</span>
  </div>`}const b={cover:{a(i,n,e){const a=n?`<div style="position:absolute;inset:0;"><img src="${n}" style="width:100%;height:100%;object-fit:cover;${v(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),f=r(i.body_html||t(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="${o(e)}font-size:22px;color:#fff;opacity:.9;">${t(l)} ${t(s)}</div>
          <div style="flex:1;"></div>
          <div style="${x(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
            ${c}
          </div>
          <div style="${p(e)}font-size:32px;color:#777;line-height:1.5;">${f}</div>
        </div>
      </div>`},b(i,n,e){const a=n?`<div style="position:absolute;inset:0;"><img src="${n}" style="width:100%;height:100%;object-fit:cover;${v(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",f=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),d=r(i.body_html||t(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:auto;">
            <div style="${o(e)}font-size:22px;color:#fff;opacity:.9;">${t(l)} ${t(s)}</div>
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="${o(e)}font-size:18px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:24px;">${t(c)}</div>
            <div style="${x(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
              ${f}
            </div>
            <div style="width:80px;height:1px;background:#2a2a2a;margin-bottom:28px;"></div>
            <div style="${p(e)}font-size:32px;color:#666;line-height:1.5;">${d}</div>
          </div>
        </div>
      </div>`},c(i,n,e){const a=n?`<div style="position:absolute;inset:0;"><img src="${n}" style="width:100%;height:100%;object-fit:cover;${v(i)}filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.7) 55%,rgba(0,0,0,.3) 100%);"></div></div>`:'<div style="position:absolute;inset:0;background:#050505;"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",f=(e==null?void 0:e.nav_right)||"SÉRIE",d=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),g=r(i.body_html||t(i.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
            <div style="${o(e)}font-size:22px;color:#fff;opacity:.85;">${t(l)} ${t(s)}</div>
            <div style="${o(e)}font-size:18px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;">${t(f)}</div>
          </div>
          <div style="width:100%;height:1px;background:linear-gradient(to right,#fff,transparent);margin-bottom:48px;"></div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="${x(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
              ${d}
            </div>
            <div style="${p(e)}font-size:32px;color:#666;line-height:1.5;">${g}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="${o(e)}font-size:18px;letter-spacing:.18em;color:#252525;text-transform:uppercase;">${t(c)}</div>
          </div>
        </div>
      </div>`}},split:{a(i,n,e){const a=n?`<img src="${n}" style="width:100%;height:100%;object-fit:cover;${v(i)}filter:grayscale(90%) contrast(1.05);">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),s=r(i.body_html||t(i.body||""));return`<div style="width:1080px;height:1350px;display:flex;background:#000;">
        <div style="flex:0 0 52%;display:flex;flex-direction:column;padding:54px 52px 60px 76px;">
          ${h(e)}
          <div style="${x(e)}font-size:62px;line-height:1.1;font-weight:400;color:#fff;margin-bottom:28px;">
            ${l}
          </div>
          <div style="${p(e)}font-size:32px;color:#777;line-height:1.5;margin-bottom:auto;">${s}</div>
          ${y(e)}
        </div>
        <div style="flex:0 0 48%;overflow:hidden;">${a}</div>
      </div>`}},dark:{a(i,n,e){const a=(i.list_items||[]).map(c=>`<div style="display:flex;gap:16px;margin-bottom:16px;">
          <span style="${p(e)}color:#555;font-size:32px;flex-shrink:0;">·</span>
          <span style="${p(e)}font-size:32px;color:#666;line-height:1.45;">${t(c)}</span>
         </div>`).join(""),l=r(i.body_html||t(i.body||"")),s=r(i.conclusion_html||t(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${h(e)}
        <div style="${o(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:16px;">${t(i.section_number)}</div>
        <div style="${x(e)}font-size:62px;line-height:1.1;font-weight:400;color:#fff;margin-bottom:36px;">${t(i.section_title)}</div>
        <div style="${p(e)}font-size:32px;color:#666;line-height:1.5;margin-bottom:32px;">${l}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${p(e)}font-size:32px;color:#555;line-height:1.5;margin-bottom:auto;">${s}</div>
        ${y(e)}
      </div>`},b(i,n,e){const a=(i.list_items||[]).map(m=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <div style="width:20px;height:1px;background:#2a2a2a;flex-shrink:0;margin-top:14px;"></div>
          <span style="${p(e)}font-size:32px;color:#3a3a3a;line-height:1.45;">${t(m)}</span>
         </div>`).join(""),l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",f=(e==null?void 0:e.brand_name)||"Marca",d=r(i.body_html||t(i.body||"")),g=r(i.conclusion_html||t(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#060606;display:flex;flex-direction:column;padding:54px 76px 80px;position:relative;overflow:hidden;">
        <div style="${x(e)}position:absolute;top:-20px;right:40px;font-size:480px;color:#111;line-height:1;user-select:none;pointer-events:none;letter-spacing:-.02em;">${t(i.section_number||"")}</div>
        <div style="display:flex;align-items:center;gap:22px;font-size:0;padding-bottom:40px;position:relative;">
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(s)}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;position:relative;">
          <div style="${o(e)}font-size:18px;letter-spacing:.22em;color:#2e2e2e;text-transform:uppercase;margin-bottom:24px;">Seção ${t(i.section_number||"")}</div>
          <div style="${x(e)}font-size:72px;line-height:1.05;font-weight:400;color:#e8e8e8;margin-bottom:40px;">${t(i.section_title)}</div>
          <div style="${p(e)}font-size:32px;color:#505050;line-height:1.6;margin-bottom:48px;">${d}</div>
          <div style="margin-bottom:0;">${a}</div>
          <div style="margin-top:auto;padding-top:32px;">
            <div style="${x(e)}font-size:32px;color:#2e2e2e;line-height:1.5;font-style:italic;">${g}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${o(e)}font-size:22px;color:#1e1e1e;">${t(c)} ${t(f)}</span>
          <span style="${o(e)}font-size:18px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${t(f)}</span>
        </div>
      </div>`},c(i,n,e){const a=(i.list_items||[]).map(m=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <span style="${p(e)}color:#555;font-size:32px;flex-shrink:0;">·</span>
          <span style="${p(e)}font-size:32px;color:#666;line-height:1.45;">${t(m)}</span>
         </div>`).join(""),l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",f=(e==null?void 0:e.brand_name)||"Marca",d=r(i.body_html||t(i.body||"")),g=r(i.conclusion_html||t(i.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(s)}</span>
        </div>
        <div style="display:flex;gap:52px;align-items:flex-start;margin-bottom:52px;border-top:1px solid #1a1a1a;padding-top:36px;">
          <div style="flex:0 0 160px;">
            <div style="${o(e)}font-size:14px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;margin-bottom:8px;">Seção</div>
            <div style="${x(e)}font-size:120px;color:#161616;line-height:1;letter-spacing:-.02em;">${t(i.section_number||"")}</div>
          </div>
          <div style="flex:1;padding-top:8px;">
            <div style="${x(e)}font-size:62px;line-height:1.1;font-weight:400;color:#fff;">${t(i.section_title)}</div>
          </div>
        </div>
        <div style="${p(e)}font-size:32px;color:#666;line-height:1.5;margin-bottom:32px;">${d}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${p(e)}font-size:32px;color:#3a3a3a;line-height:1.5;margin-bottom:auto;">${g}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${o(e)}font-size:22px;color:#252525;">${t(c)} ${t(f)}</span>
          <span style="${o(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${t(f)}</span>
        </div>
      </div>`}},steps:{a(i,n,e){const a=(i.steps||[]).map(s=>`<div style="margin-bottom:24px;">
          <span style="${p(e)}font-size:32px;font-weight:500;color:#fff;">${t(s.label)}:</span>
          <span style="${p(e)}font-size:32px;color:#666;"> ${r(s.text_html||t(s.text||""))}</span>
         </div>`).join(""),l=r(i.call_to_action_html||(i.call_to_action?t(i.call_to_action)+(i.call_to_action_italic?" <em>"+t(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${h(e)}
        ${i.section_title?`<div style="${x(e)}font-size:48px;font-weight:400;color:#fff;margin-bottom:36px;">${t(i.section_title)}</div>`:""}
        <div style="flex:1;">${a}</div>
        <div style="${x(e)}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:auto;">
          ${l}
        </div>
        ${y(e)}
      </div>`},b(i,n,e){const a=(i.steps||[]).map(g=>{var m;return`<div style="display:flex;align-items:baseline;gap:36px;margin-bottom:32px;">
          <span style="${x(e)}font-size:100px;color:#161616;line-height:1;flex-shrink:0;width:100px;">${t(((m=g.label.match(/\d+/))==null?void 0:m[0])||"")}</span>
          <div style="flex:1;">
            <div style="${o(e)}font-size:22px;font-weight:500;color:#aaa;letter-spacing:.06em;margin-bottom:6px;">${t(g.label.replace(/^\d+[:,.]?\s*/,""))}</div>
            <div style="${p(e)}font-size:28px;color:#444;line-height:1.5;">${r(g.text_html||t(g.text||""))}</div>
          </div>
        </div>`}).join(""),l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",f=(e==null?void 0:e.brand_name)||"Marca",d=r(i.call_to_action_html||(i.call_to_action?t(i.call_to_action)+(i.call_to_action_italic?" <em>"+t(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(s)}</span>
        </div>
        ${i.section_title?`<div style="${o(e)}font-size:18px;letter-spacing:.2em;color:#2a2a2a;text-transform:uppercase;margin-bottom:48px;">${t(i.section_title)}</div>`:""}
        <div style="flex:1;">${a}</div>
        <div style="${x(e)}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:auto;padding-top:24px;">
          ${d}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${o(e)}font-size:22px;color:#252525;">${t(c)} ${t(f)}</span>
          <span style="${o(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${t(f)}</span>
        </div>
      </div>`},c(i,n,e){const a=i.steps||[],l=(e==null?void 0:e.nav_left)||"CATEGORIA",s=(e==null?void 0:e.nav_right)||"SÉRIE",c=a.slice(0,4).map(d=>{let g='<div style="width:48px;height:48px;border-radius:50%;border:1px solid #1e1e1e;margin-bottom:20px;"></div>';return d.icon&&(d.icon.type==="lucide"&&d.icon.svg?g=`<div style="margin-bottom:20px;">${d.icon.svg}</div>`:d.icon.type==="upload"&&d.icon.src&&(g=`<img src="${t(d.icon.src)}" style="width:48px;height:48px;object-fit:contain;margin-bottom:20px;">`)),`<div style="background:#0d0d0d;border-radius:12px;padding:40px 36px;display:flex;flex-direction:column;">
          ${g}
          <div style="${o(e)}font-size:20px;color:#888;font-weight:500;letter-spacing:.04em;margin-bottom:12px;">${t(d.label.replace(/^\d+[:,.]?\s*/,""))}</div>
          <div style="${p(e)}font-size:26px;color:#3a3a3a;line-height:1.5;">${r(d.text_html||t(d.text||""))}</div>
        </div>`}).join(""),f=r(i.call_to_action_html||(i.call_to_action?t(i.call_to_action)+(i.call_to_action_italic?" <em>"+t(i.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(l)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${t(s)}</span>
        </div>
        <div style="${x(e)}font-size:52px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:40px;">${t(i.section_title||"")}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;">${c}</div>
        <div style="${x(e)}font-size:48px;font-weight:400;color:#fff;line-height:1.1;padding-top:32px;">
          ${f}
        </div>
      </div>`}},overlay:{a(i,n,e){const a=n?`<img src="${n}" style="width:100%;height:100%;object-fit:cover;${v(i)}">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=r(i.body_html||t(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:14px 14px 0;">
        <div style="height:680px;border-radius:18px;overflow:hidden;position:relative;flex-shrink:0;">
          ${a}
          <div style="position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,#000,transparent);"></div>
        </div>
        <div style="flex:1;padding:32px 62px 60px;display:flex;flex-direction:column;">
          ${h(e)}
          <div style="${o(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:12px;">${t(i.section_number)}</div>
          <div style="${x(e)}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:16px;">${t(i.section_title)}</div>
          <div style="${x(e)}font-size:36px;font-weight:400;font-style:italic;color:#aaa;margin-bottom:20px;">${t(i.headline)}</div>
          <div style="${p(e)}font-size:28px;color:#666;line-height:1.5;margin-bottom:auto;">${l}</div>
          ${y(e)}
        </div>
      </div>`},b(i,n,e){const a=n?`<img src="${n}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;${v(i)}">`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',l=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",f=(e==null?void 0:e.nav_right)||"SÉRIE",d=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),g=r(i.body_html||t(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;position:relative;overflow:hidden;">
        ${a}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.75) 40%,rgba(0,0,0,.2) 70%,transparent 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;align-items:center;gap:22px;">
            <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${t(c)}</span>
            <div style="flex:1;height:1px;background:rgba(255,255,255,.06);"></div>
            <span style="${o(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${t(f)}</span>
          </div>
          <div style="flex:1;"></div>
          <div style="${o(e)}font-size:18px;letter-spacing:.18em;color:#3a3a3a;text-transform:uppercase;margin-bottom:20px;">${t(i.section_number)} — ${t(i.section_title)}</div>
          <div style="${x(e)}font-size:72px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
            ${d}
          </div>
          <div style="${p(e)}font-size:32px;color:#666;line-height:1.5;margin-bottom:36px;">${g}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="${o(e)}font-size:22px;color:#1e1e1e;">${t(l)} ${t(s)}</span>
            <span style="${o(e)}font-size:22px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${t(s)}</span>
          </div>
        </div>
      </div>`}},cta:{a(i,n,e){const a=(e==null?void 0:e.brand_symbol)||"⬥",l=(e==null?void 0:e.brand_name)||"Marca",s=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),c=r(i.body_html||t(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;border:1px solid #161616;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="${o(e)}font-size:22px;color:#fff;margin-bottom:auto;">${t(a)} ${t(l)}</div>
        <div style="${x(e)}font-size:84px;line-height:1.05;font-weight:400;font-style:italic;color:#fff;margin-bottom:40px;">
          ${s}
        </div>
        <div style="${p(e)}font-size:32px;color:#444;line-height:1.5;margin-bottom:60px;">${c}</div>
        <div style="${p(e)}font-size:32px;color:#fff;line-height:1.4;">
          ${t(i.cta_text)}
          <span style="text-decoration:underline;text-underline-offset:4px;">${t(i.cta_word)}</span>
          ${t(i.cta_suffix)}
        </div>
      </div>`},c(i,n,e){const a=(e==null?void 0:e.brand_symbol)||"⬥",l=(e==null?void 0:e.brand_name)||"Marca",s=r(i.headline_html||(i.headline?t(i.headline)+(i.headline_italic?" <em>"+t(i.headline_italic)+"</em>":""):"")),c=r(i.body_html||t(i.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 96px;text-align:center;">
        <div style="${o(e)}font-size:22px;color:#252525;letter-spacing:.18em;margin-bottom:60px;">${t(a)} ${t(l)}</div>
        <div style="${x(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:36px;">
          ${s}
        </div>
        <div style="width:80px;height:1px;background:#1c1c1c;margin-bottom:36px;"></div>
        <div style="${p(e)}font-size:32px;color:#3a3a3a;line-height:1.6;margin-bottom:60px;">${c}</div>
        <div style="border:1px solid #2a2a2a;border-radius:9999px;padding:24px 60px;display:inline-block;">
          <div style="${p(e)}font-size:30px;color:#555;letter-spacing:.04em;line-height:1.4;">
            ${t(i.cta_text)} <span style="color:#fff;font-weight:500;">${t(i.cta_word)}</span> ${t(i.cta_suffix)}
          </div>
        </div>
      </div>`}}};export{u as LAYOUT_NAMES,b as RENDERERS,$ as getRenderer};
