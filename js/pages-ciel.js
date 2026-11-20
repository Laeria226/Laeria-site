/* Ciel des sous-pages : calque diffus, ornements issus des illustrations, étoiles, lueur du mot Laëria */
(function(){
  var b=document.body;
  var c=document.createElement('div');c.className='ciel';c.setAttribute('aria-hidden','true');
  c.innerHTML='<img class="orn g" src="/img/fleurs-g.webp" alt="" style="top:1%"><img class="orn d" src="/img/fleurs-d.webp" alt="" style="top:34%"><img class="orn g" src="/img/fleurs-g.webp" alt="" style="top:68%">';
  b.insertBefore(c,b.firstChild);
  var cv=document.createElement('canvas');cv.id='etoiles';cv.setAttribute('aria-hidden','true');b.insertBefore(cv,c.nextSibling);
  document.querySelectorAll('footer .wrap').forEach(function(w){var p=w.querySelector('p');if(!p||w.querySelector('.t'))return;
    if(!/Laëria/i.test(p.textContent))return;var t=document.createElement('div');t.className='t';t.innerHTML='<span class="lt-mot">Laëria</span><span class="lt-sub">Le Nouveau Monde</span>';w.replaceChild(t,p)});
  document.querySelectorAll('.brand,.lt-mot').forEach(function(el){
    var tn=[].slice.call(el.childNodes).filter(function(n){return n.nodeType==3&&n.textContent.trim()})[0];if(!tn)return;
    var t=tn.textContent.trim(),f=document.createDocumentFragment(),a=document.createElement('span');a.setAttribute('aria-label',t);a.style.display='inline-block';
    t.split('').forEach(function(ch,i){var s=document.createElement('span');s.className='l';s.setAttribute('aria-hidden','true');s.style.setProperty('--d',(i*.42).toFixed(2)+'s');s.textContent=ch;a.appendChild(s)});
    tn.parentNode.replaceChild(a,tn);
  });
  var cx=cv.getContext('2d'),W=0,H=0,dpr=1,S=[],reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,mob=matchMedia('(max-width:700px)').matches;
  var cols=['255,255,255','255,244,222','236,228,255','255,232,200'];
  function rnd(a,b){return a+Math.random()*(b-a)}
  function build(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
    var nT=mob?26:58,nM=mob?6:12,nB=mob?2:4;S=[];
    for(var i=0;i<nT+nM+nB;i++){var t=i<nB?2:i<nB+nM?1:0;S.push({x:Math.random(),y:Math.random(),t:t,r:t==2?rnd(4.5,7):t==1?rnd(1.1,1.7):rnd(.45,.95),ph:rnd(0,6.28),sp:rnd(.25,.7),c:cols[(Math.random()*cols.length)|0],par:t==2?.2:rnd(.04,.14),o:t==0?rnd(.35,.75):rnd(.6,.9)})}}
  function sparkle(x,y,L,a,c){var g=cx.createRadialGradient(x,y,0,x,y,L*1.7);g.addColorStop(0,'rgba('+c+','+(.5*a)+')');g.addColorStop(1,'rgba('+c+',0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y,L*1.7,0,6.283);cx.fill();var w=L*.16;cx.fillStyle='rgba(255,252,240,'+(.92*a)+')';cx.beginPath();cx.moveTo(x,y-L);cx.quadraticCurveTo(x+w,y-w,x+L,y);cx.quadraticCurveTo(x+w,y+w,x,y+L);cx.quadraticCurveTo(x-w,y+w,x-L,y);cx.quadraticCurveTo(x-w,y-w,x,y-L);cx.fill()}
  function frame(t){var y=scrollY||0;cx.clearRect(0,0,W,H);
    for(var i=0;i<S.length;i++){var s=S[i],tw=reduce?.8:(.6+.4*Math.sin(t/1000*s.sp+s.ph)),px=s.x*W,py=(((s.y*H-y*s.par)%H)+H)%H,a=tw*s.o;
      if(s.t==2)sparkle(px,py,s.r*(.85+.25*tw),Math.min(1,a+.1),s.c);
      else{if(s.t==1){var g=cx.createRadialGradient(px,py,0,px,py,s.r*3.4);g.addColorStop(0,'rgba('+s.c+','+(.38*a)+')');g.addColorStop(1,'rgba('+s.c+',0)');cx.fillStyle=g;cx.beginPath();cx.arc(px,py,s.r*3.4,0,6.283);cx.fill()}
        cx.fillStyle='rgba('+s.c+','+a+')';cx.beginPath();cx.arc(px,py,s.r,0,6.283);cx.fill()}}}
  function loop(t){frame(t);requestAnimationFrame(loop)}
  build();if(reduce){frame(0);addEventListener('scroll',function(){frame(0)},{passive:true})}else requestAnimationFrame(loop);
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){build();if(reduce)frame(0)},150)});
})();
