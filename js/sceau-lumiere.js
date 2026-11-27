/* Sceaux anti-spoil : lumière derrière le médaillon (couronne, rayons volumétriques),
   montée, fissure, éblouissement puis extinction fluide. WebGL ; sans WebGL, l'ancien effet CSS reste. */
(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS=[
'precision highp float;',
'uniform vec2 res,ctr;uniform float t,charge,bt,flash,rm;',
'float h(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
'float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);',
' return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),',
'  mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}',
'float rays(float a,float r,float off){',
' vec2 d=vec2(cos(a+off),sin(a+off));',
' float f=n3(vec3(d*15.,t*.30+r*1.4))*.55+n3(vec3(d*34.,t*.45-r*2.1))*.30+n3(vec3(d*70.,t*.6+r*3.))*.15;',
' float b=n3(vec3(d*4.5,t*.10));',
' return pow(smoothstep(.30,.88,f),1.7)*(.30+1.0*b);}',
'void main(){',
' vec2 uv=(gl_FragCoord.xy-ctr)/res.y; float r=length(uv); float a=atan(uv.y,uv.x);',
' float beat=1.+.38*pow(sin(t*1.7)*.5+.5,3.);',
' float I=(.085+.04*sin(t*.8))*beat+charge*.5;',
' float Lg=.26+charge*.30;',
' float dec=1.-smoothstep(.18,1.3,bt);dec*=dec*(3.-2.*dec);',
' float e=1.-pow(1.-clamp(bt/1.5,0.,1.),3.);',
' float front=.12+e*1.9;',
' float bm=bt>=0.?1.-smoothstep(front*.5,front,r):0.;',
' vec3 col=vec3(0.);',
' for(int c=0;c<3;c++){',
'  float off=(float(c)-1.)*.0028;',
'  float rr=rays(a,r,off);',
'  float occ=bt>=0.?mix(smoothstep(rm*.92,rm*1.12,r),1.,smoothstep(0.,.12,bt)):smoothstep(rm*.92,rm*1.12,r);',
'  float v=rr*I*exp(-(r-rm*.9)/Lg)/(1.+r*5.)*occ;',
'  if(bt>=0.){float rb=pow(rr,.8);v+=rb*bm*dec*.85*exp(-r/(.5+e*.7))/(1.+r*2.2)*smoothstep(0.,.06,bt);}',
'  if(c==0)col.r=v;else if(c==1)col.g=v;else col.b=v;',
' }',
' vec3 warm=mix(vec3(1.,.62,.24),vec3(1.,.93,.74),exp(-r*4.));',
' col*=warm*1.3;',
' float ro=max(r-rm,0.);float occ0=bt>=0.?smoothstep(0.,.12,bt):0.;',
' float g=(exp(-ro*26.)*(.42+charge*.9)*(.82+.18*sin(t*1.7))+exp(-ro*7.)*(.10+charge*.35))*smoothstep(rm*.9,rm*1.02,r)*(1.-occ0)+exp(-r*11.)*(.2+charge*.5)*occ0;',
' float k=smoothstep(0.,.08,bt)*dec;',
' if(bt>=0.) g+=(exp(-r*5.)*1.6+exp(-r*1.8)*.55)*k;',
' float s=exp(-abs(uv.y)*190.)*exp(-abs(uv.x)*9.)*(charge*.18+(bt>=0.?k*exp(-bt*2.)*.9:0.));',
' float cl=smoothstep(.25,1.,charge)*rm*1.06*(bt>=0.?max(1.-bt*3.,0.):1.);',
' float dx=abs(uv.x);',
' float cm=smoothstep(cl,cl-.05,abs(uv.y))*step(.001,cl);',
' float line=(exp(-dx*900.)*.9+exp(-dx*90.)*.35+exp(-dx*16.)*.10)*cm*smoothstep(0.,.5,charge);',
' col+=(g+s)*vec3(1.,.92,.76)+line*vec3(1.,.95,.82);',
' col=1.-exp(-col*1.25);',
' col=mix(col,mix(vec3(1.,.84,.55),vec3(1.,.99,.95),flash*flash),flash);',
' col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;',
' col=clamp(col,0.,1.);',
' float al=max(col.r,max(col.g,col.b));',
' gl_FragColor=vec4(col,al);}'].join('\n');

  function ss(a,b,x){x=Math.min(Math.max((x-a)/(b-a),0),1);return x*x*(3-2*x);}
  function ease(x){x=Math.min(Math.max(x,0),1);return 1-Math.pow(1-x,3);}

  function make(fig){
    var wax=fig.querySelector('.wax');if(!wax)return null;
    var cv=document.createElement('canvas');cv.className='seal-gl';cv.setAttribute('aria-hidden','true');
    var gl=cv.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false})||cv.getContext('experimental-webgl',{premultipliedAlpha:true,alpha:true});
    if(!gl)return null;
    function sh(type,src){var o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null;}
    var vs=sh(gl.VERTEX_SHADER,VS),fs=sh(gl.FRAGMENT_SHADER,FS);if(!vs||!fs)return null;
    var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
    gl.useProgram(pr);
    var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var la=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(la);gl.vertexAttribPointer(la,2,gl.FLOAT,false,0,0);
    var U={};['res','ctr','t','charge','bt','flash','rm'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n);});
    gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    fig.appendChild(cv);

    var RS=Math.min(window.devicePixelRatio||1,1.5)*.8,CX=0,CY=0,RM=40;
    var st={S:0,tS:0,tB:0,T0:0,run:false,vis:false,done:false};
    function size(){
      var a=cv.getBoundingClientRect(),b=wax.getBoundingClientRect();if(!a.width)return;
      cv.width=Math.max(2,Math.round(a.width*RS));cv.height=Math.max(2,Math.round(a.height*RS));
      CX=(b.left+b.width/2-a.left)*RS;CY=(a.height-(b.top+b.height/2-a.top))*RS;RM=b.width*.17*RS;
      gl.viewport(0,0,cv.width,cv.height);
    }
    function frame(now){
      if(!st.run)return;
      if(!st.T0)st.T0=now;
      var t=(now-st.T0)/1000,charge=0,bt=-1,flash=0;
      if(st.S>=1)charge=ease((now-st.tS)/1000);
      if(st.S>=2){bt=(now-st.tB)/1000;charge=Math.max(0,1-bt*2.2);flash=(bt<.35?ss(0,.35,bt):1-ss(.35,1.2,bt))*.8;}
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.res,cv.width,cv.height);gl.uniform2f(U.ctr,CX,CY);gl.uniform1f(U.t,t);
      gl.uniform1f(U.charge,charge);gl.uniform1f(U.bt,bt);gl.uniform1f(U.flash,flash);gl.uniform1f(U.rm,RM/cv.height);
      gl.drawArrays(gl.TRIANGLES,0,3);
      if(st.S>=2&&bt>1.9){st.run=false;st.done=true;gl.clear(gl.COLOR_BUFFER_BIT);cv.remove();return;}
      if(st.S===0&&!st.vis){st.run=false;return;}
      requestAnimationFrame(frame);
    }
    function go(){if(st.run||st.done)return;st.run=true;requestAnimationFrame(frame);}
    if(window.IntersectionObserver){
      new IntersectionObserver(function(es){es.forEach(function(e){st.vis=e.isIntersecting;if(st.vis){size();go();}});},{rootMargin:'80px'}).observe(fig);
    }else{st.vis=true;size();go();}
    if(window.ResizeObserver)new ResizeObserver(size).observe(fig);else addEventListener('resize',size);
    return {
      charge:function(){size();st.S=1;st.tS=performance.now();st.vis=true;go();},
      burst:function(){st.S=2;st.tB=performance.now();go();}
    };
  }

  var probe=document.createElement('canvas'),okGL=false;
  try{okGL=!!(probe.getContext('webgl')||probe.getContext('experimental-webgl'));}catch(e){}
  if(!okGL)return;
  var api={};
  function init(){
    document.querySelectorAll('.sealed[data-seal]').forEach(function(fig){
      if(fig.classList.contains('open')||fig._lum)return;
      var L=make(fig);if(L){fig._lum=L;document.documentElement.classList.add('seal-gl');}
    });
  }
  api.get=function(fig){return fig._lum||null;};
  window.SceauLumiere=api;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
