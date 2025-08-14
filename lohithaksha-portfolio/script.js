
// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.gap = '12px';
    navLinks.style.background = 'rgba(11,15,25,0.96)';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '56px';
    navLinks.style.right = '16px';
    navLinks.style.padding = '14px';
    navLinks.style.border = '1px solid rgba(255,255,255,0.1)';
    navLinks.style.borderRadius = '14px';
  });
}

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Particles background
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = Array.from({length: Math.min(120, Math.floor(w*h/16000))}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*0.4,
      vy: (Math.random()-0.5)*0.4,
      r: Math.random()*2 + 0.6
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function step() {
    ctx.clearRect(0,0,w,h);
    // draw links
    for(let i=0;i<particles.length;i++){
      const a = particles[i];
      a.x += a.vx; a.y += a.vy;
      if(a.x<0||a.x>w) a.vx*=-1;
      if(a.y<0||a.y>h) a.vy*=-1;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,255,213,0.7)';
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d=dx*dx+dy*dy;
        if(d< 130*130){
          const alpha = 1 - d/(130*130);
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.strokeStyle = `rgba(124,92,255,${alpha*0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();
