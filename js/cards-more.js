/* Fiches personnages : début du texte + « En savoir + » qui déplie en douceur */
(function(){
  function setup(){
    document.querySelectorAll('.cast .card, .grid .card').forEach(function(card){
      var p=card.querySelector('p');if(!p||card.dataset.more)return;
      card.dataset.more='1';
      p.classList.add('mc-p');
      var btn=document.createElement('button');btn.type='button';btn.className='mc-btn';btn.setAttribute('aria-expanded','false');btn.innerHTML='<span>En savoir +</span>';
      p.insertAdjacentElement('afterend',btn);
      function measure(){
        if(card.classList.contains('mc-open'))return;
        p.style.maxHeight='';card.classList.remove('mc-short');
        var lh=parseFloat(getComputedStyle(p).lineHeight)||24,full=p.scrollHeight;
        if(full<=lh*3.4){card.classList.add('mc-short');btn.hidden=true;}else{btn.hidden=false;p.style.maxHeight=(lh*3)+'px';}
      }
      btn.addEventListener('click',function(){
        var open=card.classList.toggle('mc-open');btn.setAttribute('aria-expanded',open);
        btn.firstChild.textContent=open?'Réduire':'En savoir +';
        var lh=parseFloat(getComputedStyle(p).lineHeight)||24;
        p.style.maxHeight=open?p.scrollHeight+'px':(lh*3)+'px';
      });
      card._mm=measure;measure();
    });
  }
  function all(){document.querySelectorAll('.card').forEach(function(c){if(c._mm)c._mm()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
  addEventListener('load',function(){setup();all()});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(all);
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(all,150)});
})();
