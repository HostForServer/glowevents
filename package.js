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

// Scelta rapida dei pacchetti (telefono): i pulsanti portano alla card,
// quello attivo segue la card che stai guardando.
(function () {
  'use strict';

  var track = document.getElementById('pks');
  var nav = document.getElementById('pkNav');
  if (!track || !nav) return;

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var chips = Array.prototype.slice.call(nav.querySelectorAll('.pk-chip'));

  function setActive(id) {
    chips.forEach(function (c) {
      c.setAttribute('aria-current', String(c.getAttribute('data-t') === id));
    });
  }

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var card = document.getElementById(c.getAttribute('data-t'));
      if (card) card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
    });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { root: track, threshold: 0.6 });
    Array.prototype.forEach.call(track.querySelectorAll('.pk'), function (p) { io.observe(p); });
  }
})();
