/* Scintillement très léger de quelques étoiles de l'image d'ouverture (celles déjà dessinées) */
(function(){
  var cam=document.querySelector('.icam'),img=cam&&cam.querySelector('.ipic');if(!cam||!img)return;
  var D=[[.2585,.082,0],[.861,.146,1.7],[.172,.139,.9],[.974,.176,2.6]];      // paysage
  var M=[[.079,.080,0],[.699,.024,1.5],[.928,.0675,.7],[.293,.019,2.4]];      // portrait
  var layer=document.createElement('div');layer.className='istars';layer.setAttribute('aria-hidden','true');cam.appendChild(layer);
  var els=[];for(var i=0;i<4;i++){var s=document.createElement('i');layer.appendChild(s);els.push(s)}
  function place(){
    var nw=img.naturalWidth,nh=img.naturalHeight;if(!nw)return;
    var W=cam.clientWidth,H=cam.clientHeight,sc=Math.max(W/nw,H/nh),rw=nw*sc,rh=nh*sc;
    var op=(getComputedStyle(img).objectPosition||'50% 50%').split(' ').map(function(v){return parseFloat(v)/100});
    var ox=(W-rw)*op[0],oy=(H-rh)*(isNaN(op[1])?.5:op[1]);
    var P=matchMedia('(max-width:700px) and (orientation:portrait)').matches?M:D,sz=Math.max(22,rw*.017);
    els.forEach(function(e,k){var p=P[k];
      e.style.left=(ox+p[0]*rw)+'px';e.style.top=(oy+p[1]*rh)+'px';
      e.style.width=e.style.height=sz+'px';e.style.animationDelay=(-p[2])+'s';
      e.style.opacity=(ox+p[0]*rw<0||ox+p[0]*rw>W||oy+p[1]*rh<0||oy+p[1]*rh>H)?0:''});
  }
  var hero=document.querySelector('.ihero');
  function glow(){ /* place la lumière de la serrure sur l'image de fond de l'écran du titre */
    var nw=img.naturalWidth,nh=img.naturalHeight;if(!nw||!hero)return;
    var port=matchMedia('(max-width:700px) and (orientation:portrait)').matches,W=hero.clientWidth,H=hero.clientHeight;
    var iw=port?1568:2576,ih=port?2100:1923,sc=Math.max(W/iw,H/ih),rw=iw*sc,rh=ih*sc;
    var kx=port?.53:.505,ky=port?.45:.43,ox=(W-rw)*.516,oy=(H-rh)*.45;
    hero.style.setProperty('--gx',(ox+kx*rw)+'px');hero.style.setProperty('--gy',(oy+ky*rh)+'px');hero.style.setProperty('--gr',(rw*.24)+'px');
  }
  glow();addEventListener('resize',glow);addEventListener('load',glow);
  if(img.complete)place();img.addEventListener('load',place);addEventListener('resize',place);addEventListener('load',place);
})();
