/* Apply the saved theme before the stylesheet paints, then wire the switch. */
(function () {
  var key = 'copperline-theme';
  var root = document.documentElement;
  var theme = 'dark';
  // Use the same moon and sun SVGs as the MyST documentation theme switch.
  // As in the docs, the icon represents the current theme.
  var icons = {
    dark: '<path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd"></path>',
    light: '<path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"></path>'
  };
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
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + icons[theme] + '</svg>';
      button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      button.title = 'Switch to ' + next + ' mode';
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
