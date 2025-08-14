
/* ====== Canvas: Stars (constellation) ====== */
const starCanvas = document.getElementById('bg-stars');
const sctx = starCanvas.getContext('2d');
let SW, SH;
const STARS = [];
const STAR_COUNT = 150;
const LINK_DIST = 140;

function sizeStars(){
  SW = starCanvas.width = window.innerWidth;
  SH = starCanvas.height = window.innerHeight;
}
function initStars(){
  STARS.length = 0;
  for(let i=0;i<STAR_COUNT;i++){
    STARS.push({x:Math.random()*SW, y:Math.random()*SH, r:Math.random()*1.5+0.5, vx:(Math.random()-0.5)*0.4, vy:(Math.random()-0.5)*0.4});
  }
}
function drawStars(){
  sctx.clearRect(0,0,SW,SH);
  // points
  for(const s of STARS){
    s.x+=s.vx; s.y+=s.vy;
    if(s.x<0) s.x=SW; if(s.x>SW) s.x=0;
    if(s.y<0) s.y=SH; if(s.y>SH) s.y=0;
    sctx.beginPath(); sctx.arc(s.x,s.y,s.r,0,Math.PI*2); sctx.fillStyle='rgba(255,255,255,0.9)'; sctx.fill();
  }
  // links
  for(let i=0;i<STAR_COUNT;i++){
    for(let j=i+1;j<STAR_COUNT;j++){
      const dx=STARS[i].x-STARS[j].x, dy=STARS[i].y-STARS[j].y;
      const d=Math.hypot(dx,dy);
      if(d<LINK_DIST){
        sctx.beginPath();
        sctx.moveTo(STARS[i].x,STARS[i].y);
        sctx.lineTo(STARS[j].x,STARS[j].y);
        sctx.strokeStyle=`rgba(255,255,255,${1-d/LINK_DIST})`;
        sctx.lineWidth=0.6;
        sctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawStars);
}
sizeStars(); initStars(); drawStars();
window.addEventListener('resize', ()=>{ sizeStars(); initStars(); });

/* ====== Canvas: Floating Shapes ====== */
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
function poly(ctx, x,y, radius, sides, rotation=0){
  ctx.beginPath();
  for(let i=0;i<sides;i++){
    const ang = rotation + i*2*Math.PI/sides;
    const px = x + Math.cos(ang)*radius;
    const py = y + Math.sin(ang)*radius;
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

/* ====== Typewriter on hero tagline (first .hero .muted) ====== */
(function(){
  const el = document.querySelector('.hero .muted');
  if(!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  let i=0;
  function type(){
    if(i<=text.length){
      el.textContent = text.slice(0,i);
      i++;
      setTimeout(type, 18); // typing speed
    }
  }
  type();
})();

/* ====== Intersection reveal with stagger ====== */
const observers = [];
document.querySelectorAll('.reveal').forEach(section=>{
  const obs = new IntersectionObserver((entries, o)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const target = entry.target;
        target.classList.add('show');
        // stagger children
        Array.from(target.querySelectorAll(':scope > *')).forEach((child, idx)=>{
          child.style.transitionDelay = (idx*60)+'ms';
          child.classList.add('show');
        });
        o.unobserve(target);
      }
    });
  }, {threshold:0.1});
  obs.observe(section);
  observers.push(obs);
});

/* ====== Parallax on scroll (opt-in via [data-parallax]) ====== */
const parallaxEls = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  parallaxEls.forEach(el=>{
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
    el.style.transform = `translateY(${y*speed}px)`;
  });
});

/* ====== Magnetic hover for .btn and nav links ====== */
function magnetic(el, strength=0.4){
  const rect = ()=> el.getBoundingClientRect();
  el.addEventListener('mousemove', e=>{
    const r = rect();
    const mx = e.clientX - (r.left + r.width/2);
    const my = e.clientY - (r.top + r.height/2);
    el.style.transform = `translate(${mx*strength}px, ${my*strength}px)`;
  });
  el.addEventListener('mouseleave', ()=>{
    el.style.transform = 'translate(0,0)';
  });
}
document.querySelectorAll('.btn, header.nav .menu a').forEach(el=>magnetic(el, 0.25));

/* ====== Card tilt based on mouse position ====== */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = '';
  });
});

/* ====== Back-to-top button visibility ====== */
const backToTopBtn = document.getElementById('backToTopBtn');
if(backToTopBtn){
  window.addEventListener('scroll',()=>{
    if(window.scrollY>300){backToTopBtn.classList.add('show');}
    else{backToTopBtn.classList.remove('show');}
  });
}
