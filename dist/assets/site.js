// Theme toggle — persists choice in localStorage. Falls back to OS preference.
(function () {
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('apex-theme'); } catch (e) {}
  // Default to light unless the user has explicitly chosen dark. The embedded
  // guides include hardcoded colour values that don't fully recolour, so dark
  // is opt-in to avoid mixed contrast.
  root.setAttribute('data-theme', (stored === 'dark' ? 'dark' : 'light'));

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('apex-theme', t); } catch (e) {}
    var btn = document.getElementById('themeBtn');
    if (btn) btn.innerHTML = t === 'dark'
      ? '<i class="ti ti-sun" aria-hidden="true"></i>'
      : '<i class="ti ti-moon" aria-hidden="true"></i>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    setTheme(currentTheme());
    btn.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });
})();
