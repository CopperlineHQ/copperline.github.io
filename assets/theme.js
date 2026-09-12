/* Apply the saved theme before the stylesheet paints, then wire the switch. */
(function () {
  var key = 'copperline-theme';
  var root = document.documentElement;
  var theme = 'dark';
  try {
    var saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) { /* Theme switching still works when storage is unavailable. */ }

  function apply(value) {
    theme = value;
    root.dataset.theme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f6f8fc' : '#080b13';
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      var next = theme === 'light' ? 'dark' : 'light';
      button.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      button.hidden = false;
    });
  }

  apply(theme);
  document.addEventListener('DOMContentLoaded', function () {
    apply(theme);
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        apply(theme === 'light' ? 'dark' : 'light');
        try { localStorage.setItem(key, theme); } catch (e) {}
      });
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) {
      apply(event.newValue === 'light' ? 'light' : 'dark');
    }
  });
})();
