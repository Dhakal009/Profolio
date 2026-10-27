import{r as e}from"./rolldown-runtime-hePW80VL.js";import{d as t,f as n,t as r}from"./motion-B95RLzU_.js";import{d as i,l as a}from"./react-C1ikaV7x.js";import{i as o,r as s}from"./index-C5HgMAKY.js";import{a as c,c as l,d as u,f as d,i as f,l as p,n as m,o as h,r as g,s as _,t as v,u as y}from"./three-DpJsDMhA.js";import{t as b}from"./styled-components.browser.esm-CwUR9aDn.js";var x=e(n(),1),S=[{id:`ems`,index:`01`,title:`Employee Management System`,shortTitle:`EMS`,subtitle:`Role-Based Task & Workforce Portal`,category:`Enterprise Dashboard`,year:`2026`,description:`A role-based workforce and task management platform featuring dedicated Admin and Employee dashboards, task creation and assignment workflows, real-time status tracking (New, Active, Completed, Failed), and persistent local state.`,tech:[`React 19`,`Tailwind CSS`,`Context API`,`LocalStorage`],techString:`React 19 · Tailwind CSS · Context API`,stat:`Admin & Employee Portals`,link:`/demo/ems`,github:`https://github.com/Dhakal009/Profolio/tree/master/Projects/EMS`,status:`Live`,accent:`#10b981`,screenshots:[],credentials:[{role:`Admin`,email:`admin@example.com`,password:`Admin@1234`},{role:`Employee`,email:`employee@example.com`,password:`Employee@1234`}]},{id:`live-chat`,index:`02`,title:`Live Chat Application`,shortTitle:`Live Chat`,subtitle:`Real-Time Messaging Platform`,category:`Full Stack & WebSockets`,year:`2026`,description:`A full-stack real-time messaging platform built with React, Node.js, Express, MongoDB, and Socket.io. Features JWT authentication, instant bidirectional messaging, live online presence indicators, typing notifications, and unread message badges.`,tech:[`React 19`,`Node.js`,`Express`,`MongoDB`,`Socket.io`,`Tailwind CSS`],techString:`React · Socket.io · Node.js · MongoDB`,stat:`Real-Time WebSockets`,link:`/demo/live-chat`,github:`https://github.com/Dhakal009/Profolio/tree/master/Projects/live-chat`,status:`Live`,accent:`#6366f1`,screenshots:[],credentials:[{role:`User 1`,email:`demo@example.com`,password:`Demo@1234`},{role:`User 2`,email:`demo2@example.com`,password:`Demo@1234`}]},{id:`ecommerce-app`,index:`03`,title:`E-Commerce App`,shortTitle:`E-Commerce`,subtitle:`Full-Stack Online Storefront`,category:`MERN E-Commerce`,year:`2026`,description:`A full-stack MERN e-commerce storefront featuring product catalog browsing, category filtering, search, interactive cart management, and checkout workflow backed by Express and MongoDB.`,tech:[`React 19`,`Node.js`,`Express`,`MongoDB`,`Tailwind CSS`],techString:`React · Express · MongoDB`,stat:`Full-Stack Storefront`,link:`/demo/ecommerce-app`,github:`https://github.com/Dhakal009/Profolio/tree/master/Projects/ecommerce-app`,status:`Live`,accent:`#f59e0b`,screenshots:[],credentials:[{role:`Customer`,email:`demo@example.com`,password:`Demo@1234`}]}],C={ROWS:28,ROW_SPACING:2.4,CYCLE_LENGTH:67.2,MAX_SCROLL:66,COLS_DESKTOP:4,COLS_MOBILE:2,TILE_W:1.7,TILE_H:1.08,GAP:.22,TUNNEL_W:7.5,TUNNEL_H:5,TILT_RANGE:3,Z_JITTER:.08,FOV_DESKTOP:75,FOV_MOBILE:68,CAMERA_Z_START:8,SCROLL_SPEED_FORWARD:.022,LERP_FACTOR:.065,PARALLAX_X:3,PARALLAX_Y:3,FOCUS_DURATION:.85,HOVER_Z:.38,HOVER_SCALE:1.08},w=t(),T=new Map,E=null,D=null,O=null;function k(e){if(!E){E=new y(e.TILE_W,e.TILE_H),D=new _(E);let t=[new d(-.09,0,.01),new d(.09,0,.01),new d(0,-.09,.01),new d(0,.09,.01)];O=new c().setFromPoints(t)}return{planeGeometry:E,borderGeometry:D,crossGeometry:O}}var A=null,j=null,M=null,N=null,P=null,F=null;function I(e){return e?(A||(A=new p({color:`#14141a`,transparent:!0,opacity:.28,roughness:.9,metalness:.05,side:2}),j=new l({color:`#252536`,transparent:!0,opacity:.25}),M=new l({color:`#2a2a3a`,transparent:!0,opacity:.2})),{meshMat:A,borderMat:j,crossMat:M}):(N||(N=new p({color:`#f1f5f9`,transparent:!0,opacity:.6,roughness:.9,metalness:.05,side:2}),P=new l({color:`#e2e8f0`,transparent:!0,opacity:.8}),F=new l({color:`#cbd5e1`,transparent:!0,opacity:.35})),{meshMat:N,borderMat:P,crossMat:F})}function L(e,t){if(typeof document>`u`)return null;let n=document.createElement(`canvas`);n.width=1024,n.height=640;let r=n.getContext(`2d`);if(!r)return null;let i=t;r.beginPath(),r.roundRect(0,0,1024,640,28);let a=r.createLinearGradient(0,0,1024,640);a.addColorStop(0,i?`#111318`:`#ffffff`),a.addColorStop(1,i?`#050608`:`#eef2f7`),r.fillStyle=a,r.fill(),r.strokeStyle=i?`rgba(255,255,255,0.18)`:`rgba(15,23,42,0.12)`,r.lineWidth=2,r.stroke();let o=r.createRadialGradient(860,110,0,860,110,430);o.addColorStop(0,i?`rgba(255,255,255,0.12)`:`rgba(0,0,0,0.08)`),o.addColorStop(1,`rgba(0,0,0,0)`),r.fillStyle=o,r.fillRect(0,0,1024,640);let s=r.createLinearGradient(0,0,1024,0);s.addColorStop(0,i?`#ffffff`:`#111111`),s.addColorStop(1,i?`rgba(255,255,255,0.25)`:`rgba(17,17,17,0.2)`),r.fillStyle=s,r.beginPath(),r.roundRect(0,0,1024,8,[28,28,0,0]),r.fill(),r.fillStyle=i?`#ffffff`:`#09090b`;let c=e.title.toUpperCase(),l=92;r.textAlign=`center`;do r.font=`900 ${l}px Inter Tight, Inter, system-ui, sans-serif`,l-=2;while(r.measureText(c).width>900&&l>42);r.font=`900 ${l}px Inter Tight, Inter, system-ui, sans-serif`,r.fillText(c,512,340),r.strokeStyle=i?`rgba(255,255,255,0.18)`:`rgba(0,0,0,0.14)`,r.lineWidth=2,r.beginPath(),r.moveTo(270,400),r.lineTo(754,400),r.stroke(),r.textAlign=`left`;let d=new h(n);return d.colorSpace=u,d.anisotropy=4,d.needsUpdate=!0,d}function R(e,t){let n=`${e.id}-${t?`dark`:`light`}`;if(T.has(n))return T.get(n);let r=L(e,t);return r&&T.set(n,r),r}function z({position:e,rotation:t,project:n,isDimmed:i,isSelected:a,onSelect:o,onHover:s,onUnhover:c,config:l,isDark:u}){let f=(0,x.useRef)(),p=(0,x.useRef)(),m=(0,x.useRef)({x:0,y:0}),h=(0,x.useMemo)(()=>R(n,u),[n,u]),{planeGeometry:g,borderGeometry:_}=k(l);(0,x.useEffect)(()=>{p.current&&r.to(p.current.material,{opacity:i?.15:1,duration:.35,ease:`power2.out`})},[i]);let v=e=>{e.stopPropagation(),document.body.style.cursor=`pointer`,s(),!a&&p.current&&(r.to(p.current.position,{z:l.HOVER_Z,duration:.3,ease:`power3.out`}),r.to(p.current.scale,{x:l.HOVER_SCALE,y:l.HOVER_SCALE,z:1,duration:.3,ease:`power3.out`}))},y=()=>{document.body.style.cursor=`auto`,c(),p.current&&(r.to(p.current.position,{z:0,duration:.3,ease:`power3.out`}),r.to(p.current.scale,{x:1,y:1,z:1,duration:.3,ease:`power3.out`}))},b=()=>{if(!p.current)return;let e=new d;p.current.getWorldPosition(e),o(n,[e.x,e.y,e.z],t)};return(0,w.jsxs)(`group`,{ref:f,position:e,rotation:t,children:[(0,w.jsx)(`mesh`,{geometry:g,position:[0,0,-.035],scale:[1.035,1.06,1],children:(0,w.jsx)(`meshBasicMaterial`,{color:u?`#ffffff`:`#111111`,transparent:!0,opacity:i?.04:.18,side:2})}),(0,w.jsx)(`mesh`,{ref:p,geometry:g,onPointerDown:e=>{m.current={x:e.clientX,y:e.clientY}},onClick:e=>{e.stopPropagation();let t=Math.abs((e.clientX??m.current.x)-m.current.x),n=Math.abs((e.clientY??m.current.y)-m.current.y);t<14&&n<14&&b()},onPointerOver:v,onPointerOut:y,children:(0,w.jsx)(`meshStandardMaterial`,{map:h,transparent:!1,roughness:.45,metalness:.08,emissive:u?`#ffffff`:`#111111`,emissiveIntensity:i?.02:.055,side:2})}),(0,w.jsx)(`lineSegments`,{geometry:_,position:[0,0,.02],children:(0,w.jsx)(`lineBasicMaterial`,{color:u?`#ffffff`:`#111111`,transparent:!0,opacity:i?.25:.88})})]})}function B({position:e,rotation:t,config:n,isDark:r,project:i,onSelect:a}){let{planeGeometry:o,borderGeometry:s,crossGeometry:c}=k(n),{meshMat:l,borderMat:u,crossMat:f}=I(r),p=(0,x.useRef)(),m=(0,x.useRef)({x:0,y:0}),h=()=>{if(!p.current||!i||!a)return;let e=new d;p.current.getWorldPosition(e),a(i,[e.x,e.y,e.z],t)};return(0,w.jsxs)(`group`,{position:e,rotation:t,children:[(0,w.jsx)(`mesh`,{ref:p,geometry:o,material:l,onPointerDown:e=>{m.current={x:e.clientX,y:e.clientY}},onClick:e=>{e.stopPropagation();let t=Math.abs((e.clientX??m.current.x)-m.current.x),n=Math.abs((e.clientY??m.current.y)-m.current.y);t<14&&n<14&&h()},onPointerOver:e=>{i&&(e.stopPropagation(),document.body.style.cursor=`pointer`)},onPointerOut:()=>{document.body.style.cursor=`auto`}}),(0,w.jsx)(`lineSegments`,{geometry:s,material:u,position:[0,0,.005]}),(0,w.jsx)(`lineSegments`,{geometry:c,material:f})]})}function ee({position:e,rotation:t,project:n,fallbackProject:r,isDimmed:i,isSelected:a,onSelect:o,onHover:s,onUnhover:c,config:l,isDark:u}){return n?(0,w.jsx)(z,{position:e,rotation:t,project:n,isDimmed:i,isSelected:a,onSelect:o,onHover:s,onUnhover:c,config:l,isDark:u}):(0,w.jsx)(B,{position:e,rotation:t,config:l,isDark:u,project:r,onSelect:o})}function te(e){return function(){let t=e+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function ne({rowIndex:e,zBase:t,projects:n,onSelect:r,setHoveredId:i,selectedId:a,isMobile:o,isDark:s,ringGeometry:c,rowRef:l,randomPlacements:u}){let d=o?C.COLS_MOBILE:C.COLS_DESKTOP,f=(0,x.useMemo)(()=>{let t=te(200+e*31),r=[],i=[`left`,`right`,`floor`,`ceiling`],a=C.TILE_W+C.GAP,o=C.TILE_H+C.GAP;for(let s=0;s<d;s++)for(let c=0;c<4;c++){let l=i[c],f=(t()-.5)*C.TILT_RANGE*(Math.PI/180),p=(t()-.5)*C.TILT_RANGE*(Math.PI/180),m=(t()-.5)*C.TILT_RANGE*(Math.PI/180),h=(t()-.5)*C.Z_JITTER,g=0,_=0,v=0,y=0,b=0;l===`left`?(g=-C.TUNNEL_W/2,_=(s-(d-1)/2)*o*1.05,y=Math.PI/2,v=f,b=m):l===`right`?(g=C.TUNNEL_W/2,_=(s-(d-1)/2)*o*1.05,y=-Math.PI/2,v=f,b=m):l===`floor`?(_=-C.TUNNEL_H/2,g=(s-(d-1)/2)*a*1.05,v=Math.PI/2,y=p,b=m):l===`ceiling`&&(_=C.TUNNEL_H/2,g=(s-(d-1)/2)*a*1.05,v=-Math.PI/2,y=p,b=m),v+=f,y+=p,b+=m;let x=u[`${e}-${l}-${s%2}`],S=x===void 0?null:n[x%n.length];r.push({key:`tile-${e}-${l}-${s}`,position:[g,_,h],rotation:[v,y,b],project:S})}return r},[e,n,d,u]);return(0,w.jsxs)(`group`,{ref:l,position:[0,0,t],children:[(0,w.jsx)(`lineSegments`,{geometry:c,children:(0,w.jsx)(`lineBasicMaterial`,{color:s?`#23232c`:`#cbd5e1`,transparent:!0,opacity:s?.45:.6})}),f.map((t,o)=>(0,w.jsx)(ee,{position:t.position,rotation:t.rotation,project:t.project,fallbackProject:n[(e+o)%n.length],config:C,isDark:s,isDimmed:a!==null&&(!t.project||a!==t.project.id),isSelected:!!(a&&t.project&&a===t.project.id),onHover:()=>i(t.key),onUnhover:()=>i(null),onSelect:r},t.key))]})}function re({projects:e,onSelect:t,setHoveredId:n,selectedId:r,isMobile:i,isDark:a}){let o=(0,x.useRef)([]),s=C.TUNNEL_W/2,l=C.TUNNEL_H/2,u=Math.floor(C.ROWS*.7),f=(0,x.useMemo)(()=>{let t={},n=[`left`,`floor`,`right`,`ceiling`];for(let r=0;r<u;r++){let i=r%e.length,a=n[r%4],o=n[(r+2)%4];t[`${r}-${a}-0`]=i,t[`${r}-${o}-1`]=(i+1)%e.length}return t},[e.length,u]),p=(0,x.useMemo)(()=>{let e=[new d(-s,-l,0),new d(s,-l,0),new d(s,-l,0),new d(s,l,0),new d(s,l,0),new d(-s,l,0),new d(-s,l,0),new d(-s,-l,0)];return new c().setFromPoints(e)},[s,l]),m=(u-1)*C.ROW_SPACING,h=(0,x.useMemo)(()=>{let e=-m-10,t=[new d(-s,-l,15),new d(-s,-l,e),new d(s,-l,15),new d(s,-l,e),new d(-s,l,15),new d(-s,l,e),new d(s,l,15),new d(s,l,e)];return new c().setFromPoints(t)},[s,l,m]),g=(0,x.useMemo)(()=>Array.from({length:u},(e,t)=>({index:t,zBase:-t*C.ROW_SPACING})),[u]);return(0,w.jsxs)(`group`,{children:[(0,w.jsx)(`lineSegments`,{geometry:h,children:(0,w.jsx)(`lineBasicMaterial`,{color:a?`#2e2e3a`:`#94a3b8`,transparent:!0,opacity:a?.6:.75})}),(0,w.jsx)(`lineSegments`,{geometry:h,children:(0,w.jsx)(`lineBasicMaterial`,{color:a?`#ffffff`:`#111111`,transparent:!0,opacity:a?.13:.1})}),g.map(s=>(0,w.jsx)(ne,{rowIndex:s.index,zBase:s.zBase,projects:e,onSelect:t,setHoveredId:n,selectedId:r,isMobile:i,isDark:a,ringGeometry:p,randomPlacements:f,rowRef:e=>o.current[s.index]=e},s.index)),(0,w.jsx)(`group`,{position:[0,0,-m],children:(0,w.jsx)(`lineSegments`,{geometry:p,children:(0,w.jsx)(`lineBasicMaterial`,{color:a?`#ffffff`:`#111111`,transparent:!0,opacity:a?.7:.48})})})]})}function ie({scrollDistance:e,scrollDistanceRef:t,selected:n,isMobile:i,isRewinding:a=!1}){let{camera:o}=f(),s=(0,x.useRef)({x:0,y:0}),c=(0,x.useRef)(null),l=(0,x.useRef)(null),u=(0,x.useRef)(C.CAMERA_Z_START),d=(0,x.useRef)(C.CAMERA_Z_START),p=(0,x.useRef)(!1);return(0,x.useEffect)(()=>{d.current=C.CAMERA_Z_START-e},[e]),(0,x.useEffect)(()=>{c.current=r.quickTo(o.rotation,`y`,{duration:.5,ease:`power3.out`}),l.current=r.quickTo(o.rotation,`x`,{duration:.5,ease:`power3.out`});let e=e=>{if(n)return;let t=(e.clientX/window.innerWidth-.5)*2,r=(e.clientY/window.innerHeight-.5)*2;s.current.x=t,s.current.y=r;let a=i?C.PARALLAX_X*.35:C.PARALLAX_X,o=i?C.PARALLAX_Y*.35:C.PARALLAX_Y;c.current?.(t*a*(Math.PI/180)),l.current?.(-r*o*(Math.PI/180))};return window.addEventListener(`pointermove`,e,{passive:!0}),()=>window.removeEventListener(`pointermove`,e)},[o,n,i]),(0,x.useEffect)(()=>{if(n){p.current=!0;let[e,t,i]=n.position,a=0,s=0,c=i,l=0,u=0;e<-2?(a=e+2.5,s=t,u=Math.PI/2):e>2?(a=e-2.5,s=t,u=-Math.PI/2):t<-1.5?(a=e,s=t+2.4,l=-Math.PI/2):(a=e,s=t-2.4,l=Math.PI/2);let d=r.timeline({defaults:{duration:C.FOCUS_DURATION,ease:`power3.inOut`}});return d.to(o.position,{x:a,y:s,z:c},0),d.to(o.rotation,{x:l,y:u,z:0},0),()=>d.kill()}if(p.current){let e=r.timeline({defaults:{duration:C.FOCUS_DURATION*.8,ease:`power3.out`},onComplete:()=>{p.current=!1}});return e.to(o.position,{x:0,y:0,z:u.current},0),e.to(o.rotation,{x:0,y:0,z:0},0),()=>e.kill()}},[n,o]),g(()=>{t&&(d.current=C.CAMERA_Z_START-t.current),!n&&!p.current&&(a?(u.current=d.current,o.position.z=u.current,o.position.x+=(0-o.position.x)*.15,o.position.y+=(0-o.position.y)*.15):(u.current+=(d.current-u.current)*C.LERP_FACTOR,o.position.z=u.current,o.position.x+=(0-o.position.x)*.1,o.position.y+=(0-o.position.y)*.1))}),null}var ae=e(i(),1),oe=[{role:`Demo user`,email:`demo@example.com`,password:`Demo@1234`}],V=[`Dashboard`,`Detail view`,`Settings`],H=(e,t=`#38bdf8`)=>{let n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800">
<rect width="1280" height="800" fill="#12131a"/>
<rect width="220" height="800" fill="#181a23"/>
<rect x="28" y="32" width="120" height="16" rx="8" fill="${t}"/>
${[0,1,2,3,4].map(e=>`<rect x="28" y="${110+e*44}" width="${150-e%3*24}" height="12" rx="6" fill="#2a2d3a"/>`).join(``)}
<rect x="260" y="32" width="420" height="22" rx="11" fill="#2a2d3a"/>
${[0,1,2].map(e=>`<rect x="${260+e*330}" y="100" width="300" height="130" rx="16" fill="#1d1f2b"/><rect x="${284+e*330}" y="126" width="90" height="12" rx="6" fill="#3a3e50"/><rect x="${284+e*330}" y="160" width="150" height="30" rx="8" fill="${t}" opacity="${.9-e*.2}"/>`).join(``)}
<rect x="260" y="262" width="640" height="300" rx="16" fill="#1d1f2b"/>
<polyline points="290,520 380,450 470,480 560,390 650,420 740,340 860,370" fill="none" stroke="${t}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="930" y="262" width="300" height="300" rx="16" fill="#1d1f2b"/>
${[0,1,2,3].map(e=>`<rect x="956" y="${292+e*62}" width="248" height="42" rx="10" fill="#262938"/>`).join(``)}
<rect x="260" y="594" width="970" height="160" rx="16" fill="#1d1f2b"/>
<text x="640" y="780" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#6b7080">${e} · placeholder</text>
</svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`},U=()=>(0,w.jsxs)(`svg`,{width:`15`,height:`15`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,w.jsx)(`path`,{d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`}),(0,w.jsx)(`polyline`,{points:`15 3 21 3 21 9`}),(0,w.jsx)(`line`,{x1:`10`,y1:`14`,x2:`21`,y2:`3`})]}),W=()=>(0,w.jsx)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`currentColor`,"aria-hidden":`true`,children:(0,w.jsx)(`path`,{fillRule:`evenodd`,clipRule:`evenodd`,d:`M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z`})}),G=()=>(0,w.jsxs)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,w.jsx)(`line`,{x1:`18`,y1:`6`,x2:`6`,y2:`18`}),(0,w.jsx)(`line`,{x1:`6`,y1:`6`,x2:`18`,y2:`18`})]}),K=()=>(0,w.jsxs)(`svg`,{width:`15`,height:`15`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,w.jsx)(`rect`,{x:`9`,y:`9`,width:`13`,height:`13`,rx:`2`}),(0,w.jsx)(`path`,{d:`M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1`})]}),q=()=>(0,w.jsx)(`svg`,{width:`15`,height:`15`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.6`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:(0,w.jsx)(`polyline`,{points:`20 6 9 17 4 12`})}),se=b.div.attrs(e=>({style:{opacity:e.$bgOpacity,transform:`translate3d(0, ${e.$translateY}px, 0)`,background:e.$isDark?`rgba(0, 0, 0, ${.94*e.$bgOpacity})`:`rgba(244, 244, 246, ${.94*e.$bgOpacity})`,pointerEvents:`none`}}))`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 20;
  overflow: hidden;
  will-change: opacity, transform;
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
`,ce=b.h1.attrs(e=>({style:{transform:`translate3d(0, 0, 0) scale(${e.$scale})`,opacity:e.$textOpacity,letterSpacing:`${e.$letterSpacing}em`}}))`
  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
  font-size: clamp(3.5rem, 13vw, 11rem);
  font-weight: 800;
  line-height: 0.9;
  margin: 0;
  color: ${e=>e.$isDark?`#ffffff`:`#09090b`};
  letter-spacing: -0.07em;
  max-width: 1200px;
  transform-origin: center center;
  will-change: transform, opacity;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`,le=b.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;

  &::after {
    content: '';
    width: clamp(4rem, 12vw, 8rem);
    height: 2px;
    background: ${e=>e.$isDark?`#38bdf8`:`#0284c7`};
    transform-origin: left;
    animation: introLine 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  user-select: none;

  &.is-opening .opening-word {
    display: inline-block;
    opacity: 0;
    animation: wordRise 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  &.is-opening .opening-word:nth-child(1) { animation-delay: 0.04s; }
  &.is-opening .opening-word:nth-child(2) { animation-delay: 0.12s; }
  &.is-opening .opening-word:nth-child(3) { animation-delay: 0.20s; }
  &.is-opening .opening-word:nth-child(4) { animation-delay: 0.28s; }

  @keyframes wordRise {
    0% { opacity: 0; transform: translateY(28px) scale(0.92); filter: blur(10px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
  }

  @keyframes introLine {
    from { opacity: 0; transform: scaleX(0); }
    to { opacity: 1; transform: scaleX(1); }
  }

  @media (max-width: 860px) {
    height: auto;
    max-height: calc(100dvh - 1rem);
    overflow-y: auto;
    padding: 1rem;
  }
`,ue=b.span`
  color: ${e=>e.$isDark?`rgba(255,255,255,0.58)`:`rgba(9,9,11,0.55)`};
  font: 600 0.7rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.16em;
  text-transform: uppercase;
`,de=b.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.75rem, 3vw, 2rem);
  background: ${e=>e.$isDark?`rgba(4, 4, 6, 0.8)`:`rgba(235, 235, 240, 0.8)`};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: opacity 0.22s ease-in;
  opacity: ${e=>+!e.$isClosing};
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`,fe=b.div`
  perspective: 1600px;
  width: min(96vw, 1180px);
`,pe=b.div`
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.18s ease-out;
  will-change: transform;

  /* floating shadow layer sits behind the card to create depth */
  &::before {
    content: '';
    position: absolute;
    inset: 18px 14px -22px;
    border-radius: 32px;
    background: ${e=>e.$accent||(e.$isDark?`#38bdf8`:`#0284c7`)};
    opacity: ${e=>e.$isDark?.22:.18};
    filter: blur(46px);
    transform: translateZ(-70px);
    pointer-events: none;
  }
`,me=b.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: min(92dvh, 820px);
  max-height: calc(100dvh - 2rem);
  overflow: hidden;
  border-radius: 24px;
  padding: clamp(1rem, 2.2vw, 1.65rem);
  background: ${e=>e.$isDark?`linear-gradient(160deg, rgba(28, 29, 38, 0.97), rgba(14, 14, 19, 0.98))`:`linear-gradient(160deg, rgba(255, 255, 255, 1), rgba(246, 246, 250, 0.98))`};
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.12)`:`rgba(0,0,0,0.08)`};
  box-shadow: ${e=>e.$isDark?`inset 0 1px 0 rgba(255,255,255,0.1), 0 40px 90px rgba(0,0,0,0.75), 0 10px 24px rgba(0,0,0,0.5)`:`inset 0 1px 0 #fff, 0 40px 80px rgba(20,20,40,0.18), 0 8px 20px rgba(20,20,40,0.1)`};
  color: ${e=>e.$isDark?`#f4f4f5`:`#09090b`};
  transition: transform 0.22s ease-in, opacity 0.2s ease-in;
  transform: ${e=>e.$isClosing?`scale(0.95) translateY(20px)`:`none`};
  opacity: ${e=>+!e.$isClosing};
  animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  scrollbar-width: thin;

  @keyframes popIn {
    from { transform: scale(0.94) translateY(16px) rotateX(6deg); opacity: 0; }
    to { transform: none; opacity: 1; }
  }
`,he=b.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
`,ge=b.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`,_e=b.span`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.06)`};
  color: ${e=>e.$isDark?`#e4e4e7`:`#3f3f46`};
`,ve=b.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #10b981;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }
`,ye=b.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.15)`:`rgba(0,0,0,0.1)`};
  background: ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.05)`};
  color: currentColor;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.2s;

  &:hover { background: ${e=>e.$isDark?`rgba(255,255,255,0.2)`:`rgba(0,0,0,0.12)`}; transform: scale(1.06); }
  &:focus-visible { outline: 2px solid ${e=>e.$accent||`#38bdf8`}; outline-offset: 2px; }
