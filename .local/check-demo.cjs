
const { chromium } = require('./browser-tools/node_modules/playwright-core');
const { default: AxeBuilder } = require('./browser-tools/node_modules/@axe-core/playwright');
const fs = require('fs'); const path = require('path');
const root = 'http://127.0.0.1:3000';
const paths = ['/','/lineas','/proyectos','/novedades','/reuniones','/integrantes','/publicaciones','/galeria','/unete'];
for (const section of ['proyectos','novedades']) for(const f of fs.readdirSync('contenido/'+section).filter(f=>f.endsWith('.md')&&!f.startsWith('_'))) paths.push('/'+section+'/'+f.slice(0,-3));
(async()=>{
 const browser = await chromium.connectOverCDP('http://127.0.0.1:61534');
 const context = await browser.newContext(); const page = await context.newPage();
 const errors=[]; const rows=[]; const links=new Set();
 page.on('pageerror', e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const width of [1440,390,768,360]){
  await page.setViewportSize({width,height:width>1000?1000:844});
  for(const route of paths) {
   const response=await page.goto(root+route, {waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const info=await page.evaluate(()=>{
    const elems=[...document.querySelectorAll('main *')];
    return {h1:document.querySelectorAll('h1').length,title:document.title, description:document.querySelector('meta[name="description"]')?.content,
     robots:document.querySelector('meta[name="robots"]')?.content,
     overflow:document.documentElement.scrollWidth>innerWidth+1,
     hidden:elems.filter(el=>!el.closest('details:not([open]),dialog:not([open]),[hidden]')&&getComputedStyle(el).opacity==='0').map(el=>el.tagName),
     transformed:elems.filter(el=>!el.closest('dialog')&&getComputedStyle(el).transform!=='none').map(el=>el.tagName),
     missingImages:[...document.images].filter(el=>!el.complete||el.naturalWidth===0||!el.hasAttribute('alt')).map(el=>el.src),
     links:[...document.querySelectorAll('a[href]')].map(el=>el.getAttribute('href')),
     fake: /isia@universidad|Convocatoria abierta|Grupo de investigación|Año de fundación/.test(document.body.innerText),
     forms:document.querySelectorAll('form').length,
     structured:document.querySelectorAll('script[type="application/ld+json"]').length,
    };
   });
   info.links.forEach(l=>links.add(l)); delete info.links;
   const bad = response.status()!==200||info.h1!==1||!info.robots?.includes('noindex')||!info.description||info.overflow||info.hidden.length||info.transformed.length||info.missingImages.length||info.fake||info.forms||info.structured;
   let violations=[];
   if(width===1440 || width===390) {
    const name=(route==='/'?'inicio':route.slice(1).replaceAll('/','--'));
    await page.screenshot({path:'.local/'+name+'-'+width+'.png',fullPage:true});
    if(paths.indexOf(route)<9 || route===paths[9] || route===paths[13]) {
      const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
      violations=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));
    }
   }
   rows.push({width,route,status:response.status(),...info,violations});
   console.log(JSON.stringify({width,route,ok:!bad,violations:violations.map(v=>v.id)}));
  }
 }
 const broken=[];
 for(const href of links) {
   if(/^(mailto:|tel:|javascript:|https:\/\/github.com\/?$)/.test(href))broken.push(href);
   if(href.startsWith('/')&&!href.startsWith('//')){
     const url=new URL(href,root); const r=await context.request.get(url.href);
     if(r.status()!==200)broken.push(href+' status='+r.status());
     if(url.hash) {await page.goto(url.href);if(await page.locator('[id="'+decodeURIComponent(url.hash.slice(1))+'"]').count()===0)broken.push(href+' anchor missing');}
   }
 }
 await page.setViewportSize({width:390,height:844}); await page.goto(root);
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 const menu=page.getByRole('navigation',{name:'Navegación móvil'});
 if(!await menu.isVisible())throw new Error('Menu no abre');
 await page.screenshot({path:'.local/menu-mobile.png'});
 await page.keyboard.press('Escape');
 if(await menu.isVisible())throw new Error('Escape no cierra menú');
 if(await page.getByRole('button',{name:'Abrir menú',exact:true}).evaluate(el=>el!==document.activeElement))throw new Error('Foco no regresa a menú');
 await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
 await menu.getByRole('link',{name:'Proyectos',exact:true}).click();await page.waitForURL('**/proyectos');
 if(await menu.isVisible())throw new Error('Menu no cierra al navegar');
 await page.locator('main').getByRole('link',{name:'Ver proyecto: Nodo de medida autónomo',exact:true}).click();await page.waitForURL('**/proyectos/nodo-de-medida-autonomo');
 await page.getByRole('link',{name:'Volver a proyectos',exact:true}).click();await page.waitForURL('**/proyectos');
 await page.goto(root); await page.locator('main').getByRole('link',{name:'Ver los proyectos',exact:true}).click();await page.waitForURL('**/proyectos');
 await page.goto(root); await page.locator('main').getByRole('link',{name:'Quiero participar',exact:true}).first().click();await page.waitForURL('**/unete');
 await page.goto(root+'/reuniones'); await page.locator('summary').first().focus(); await page.keyboard.press('Enter');
 if(!await page.locator('details').first().evaluate(el=>el.open))throw new Error('Reunión no abre con teclado');
 await page.screenshot({path:'.local/reunion-abierta-mobile.png',fullPage:true});
 await page.goto(root); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
 if(await page.evaluate(()=>document.activeElement?.id)!=='contenido')throw new Error('Enlace salto no enfoca main');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(root);
 const motion=await page.evaluate(()=>[...document.querySelectorAll('main *')].filter(el=>getComputedStyle(el).animationName!=='none').length);
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}); const np=await nojs.newPage();await np.goto(root);
 const withoutJS=await np.locator('main h1').isVisible() && await np.locator('#proyectos').isVisible() && await np.locator('#integrantes').isVisible();
 await nojs.close();
 const report={rows,errors:[...new Set(errors)],broken,interactions:'passed',motion,withoutJS};
 fs.writeFileSync('.local/verification.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({summary:true,pages:paths.length,viewports:4,errors:report.errors,broken,motion,withoutJS,interactions:'passed'}));
 await context.close(); await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});

