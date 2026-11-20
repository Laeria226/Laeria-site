/* « Laëria » : un seul passage de lumière continu, sans pause, sur des lettres légèrement métalliques */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var sel='.itit,.hl,.laeria-mot,.syl b,.brand>span,.brand,.lt-mot';
  var words=[],P=3400;
  function scan(){
    words=[];
    document.querySelectorAll(sel).forEach(function(w){
      var ls=[].slice.call(w.children).filter(function(c){return c.classList&&c.classList.contains('l')});
      if(!ls.length)return;
      if(getComputedStyle(w).position==='static')w.style.position='relative';
      var ww=w.offsetWidth||1;
      ls.forEach(function(l){l.style.setProperty('--ox',l.offsetLeft+'px')});
      w.style.setProperty('--ww',ww+'px');w.style.setProperty('--bw',Math.round(ww*.55)+'px');
      w.classList.add('sweep');words.push({el:w,ww:ww,bw:ww*.55});
    });
  }
  function tick(now){
    var t=(now%P)/P;
    for(var i=0;i<words.length;i++){var o=words[i];o.el.style.setProperty('--sx',(-o.bw+t*(o.ww+o.bw)).toFixed(1)+'px');}
    requestAnimationFrame(tick);
  }
  function init(){scan();if(reduce){words.forEach(function(o){o.el.style.setProperty('--sx',(o.ww*.5-o.bw*.5)+'px')});}else requestAnimationFrame(tick);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,60)});else setTimeout(init,60);
  addEventListener('load',scan);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(scan);
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(scan,150)});
})();