`,be=b.div`
  margin-bottom: 0.8rem;
  flex: 0 0 auto;
`,xe=b.h2`
  font-size: clamp(1.65rem, 3.4vw, 2.55rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin: 0 0 0.4rem;
`,Se=b.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${e=>e.$accent||(e.$isDark?`#38bdf8`:`#0284c7`)};
  margin: 0;
`,Ce=b.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
  flex: 1;
  height: auto;
  min-height: 0;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
    flex: 1 1 auto;
    overflow-y: auto;
    padding-right: 0.15rem;
  }
`,J=b.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 0;
  min-height: 0;

  &:last-child {
    overflow-y: auto;
    padding-right: 0.25rem;
    scrollbar-width: thin;
  }
`,we=b.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.12)`:`rgba(0,0,0,0.1)`};
  background: ${e=>e.$isDark?`#0d0e13`:`#fff`};
  box-shadow: ${e=>e.$isDark?`0 30px 50px -18px rgba(0,0,0,0.8), 0 12px 20px -10px rgba(0,0,0,0.6)`:`0 30px 50px -18px rgba(20,20,40,0.3), 0 12px 20px -10px rgba(20,20,40,0.18)`};
  transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover { transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(-3px); }

  @media (max-width: 860px) { transform: none; &:hover { transform: none; } }
  @media (prefers-reduced-motion: reduce) { transform: none; &:hover { transform: none; } }
