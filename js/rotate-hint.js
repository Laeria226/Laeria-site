/* Téléphone en paysage : invitation à passer en portrait (l'expérience est pensée pour le portrait) */
(function(){
  var mq=function(q){try{return matchMedia(q).matches}catch(e){return false}};
  var KEY='laeria-paysage-ok';
  var css='#rot-hint{position:fixed;inset:0;z-index:2147483000;display:none;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:24px;text-align:center;background:radial-gradient(ellipse at 50% 40%,#2a1747 0%,#0c0914 75%);color:#f3e6c4;font-family:Georgia,"Times New Roman",serif;touch-action:none}'
   +'#rot-hint.on{display:flex}'
   +'#rot-hint .ph{width:74px;height:124px;border:2.5px solid #d9b26a;border-radius:16px;position:relative;box-shadow:0 0 22px rgba(255,200,120,.35) inset,0 0 18px rgba(255,200,120,.25);animation:rot-turn 2.8s ease-in-out infinite}'
   +'#rot-hint .ph::after{content:"";position:absolute;left:50%;bottom:9px;width:18px;height:3px;margin-left:-9px;border-radius:2px;background:#d9b26a;opacity:.8}'
   +'@keyframes rot-turn{0%,15%{transform:rotate(0)}45%,70%{transform:rotate(-90deg)}100%{transform:rotate(0)}}'
   +'#rot-hint p{margin:0;max-width:340px;font-size:17px;line-height:1.55;letter-spacing:.02em}'
   +'#rot-hint p b{font-weight:400;color:#f2cf86}'
   +'#rot-hint button{margin-top:6px;background:none;border:1px solid #d9b26a;color:#f2cf86;padding:11px 20px;font:inherit;font-size:13px;letter-spacing:.14em;text-transform:uppercase;border-radius:2px;cursor:pointer}'
   +'@media (prefers-reduced-motion:reduce){#rot-hint .ph{animation:none;transform:rotate(-90deg)}}';
  var box=null;
  function build(){
    var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    box=document.createElement('div');box.id='rot-hint';box.setAttribute('role','dialog');box.setAttribute('aria-label','Passez en mode portrait');
    box.innerHTML='<div class="ph" aria-hidden="true"></div>'
      +'<p><b>Pour une meilleure expérience</b>, tenez votre téléphone en mode portrait.</p>'
      +'<button type="button">Continuer quand même</button>';
    box.querySelector('button').addEventListener('click',function(){
      try{sessionStorage.setItem(KEY,'1')}catch(e){}
      box.classList.remove('on');
    });
    box.addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
    document.body.appendChild(box);
  }
  function ok(){try{return sessionStorage.getItem(KEY)==='1'}catch(e){return false}}
  function check(){
    if(!box)return;
    var paysage=innerWidth>innerHeight&&innerHeight<=600&&mq('(pointer:coarse)');
    if(!paysage){try{sessionStorage.removeItem(KEY)}catch(e){}}
    if(paysage&&!ok())box.classList.add('on');else box.classList.remove('on');
  }
  function start(){build();check();addEventListener('resize',check);addEventListener('orientationchange',function(){setTimeout(check,250)});}
  if(document.body)start();else document.addEventListener('DOMContentLoaded',start);
})();
