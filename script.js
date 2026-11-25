/* ===== زهزة لاند · script.js ===== */
(function(){
  'use strict';
  // Put the real YouTube channel / video link here when it exists.
  // While empty, the "watch" buttons show "coming soon" instead of a broken link.
  var YOUTUBE_URL = '';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  // Header gets a solid background after scrolling
  var nav = $('#nav');
  function navState(){ nav.classList.toggle('solid', window.scrollY > 40); }
  navState(); window.addEventListener('scroll', navState, {passive:true});

  // Watch buttons
  $$('[data-yt]').forEach(function(a){
    if (YOUTUBE_URL){ a.href = YOUTUBE_URL; a.target = '_blank'; a.rel = 'noopener'; }
    else if (a.id === 'ytbtn'){ a.textContent = 'الحلقة الأولى قريبًا على يوتيوب'; a.setAttribute('aria-disabled','true'); a.addEventListener('click', function(e){e.preventDefault();}); }
  });

  // Flip cards: tap/click toggles (hover and keyboard focus work in CSS)
  $$('.flip').forEach(function(c){
    c.addEventListener('click', function(){ c.classList.toggle('on'); });
  });

  // Step highlighting helper
  var steps = $$('#steps .step');
  function setStep(i){ steps.forEach(function(s,k){ s.classList.toggle('on', k===i); }); }

  // Count-up (works without GSAP too)
  function countUp(el){
    var end = +el.dataset.count, t0 = null, dur = 1400;
    function f(t){ if(!t0) t0=t; var p=Math.min((t-t0)/dur,1); el.textContent = Math.round(end*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  var counted = false;
  var statsEl = $('#stats');
  if ('IntersectionObserver' in window && !reduce){
    new IntersectionObserver(function(es,o){ es.forEach(function(e){ if(e.isIntersecting && !counted){ counted=true; $$('[data-count]').forEach(countUp); o.disconnect(); } }); },{threshold:.35}).observe(statsEl);
  }

  if (reduce || typeof gsap === 'undefined'){
    // Static fallback: everything is visible, story shows the final clean state
    var vis = $('#visual'); if (vis){ $('.dirty',vis).style.opacity = 0; $('.clean',vis).style.opacity = 1; $$('.mud,.germ',vis).forEach(function(n){n.style.display='none';}); }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero: bouncy entrance, characters pop one by one
  var tl = gsap.timeline({defaults:{ease:'back.out(1.8)'}});
  tl.from('[data-pop]', {y:40, opacity:0, scale:.9, duration:.7, stagger:.12}, .1)
    .from('#cast .c', {y:260, scale:.4, rotate:function(i){return (i%2?1:-1)*18}, opacity:0, duration:1, ease:'elastic.out(1,.55)', stagger:.12}, .35)
    .from('.sun', {scale:0, duration:1, ease:'elastic.out(1,.5)'}, 0);
  // Characters jump when hovered
  $$('#cast .c').forEach(function(c){
    c.addEventListener('pointerenter', function(){ gsap.fromTo(c,{y:0},{y:-40,duration:.25,yoyo:true,repeat:1,ease:'power2.out',overwrite:'auto'}); });
  });

  // Pinned storytelling: one visual transforms while scrolling
  var vis = $('#visual');
  var mm = gsap.matchMedia();
  mm.add('(min-width: 0px)', function(){
    var st = gsap.timeline({
      scrollTrigger:{trigger:'#story', start:'top top', end:'+=220%', pin:true, scrub:.6,
        onUpdate:function(self){ setStep(self.progress<.34?0:self.progress<.67?1:2); }},
      defaults:{ease:'none'}
    });
    st.to('.germ',{y:function(i){return -8*(i+1)},rotate:function(i){return i%2?18:-18},duration:.3,yoyo:true,repeat:1,ease:'sine.inOut'},0)
      .to('.bub',{scale:1,y:-30,duration:.35,stagger:.03,ease:'back.out(2)'},.3)
      .to('.counter',{opacity:1,y:-6,duration:.1},.38)
      .to('.mud',{scale:0,opacity:0,duration:.3,stagger:.04},.42)
      .to('.germ',{scale:0,y:80,duration:.25,stagger:.05,ease:'power2.in'},.5)
      .to('.dirty',{opacity:0,duration:.08},.66)
      .to('.clean',{opacity:1,duration:.08},.66)
      .to('.spark',{scale:1,rotate:180,duration:.25,stagger:.04,ease:'back.out(3)'},.7)
      .to('.counter',{opacity:0,duration:.1},.8)
      .to('.hero-c',{y:-14,scale:1.04,duration:.2,yoyo:true,repeat:1,ease:'sine.inOut'},.8);
    return function(){ setStep(0); };
  });

  // Cards pop in with bounce
  gsap.from('#cards .flip',{scrollTrigger:{trigger:'#cards',start:'top 82%'}, y:80, scale:.7, rotate:function(i){return (i%2?4:-4)}, opacity:0, duration:.8, ease:'back.out(1.7)', stagger:.12});

  // Stats and final CTA
  gsap.from('.stat',{scrollTrigger:{trigger:'#stats',start:'top 85%'}, y:50, scale:.8, opacity:0, duration:.7, ease:'back.out(2)', stagger:.1});
  gsap.from('.final .row svg',{scrollTrigger:{trigger:'.final .row',start:'top 92%'}, y:140, opacity:0, duration:.9, ease:'elastic.out(1,.6)', stagger:.1});
  gsap.to('.final .row svg',{y:-12,duration:1.2,yoyo:true,repeat:-1,ease:'sine.inOut',stagger:.18});
  gsap.utils.toArray('.sec-title').forEach(function(t){ gsap.from(t,{scrollTrigger:{trigger:t,start:'top 90%'},y:30,opacity:0,duration:.6}); });
})();
