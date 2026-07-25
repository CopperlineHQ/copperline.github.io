/* The hamburger menu used by the narrow layout. The links are hidden by CSS
   below 960px and revealed while .nav carries .is-open. */
(function () {
  var nav = document.querySelector('.nav');
  var toggle = nav && nav.querySelector('.nav__toggle');
  var links = nav && nav.querySelector('.nav__links');
  if (!nav || !toggle || !links) return;

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function isOpen() { return nav.classList.contains('is-open'); }

  toggle.addEventListener('click', function () { setOpen(!isOpen()); });

  // Picking a link closes the menu - most of them are same-page anchors, so
  // there is no navigation to do it for us.
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  document.addEventListener('click', function (e) {
    if (isOpen() && !nav.contains(e.target)) setOpen(false);
  });

  // Growing back to the desktop layout leaves the links visible anyway.
  var desktop = window.matchMedia('(min-width: 961px)');
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', onChange);
  else if (desktop.addListener) desktop.addListener(onChange);
})();
