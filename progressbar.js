// Barra di avanzamento in alto: si riempie mentre scorri la pagina
(function () {
  'use strict';

  var bar = document.getElementById('progressBar');
  if (!bar) return;

  var queued = false;

  function update() {
    queued = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }

  function queue() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
})();
