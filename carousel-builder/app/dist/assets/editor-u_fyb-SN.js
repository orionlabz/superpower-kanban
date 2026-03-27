import{a as j,S as o,n as L,s as x}from"./index-CCL2nX-W.js";function G(t){t||(t=D());const i=t.font_display||"Playfair Display",e=t.font_body||"Inter";return`<style>
@import url('${F(i,e)}');
:root {
  --t-bg: ${t.color_bg||"#000"};
  --t-text: ${t.color_text||"#e8e8e8"};
  --t-emphasis: ${t.color_emphasis||"#CCFF00"};
  --t-secondary: ${t.color_secondary||"#666"};
  --t-detail: ${t.color_detail||"#2a2a2a"};
  --t-border: ${t.color_border||"#1e1e1e"};
  --t-font-display: '${i}';
  --t-font-body: '${e}';
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--t-bg); }
em { font-style: italic; }
strong { font-weight: 700; }
.accent { color: var(--t-emphasis); }
</style>`}function F(t,i){const e=[],a=s=>s.replace(/ /g,"+");return e.push(`family=${a(t)}:ital,wght@0,400;0,500;1,400;1,500`),i!==t&&e.push(`family=${a(i)}:wght@300;400;500;600`),`https://fonts.googleapis.com/css2?${e.join("&")}&display=swap`}function D(){return{font_display:"Playfair Display",font_body:"Inter",color_bg:"#000000",color_text:"#e8e8e8",color_emphasis:"#CCFF00",color_secondary:"#666666",color_detail:"#2a2a2a",color_border:"#1e1e1e",brand_name:"Marca",brand_symbol:"⬥",nav_left:"CATEGORIA",nav_right:"SÉRIE"}}function n(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function f(t){return t||""}function U(t){const i=t.layout||"a",e=M[t.template];return(e==null?void 0:e[i])??(e==null?void 0:e.a)??M.dark.a}const Y={cover:{a:"Ancorado",b:"Editorial",c:"Linha de corte"},dark:{a:"Stacked",b:"Nº fundo",c:"2 colunas"},steps:{a:"Lista",b:"Numerado",c:"Ícones"},overlay:{a:"Foto topo",b:"Full-bleed"},split:{a:"Padrão"},cta:{a:"Headline",c:"Centrado"}},g=t=>`font-family:'${(t==null?void 0:t.font_display)||"Playfair Display"}',serif;`,d=t=>`font-family:'${(t==null?void 0:t.font_body)||"Inter"}',sans-serif;`;function S(t){const i=(t==null?void 0:t.nav_left)||"CATEGORIA",e=(t==null?void 0:t.nav_right)||"SÉRIE";return`<div style="${d(t)}display:flex;align-items:center;gap:22px;font-size:22px;letter-spacing:.18em;color:#303030;text-transform:uppercase;margin-bottom:96px;">
    <span>${n(i)}</span>
    <div style="flex:1;height:1px;background:#1e1e1e;"></div>
    <span>${n(e)}</span>
  </div>`}function C(t){const i=(t==null?void 0:t.brand_symbol)||"⬥",e=(t==null?void 0:t.brand_name)||"Marca";return`<div style="${d(t)}display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:36px;">
    <span style="font-size:28px;color:#252525;">${n(i)} ${n(e)}</span>
    <span style="font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(e.toUpperCase())}</span>
  </div>`}const M={cover:{a(t,i,e){const a=i?`<div style="position:absolute;inset:0;"><img src="${i}" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',s=(e==null?void 0:e.brand_symbol)||"⬥",r=(e==null?void 0:e.brand_name)||"Marca",c=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),p=f(t.body_html||n(t.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="${d(e)}font-size:22px;color:#fff;opacity:.9;">${n(s)} ${n(r)}</div>
          <div style="flex:1;"></div>
          <div style="${g(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
            ${c}
          </div>
          <div style="${d(e)}font-size:27px;color:#777;line-height:1.5;">${p}</div>
        </div>
      </div>`},b(t,i,e){const a=i?`<div style="position:absolute;inset:0;"><img src="${i}" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.6) 42%,transparent 72%);"></div></div>`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',s=(e==null?void 0:e.brand_symbol)||"⬥",r=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",p=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),l=f(t.body_html||n(t.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:auto;">
            <div style="${d(e)}font-size:22px;color:#fff;opacity:.9;">${n(s)} ${n(r)}</div>
          </div>
          <div style="display:flex;flex-direction:column;">
            <div style="${d(e)}font-size:18px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:24px;">${n(c)}</div>
            <div style="${g(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
              ${p}
            </div>
            <div style="width:80px;height:1px;background:#2a2a2a;margin-bottom:28px;"></div>
            <div style="${d(e)}font-size:27px;color:#666;line-height:1.5;">${l}</div>
          </div>
        </div>
      </div>`},c(t,i,e){const a=i?`<div style="position:absolute;inset:0;"><img src="${i}" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.6);"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.7) 55%,rgba(0,0,0,.3) 100%);"></div></div>`:'<div style="position:absolute;inset:0;background:#050505;"></div>',s=(e==null?void 0:e.brand_symbol)||"⬥",r=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",p=(e==null?void 0:e.nav_right)||"SÉRIE",l=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),v=f(t.body_html||n(t.body||""));return`<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;">
        ${a}
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">
            <div style="${d(e)}font-size:22px;color:#fff;opacity:.85;">${n(s)} ${n(r)}</div>
            <div style="${d(e)}font-size:18px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;">${n(p)}</div>
          </div>
          <div style="width:100%;height:1px;background:linear-gradient(to right,#fff,transparent);margin-bottom:48px;"></div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
            <div style="${g(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
              ${l}
            </div>
            <div style="${d(e)}font-size:27px;color:#666;line-height:1.5;">${v}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="${d(e)}font-size:18px;letter-spacing:.18em;color:#252525;text-transform:uppercase;">${n(c)}</div>
          </div>
        </div>
      </div>`}},split:{a(t,i,e){const a=i?`<img src="${i}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(90%) contrast(1.05);">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',s=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),r=f(t.body_html||n(t.body||""));return`<div style="width:1080px;height:1350px;display:flex;background:#000;">
        <div style="flex:0 0 52%;display:flex;flex-direction:column;padding:54px 52px 60px 76px;">
          ${S(e)}
          <div style="${g(e)}font-size:62px;line-height:1.1;font-weight:400;color:#fff;margin-bottom:28px;">
            ${s}
          </div>
          <div style="${d(e)}font-size:27px;color:#777;line-height:1.5;margin-bottom:auto;">${r}</div>
          ${C(e)}
        </div>
        <div style="flex:0 0 48%;overflow:hidden;">${a}</div>
      </div>`}},dark:{a(t,i,e){const a=(t.list_items||[]).map(c=>`<div style="display:flex;gap:16px;margin-bottom:16px;">
          <span style="${d(e)}color:#555;font-size:27px;flex-shrink:0;">·</span>
          <span style="${d(e)}font-size:27px;color:#666;line-height:1.45;">${n(c)}</span>
         </div>`).join(""),s=f(t.body_html||n(t.body||"")),r=f(t.conclusion_html||n(t.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${S(e)}
        <div style="${d(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:16px;">${n(t.section_number)}</div>
        <div style="${g(e)}font-size:62px;line-height:1.1;font-weight:400;color:#fff;margin-bottom:36px;">${n(t.section_title)}</div>
        <div style="${d(e)}font-size:27px;color:#666;line-height:1.5;margin-bottom:32px;">${s}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${d(e)}font-size:27px;color:#555;line-height:1.5;margin-bottom:auto;">${r}</div>
        ${C(e)}
      </div>`},b(t,i,e){const a=(t.list_items||[]).map(u=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <div style="width:20px;height:1px;background:#2a2a2a;flex-shrink:0;margin-top:14px;"></div>
          <span style="${d(e)}font-size:27px;color:#3a3a3a;line-height:1.45;">${n(u)}</span>
         </div>`).join(""),s=(e==null?void 0:e.nav_left)||"CATEGORIA",r=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",p=(e==null?void 0:e.brand_name)||"Marca",l=f(t.body_html||n(t.body||"")),v=f(t.conclusion_html||n(t.conclusion||""));return`<div style="width:1080px;height:1350px;background:#060606;display:flex;flex-direction:column;padding:54px 76px 80px;position:relative;overflow:hidden;">
        <div style="${g(e)}position:absolute;top:-20px;right:40px;font-size:480px;color:#111;line-height:1;user-select:none;pointer-events:none;letter-spacing:-.02em;">${n(t.section_number||"")}</div>
        <div style="display:flex;align-items:center;gap:22px;font-size:0;padding-bottom:40px;position:relative;">
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(r)}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;position:relative;">
          <div style="${d(e)}font-size:18px;letter-spacing:.22em;color:#2e2e2e;text-transform:uppercase;margin-bottom:24px;">Seção ${n(t.section_number||"")}</div>
          <div style="${g(e)}font-size:72px;line-height:1.05;font-weight:400;color:#e8e8e8;margin-bottom:40px;">${n(t.section_title)}</div>
          <div style="${d(e)}font-size:27px;color:#505050;line-height:1.6;margin-bottom:48px;">${l}</div>
          <div style="margin-bottom:0;">${a}</div>
          <div style="margin-top:auto;padding-top:32px;">
            <div style="${g(e)}font-size:27px;color:#2e2e2e;line-height:1.5;font-style:italic;">${v}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${d(e)}font-size:22px;color:#1e1e1e;">${n(c)} ${n(p)}</span>
          <span style="${d(e)}font-size:18px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${n(p)}</span>
        </div>
      </div>`},c(t,i,e){const a=(t.list_items||[]).map(u=>`<div style="display:flex;gap:28px;margin-bottom:22px;align-items:baseline;">
          <span style="${d(e)}color:#555;font-size:27px;flex-shrink:0;">·</span>
          <span style="${d(e)}font-size:27px;color:#666;line-height:1.45;">${n(u)}</span>
         </div>`).join(""),s=(e==null?void 0:e.nav_left)||"CATEGORIA",r=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",p=(e==null?void 0:e.brand_name)||"Marca",l=f(t.body_html||n(t.body||"")),v=f(t.conclusion_html||n(t.conclusion||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(r)}</span>
        </div>
        <div style="display:flex;gap:52px;align-items:flex-start;margin-bottom:52px;border-top:1px solid #1a1a1a;padding-top:36px;">
          <div style="flex:0 0 160px;">
            <div style="${d(e)}font-size:14px;letter-spacing:.18em;color:#2a2a2a;text-transform:uppercase;margin-bottom:8px;">Seção</div>
            <div style="${g(e)}font-size:120px;color:#161616;line-height:1;letter-spacing:-.02em;">${n(t.section_number||"")}</div>
          </div>
          <div style="flex:1;padding-top:8px;">
            <div style="${g(e)}font-size:62px;line-height:1.1;font-weight:400;color:#fff;">${n(t.section_title)}</div>
          </div>
        </div>
        <div style="${d(e)}font-size:27px;color:#666;line-height:1.5;margin-bottom:32px;">${l}</div>
        <div style="margin-bottom:24px;">${a}</div>
        <div style="${d(e)}font-size:27px;color:#3a3a3a;line-height:1.5;margin-bottom:auto;">${v}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${d(e)}font-size:22px;color:#252525;">${n(c)} ${n(p)}</span>
          <span style="${d(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(p)}</span>
        </div>
      </div>`}},steps:{a(t,i,e){const a=(t.steps||[]).map(r=>`<div style="margin-bottom:24px;">
          <span style="${d(e)}font-size:27px;font-weight:500;color:#fff;">${n(r.label)}:</span>
          <span style="${d(e)}font-size:27px;color:#666;"> ${f(r.text_html||n(r.text||""))}</span>
         </div>`).join(""),s=f(t.call_to_action_html||(t.call_to_action?n(t.call_to_action)+(t.call_to_action_italic?" <em>"+n(t.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 60px;">
        ${S(e)}
        ${t.section_title?`<div style="${g(e)}font-size:48px;font-weight:400;color:#fff;margin-bottom:36px;">${n(t.section_title)}</div>`:""}
        <div style="flex:1;">${a}</div>
        <div style="${g(e)}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:auto;">
          ${s}
        </div>
        ${C(e)}
      </div>`},b(t,i,e){const a=(t.steps||[]).map(v=>{var u;return`<div style="display:flex;align-items:baseline;gap:36px;margin-bottom:32px;">
          <span style="${g(e)}font-size:100px;color:#161616;line-height:1;flex-shrink:0;width:100px;">${n(((u=v.label.match(/\d+/))==null?void 0:u[0])||"")}</span>
          <div style="flex:1;">
            <div style="${d(e)}font-size:22px;font-weight:500;color:#aaa;letter-spacing:.06em;margin-bottom:6px;">${n(v.label.replace(/^\d+[:,.]?\s*/,""))}</div>
            <div style="${d(e)}font-size:24px;color:#444;line-height:1.5;">${f(v.text_html||n(v.text||""))}</div>
          </div>
        </div>`}).join(""),s=(e==null?void 0:e.nav_left)||"CATEGORIA",r=(e==null?void 0:e.nav_right)||"SÉRIE",c=(e==null?void 0:e.brand_symbol)||"⬥",p=(e==null?void 0:e.brand_name)||"Marca",l=f(t.call_to_action_html||(t.call_to_action?n(t.call_to_action)+(t.call_to_action_italic?" <em>"+n(t.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(r)}</span>
        </div>
        ${t.section_title?`<div style="${d(e)}font-size:18px;letter-spacing:.2em;color:#2a2a2a;text-transform:uppercase;margin-bottom:48px;">${n(t.section_title)}</div>`:""}
        <div style="flex:1;">${a}</div>
        <div style="${g(e)}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:auto;padding-top:24px;">
          ${l}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:36px;">
          <span style="${d(e)}font-size:22px;color:#252525;">${n(c)} ${n(p)}</span>
          <span style="${d(e)}font-size:22px;letter-spacing:.14em;color:#252525;text-transform:uppercase;">${n(p)}</span>
        </div>
      </div>`},c(t,i,e){const a=t.steps||[],s=(e==null?void 0:e.nav_left)||"CATEGORIA",r=(e==null?void 0:e.nav_right)||"SÉRIE",c=a.slice(0,4).map(l=>{let v='<div style="width:48px;height:48px;border-radius:50%;border:1px solid #1e1e1e;margin-bottom:20px;"></div>';return l.icon&&(l.icon.type==="lucide"&&l.icon.svg?v=`<div style="margin-bottom:20px;">${l.icon.svg}</div>`:l.icon.type==="upload"&&l.icon.src&&(v=`<img src="${n(l.icon.src)}" style="width:48px;height:48px;object-fit:contain;margin-bottom:20px;">`)),`<div style="background:#0d0d0d;border-radius:12px;padding:40px 36px;display:flex;flex-direction:column;">
          ${v}
          <div style="${d(e)}font-size:20px;color:#888;font-weight:500;letter-spacing:.04em;margin-bottom:12px;">${n(l.label.replace(/^\d+[:,.]?\s*/,""))}</div>
          <div style="${d(e)}font-size:22px;color:#3a3a3a;line-height:1.5;">${f(l.text_html||n(l.text||""))}</div>
        </div>`}).join(""),p=f(t.call_to_action_html||(t.call_to_action?n(t.call_to_action)+(t.call_to_action_italic?" <em>"+n(t.call_to_action_italic)+"</em>":""):""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px;">
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(s)}</span>
          <div style="flex:1;height:1px;background:#1e1e1e;"></div>
          <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:#282828;text-transform:uppercase;">${n(r)}</span>
        </div>
        <div style="${g(e)}font-size:52px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:40px;">${n(t.section_title||"")}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;">${c}</div>
        <div style="${g(e)}font-size:48px;font-weight:400;color:#fff;line-height:1.1;padding-top:32px;">
          ${p}
        </div>
      </div>`}},overlay:{a(t,i,e){const a=i?`<img src="${i}" style="width:100%;height:100%;object-fit:cover;">`:'<div style="width:100%;height:100%;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',s=f(t.body_html||n(t.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;padding:14px 14px 0;">
        <div style="height:680px;border-radius:18px;overflow:hidden;position:relative;flex-shrink:0;">
          ${a}
          <div style="position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,#000,transparent);"></div>
        </div>
        <div style="flex:1;padding:32px 62px 60px;display:flex;flex-direction:column;">
          ${S(e)}
          <div style="${d(e)}font-size:22px;letter-spacing:.18em;color:#333;text-transform:uppercase;margin-bottom:12px;">${n(t.section_number)}</div>
          <div style="${g(e)}font-size:62px;font-weight:400;color:#fff;line-height:1.1;margin-bottom:16px;">${n(t.section_title)}</div>
          <div style="${g(e)}font-size:36px;font-weight:400;font-style:italic;color:#aaa;margin-bottom:20px;">${n(t.headline)}</div>
          <div style="${d(e)}font-size:24px;color:#666;line-height:1.5;margin-bottom:auto;">${s}</div>
          ${C(e)}
        </div>
      </div>`},b(t,i,e){const a=i?`<img src="${i}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`:'<div style="position:absolute;inset:0;background:linear-gradient(160deg,#2a3540,#1a2228);"></div>',s=(e==null?void 0:e.brand_symbol)||"⬥",r=(e==null?void 0:e.brand_name)||"Marca",c=(e==null?void 0:e.nav_left)||"CATEGORIA",p=(e==null?void 0:e.nav_right)||"SÉRIE",l=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),v=f(t.body_html||n(t.body||""));return`<div style="width:1080px;height:1350px;background:#000;position:relative;overflow:hidden;">
        ${a}
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.97) 0%,rgba(0,0,0,.75) 40%,rgba(0,0,0,.2) 70%,transparent 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:54px 76px 80px;">
          <div style="display:flex;align-items:center;gap:22px;">
            <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${n(c)}</span>
            <div style="flex:1;height:1px;background:rgba(255,255,255,.06);"></div>
            <span style="${d(e)}font-size:18px;letter-spacing:.18em;color:rgba(255,255,255,.18);text-transform:uppercase;">${n(p)}</span>
          </div>
          <div style="flex:1;"></div>
          <div style="${d(e)}font-size:18px;letter-spacing:.18em;color:#3a3a3a;text-transform:uppercase;margin-bottom:20px;">${n(t.section_number)} — ${n(t.section_title)}</div>
          <div style="${g(e)}font-size:72px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:28px;">
            ${l}
          </div>
          <div style="${d(e)}font-size:27px;color:#666;line-height:1.5;margin-bottom:36px;">${v}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="${d(e)}font-size:22px;color:#1e1e1e;">${n(s)} ${n(r)}</span>
            <span style="${d(e)}font-size:22px;letter-spacing:.14em;color:#1a1a1a;text-transform:uppercase;">${n(r)}</span>
          </div>
        </div>
      </div>`}},cta:{a(t,i,e){const a=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",r=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),c=f(t.body_html||n(t.body||""));return`<div style="width:1080px;height:1350px;background:#000;border:1px solid #161616;display:flex;flex-direction:column;padding:54px 76px 80px;">
        <div style="${d(e)}font-size:22px;color:#fff;margin-bottom:auto;">${n(a)} ${n(s)}</div>
        <div style="${g(e)}font-size:84px;line-height:1.05;font-weight:400;font-style:italic;color:#fff;margin-bottom:40px;">
          ${r}
        </div>
        <div style="${d(e)}font-size:27px;color:#444;line-height:1.5;margin-bottom:60px;">${c}</div>
        <div style="${d(e)}font-size:32px;color:#fff;line-height:1.4;">
          ${n(t.cta_text)}
          <span style="text-decoration:underline;text-underline-offset:4px;">${n(t.cta_word)}</span>
          ${n(t.cta_suffix)}
        </div>
      </div>`},c(t,i,e){const a=(e==null?void 0:e.brand_symbol)||"⬥",s=(e==null?void 0:e.brand_name)||"Marca",r=f(t.headline_html||(t.headline?n(t.headline)+(t.headline_italic?" <em>"+n(t.headline_italic)+"</em>":""):"")),c=f(t.body_html||n(t.body||""));return`<div style="width:1080px;height:1350px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 96px;text-align:center;">
        <div style="${d(e)}font-size:22px;color:#252525;letter-spacing:.18em;margin-bottom:60px;">${n(a)} ${n(s)}</div>
        <div style="${g(e)}font-size:84px;line-height:1.05;font-weight:400;color:#fff;margin-bottom:36px;">
          ${r}
        </div>
        <div style="width:80px;height:1px;background:#1c1c1c;margin-bottom:36px;"></div>
        <div style="${d(e)}font-size:27px;color:#3a3a3a;line-height:1.6;margin-bottom:60px;">${c}</div>
        <div style="border:1px solid #2a2a2a;border-radius:9999px;padding:24px 60px;display:inline-block;">
          <div style="${d(e)}font-size:30px;color:#555;letter-spacing:.04em;line-height:1.4;">
            ${n(t.cta_text)} <span style="color:#fff;font-weight:500;">${n(t.cta_word)}</span> ${n(t.cta_suffix)}
          </div>
        </div>
      </div>`}}},W={dark:{template:"dark",layout:"a",section_number:"",section_title:"",body:"",list_items:[],conclusion:""}},V=[0,2e3,8e3,2e4],J=[12,30,55,80];let I=[];function y(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function T(t){const i=o.slides[t];if(!i)return'<!DOCTYPE html><html><body style="background:#111;width:1080px;height:1350px;"></body></html>';const a=U(i)(i,o.images[t]||null,o.theme);return`<!DOCTYPE html><html><head><meta charset="UTF-8">${G(o.theme)}</head><body style="margin:0;overflow:hidden;">${a}</body></html>`}function K(t){const i=document.getElementById("canvas-loading");if(!i)return;i.classList.remove("hidden");const e=document.getElementById("loading-topic");e&&(e.textContent=t||"");const a=document.getElementById("loading-bar");a&&(a.style.width="0%"),document.querySelectorAll(".loading-step").forEach(p=>{p.classList.remove("active","done");const l=p.querySelector(".step-icon");l&&(l.textContent="")});let s=0;const r=document.getElementById("loading-elapsed");r&&(r.textContent="0s");const c=setInterval(()=>{s++,r&&(r.textContent=s+"s")},1e3);I.push(c),V.forEach((p,l)=>{const v=setTimeout(()=>{if(l>0){const _=document.getElementById("step-"+(l-1));if(_){_.classList.remove("active"),_.classList.add("done");const $=_.querySelector(".step-icon");$&&($.textContent="✓")}}const u=document.getElementById("step-"+l);u&&u.classList.add("active"),a&&(a.style.width=J[l]+"%")},p);I.push(v)})}function N(){I.forEach(i=>{clearInterval(i),clearTimeout(i)}),I=[];const t=document.getElementById("canvas-loading");t&&t.classList.add("hidden")}function E(){Q(),h(),w()}function Q(){const t=document.getElementById("sidebar");if(!t)return;t.innerHTML="",o.slides.forEach((e,a)=>{const s=document.createElement("div");s.className="thumb-item"+(a===o.active?" active":""),s.onclick=()=>H(a);const r=document.createElement("div");r.className="thumb-wrap";const c=document.createElement("iframe");c.srcdoc=T(a),c.title="Slide "+(a+1),r.appendChild(c);const p=document.createElement("div");p.className="thumb-label",p.textContent=a+1+" · "+e.template,s.appendChild(r),s.appendChild(p),t.appendChild(s)});const i=document.createElement("button");i.className="btn-add-slide",i.textContent="+ Slide",i.onclick=ve,t.appendChild(i)}function h(){const t=document.getElementById("preview-col"),i=document.getElementById("preview-wrap");if(!t||!i)return;const e=t.clientHeight-80,a=t.clientWidth-32,s=Math.min(e/1350,a/1080,1),r=Math.round(1080*s),c=Math.round(1350*s);i.style.width=r+"px",i.style.height=c+"px",i.style.overflow="hidden",i.style.flexShrink="0",i.innerHTML="";const p=document.createElement("iframe");p.style.width="1080px",p.style.height="1350px",p.style.transformOrigin="top left",p.style.transform=`scale(${s})`,p.style.border="none",p.style.display="block",p.srcdoc=T(o.active),p.title="Preview",i.appendChild(p);const l=o.slides[o.active],v=document.getElementById("layout-pills");if(l&&v){const u=Y[l.template]||{},_=l.layout||"a";v.innerHTML=Object.entries(u).map(([$,z])=>`<button class="pill${$===_?" active":""}" data-layout="${y($)}">${y(z)}</button>`).join(""),v.querySelectorAll(".pill").forEach($=>{$.onclick=()=>me($.dataset.layout)})}}function w(){const t=document.getElementById("edit-panel");if(!t)return;const i=o.slides[o.active];if(!i){t.innerHTML="";return}const e=i.template,a=["cover","split","overlay"].includes(e),s=o.images[o.active],r=o.slides.length>1;function c(m,b,A){return`<div class="field-group"><div class="field-label">${y(b)}</div>
      <input class="field-input" value="${y(A||"")}" data-key="${y(m)}"></div>`}function p(m,b,A){return`<div class="field-group"><div class="field-label">${y(b)}</div>
      <textarea class="field-textarea" data-key="${y(m)}">${y(A||"")}</textarea></div>`}let l=`<div class="panel-header">
    <div class="panel-title">Slide ${o.active+1} · ${y(e)}</div>
    ${r?'<button class="btn-delete" id="btn-delete-slide">Excluir</button>':""}
  </div>`;a&&(l+=`<div class="field-group"><div class="field-label">Imagem</div>
      ${s?`<div class="img-preview-wrap">
             <img class="img-preview" src="${s}">
             <button class="btn-remove-img" id="btn-remove-img">Remover</button>
           </div>`:`<div class="drop-zone">
             <input type="file" accept="image/*" id="inp-img">
             <div class="drop-zone-icon">⊕</div>
             <div class="drop-zone-text">Clique para fazer upload<br>JPG · PNG · WEBP</div>
           </div>`}
    </div>`),(e==="cover"||e==="split")&&(l+=c("headline","Headline",i.headline),l+=c("headline_italic","Headline (itálico)",i.headline_italic),l+=p("body","Corpo",i.body)),e==="dark"&&(l+=c("section_number","Número da seção",i.section_number),l+=c("section_title","Título da seção",i.section_title),l+=p("body","Corpo",i.body),l+=`<div class="field-group"><div class="field-label">Itens da lista</div>
      <div class="list-items-wrap" id="list-items-wrap">
        ${(i.list_items||[]).map((m,b)=>`<div class="list-item-row">
            <input class="field-input" value="${y(m)}" data-list-idx="${b}">
            <button class="btn-remove" data-list-remove="${b}">×</button>
          </div>`).join("")}
      </div>
      ${(i.list_items||[]).length<4?'<button class="btn-add-item" id="btn-add-list-item">+ Adicionar</button>':""}
    </div>`,l+=p("conclusion","Conclusão",i.conclusion)),e==="steps"&&(l+=c("section_title","Título (opcional)",i.section_title||""),l+=`<div class="field-group"><div class="field-label">Etapas</div>
      <div class="steps-wrap" id="steps-wrap">
        ${(i.steps||[]).map((m,b)=>`<div class="step-row">
            <div class="step-row-top">
              <input class="field-input step-label-input" value="${y(m.label)}" placeholder="Etapa ${b+1}" data-step-idx="${b}" data-step-field="label">
              <button class="btn-remove" data-step-remove="${b}">×</button>
            </div>
            <input class="field-input" value="${y(m.text)}" placeholder="Texto da etapa" data-step-idx="${b}" data-step-field="text">
            ${i.layout==="c"?Z(b,(i.steps[b]||{}).icon):""}
          </div>`).join("")}
      </div>
      ${(i.steps||[]).length<4?'<button class="btn-add-item" id="btn-add-step">+ Etapa</button>':""}
    </div>`,l+=c("call_to_action","Chamada final",i.call_to_action),l+=c("call_to_action_italic","Chamada final (itálico)",i.call_to_action_italic)),e==="overlay"&&(l+=c("section_number","Número da seção",i.section_number),l+=c("section_title","Título",i.section_title),l+=c("headline","Headline",i.headline),l+=p("body","Corpo",i.body)),e==="cta"&&(l+=c("headline","Headline",i.headline),l+=c("headline_italic","Headline (itálico)",i.headline_italic),l+=p("body","Corpo",i.body),l+=c("cta_text","Texto do CTA",i.cta_text),l+=c("cta_word","Palavra em destaque",i.cta_word),l+=c("cta_suffix","Sufixo do CTA",i.cta_suffix)),l+=`<div class="refine-section">
    <button class="btn-refine" id="btn-refine-toggle">✦ Refinar com IA</button>
    <div id="refine-wrap" class="refine-input-wrap">
      <textarea id="refine-instr" class="field-textarea" placeholder="O que você quer mudar neste slide?" rows="3"></textarea>
      <div class="refine-actions">
        <button id="btn-refine-ok" class="btn-confirm">Refinar</button>
        <button id="btn-refine-cancel" class="btn-cancel">Cancelar</button>
      </div>
    </div>
  </div>`,t.innerHTML=l,t.querySelectorAll("input[data-key], textarea[data-key]").forEach(m=>{m.addEventListener("input",()=>oe(m.dataset.key,m.value))});const v=t.querySelector("#btn-delete-slide");v&&(v.onclick=pe);const u=t.querySelector("#btn-remove-img");u&&(u.onclick=ge);const _=t.querySelector("#inp-img");_&&(_.onchange=m=>fe(m)),t.querySelectorAll("input[data-list-idx]").forEach(m=>{m.addEventListener("input",()=>ae(Number(m.dataset.listIdx),m.value))}),t.querySelectorAll("[data-list-remove]").forEach(m=>{m.onclick=()=>se(Number(m.dataset.listRemove))});const $=t.querySelector("#btn-add-list-item");$&&($.onclick=le),t.querySelectorAll("input[data-step-idx]").forEach(m=>{m.addEventListener("input",()=>de(Number(m.dataset.stepIdx),m.dataset.stepField,m.value))}),t.querySelectorAll("[data-step-remove]").forEach(m=>{m.onclick=()=>re(Number(m.dataset.stepRemove))});const z=t.querySelector("#btn-add-step");z&&(z.onclick=ce);const q=t.querySelector("#btn-refine-toggle");q&&(q.onclick=()=>{const m=document.getElementById("refine-wrap");m&&m.classList.toggle("open")});const R=t.querySelector("#btn-refine-ok");R&&(R.onclick=ue);const B=t.querySelector("#btn-refine-cancel");B&&(B.onclick=()=>{const m=document.getElementById("refine-wrap");m&&m.classList.remove("open")}),ee()}function O(t,i=48,e="#333"){if(!window.lucide||!lucide.icons[t])return null;const[,,a]=lucide.icons[t],s=a.map(([r,c])=>{const p=Object.entries(c).map(([l,v])=>`${l}="${v}"`).join(" ");return`<${r} ${p}/>`}).join("");return`<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${i}" viewBox="0 0 24 24" fill="none" stroke="${e}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${s}</svg>`}function X(t){return window.lucide?Object.keys(lucide.icons).filter(i=>i.includes(t.toLowerCase().replace(/\s+/g,"-"))).slice(0,30):[]}function Z(t,i){const e=(i==null?void 0:i.type)==="lucide"&&i.svg?i.svg:null,a=(i==null?void 0:i.type)==="upload"?i.src:null,s=e||(a?`<img src="${a}" style="width:18px;height:18px;object-fit:contain;">`:'<div style="width:18px;height:18px;border:1px dashed #333;border-radius:3px;"></div>');return`<div class="icon-picker" id="icon-picker-${t}">
    <div class="field-label">Ícone</div>
    <div class="icon-current">${s}<span style="font-size:11px;color:#555;">${y((i==null?void 0:i.name)||"nenhum")}</span></div>
    <div class="icon-search-wrap">
      <input class="field-input icon-search-input" placeholder="buscar ícone…" data-icon-search="${t}">
    </div>
    <div id="icon-grid-${t}" class="icon-grid"></div>
    <div style="display:flex;align-items:center;gap:6px;">
      <span class="field-label" style="margin:0;">ou upload</span>
      <input type="file" accept="image/png,image/svg+xml" style="font-size:11px;color:#666;flex:1;" data-icon-upload="${t}">
    </div>
  </div>`}function ee(){const t=document.getElementById("edit-panel");t&&(t.querySelectorAll("[data-icon-search]").forEach(i=>{const e=Number(i.dataset.iconSearch);i.addEventListener("input",()=>te(e,i.value))}),t.querySelectorAll("[data-icon-upload]").forEach(i=>{const e=Number(i.dataset.iconUpload);i.onchange=()=>ne(e,i)}))}function te(t,i){var c,p,l;const e=document.getElementById("icon-grid-"+t);if(!e||!i){e&&(e.innerHTML="");return}const a=X(i),s=o.slides[o.active],r=(l=(p=(c=s==null?void 0:s.steps)==null?void 0:c[t])==null?void 0:p.icon)==null?void 0:l.name;e.innerHTML=a.map(v=>{const u=O(v,14,"#888");return u?`<button class="icon-btn${v===r?" selected":""}" title="${y(v)}" data-icon-name="${y(v)}" data-step-idx="${t}">${u}</button>`:""}).join(""),e.querySelectorAll(".icon-btn").forEach(v=>{v.onclick=()=>ie(Number(v.dataset.stepIdx),v.dataset.iconName)})}function ie(t,i){const e=O(i,48,"#333");e&&P(t,{type:"lucide",name:i,svg:e})}function ne(t,i){const e=i.files[0];if(!e||!["image/png","image/svg+xml"].includes(e.type))return;const a=new FileReader;a.onload=s=>{let r=s.target.result;e.type==="image/svg+xml"&&(r="data:image/svg+xml;base64,"+btoa(atob(r.split(",")[1]).replace(/<script[\s\S]*?<\/script>/gi,""))),P(t,{type:"upload",src:r})},a.readAsDataURL(e)}function P(t,i){const e=o.slides[o.active];!e||!e.steps||!e.steps[t]||(e.steps[t].icon=i,k(o.active),h(),w(),x())}function H(t){o.active=t,E()}function oe(t,i){o.slides[o.active][t]=i,k(o.active),h(),x()}function ae(t,i){o.slides[o.active].list_items[t]=i,k(o.active),h(),x()}function le(){(o.slides[o.active].list_items||[]).length>=4||(o.slides[o.active].list_items=[...o.slides[o.active].list_items||[],""],w(),h(),x())}function se(t){o.slides[o.active].list_items.splice(t,1),w(),h(),x()}function de(t,i,e){o.slides[o.active].steps[t][i]=e,k(o.active),h(),x()}function ce(){const t=o.slides[o.active].steps||[];t.length>=4||(t.push({label:"Etapa "+(t.length+1),text:""}),o.slides[o.active].steps=t,w(),h(),x())}function re(t){o.slides[o.active].steps.splice(t,1),w(),h(),x()}function pe(){if(o.slides.length<=1)return;o.slides.splice(o.active,1);const t={};Object.keys(o.images).forEach(i=>{const e=Number(i);e<o.active?t[e]=o.images[e]:e>o.active&&(t[e-1]=o.images[e])}),o.images=t,o.active=Math.min(o.active,o.slides.length-1),E(),x()}function ve(){o.slides.splice(o.active+1,0,{...W.dark}),H(o.active+1),x()}function me(t){o.slides[o.active]&&(o.slides[o.active].layout=t,k(o.active),h(),w(),x())}function fe(t){const i=t.target.files[0];if(!i)return;const e=new FileReader;e.onload=a=>{o.images[o.active]=a.target.result,w(),k(o.active),h(),x()},e.readAsDataURL(i)}function ge(){delete o.images[o.active],w(),k(o.active),h(),x()}function k(t){const e=document.querySelectorAll(".thumb-item")[t];if(!e)return;const a=e.querySelector("iframe");a&&(a.srcdoc=T(t))}async function ue(){const t=document.getElementById("refine-instr"),i=t==null?void 0:t.value.trim();if(!i)return;const e=document.getElementById("btn-refine-ok");e&&(e.textContent="…",e.disabled=!0);try{const a=await j.refine(o.slides[o.active],i),s=o.slides[o.active].layout;o.slides[o.active]=a,s&&!o.slides[o.active].layout&&(o.slides[o.active].layout=s),E(),x()}catch(a){alert("Erro ao refinar: "+a.message)}finally{e&&(e.textContent="Refinar",e.disabled=!1)}}function be(){const t=document.getElementById("app");t&&(t.innerHTML=`
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
    </div>`,document.getElementById("btn-back").onclick=()=>L("project",{projectId:o.projectId}),o.carousel&&(document.getElementById("editor-topic").textContent=o.carousel.title||""),o.slides.length>0&&E())}function he(){N()}function $e(){var e;(e=document.getElementById("new-carousel-modal"))==null||e.remove();let t=8;const i=document.createElement("div");i.className="modal-overlay",i.id="new-carousel-modal",i.innerHTML=`
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
    </div>`,document.body.appendChild(i),i.querySelector("#modal-close").onclick=()=>i.remove(),i.addEventListener("click",a=>{a.target===i&&i.remove()}),i.querySelector("#modal-count-dec").onclick=()=>{t=Math.max(3,t-1),i.querySelector("#modal-count-val").textContent=t},i.querySelector("#modal-count-inc").onclick=()=>{t=Math.min(15,t+1),i.querySelector("#modal-count-val").textContent=t},i.querySelector("#modal-submit").onclick=async()=>{const a=i.querySelector("#modal-topic").value.trim();if(!a){i.querySelector("#modal-topic").focus();return}const s={topic:a,audience:i.querySelector("#modal-audience").value.trim(),cta:i.querySelector("#modal-cta").value.trim(),slideCount:t};i.remove(),await ye(s)}}async function ye(t){const i=await j.carousels.create(o.projectId,t.topic);o.carouselId=i.id,await L("editor",{projectId:o.projectId,carouselId:i.id}),K(t.topic);try{const e=await j.generate(t);o.slides=e.slides||[],o.images={},E(),x()}catch(e){alert("Erro ao gerar: "+e.message),L("project",{projectId:o.projectId})}finally{N()}}export{ye as generateAndOpen,be as mountEditor,$e as showNewCarouselModal,he as unmountEditor};
