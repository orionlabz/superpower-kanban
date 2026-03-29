function f(o){o||(o=_());const a=o.font_display||"Playfair Display",r=o.font_body||"Inter",t=o.font_ui||"JetBrains Mono";return`<style>
@import url('${g(a,r,t)}');
:root {
  --t-bg: ${o.color_bg||"#000"};
  --t-text: ${o.color_text||"#e8e8e8"};
  --t-emphasis: ${o.color_emphasis||"#CCFF00"};
  --t-secondary: ${o.color_secondary||"#666"};
  --t-detail: ${o.color_detail||"#2a2a2a"};
  --t-border: ${o.color_border||"#1e1e1e"};
  --t-font-display: '${a}';
  --t-font-body: '${r}';
  --t-font-ui: '${t}';
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--t-bg); }
em { font-style: italic; }
strong { font-weight: 700; }
.accent { color: var(--t-emphasis); }
</style>`}function g(o,a,r){const t=[],i=n=>n.replace(/ /g,"+"),s=new Set,l=(n,d)=>{n&&!s.has(n)&&(s.add(n),t.push(`family=${i(n)}:${d}`))};return l(o,"ital,wght@0,400;0,500;1,400;1,500"),l(a,"wght@300;400;500;600"),l(r,"wght@400;500"),`https://fonts.googleapis.com/css2?${t.join("&")}&display=swap`}function _(){return{font_display:"Playfair Display",font_body:"Inter",font_ui:"JetBrains Mono",color_bg:"#000000",color_text:"#e8e8e8",color_emphasis:"#CCFF00",color_secondary:"#666666",color_detail:"#2a2a2a",color_border:"#1e1e1e",brand_name:"Marca",brand_symbol:"⬥",nav_left:"CATEGORIA",nav_right:"SÉRIE",username:"",footer_logo_variant:"dark"}}function b(o,a="dark"){const r=a==="light"?o==null?void 0:o.brand_logo_light:o==null?void 0:o.brand_logo_dark;return r?`<img src="${r}" style="height:22px;object-fit:contain;" alt="">`:`${c((o==null?void 0:o.brand_symbol)||"⬥")} ${c((o==null?void 0:o.brand_name)||"Marca")}`}function c(o){return String(o??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}export{b as brandLogoHTML,g as buildGoogleFontsUrl,_ as defaultTheme,f as themeStyleBlock};
