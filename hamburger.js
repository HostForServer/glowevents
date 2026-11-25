// Menu: apre e chiude il pannello su telefono e blocca lo scroll della pagina
(function () {
  'use strict';

  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  function setOpen(open) {
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', function () {
    setOpen(!navMenu.classList.contains('active'));
  });

  // chiude il menu quando tocchi un link
  Array.prototype.forEach.call(navMenu.querySelectorAll('a'), function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // passando a desktop il pannello torna a essere la barra in riga
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) setOpen(false);
  });
})();
