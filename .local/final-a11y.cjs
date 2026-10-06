
const {chromium}=require('./browser-tools/node_modules/playwright-core');const {default:AxeBuilder}=require('./browser-tools/node_modules/@axe-core/playwright');const fs=require('fs');
(async()=>{const b=await chromium.connectOverCDP('http://127.0.0.1:61534');const c=await b.newContext();const p=await c.newPage();const rows=[];const consoleErrors=[];p.on('pageerror',e=>consoleErrors.push(e.message));p.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
const paths=[...new Set(JSON.parse(fs.readFileSync('.local/verification.json')).rows.map(r=>r.route))];
for(const route of paths){await p.setViewportSize({width:1440,height:1000});const r=await p.goto('http://127.0.0.1:3000'+route);await p.evaluate(()=>document.fonts.ready);
const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
const violations=axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));rows.push({route,status:r.status(),violations,noindex:r.headers()['x-robots-tag']});console.log(JSON.stringify(rows.at(-1)));
if(route==='/'){await p.screenshot({path:'.local/preview-desktop.png'});await p.setViewportSize({width:390,height:844});await p.screenshot({path:'.local/preview-mobile.png'});const mobile=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();rows.push({route:'/',width:390,violations:mobile.violations.map(v=>v.id)});}
}
const missing=await c.request.get('http://127.0.0.1:3000/proyectos/no-existe');const notfound=await c.request.get('http://127.0.0.1:3000/ruta-no-existente');
fs.writeFileSync('.local/final-a11y.json',JSON.stringify({rows,consoleErrors,notfound: [missing.status(),notfound.status()]},null,2));
console.log(JSON.stringify({finished:true,violations:rows.flatMap(r=>r.violations),consoleErrors,notfound: [missing.status(),notfound.status()]}));await c.close();await b.close();})().catch(e=>{console.error(e);process.exitCode=1});

