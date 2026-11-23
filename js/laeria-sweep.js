/* « Laëria » : un seul passage de lumière continu, sans pause, sur des lettres légèrement métalliques */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var sel='.itit,.hl,.laeria-mot,.syl b,.brand>span,.brand,.lt-mot';
  var words=[],P=3400;
  function scan(){
    words=[];
    document.querySelectorAll(sel).forEach(function(w){
      var ls=[].slice.call(w.querySelectorAll('.l'));
      if(!ls.length)return;
      if(getComputedStyle(w).position==='static')w.style.position='relative';
      var ww=w.offsetWidth||1;
      ls.forEach(function(l){l.style.setProperty('--ox',l.offsetLeft+'px');var c=(l.textContent||'').trim().toLowerCase();var m={l:'L',a:'A','ë':'E','e':'E',r:'R',i:'I'}[c];if(m)l.setAttribute('data-g',m)});
      w.style.setProperty('--ww',ww+'px');w.style.setProperty('--bw',Math.round(ww*.55)+'px');
      if(!w.classList.contains('sweep')){w.classList.add('sweep');if(io)io.observe(w);}words.push({el:w,ww:ww,bw:ww*.55});
    });
  }
  var vis=new Set(),io=null,last=0;
  if('IntersectionObserver' in window){io=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?vis.add(e.target):vis.delete(e.target)})},{rootMargin:'80px'});}
  function tick(now){
    requestAnimationFrame(tick);
    if(now-last<33)return; /* ~30 images/s : suffisant pour un reflet, bien plus léger */
    last=now;
    var t=(now%P)/P;
    for(var i=0;i<words.length;i++){var o=words[i];if(io&&!vis.has(o.el))continue;o.el.style.setProperty('--sx',(-o.bw+t*(o.ww+o.bw)).toFixed(1)+'px');}
  }
  function init(){scan();if(reduce){words.forEach(function(o){o.el.style.setProperty('--sx',(o.ww*.5-o.bw*.5)+'px')});}else requestAnimationFrame(tick);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,60)});else setTimeout(init,60);
  addEventListener('load',scan);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scan);
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(scan,150)});
})();
