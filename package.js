// Pagina pacchetti: comparsa delle card allo scroll e parallasse dell'immagine in alto.
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  root.classList.add('js');

  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  var hero = document.querySelector('.phero');
  if (hero && !reduce) {
    var queued = false;
    var update = function () {
      queued = false;
      var r = hero.getBoundingClientRect();
      if (r.bottom < 0) return;
      var p = Math.max(0, Math.min(1, -r.top / Math.max(r.height, 1)));
      hero.style.setProperty('--py', p.toFixed(3));
    };
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
