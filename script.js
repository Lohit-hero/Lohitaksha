/* ============================
   Animated Backgrounds
============================ */

// ---- Stars / constellation layer ----
const starCanvas = document.getElementById('bg-stars');
const sctx = starCanvas.getContext('2d');
let SW, SH;
const STARS = [];
const STAR_COUNT = 160;
const LINK_DIST = 140;

function sizeStars(){
  SW = starCanvas.width = window.innerWidth;
  SH = starCanvas.height = window.innerHeight;
}
function initStars(){
  STARS.length = 0;
  for(let i=0;i<STAR_COUNT;i++){
    STARS.push({
      x: Math.random()*SW,
      y: Math.random()*SH,
      r: Math.random()*1.5+0.5,
      vx:(Math.random()-0.5)*0.35,
      vy:(Math.random()-0.5)*0.35
    });
  }
}
function drawStars(){
  sctx.clearRect(0,0,SW,SH);
  // points
  for(const s of STARS){
    s.x += s.vx; s.y += s.vy;
    if(s.x<0) s.x = SW; if(s.x>SW) s.x = 0;
    if(s.y<0) s.y = SH; if(s.y>SH) s.y = 0;
    sctx.beginPath(); sctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    sctx.fillStyle = 'rgba(255,255,255,0.9)'; sctx.fill();
  }
  // links
  for(let i=0;i<STARS.length;i++){
    for(let j=i+1;j<STARS.length;j++){
      const dx = STARS[i].x - STARS[j].x;
      const dy = STARS[i].y - STARS[j].y;
      const d = Math.hypot(dx,dy);
      if(d < LINK_DIST){
        sctx.beginPath();
        sctx.moveTo(STARS[i].x, STARS[i].y);
        sctx.lineTo(STARS[j].x, STARS[j].y);
        sctx.strokeStyle = `rgba(255,255,255,${1-d/LINK_DIST})`;
        sctx.lineWidth = 0.6;
        sctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawStars);
}
sizeStars(); initStars(); drawStars();
window.addEventListener('resize', ()=>{ sizeStars(); initStars(); });

// ---- Floating geometric shapes layer ----
const shapeCanvas = document.getElementById('bg-shapes');
const hctx = shapeCanvas.getContext('2d');
let HW, HH;
const SHAPES = [];
const SHAPE_COUNT = 60;

function sizeShapes(){
  HW = shapeCanvas.width = window.innerWidth;
  HH = shapeCanvas.height = window.innerHeight;
}
function initShapes(){
  SHAPES.length = 0;
  for(let i=0;i<SHAPE_COUNT;i++){
    SHAPES.push({
      x: Math.random()*HW,
      y: Math.random()*HH,
      s: Math.random()*12+6,
      a: Math.random()*Math.PI*2,
      va: (Math.random()-0.5)*0.01,
      vx: (Math.random()-0.5)*0.3,
      vy: (Math.random()-0.5)*0.3,
      sides: [3,4,6][Math.floor(Math.random()*3)]
    });
  }
}
function poly(ctx, x, y, r, sides, rot=0){
  ctx.beginPath();
  for(let i=0;i<sides;i++){
    const ang = rot + i*2*Math.PI/sides;
    const px = x + Math.cos(ang)*r;
    const py = y + Math.sin(ang)*r;
    i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.closePath();
}
function drawShapes(){
  hctx.clearRect(0,0,HW,HH);
  for(const p of SHAPES){
    p.x+=p.vx; p.y+=p.vy; p.a+=p.va;
    if(p.x<-50)p.x=HW+50; if(p.x>HW+50)p.x=-50;
    if(p.y<-50)p.y=HH+50; if(p.y>HH+50)p.y=-50;
    hctx.save();
    hctx.globalAlpha = 0.08;
    hctx.strokeStyle = '#00d9ff';
    poly(hctx, p.x, p.y, p.s, p.sides, p.a);
    hctx.stroke();
    hctx.restore();
  }
  requestAnimationFrame(drawShapes);
}
sizeShapes(); initShapes(); drawShapes();
window.addEventListener('resize', ()=>{ sizeShapes(); initShapes(); });

/* ============================
   Interactions & Animations
============================ */

// Typewriter effect on the first hero tagline (.hero .muted)
(function(){
  const el = document.querySelector('.hero .muted');
  if(!el) return;
  const txt = el.textContent.trim();
  el.dataset.fullText = txt;
  el.textContent = '';
  let i=0;
  function type(){
    if(i<=txt.length){
      el.textContent = txt.slice(0,i);
      i++;
      setTimeout(type, 18);
    }
  }
  type();
})();

// Intersection-based reveal + stagger for .reveal
const observers = [];
document.querySelectorAll('.reveal').forEach(sec=>{
  const obs = new IntersectionObserver((entries,o)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const t = entry.target;
        t.classList.add('show');
        // stagger children slightly
        [...t.children].forEach((c,idx)=>{
          c.style.transitionDelay = `${idx*60}ms`;
          c.classList.add('show');
        });
        o.unobserve(t);
      }
    });
  }, {threshold:0.1});
  obs.observe(sec);
  observers.push(obs);
});

// Magnetic hover for .btn and nav links
function magnetic(el, strength=0.25){
  const rect = ()=> el.getBoundingClientRect();
  el.addEventListener('mousemove', e=>{
    const r = rect();
    const mx = e.clientX - (r.left + r.width/2);
    const my = e.clientY - (r.top + r.height/2);
    el.style.transform = `translate(${mx*strength}px, ${my*strength}px)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
}
document.querySelectorAll('.btn, header.nav .menu a').forEach(el=>magnetic(el, 0.22));

// Card tilt based on pointer position
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
});

// Back-to-top button visibility
const backToTopBtn = document.getElementById('backToTopBtn');
if(backToTopBtn){
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 300){ backToTopBtn.classList.add('show'); }
    else{ backToTopBtn.classList.remove('show'); }
  });
}

/* ============================
   Optional: Smooth active link highlighting
============================ */
(function(){
  const links = [...document.querySelectorAll('header.nav .menu a')];
  if(!links.length) return;
  const targets = links.map(a=> document.querySelector(a.getAttribute('href')) ).filter(Boolean);

  function onScroll(){
    const y = window.scrollY + 120; // offset for sticky nav
    let activeIndex = -1;
    targets.forEach((sec, i)=>{
      if(sec.offsetTop <= y) activeIndex = i;
    });
    links.forEach((a,i)=> a.classList.toggle('active', i===activeIndex));
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();
