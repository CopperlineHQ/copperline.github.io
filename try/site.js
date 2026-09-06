// Site controls wrap the published emulator glue, which is replaced by
// Copperline's WASM workflow. Let it mount the supported panels first.
import './try.js';

const netplay = document.getElementById('netplay-panel');
const netplayButton = document.getElementById('netplay-open');

if (netplay) {
  netplayButton.hidden = false;

  function openNetplay() {
    if (document.documentElement.dataset.sidebar !== 'open') {
      document.getElementById('sidebar-toggle').click();
    }
    netplay.open = true;
    const summary = netplay.querySelector('summary');
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }

  netplayButton.addEventListener('click', openNetplay);
  // Handle repeated clicks on the same fragment as well as shared links.
  document.querySelectorAll('a[href="#netplay-panel"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openNetplay();
    });
  });
  window.addEventListener('hashchange', () => {
    if (location.hash === '#netplay-panel') openNetplay();
  });
  if (location.hash === '#netplay-panel') openNetplay();
}