`,Te=b.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.55rem 0.8rem;
  background: ${e=>e.$isDark?`rgba(255,255,255,0.05)`:`rgba(0,0,0,0.04)`};

  i { width: 9px; height: 9px; border-radius: 50%; background: ${e=>e.$isDark?`#3f3f46`:`#d4d4d8`}; }
  span {
    margin-left: 0.5rem;
    flex: 1;
    font-size: 0.72rem;
    padding: 0.18rem 0.6rem;
    border-radius: 6px;
    color: ${e=>e.$isDark?`#a1a1aa`:`#71717a`};
    background: ${e=>e.$isDark?`rgba(255,255,255,0.06)`:`rgba(0,0,0,0.05)`};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,Ee=b.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 8.8;
  object-fit: cover;
  background: ${e=>e.$isDark?`#12131a`:`#f1f1f5`};
  animation: shotIn 0.35s ease-out;

  @keyframes shotIn { from { opacity: 0; } to { opacity: 1; } }
`,De=b.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.45rem;
  overflow-x: auto;
  padding: 4px 2px 6px;
`,Oe=b.button`
  flex: 0 0 auto;
  width: 84px;
  aspect-ratio: 16 / 10;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  border: 2px solid ${e=>e.$active?e.$accent||`#38bdf8`:`transparent`};
  opacity: ${e=>e.$active?1:.55};
  transition: opacity 0.2s, transform 0.2s, border-color 0.2s;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &:hover { opacity: 1; transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid ${e=>e.$accent||`#38bdf8`}; outline-offset: 2px; }
`,Y=b.div`
  padding: 0.8rem 0.95rem;
  border-radius: 18px;
  background: ${e=>e.$isDark?`rgba(255,255,255,0.04)`:`rgba(0,0,0,0.03)`};
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.07)`};
  box-shadow: ${e=>e.$isDark?`inset 0 1px 0 rgba(255,255,255,0.05)`:`inset 0 1px 0 #fff`};
