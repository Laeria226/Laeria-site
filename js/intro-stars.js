/* géométrie réelle de l'image : posée à la main (téléphone vertical) ou recadrée en « cover » */
function geo(img,cam,nw,nh){var W=cam.clientWidth,H=cam.clientHeight;
  if(img.style.width){return{rw:parseFloat(img.style.width),rh:parseFloat(img.style.height),ox:parseFloat(img.style.left),oy:parseFloat(img.style.top)}}
  var sc=Math.max(W/nw,H/nh),rw=nw*sc,rh=nh*sc,op=(getComputedStyle(img).objectPosition||'50% 50%').split(' ').map(function(v){return parseFloat(v)/100});
  return{rw:rw,rh:rh,ox:(W-rw)*op[0],oy:(H-rh)*(isNaN(op[1])?.5:op[1])}}
/* Scintillement très léger de quelques étoiles de l'image d'ouverture (celles déjà dessinées) */
(function(){
  var cam=document.querySelector('.icam'),img=cam&&cam.querySelector('.ipic');if(!cam||!img)return;
  var D=[[.3156,.0801,0],[.8844,.1445,1.7],[.2488,.1389,.9],[.9788,.1753,2.6]];      // paysage
  var M=[[.079,.080,0],[.699,.024,1.5],[.928,.0675,.7],[.293,.019,2.4]];      // portrait
  var layer=document.createElement('div');layer.className='istars';layer.setAttribute('aria-hidden','true');cam.appendChild(layer);
  var els=[];for(var i=0;i<4;i++){var s=document.createElement('i');layer.appendChild(s);els.push(s)}
  function place(){
    var nw=img.naturalWidth,nh=img.naturalHeight;if(!nw)return;
    var W=cam.clientWidth,H=cam.clientHeight,g=geo(img,cam,nw,nh),rw=g.rw,rh=g.rh,ox=g.ox,oy=g.oy;
    var P=matchMedia('(max-width:700px) and (orientation:portrait)').matches?M:D,sz=Math.max(22,rw*.017);
    els.forEach(function(e,k){var p=P[k];
      e.style.left=(ox+p[0]*rw)+'px';e.style.top=(oy+p[1]*rh)+'px';
      e.style.width=e.style.height=sz+'px';e.style.animationDelay=(-p[2])+'s';
      e.style.opacity=(ox+p[0]*rw<0||ox+p[0]*rw>W||oy+p[1]*rh<0||oy+p[1]*rh>H)?0:''});
  }
  if(img.complete)place();img.addEventListener('load',place);addEventListener('resize',place);addEventListener('load',place);
})();

/* Étoiles filantes : une belle au début, une autre plus loin, puis de rares au loin */
(function(){
  var cam=document.querySelector('.icam'),img=cam&&cam.querySelector('.ipic');if(!cam||!img)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||!cam.animate||matchMedia('(max-width:700px) and (orientation:portrait)').matches)return;
  var layer=document.createElement('div');layer.setAttribute('aria-hidden','true');
  layer.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden';cam.appendChild(layer);
  var n=0;
  function shoot(big){
    var nw=img.naturalWidth,nh=img.naturalHeight;if(!nw||!cam.offsetParent)return;
    var W=cam.clientWidth,H=cam.clientHeight,g=geo(img,cam,nw,nh),rw=g.rw,rh=g.rh,ox=g.ox,oy=g.oy;
    var dir=(n++%2)?1:-1;                                   /* alterne gauche / droite */
    var x0=ox+rw*(dir<0?.12+Math.random()*.07:.78+Math.random()*.05),y0=Math.max(8,oy+rh*(.04+Math.random()*.07));
    var L=dir<0?1:.8,len=rw*(big?.12:.055)*L,dist=rw*(big?.15:.09)*(dir<0?.9:1.15),ang=Math.PI/180*(dir<0?12+Math.random()*6:26+Math.random()*8);
    var dx=dir*Math.cos(ang)*dist,dy=Math.sin(ang)*dist,deg=Math.atan2(dy,dx)*180/Math.PI,th=big?3:1.8;
    var e=document.createElement('i');
    e.style.cssText='position:absolute;left:'+x0+'px;top:'+y0+'px;width:'+len+'px;height:'+th+'px;margin-top:-'+th/2+'px;border-radius:2px;opacity:0;mix-blend-mode:screen;transform-origin:100% 50%;'
      +'background:linear-gradient(90deg,rgba(255,226,160,0),rgba(255,236,190,.7) 65%,rgba(255,252,238,1));'
      +'filter:drop-shadow(0 0 '+(big?7:3)+'px rgba(255,226,160,.8))';
    layer.appendChild(e);
    var T=(big?1500:1100)*(dir<0?1.15:.85),t=function(f){return 'translate('+(dx*f)+'px,'+(dy*f)+'px) rotate('+deg+'deg)'};
    var a=e.animate([{opacity:0,transform:t(0)},{opacity:big?1:.75,transform:t(.12),offset:.12},{opacity:big?.9:.6,transform:t(.65),offset:.65},{opacity:0,transform:t(1)}],{duration:T,easing:'cubic-bezier(.3,.1,.6,1)'});
    a.onfinish=function(){e.remove()};
  }
  var seq=[[2600,0],[5600,0],[9500,0],[14000,0],[19000,0],[24000,0]];
  seq.forEach(function(q){setTimeout(function(){shoot(q[1])},q[0])});
  if(location.search.indexOf('etoile')>-1){setTimeout(function(){shoot(1)},800)}
})();
