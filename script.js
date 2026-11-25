// Home: comparsa allo scroll, card impilate, parallasse, fascia scorrevole,
// hero con video + laser su canvas, modulo che scrive il messaggio WhatsApp.
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Numero WhatsApp in formato internazionale, senza +.
  var WA = '393331268874';
  var vel = 0;

  root.classList.add('js');

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function waLink(t) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t); }

  /* ---------- comparsa allo scroll ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- scroll: card impilate, parallasse, passi ---------- */
  var stack = $$('.sc'), par = $$('[data-par]'), steps = $('.steps');
  var tops = [], lastY = window.scrollY, queued = false;

  if (steps && reduce) {
    steps.style.setProperty('--pr', '1');
    $$('li', steps).forEach(function (li) { li.classList.add('on'); });
  }

  function measure() {
    tops = stack.map(function (c) { return parseFloat(getComputedStyle(c).top) || 0; });
  }

  function update() {
    queued = false;
    var y = window.scrollY, h = window.innerHeight;
    vel = Math.min(vel + Math.abs(y - lastY), 120);
    lastY = y;
    if (reduce) return;

    stack.forEach(function (c, i) {
      var n = stack[i + 1];
      if (!n) return;
      var p = clamp(1 - (n.getBoundingClientRect().top - tops[i]) / (c.offsetHeight * 0.85), 0, 1);
      c.style.setProperty('--p', p.toFixed(3));
    });

    par.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--py', clamp((r.top + r.height / 2 - h / 2) / h, -1, 1).toFixed(3));
    });

    if (steps) {
      var sr = steps.getBoundingClientRect();
      steps.style.setProperty('--pr', clamp((h * 0.65 - sr.top) / sr.height, 0, 1).toFixed(3));
      $$('li', steps).forEach(function (li) {
        li.classList.toggle('on', li.getBoundingClientRect().top < h * 0.7);
      });
    }
  }

  function queue() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', function () { measure(); queue(); });
  measure();
  update();

  /* ---------- fascia scorrevole: va più veloce quando scorri ---------- */
  var mq = [];
  if (!reduce) {
    $$('.mq-track').forEach(function (t, i) {
      if (!t.animate) return;
      mq.push(t.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }],
        { duration: 26000, iterations: Infinity, direction: i % 2 ? 'reverse' : 'normal' }
      ));
    });
    if (mq.length) {
      (function tick() {
        vel *= 0.9;
        var rate = 1 + Math.min(vel, 80) * 0.12;
        mq.forEach(function (a) { a.playbackRate = rate; });
        requestAnimationFrame(tick);
      })();
    }
  }

  /* ---------- hero: video.mov e canvas con laser ed equalizzatore ---------- */
  var hv = $('#hv');
  if (hv) {
    hv.addEventListener('loadeddata', function () { hv.classList.add('on'); });
    // l'errore di <source> non risale: lo intercetto in fase di cattura
    hv.addEventListener('error', function () { hv.remove(); }, true);
    if (reduce) {
      hv.removeAttribute('autoplay');
      hv.pause();
    } else {
      var pp = hv.play();
      if (pp && pp.catch) pp.catch(function () {});
    }
  }

  var hero = $('.hero'), cv = $('#fx');
  if (hero && cv && cv.getContext) {
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, running = false, mx = 0, lastBeat = -1;
    var BPM = 124, beams = [], bars = 0, dots = [], barGrad = null;
    var COLS = ['91,155,255', '211,227,255', '42,99,216'];

    var size = function () {
      var d = Math.min(window.devicePixelRatio || 1, 2), i, n;
      W = hero.clientWidth; H = hero.clientHeight;
      cv.width = Math.round(W * d); cv.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      n = W < 600 ? 6 : 10;
      beams = [];
      for (i = 0; i < n; i++) {
        beams.push({ x: (i + 0.5) / n, ph: i * 1.7, sp: 0.35 + (i % 4) * 0.13, c: COLS[i % 3], z: (i % 3) - 1 });
      }
      bars = W < 600 ? 18 : 40;
      dots = [];
      for (i = 0; i < (W < 600 ? 28 : 60); i++) {
        dots.push({ x: Math.random(), y: Math.random(), s: 0.02 + Math.random() * 0.05, r: 0.6 + Math.random() * 1.6 });
      }
      barGrad = ctx.createLinearGradient(0, H, 0, H * 0.78);
      barGrad.addColorStop(0, 'rgba(91,155,255,.5)');
      barGrad.addColorStop(1, 'rgba(211,227,255,.25)');
    };

    var draw = function (ms) {
      var t = ms / 1000, i;
      var beat = Math.pow(0.5 + 0.5 * Math.cos(t * BPM / 60 * Math.PI * 2), 3);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      for (i = 0; i < beams.length; i++) {
        var b = beams[i], a = Math.sin(t * b.sp + b.ph) * 0.7;
        var ox = b.x * W + mx * 40 * b.z, len = H * 1.4;
        var ex = ox + Math.sin(a) * len, ey = Math.cos(a) * len;
        var wd = 26 + beat * 22, px = Math.cos(a) * wd, py = -Math.sin(a) * wd;
        var g = ctx.createLinearGradient(ox, 0, ex, ey);
        g.addColorStop(0, 'rgba(' + b.c + ',' + (0.26 + beat * 0.22).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + b.c + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(ox - 2, 0); ctx.lineTo(ox + 2, 0);
        ctx.lineTo(ex + px, ey + py); ctx.lineTo(ex - px, ey - py);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = g; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ex, ey); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255,255,255,' + (0.25 + beat * 0.5).toFixed(3) + ')';
      for (i = 0; i < dots.length; i++) {
        var d = dots[i], y = (d.y - t * d.s) % 1;
        if (y < 0) y += 1;
        ctx.beginPath(); ctx.arc(d.x * W, y * H, d.r, 0, 6.283); ctx.fill();
      }

      var bw = W / bars;
      ctx.fillStyle = barGrad;
      for (i = 0; i < bars; i++) {
        var hh = H * (0.03 + 0.07 * (0.5 + 0.5 * Math.sin(t * 3.1 + i * 0.8)) * (0.35 + 0.65 * beat));
        ctx.fillRect(i * bw + 2, H - hh, bw - 4, hh);
      }
      ctx.globalCompositeOperation = 'source-over';

      if (Math.abs(beat - lastBeat) > 0.04) {
        lastBeat = beat;
        hero.style.setProperty('--beat', beat.toFixed(2));
      }
    };

    var loop = function (ms) {
      if (!running) return;
      draw(ms);
      requestAnimationFrame(loop);
    };
    var start = function () {
      if (!running) { running = true; requestAnimationFrame(loop); }
    };

    size();
    window.addEventListener('resize', function () { size(); if (!running) draw(2400); });

    if (reduce) {
      draw(2400);
    } else {
      hero.addEventListener('pointermove', function (e) { mx = e.clientX / (W || 1) - 0.5; });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          if (es[0].isIntersecting) start(); else running = false;
        }).observe(hero);
      } else {
        start();
      }
    }
  }

  /* ---------- modulo che scrive il messaggio WhatsApp ---------- */
  var form = $('#f');
  if (form) {
    var out = $('#msg'), wa = $('#wa'), cp = $('#cp'), dIn = $('#d');
    var val = function (id) { return ($('#' + id).value || '').trim(); };
    dIn.min = new Date().toISOString().slice(0, 10);

    var build = function () {
      var n = val('n'), t = val('t'), d = val('d'), l = val('l'), g = val('g');
      var s = 'Ciao Glow Events!';
      if (n) s += ' Sono ' + n + '.';
      s += ' Vorrei informazioni per ' + (t || 'la mia serata');
      if (d) s += ' del ' + new Date(d + 'T12:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
      if (l) s += ' a ' + l;
      if (g) s += ', circa ' + g + ' ospiti';
      s += '.';
      out.value = s;
      wa.href = waLink(s);
    };

    form.addEventListener('input', build);
    form.addEventListener('change', build);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    cp.addEventListener('click', function () {
      var done = function () { cp.textContent = 'Copiato'; setTimeout(function () { cp.textContent = 'Copia testo'; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(out.value).then(done, function () { out.select(); });
      } else {
        out.select();
      }
    });
    build();
  }
})();