`,X=b.h3`
  margin: 0 0 0.7rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${e=>e.$isDark?`#fafafa`:`#18181b`};
`,ke=b.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;

  div { font-size: 0.78rem; color: ${e=>e.$isDark?`#a1a1aa`:`#71717a`}; }
  strong {
    display: block;
    margin-bottom: 2px;
    font-size: 0.92rem;
    color: ${e=>e.$isDark?`#fff`:`#09090b`};
  }
`,Ae=b.p`
  font-size: 0.88rem;
  line-height: 1.48;
  margin: 0;
  color: ${e=>e.$isDark?`rgba(255,255,255,0.84)`:`rgba(0,0,0,0.78)`};
`,je=b.p`
  margin: -0.2rem 0 0.45rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${e=>e.$isDark?`#a1a1aa`:`#71717a`};
`,Me=b.div`
  & + & { margin-top: 0.55rem; padding-top: 0.55rem; border-top: 1px dashed ${e=>e.$isDark?`rgba(255,255,255,0.12)`:`rgba(0,0,0,0.12)`}; }
`,Ne=b.div`
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${e=>e.$accent||(e.$isDark?`#38bdf8`:`#0284c7`)};
`,Z=b.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.5rem 0.5rem 0.8rem;
  border-radius: 10px;
  background: ${e=>e.$isDark?`rgba(0,0,0,0.35)`:`rgba(255,255,255,0.9)`};
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.08)`};

  & + & { margin-top: 0.45rem; }

  .label { width: 66px; flex-shrink: 0; font-size: 0.76rem; color: ${e=>e.$isDark?`#a1a1aa`:`#71717a`}; }
  .value {
    flex: 1;
    min-width: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.86rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`,Q=b.button`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  color: ${e=>e.$done?`#10b981`:`currentColor`};
  background: ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.06)`};
  transition: background 0.2s;

  &:hover { background: ${e=>e.$isDark?`rgba(255,255,255,0.16)`:`rgba(0,0,0,0.12)`}; }
  &:focus-visible { outline: 2px solid ${e=>e.$accent||`#38bdf8`}; outline-offset: 1px; }
