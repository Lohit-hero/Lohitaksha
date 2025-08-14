
const canvas=document.getElementById('bg');
const ctx=canvas.getContext('2d');
let w=canvas.width=window.innerWidth;
let h=canvas.height=window.innerHeight;
const stars=[];const STAR_COUNT=120;const MAX_DIST=150;
for(let i=0;i<STAR_COUNT;i++){
  stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+0.5,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5});
}
function draw(){
  ctx.clearRect(0,0,w,h);
  stars.forEach(s=>{
    s.x+=s.vx; s.y+=s.vy;
    if(s.x<0) s.x=w; if(s.x>w) s.x=0;
    if(s.y<0) s.y=h; if(s.y>h) s.y=0;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle='white'; ctx.fill();
  });
  for(let i=0;i<STAR_COUNT;i++){
    for(let j=i+1;j<STAR_COUNT;j++){
      let dx=stars[i].x-stars[j].x;
      let dy=stars[i].y-stars[j].y;
      let dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<MAX_DIST){
        ctx.beginPath();
        ctx.moveTo(stars[i].x,stars[i].y);
        ctx.lineTo(stars[j].x,stars[j].y);
        ctx.strokeStyle=`rgba(255,255,255,${1-dist/MAX_DIST})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
window.addEventListener('resize',()=>{w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;});
draw();
