// Storie in stile Instagram: 4 video verticali, barre di avanzamento in alto,
// tocco a sinistra = indietro, tocco a destra = avanti. Ogni storia dura 5 secondi
// e alla fine si riparte dalla prima.
(function () {
  'use strict';

  var box = document.getElementById('stories');
  if (!box) return;

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var slides = Array.prototype.slice.call(box.querySelectorAll('.story-slide'));
  var fills = Array.prototype.slice.call(box.querySelectorAll('.progress-fill'));
  var duration = 5000;
  var current = 0;
  var timer = null;
  var visible = false;

  function play(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function stop() {
    clearTimeout(timer);
    slides.forEach(function (s) {
      var v = s.querySelector('video');
      if (v) v.pause();
    });
  }

  function show(i) {
    clearTimeout(timer);
    current = i;

    slides.forEach(function (s, k) {
      s.classList.toggle('active', k === i);
      var v = s.querySelector('video');
      if (!v) return;
      if (k === i) { v.currentTime = 0; play(v); } else { v.pause(); }
    });

    fills.forEach(function (f, k) {
      f.style.transition = 'none';
      f.style.width = k < i ? '100%' : '0%';
    });
    void box.offsetWidth; // applica gli stili prima di far partire la barra

    if (reduce) {
      // niente avanzamento automatico: la barra resta piena e si cambia toccando
      fills[i].style.width = '100%';
      return;
    }
    fills[i].style.transition = 'width ' + duration + 'ms linear';
    fills[i].style.width = '100%';
    timer = setTimeout(next, duration);
  }

  function next() { show((current + 1) % slides.length); }
  function prev() { show(current > 0 ? current - 1 : 0); }

  box.querySelector('.story-nav-right').addEventListener('click', next);
  box.querySelector('.story-nav-left').addEventListener('click', prev);

  // parte quando la storia è a schermo e si ferma quando esci
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var now = es[0].isIntersecting;
      if (now === visible) return;
      visible = now;
      if (now) show(current); else stop();
    }, { threshold: 0.5 }).observe(box);
  } else {
    show(0);
  }
})();