`,Pe=b(Q)`
  width: auto;
  padding: 0 0.6rem;
  font-size: 0.74rem;
  font-weight: 600;
`,$=b.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`,Fe=b.span`
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  background: ${e=>e.$isDark?`rgba(255,255,255,0.06)`:`rgba(0,0,0,0.05)`};
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.1)`:`rgba(0,0,0,0.08)`};
  color: ${e=>e.$isDark?`#e4e4e7`:`#3f3f46`};
`,Ie=b.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  flex: 0 0 auto;
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  border-top: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.08)`};
`,Le=b.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 999px;
  font-size: 0.93rem;
  font-weight: 700;
  text-decoration: none;
  background: ${e=>e.$accent||(e.$isDark?`#ffffff`:`#09090b`)};
  color: ${e=>e.$accent?`#ffffff`:e.$isDark?`#09090b`:`#ffffff`};
  box-shadow: 0 4px 16px ${e=>e.$accent?`${e.$accent}44`:`rgba(0,0,0,0.2)`};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${e=>e.$accent?`${e.$accent}66`:`rgba(0,0,0,0.3)`}; }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
`,Re=b.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  font-size: 0.93rem;
  font-weight: 600;
  text-decoration: none;
  background: ${e=>e.$isDark?`rgba(255,255,255,0.08)`:`rgba(0,0,0,0.06)`};
  border: 1px solid ${e=>e.$isDark?`rgba(255,255,255,0.15)`:`rgba(0,0,0,0.1)`};
  color: currentColor;
  transition: background 0.2s, transform 0.2s;

  &:hover { background: ${e=>e.$isDark?`rgba(255,255,255,0.16)`:`rgba(0,0,0,0.12)`}; transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
`;b.div`
  position: absolute;
  bottom: 2.25rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  background: ${e=>e.$isDark?`rgba(17, 17, 22, 0.9)`:`rgba(255, 255, 255, 0.94)`};
  border: 1px solid ${e=>e.$isDark?`rgba(255, 255, 255, 0.16)`:`rgba(0, 0, 0, 0.12)`};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${e=>e.$isDark?`#93c5fd`:`#2563eb`};
  pointer-events: none;
  z-index: 25;
  white-space: nowrap;
  animation: noticeFadeIn 0.35s ease-out;

  @keyframes noticeFadeIn {
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;function ze({list:e,isDark:t,accent:n}){let[r,i]=(0,x.useState)(``),[a,o]=(0,x.useState)({}),s=async(e,t)=>{try{await navigator.clipboard.writeText(t),i(e),setTimeout(()=>i(``),1400)}catch{}};return(0,w.jsxs)(Y,{$isDark:t,children:[(0,w.jsx)(X,{$isDark:t,children:`Try the live demo`}),(0,w.jsx)(je,{$isDark:t,children:`Use these test accounts to log in. Data is sample only.`}),e.map((e,i)=>{let c=a[i];return(0,w.jsxs)(Me,{$isDark:t,children:[e.role&&(0,w.jsx)(Ne,{$isDark:t,$accent:n,children:e.role}),(0,w.jsxs)(Z,{$isDark:t,children:[(0,w.jsx)(`span`,{className:`label`,children:`Email`}),(0,w.jsx)(`span`,{className:`value`,children:e.email}),(0,w.jsx)(Q,{$isDark:t,$accent:n,$done:r===`e${i}`,onClick:()=>s(`e${i}`,e.email),"aria-label":`Copy email`,children:r===`e${i}`?(0,w.jsx)(q,{}):(0,w.jsx)(K,{})})]}),(0,w.jsxs)(Z,{$isDark:t,children:[(0,w.jsx)(`span`,{className:`label`,children:`Password`}),(0,w.jsx)(`span`,{className:`value`,children:c?e.password:`•`.repeat(Math.min(e.password.length,10))}),(0,w.jsx)(Pe,{$isDark:t,$accent:n,onClick:()=>o(e=>({...e,[i]:!e[i]})),"aria-label":c?`Hide password`:`Show password`,children:c?`Hide`:`Show`}),(0,w.jsx)(Q,{$isDark:t,$accent:n,$done:r===`p${i}`,onClick:()=>s(`p${i}`,e.password),"aria-label":`Copy password`,children:r===`p${i}`?(0,w.jsx)(q,{}):(0,w.jsx)(K,{})})]})]},`${e.role}-${i}`)})]})}function Be({scrollDistance:e,selected:t,onClose:n,_onExit:r,theme:i,_isExiting:a=!1,_isEmbedded:o=!1,effectiveMaxScroll:s=58}){let c=i===`dark`,[l,u]=(0,x.useState)(!1),[d,f]=(0,x.useState)(!0),[p,m]=(0,x.useState)(0),h=(0,x.useRef)(null);(0,x.useEffect)(()=>{let e=setTimeout(()=>f(!1),1200);return()=>clearTimeout(e)},[]);let g=t?.project,_=(0,x.useMemo)(()=>g?Array.isArray(g.screenshots)&&g.screenshots.length?g.screenshots:V.map(e=>H(e,g.accent||`#38bdf8`)):[],[g]),v=(0,x.useMemo)(()=>{let e=g?.credentials;return e?Array.isArray(e)?e:[e]:oe},[g]);(0,x.useEffect)(()=>m(0),[g]);let y=Math.min(1,Math.max(0,e/4.8)),b=y**1.35,S=1+b*.08,C=b*-18,T=-.07+y*.06,E=Math.max(0,1-y*1.15),D=Math.max(0,1-y**1.15),O=(D>.005||E>.005)&&!t,k=()=>{u(!0),setTimeout(()=>{n(),u(!1)},220)};(0,x.useEffect)(()=>{let e=e=>{e.key===`Escape`&&t&&!l&&k()};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[t,l]);let A=()=>typeof window<`u`&&window.matchMedia(`(hover: hover) and (pointer: fine)`).matches&&!window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;return(0,w.jsxs)(w.Fragment,{children:[O&&(0,w.jsx)(se,{$isDark:c,$bgOpacity:D,$translateY:C,children:(0,w.jsxs)(le,{className:d?`is-opening`:``,children:[(0,w.jsx)(ue,{$isDark:c,children:`Selected work · 03 projects`}),(0,w.jsxs)(ce,{$isDark:c,$scale:S,$textOpacity:E,$letterSpacing:T,children:[(0,w.jsx)(`span`,{className:`opening-word`,children:`EXPLORE`}),``,(0,w.jsx)(`br`,{}),(0,w.jsx)(`span`,{className:`opening-word`,children:`PROJECTS`})]})]})}),t&&typeof document<`u`&&(0,ae.createPortal)((0,w.jsx)(de,{$isDark:c,$isClosing:l,onClick:e=>{e.target===e.currentTarget&&k()},onMouseMove:e=>{if(!h.current||!A())return;let t=e.clientX/window.innerWidth-.5,n=e.clientY/window.innerHeight-.5;h.current.style.transform=`rotateX(${(-n*5).toFixed(2)}deg) rotateY(${(t*7).toFixed(2)}deg)`},onMouseLeave:()=>{h.current&&(h.current.style.transform=`rotateX(0deg) rotateY(0deg)`)},onWheel:e=>e.stopPropagation(),onTouchMove:e=>e.stopPropagation(),children:(0,w.jsx)(fe,{children:(0,w.jsx)(pe,{ref:h,$isDark:c,$accent:g.accent,children:(0,w.jsxs)(me,{$isDark:c,$isClosing:l,role:`dialog`,"aria-modal":`true`,"aria-label":g.title,onClick:e=>e.stopPropagation(),children:[(0,w.jsxs)(he,{children:[(0,w.jsxs)(ge,{children:[(0,w.jsxs)(_e,{$isDark:c,children:[g.index,` · `,g.category]}),(0,w.jsx)(ve,{children:`Production live`})]}),(0,w.jsx)(ye,{$isDark:c,$accent:g.accent,onClick:k,"aria-label":`Close details`,children:(0,w.jsx)(G,{})})]}),(0,w.jsxs)(be,{children:[(0,w.jsx)(xe,{children:g.title}),(0,w.jsx)(Se,{$accent:g.accent,$isDark:c,children:g.subtitle})]}),(0,w.jsxs)(Ce,{children:[(0,w.jsxs)(J,{children:[(0,w.jsxs)(we,{$isDark:c,children:[(0,w.jsxs)(Te,{$isDark:c,children:[(0,w.jsx)(`i`,{}),(0,w.jsx)(`i`,{}),(0,w.jsx)(`i`,{}),(0,w.jsx)(`span`,{children:(g.link||`your-project.com`).replace(/^https?:\/\//,``)})]}),(0,w.jsx)(Ee,{$isDark:c,src:_[p],alt:`${g.title} screenshot ${p+1}`},p)]}),_.length>1&&(0,w.jsx)(De,{children:_.map((e,t)=>(0,w.jsx)(Oe,{$active:t===p,$accent:g.accent,onClick:()=>m(t),"aria-label":`Show screenshot ${t+1}`,children:(0,w.jsx)(`img`,{src:e,alt:``})},t))})]}),(0,w.jsxs)(J,{children:[(0,w.jsx)(Y,{$isDark:c,children:(0,w.jsxs)(ke,{$isDark:c,children:[(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`strong`,{children:g.stat||g.category}),`Focus`]}),(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`strong`,{children:g.year||`2026`}),`Year`]}),(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`strong`,{children:`Live demo`}),`Deployment`]})]})}),(0,w.jsx)(Ae,{$isDark:c,children:g.description}),(0,w.jsx)(ze,{list:v,isDark:c,accent:g.accent}),(0,w.jsxs)(`div`,{children:[(0,w.jsx)(X,{$isDark:c,children:`Built with`}),(0,w.jsx)($,{children:g.tech.map(e=>(0,w.jsx)(Fe,{$isDark:c,children:e},e))})]})]})]}),(0,w.jsxs)(Ie,{$isDark:c,children:[(0,w.jsxs)(Le,{href:g.link,target:`_blank`,rel:`noopener noreferrer`,$accent:g.accent,$isDark:c,children:[`Open live demo `,(0,w.jsx)(U,{})]}),(0,w.jsxs)(Re,{href:g.github,target:`_blank`,rel:`noopener noreferrer`,$isDark:c,children:[(0,w.jsx)(W,{}),` Source code`]})]})]})})})}),document.body)]})}var Ve=25,He=b.div`
  position: ${e=>e.$isEmbedded?`relative`:`fixed`};
  ${e=>e.$isEmbedded?`width: 100%; height: 100%;`:`inset: 0; width: 100vw; height: 100vh; z-index: 85;`}
  overflow: hidden;
  background: ${e=>e.$isDark?`#000000`:`#f4f4f6`};
  user-select: none;
`;function Ue({isEmbedded:e=!1,containerRef:t=null}){let{id:n}=a(),{theme:i}=o(),{lenis:c}=s()||{},l=i===`dark`,[u,d]=(0,x.useState)(null),[f,p]=(0,x.useState)(null),[h,g]=(0,x.useState)(!1),[_,y]=(0,x.useState)(0),[b,T]=(0,x.useState)(!1),E=(Math.floor(C.ROWS*.7)-1)*C.ROW_SPACING-2,D=(0,x.useRef)(0),O=(0,x.useRef)(0),k=(0,x.useRef)(0),A=(0,x.useRef)(0),j=(0,x.useRef)(null),M=(0,x.useRef)(!1);(0,x.useEffect)(()=>{if(typeof window>`u`||!window.matchMedia)return;let e=window.matchMedia(`(max-width: 768px)`),t=()=>g(e.matches);return t(),e.addEventListener(`change`,t),()=>e.removeEventListener(`change`,t)},[]),(0,x.useEffect)(()=>{if(!e)return document.body.classList.add(`tunnel-active`),()=>{document.body.classList.remove(`tunnel-active`,`tunnel-scrolling`,`in-tunnel`)}},[e]),(0,x.useEffect)(()=>{if(e&&u){c&&c.stop();let e=document.body.style.overflow;return document.body.style.overflow=`hidden`,()=>{document.body.style.overflow=e,c&&c.start()}}},[e,u,c]),(0,x.useEffect)(()=>{if(n){let e=S.findIndex(e=>e.id===n);if(e!==-1){let t=S[e],n=[1,3,5][e%3];d({project:t,position:[-C.TUNNEL_W/2,0,-n*C.ROW_SPACING],rotation:[0,Math.PI/2,0]})}}},[n]),(0,x.useEffect)(()=>{let n=()=>{if(!u){if(e){let e=t?.current||document.getElementById(`projects`);if(e){let t=e.getBoundingClientRect(),n=window.innerHeight,r=25/100*n,i=e.offsetHeight-n-r;if(i>0){let e=Math.max(0,Math.min(1,(-t.top-r)/i));D.current=e*E}}}M.current||(O.current+=(D.current-O.current)*(e?.18:C.LERP_FACTOR),O.current<.05&&(O.current=0),O.current>E-.05&&(O.current=E),(Math.abs(O.current-k.current)>.08||O.current===0||O.current===E)&&(k.current=O.current,y(O.current))),e||(O.current>.4||u?document.body.classList.add(`tunnel-scrolling`,`in-tunnel`):document.body.classList.remove(`tunnel-scrolling`,`in-tunnel`))}j.current=requestAnimationFrame(n)};return j.current=requestAnimationFrame(n),()=>{j.current&&cancelAnimationFrame(j.current)}},[u,e,t,E]);let N=(0,x.useCallback)(()=>{u&&(d(null),e||window.history.replaceState(null,``,`/projects`));let t=O.current;if(t>.02||D.current>.02){M.current=!0,T(!0);let e=Math.min(1.4,Math.max(1,t*.045)),n={val:t};r.to(n,{val:0,duration:e,ease:`power3.inOut`,onUpdate:()=>{O.current=n.val,D.current=n.val,k.current=n.val,y(n.val)},onComplete:()=>{D.current=0,O.current=0,y(0),M.current=!1,T(!1)}})}},[u,e]);(0,x.useEffect)(()=>{let e=()=>N();return window.addEventListener(`exit-tunnel`,e),()=>window.removeEventListener(`exit-tunnel`,e)},[N]);let P=(0,x.useCallback)(t=>{e||u||M.current||(D.current=Math.min(E,Math.max(0,D.current+t.deltaY*C.SCROLL_SPEED_FORWARD)))},[u,e,E]),F=(0,x.useCallback)(t=>{e||u||M.current||(A.current=t.touches[0].clientY)},[u,e]),I=(0,x.useCallback)(t=>{if(e||u||M.current)return;let n=A.current-t.touches[0].clientY;A.current=t.touches[0].clientY,D.current=Math.min(E,Math.max(0,D.current+n*C.SCROLL_SPEED_FORWARD*1.3))},[u,e,E]),L=(0,x.useCallback)((t,n,r)=>{d({project:t,position:n,rotation:r}),e||window.history.replaceState(null,``,`/projects/${t.id}`)},[e]),R=(0,x.useCallback)(()=>{d(null),e||window.history.replaceState(null,``,`/projects`)},[e]);return(0,x.useEffect)(()=>{let t=t=>{u?t.key===`Escape`&&R():e||(t.key===`Escape`?N():t.key===`ArrowDown`||t.key===`PageDown`||t.key===` `?D.current=Math.min(E,D.current+3.5):(t.key===`ArrowUp`||t.key===`PageUp`)&&(D.current=Math.max(0,D.current-3.5)))};return window.addEventListener(`keydown`,t),()=>window.removeEventListener(`keydown`,t)},[u,e,R,N,E]),(0,w.jsxs)(He,{$isDark:l,$isEmbedded:e,onWheel:e?void 0:P,onTouchStart:e?void 0:F,onTouchMove:e?void 0:I,children:[(0,w.jsxs)(m,{dpr:[1,h?1.25:1.5],performance:{min:.7},frameloop:`always`,camera:{position:[0,0,C.CAMERA_Z_START],fov:h?C.FOV_MOBILE:C.FOV_DESKTOP,near:.1,far:90},gl:{antialias:!h,powerPreference:`high-performance`,alpha:!1,stencil:!1},style:{width:`100%`,height:`100%`,background:l?`#000000`:`#f4f4f6`},children:[(0,w.jsx)(`color`,{attach:`background`,args:[l?`#000000`:`#f4f4f6`]}),(0,w.jsx)(`fog`,{attach:`fog`,args:[l?`#000000`:`#f4f4f6`,13,58]}),(0,w.jsx)(`ambientLight`,{intensity:l?.78:1.35}),(0,w.jsx)(`hemisphereLight`,{skyColor:l?`#172033`:`#ffffff`,groundColor:l?`#020204`:`#cbd5e1`,intensity:l?.65:.8}),(0,w.jsx)(`directionalLight`,{position:[6,9,6],intensity:l?1.15:1.6,color:l?`#dbeafe`:`#ffffff`}),(0,w.jsx)(`pointLight`,{position:[0,0,5],color:l?`#ffffff`:`#f8fafc`,intensity:l?1.15:.65,distance:16,decay:2}),(0,w.jsx)(`pointLight`,{position:[0,0,-42],color:l?`#ffffff`:`#e2e8f0`,intensity:l?1.4:.75,distance:26,decay:2}),(0,w.jsxs)(x.Suspense,{fallback:null,children:[(0,w.jsx)(re,{projects:S,onSelect:L,hoveredId:f,setHoveredId:p,selectedId:u?.project.id??null,isMobile:h,isDark:l}),(0,w.jsx)(ie,{scrollDistance:_,scrollDistanceRef:O,selected:u,isMobile:h,isRewinding:b}),(0,w.jsx)(v,{all:!0})]})]}),(0,w.jsx)(Be,{scrollDistance:_,selected:u,onClose:R,onExit:N,theme:i,isExiting:b,isEmbedded:e,effectiveMaxScroll:E})]})}export{Ve as INTRO_HOLD_VH,Ue as default};